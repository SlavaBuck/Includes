// --------------------------------------------------------------
// @@@BUILDINFO@@@
// MVCApplication
// --------------------------------------------------------------


/**
 * Специальный флаг, если true - проверки на уникальность id при добавлении MVC-объектов в коллекции 
 * <code>MVCApplication.models</code>, <code>MVCApplication.models</code> и <code>MVCApplication.controllers</code>
 * не производится. Может быть полезна для интенсивной работы с большими коллекциями при условии реализованного
 * в программе надёжного алгоритма для формирования уникальных id-шников
 * @name MVC.fastmode
 * @type {boolean}
 */
MVC.fastmode = false;

// Локализация:
#include "locales.jsxinc"

/**
 * @extends MVCObject#
 * @class   MVCApplication
 * @summary Объект <b>MVC-Приложение</b>.
 * @desc    Поддерживает коллекции MVC-объектов, предоставляет интерфейс для управления ими (создание, удаление, поиск и получение их из 
 *  коллекций) и отвечает за формирование главного окна - основного родительского диалога. Кроме того, может в целом выступать в качестве 
 *  изолированного пространства имён для всего пользовательского приложения.
 *      
 * @param {object} [prefs]                          Параметры инициализации (опционально)
 * @param {string} [prefs.name = "Приложение MVC"]  имя объекта-приложения, присваивается свойству .name;
 * @param {string} [prefs.version = ""]             версия, присваивается свойству .version;
 * @param {string} [prefs.caption = name + version] заголовок окна, по умолчанию формируется автоматически из имени и
 *                                                  и версии, присваивается свойству .caption; 
 * @param {string} [prefs.view = "dialog"]          ScriptUI-строка, используемая в качестве аргумента при вызове
 *                                                  new Window(prefs.view) для формирования главного окна приложения,
 *                                                  присваивается свойству .view;
 * @property {string}       id          id объекта-приложения ();
 * @property {string}       name        имя объекта-приложения;
 * @property {string}       version     версия объекта-приложения;
 * @property {string}       caption     заголовок главного окна;
 * @property {string}       view        ресурсная ScriptUI-строка, представляющая главное окно;
 * @property {UIControl}    window      ScriptUI-объект, представляющий главное окно приложения;
 * @property {MVCView}      mainView    представление, в рамках которого инкапсулировано главное окно приложения;
 * @property {Collection}   models      коллекция моделей;
 * @property {Collection}   views       коллекция представлений;
 * @property {Collection}   controllers коллекция контролёров;
 * @property {number}       exitcode    код завершения приложения (устанавливается как результат вызова window.show() в методе run()
 * @property {object}       _counters_  hash-объект, используется как счётчик объектов в коллекциях для генерации уникальных id;
 *
 * @fires MVCApplication#onExit
 * 
 * @returns {MVCApplication} Каждый новый вызов конструктора переустанавливает свойство MVC.app на созданный экземпляр Приложения.
 *
 * @example <caption>Пример создания и запуска MVC-Приложения</caption>
 * // Этого достаточно, чтобы создать MVC-приложение:
 * var myApp = new MVC.Application();
 * myApp.run();
 * 
 * @example <caption>Создание объекта Приложения с заданными параметрами главного окна</caption>
 * // В результате Приложение получит масштабируемое окно (тип окна
 * // задан как palette с установленным свойством resizeable:true) 
 * var myApp = new MVC.Application({
 *      name:"Приложение MVC",
 *      version:"1.00",
 *      caption:"Приложение MVC (MVC v"+MVC.version+")",
 *      view:"palette { preferredSize:[350,200], properties:{resizeable:true} }"
 *  });
 */
function MVCApplication(prefs) {
    MVC.app = this;     // глобальный (в рамках модуля MVC) указатель на текущее приложение
    // Настройки по умолчанию
    var defaults = {
        id          :"app",
        name        :localize(locales.DEF_APPNAME),
        version     :"1.00",
        caption     :localize(locales.DEF_APPNAME) + " v1.00",
        view        :"dialog",
        exitcode    :undefined,                     // Код завершения приложения (устанавливается в методе run())
        _counters_  :{ models:0, views:0, ctrls:0 } // Внутренний счётчик MVC-объектов (учавствует в формировании id-шников для соответствующих MVC-объектов)
    };
    // Вызов базового конструктора
    MVCApplication.prototype.__super__.constructor.call(this, extend(defaults, prefs));
    
    this.models = new Collection();         // Коллекция моделй
    this.views = new Collection();          // Коллекция представлений
    this.controllers = new Collection();    // Коллекция контролёров
    
    // Конструирование главного окна:
    this.CreateMainView(this.view); // Инициализирует this.window и this.mainView
};

inherit(MVCApplication, MVCObject);


/**
 * @method  MVCApplication#run
 * @summary Стартует приложение.
 * @desc    Старт выполняется в два этапа: - вначале выполняется собственный метод Init(); затем выполняет отображение главного 
 *  окна Приложения, путём вызова <code>MVCApplication.window.show()</code>.
 *  
 * @returns {number} Возвращает код завершение, полученный от метода show() главного диалогового окна приложения.
 */
MVCApplication.prototype.run = function() {
    this.Init();
    var code = this.window.show();
    if (this.exitcode === undefined) this.exitcode = code;
    return this.exitcode;
};

/**
 * @method  MVCApplication#stop
 * @summary Остановка приложения путём закрытия главного окна.
 * @desc    Старт выполняется в два этапа: - вначале выполняется собственный метод Init(); затем выполняет отображение главного 
 *  окна Приложения, путём вызова <code>MVCApplication.window.show()</code>.
 *  
 * @returns {number} Возвращает код завершение <code>MVCApplication.exitcode</code>.
 */
MVCApplication.prototype.stop = function() {
    if (this.window && this.window.visible) this.window.close();
    return this.exitcode;
};

/**
 * @event   MVCApplication#onExit
 * @summary Обработчик завершения Приложения.
 * @desc    Назначается как обработчик для события onClose главного окна приложения .window и, таким образом, вызывается 
 *     автоматически после его закрытия. Метод выступает в роли обработчика закрытия приложения и предназначен для 
 *     переопределения в реальном экземпляре объекта-приложения.
 * 
 * @param {UIEvent} e Обработчик получает событие, переадрисованное от обработчика onClose() главного окна Приложения.
 * @returns {any}
 */
MVCApplication.prototype.onExit = function(e) {
    return true; 
};

/**
 * @method  MVCApplication#Init
 * @summary Инициализация <b>Приложения</b>.
 * @desc    Метод вызывается автоматически в процессе звпуска <b>MVC-Приложения</b>: {@linkcode MVCApplication#run MVCApplication.run()}. 
 *  Вызов происходит в контексте объекта-приложения, не получает параметров и предназначен для переопределения 
 *  с целью выполнения всех необходимых действий по инициализации данных приложения. {@linkcode MVCApplication#CreateMainView Пример}.
 * @abstract 
 * 
 * @returns {any} определяется пользователем.
 */
MVCApplication.prototype.Init = function() {
    return true;
}

/**
 * @method  MVCApplication#CreateMainView
 * @summary <i>Приватный</i> метод, формирующий главное окно приложения. 
 * @desc    Метод формирует главное окно приложения из ресурсной ScriptUI-строки, переданной в качестве аргумента вызова.
 *  При формировании окна обеспечивается корректная обработка свойства <code>properties:true</code>, если оно заявлено в
 *  ресурсной строке и навешивается обработчик на событие '<code>close</code>' окна, который обеспечивает вызов обработчика
 *  Приложения {@link MVCApplication#event:onExit .onExit()}, который может быть определён для выполнения каких либо операций
 *  при закрытии главного окна приложения. В результате работы, метод инициализирует свойства <code>.window</code> и <code>.mainView</code> 
 *  объекта-приложения.
 *  <p>Конструктор <code>MVCApplication()</code> вызывает этот метод при создании экземпляра Приложения. Подходящее место
 *  для явного вызова этого метода - тело функции Init(), предусмотренной для переопределения в "рабочем" экземпляре 
 *  объекта-приложения.</p>
 *  
 * @param {string} rcString ресурсная ScriptUI-строка для формирования диалога, представляющего главное окно приложенияю
 * @returns {MVCView} Главное окно Приложения.
 * @example <caption>CreateMainView() позволяет получить полный контроль над процессом создания главного окна приложения</caption>
 * var myApp = new MVC.Application();
 * myApp.Init = function() {
 *     // ресурсная строка любой длинны и сложности
 *     var rc = "dialog { preferredSize:[350,200], properties:{resizeable:true} }"
 *     this.CreateMainView(rc);
 *     // В результате вызова CreateMainView() свойству this.window присвоена ссылка
 *     // на созданное окно, теперь с ним можно работать напрямую
 *     this.window.text = "la-la-la...";
 *     //... 
 *
 *     // делать здесь вызов this.window.show() не нужно, - этот вызов будет
 *     // произведён внутри метода .run()
 * };
 * 
 * myApp.run(); // Выполнит .Init() и откроет окно (выполнит .window.show();)
 */
MVCApplication.prototype.CreateMainView = function(rcString) {
    var app = this,
        rcStr = (rcString)||"dialog",
        w = new Window(rcStr)
    w.text = app.caption;
    app.window = w;   // главное представление имеет тот же id, что и приложние;
    app.views[0] = app.mainView = new MVCView('window', app.window, rcStr);
    // только для resizeable окон
    if (w.properties && w.properties.resizeable) { w.onResizing = w.onResize = function(){ w.layout.resize() } }; 
    // обеспечиваем работу обработчика приложения onExit():
    w.addEventListener('close', function(e) {  return app.onExit(e); });
    // главное Представление всегда 1-е в коллекции:
    return app.mainView;
};

/**
 * @method  MVCApplication#addModel
 * @summary Добавление <b>Модели</b>:
 * @desc    Создаёт и добавляет объект-модель в коллекцию models приложения. 
 *  В качестве аргумента метод принимает литерал классического JavaScript-объекта, который выступает 
 *  в качестве основы объекта данных приложения - модели. В литерале предусматривается несколько 
 *  специально-зарезервированных полей, определяющих особенные характеристики модели. 
 * 
 * @param {object}   [obj]      литерал, представляющий пользовательские данные - основу объекта MVCModel
 * @param {string}   [obj.id]   id (идентификатор) объекта, должен быть уникальным в пределах коллекции;
 * @param {function} [obj.validator] метод, выполняющий валидацию модели (см MVCModel.validator());
 * 
 * @returns {MVCCModel}
 * @example <caption>Стандартный способ создания Моделей:</caption>
 *  // myApp – созданный ранее объект MVCApplication
 *  var myData = myApp.addModel({
 *      id:"myData", 
 *      value:{ txt:"Мои данные" },
 *      print:function() { $.writeln(this.value.txt) },
 *      // метод-валидатор - предусмотрен библиотекой, 
 *      // может определяется в конкретном экземпляре 
 *      // Модели при необходимости (см. MVCModel.validator();)
 *      validator:function(key, oldVal, newVal, ctrl) {
 *          return (newVal.length < 10 || newVal.length > 30) ? false : true;
 *      }
 *  });
 *  myData.print(); // => `Мои данные`
 *  $.writeln(myData instanceof MVCModel); // => true
 *  $.writeln(typeof myData); // => object
 *  $.writeln(myData.id == "myData"); // => true
 *  $.writeln(myData.value.txt == "Мои данные"); // true
 */
MVCApplication.prototype.addModel = function(obj) {
    var obj = (obj)||{},
        models = this.models;
    if (!obj.id) obj.id = 'model' + (this._counters_['models']++);
    // Проверка id на уникальность и добавления объекта в коллекцию:
    if (!MVC.fastmode) {
        if (models.getFirstIndexByKeyValue('id', obj.id) != -1 ) throw Error(localize(locales.ERR_BOBJKEY, obj.id, "models" ));
    }
    models.push(new MVCModel(obj));
    return models[models.length-1];
};

/**
 * @method  MVCApplication#removeModel
 * @summary Удаление <b>Модели</b>.
 * @desc    При удалении модели из коллекции моделей приложения также удаляются все связанные с ней контролёры.
 * 
 * @param  {string|MVCModel} model id модели или сам объект MVCModel
 * @returns {number} Возвращает кол-во моделей в коллекции после удаления. Если удаление не состоялось - возвращает -1
 * @example <caption>Удаление модели, созданной в предыдущих примерах:</caption>
 * myApp.removeModel("myModel");
 */
MVCApplication.prototype.removeModel = function(obj) { //  В качестве obj принимает либо id-модели, либо сам объект-модель
    var app = this,
        model = (typeof obj == 'string') ? app.models.getFirstByKeyValue('id', obj) : app.models.getFirstByValue(obj);
    if (model) {
        each(model._controllers, function(ctrl) {
            ctrl.disable();
            app.controllers.splice(app.controllers.indexOf(ctrl), 1);
        });
        model._controllers.length = 0;
        app.models.splice(app.models.indexOf(model), 1);
        return app.models.length;
    }
    return -1;
};

/**
 * @method  MVCApplication#addView
 * @summary Добавление нового <b>Представления</b>.
 * @desc    Метод создаёт и добавляет объект-представление в коллекцию <code>views</code> Приложения. 
 * В качестве аргумента метод принимает литерал классического JavaScript-объекта, который описывает параметры создаваемого
 * Представления. В литерале предусматривается несколько специально-зарезервированных полей, определяющих особенные характеристики
 * создаваемого объекта-представления. 
 * 
 * @param {object}   [obj]      литерал, описывающий создаваемый объект-представление.
 * @param {string}   [obj.id]      id (идентификатор) объекта, должен быть уникальным в пределах коллекции;
 * @param {object}   [obj.parent = window]   родительский контейнер для элемента управления, по умолчанию 
 *                                 родительским конт. является главное окно приложения (опционально);
 * @param {string}   obj.view      ресурсная строка для создания ел.управления, используется как аргумент ScriptUI метода 
 *                                 Window.add(...) (указывается обязательно);
 * @param {object}   [obj.control] литерал объекта, все свойства в рамках которого будут объеденены непосредственно со
 *                                 ScriptUI-объектом - элементом управления, полученным на основе свойства .view
 *                                 В рамках этого литерала удобно переопределять стандартные обработчики (например, onChange и
 *                                 onChanging);
 * @param {function} [obj.Init]    функция-инициализатор для эл.управления. Вызывается в контексте MVCView.control сразу после
 *                                 его создания;
 * @param {function} [obj.render]  обработчик, вызываемый когда требуется обновить представление в связи с обновлением модели.
 *
 * @returns {MVCCView}
 * @example <caption>Полная сигнатура метода .addView()</caption>
 * // myApp – созданный ранее объект MVCApplication
 * var myView = myApp.addView({ 
 *     id:"myView",     // id объекта 
 *     // родительский контейнер для ел.уп.
 *     parent:myApp.window.panel, 
 *     // ресурсная строка для создания ел.управления
 *     view:"EditText { characters:15 }",   
 *     control:{   // все свойства, заданные в рамках объекта control
 *                 // объединяются с создаваемым эл.управления
 *                 // Например, перезапишется обработчик onChange:
 *         onChange:function() { },
 *                 // и добавится новое свойство “property”:
 *         property:{ }
 *     },
 *     Init:{function},   // функция-инициализатор для эл.управления
 *     render:{function}  // обработчик, вызываемый когда требуется обновить
 *                        // представление в связи с обновлением модели.
 * });
 */
MVCApplication.prototype.addView = function(obj) {
    var views = this.views;
    if (!obj.id) obj.id = 'view' + (this._counters_['views']++);
    // Проверка на уникальность в коллекции:
    if (!MVC.fastmode) {
        if (views.getFirstIndexByKeyValue('id', obj.id) != -1 ) throw Error(localize(locales.ERR_BOBJKEY, obj.id, "views" ));
    }
    // Создание нового объекта представления:
    var parent = (obj.parent)||this.window,
        view = new MVCView(obj);
    view.control = extend(parent.add(obj.view), obj.control);
    // Пост-инициализация - вызов Init в контексте созданного ScriptUI элемента (по умолчанию данный метод ничего не делает)
    view.Init.call(view.control);
    views.push(view);
    return view;
};

/**
 * @method   MVCApplication#removeView
 * @summary  Удаление <b>Представления</b>. 
 * @desc     При удалении никакие связанные объекты моделей и контролёров не затрагиваются.
 *
 * @fires MVCView#event:onRemove
 * 
 * @param  {string|MVCView}  obj      id представления или само представление - объект MVCView
 * @returns {number}     Возвращает кол-во объектов в коллекции после удаления. Если удаление не состоялось - возвращает -1
 * @example <caption>Yдаление представления, созданной в предыдущих примерах:</caption>
 * myApp.removeView("myView");
 */
MVCApplication.prototype.removeView = function(obj) {
    var app = this,
        view = (typeof obj == 'string') ? app.views.getFirstByKeyValue('id', obj) : app.views.getFirstByValue(obj);
    if (view) {
        view.remove(); // специальная обработка для ScriptUI (см MVCView.prototype.remove(...) )
        app.views.removeByValue(view);
        return app.views.length;
    }
    return -1;
};

/**
 * @method MVCApplication#addController
 * @summary Добавление нового <b>Контролёра</b>.
 * @desc    Метод создаёт и добавляет в коллекцию <code>controllers</code> объект MVCController (контролёр). В качестве аргумента вызова
 *  принимает комплексный параметр {@link cparams param}, который передаётся конструктору {@link MVCController MVCController(param)},
 *  который выполняет связывание Модели и Представления.
 *  <p><i><b>ПРИМЕЧАНИЕ:</b> Задавать значения параметров id и app необязательно, метод обеспечивает автоматическую инициализацию свойства
 *           свойства param.app ссылкой на собственный объект MVCApplication и, в случае отсутствия значения param.id - обеспечивает
 *           автоматическую генерацию уникального id для Контролёра.</i></p> 
 * 
 * @param {cparams} param          литерал объекта, представляющий параметры инициализации контролёра;
 * @param {string} [param.app]    автоматически инициализируется ссылкой на MVCApplication, в контексте которого происходит вызов этого метода;  
 * @param {string} [param.id]     id для создаваемого контролёра, должен быть уникальным в рамках коллекции controllers, если не указан - 
 *                                генерируется автоматически;
 * @param {string} [param.binding] строка биндинга (см. {@link MVCApplication MVCController});
 * @param {boolean}[param.bind = true] флаг, связывания (см. {@link MVCApplication MVCController}).
 *                            
 * @returns {MVCController}
 * @example <caption>Пример создания Контролёра</caption>
 * // Значение myModel.value.text будет сразу присвоено myView.text:
 * myApp.addController({ binding:"myModel.value.text:myView.text" });
 * // ...
 * // Значение myModel.value.text не будет сразу присвоено myView.text:
 * myApp.addController({ binding:"myModel.value.text:myView.text", bind:false });
 */
MVCApplication.prototype.addController = function(obj) {
    var controllers = this.controllers,
        obj = extend({ app:this, id:'ctrls'+(this._counters_['ctrls']++) }, obj);
    // Проверка id на уникальность и добавления объекта в коллекцию:
    if (!MVC.fastmode) {
        if (controllers.getFirstIndexByKeyValue('id', obj.id) != -1) throw Error(localize(locales.ERR_BOBJKEY, obj.id, "controllers" ));
    }
    controllers.push(new MVCController(obj));
    // Возвращаем добавленный контролер:
    return controllers[controllers.length-1];
};

/**
* @method   MVCApplication#removeController
* @summary  Удаляет <b>Контроллер</b>. 
* @desc     При удалении, связанные Представлениt и Модель "отсвязюваются" друг от друга (но остаются в своих коллекциях), сам
* объект-контролёр удаляется из коллекции <code>controllers</code>.
* 
* @param  {string|MVCController} ctrl id контролёра или сам контролёр - объект MVCControler
* @returns {number} Возвращает кол-во объектов в коллекции после удаления. Если удаление не состоялось - возвращает -1
*/
MVCApplication.prototype.removeController = function(obj) { // в качестве obj принимает либо id-контролёра, либо сам объект-контролёр
    var app = this,
        ctrl = (typeof obj == 'string') ? app.controllers.getFirstByKeyValue('id', obj) : app.controllers.getFirstByValue(obj);
    if (ctrl && ctrl.model) {
        // убиваем "слушателя" - выполняем unwatch
        ctrl.disable();
        // удаляемся из персональной коллекции контролёров модели:
        ctrl.model._controllers.splice(ctrl.model._controllers.indexOf(ctrl), 1);
        // удаляемся из коллекции контролёров приложения:
        app.controllers.splice(app.controllers.indexOf(ctrl), 1);
        return app.controllers.length;
    }
    return -1; 
};

 /**
 * @method  MVCApplication#removeMVC
 * @summary Универсальный метод удаления <b>MVC-объектов</b>.
 * @desc    Принимает либо строковое значение, либо MVC-объект (<b>Контролёр</b>, <b>Модель</b> или <b>Представление</b>). 
 *     Любое строковое значение рассматривается как возможное значение <tt>id</tt>-MVC-объекта и происходит попытка найти 
 *     данный объект в коллекциях:
 *     <p>в начале происходит поиск в коллекции <code>controllers</code>, затем в <code>models</code> и затем в <code>views</code>.
 *     Далее происходит процедура удаления по следующему принципу: </p><div>
 *     - При удалении Модели - удаляются связанные с ней объекты-Контролёры и Представления!
 *     - При удалении Контролёра - удаляются связанное с ним Представление но НЕ модель!
 *     - При удалении Представления - удаляется только указанный объект-Представление! </div>
 *     <p> Если в качестве аргумента передать строку, она будет трактоваться как id-объекта и произойдёт попытка обнаружить соответствующий
 *     MVC-объект. Поиск и удаление в таком случае происходит в следующем порядке:</p><div>
 *     - Ищется MVC-модель в коллекции <code>models</code>;
 *     - если модель не обнаруживается, происходит попытка обнаружить контролёр с укзанным id;
 *     - если контролёр не обнаруживается, происходит попытка обнаружить представление с укзанным id;
 *     - Как только на каком либо этапе обнаруживается соответствующий объект - происходит его удаление по описанному выше принципу.</div>
 *     <p>Метод удобно применять для совместного удаления связки <b>Модель</b> + <b>Представление</b> + <b>Контролёр</b>, передавая 
 *     в качестве аргумента указатель (или id) на объект-модель.</p>
 *
 * @fires MVCView#event:onRemove
 * 
 * @param  {string|MVCController|MVCModel|MVCView} obj удаляемый MVC-объект (или id объекта, тогда происходит автоматическая 
 *                                                     попытка его поиска и удаления из соответствующей коллекции.)
 * @returns {boolean} <b>true</b> если удаление прошло успешно, иначе <b>false</b>.
 * @example <caption>Удаление MVC-объектов, созданных в предыдущих примерах:</caption>
 * // удаление только представления:
 * myApp.removeMVC(myApp.getViewByID("myView"));
 * // удаление (предположительно) модели (также приводит и к 
 * // удалению связанных с ней контролёров и представлений):
 * myApp.removeMVC("myModel");
 * // прямое удаление модели:
 * myApp.removeMVC(myApp.getModelByID("myModel"));
 * // удаление с указанием контролёра (также приводит и к 
 * // удалению связанного с ним представления, модель не удаляется!):
 * myApp.removeMVC(myApp.findController(myModel));
 */
MVCApplication.prototype.removeMVC = function(obj) {
    var app = this, model = obj;
    if (!model) return false;
    if (typeof obj == 'string') {
        model = app.models.getFirstByKeyValue('id', obj);
        if (!model) {
            model = app.controllers.getFirstByKeyValue('id', obj);
            if (!model) {
                model = app.views.getFirstByKeyValue('id', obj);
                if (!model) return false;
            }
        }
    } 
    switch (classof(model)) {
        case 'MVCModel':
            each(model._controllers, function(ctrl) { app.removeView(ctrl.view); });
            app.removeModel(model);
            break;
        case 'MVCController':
            app.removeView(model.view);
            app.removeController(model);
            break;
        case 'MVCView':
            app.removeView(model);
            break;
        default: return false;
    }
    return true;
};

/**
 * @method  MVCApplication#findController
 * @summary Поиск связанного с объектом Контролёра.
 * @desc    Происходит попытка обнаружения контролёра, связанного с аргументом. В качестве аргумента могут выступать либо MVC-объекты, либо
 *  ассоциированные с ними объекты (ScriptUI-объекты графического интерфейса UIControl-s, или ассоциированные с Моделями объекты).
 *  В случае успешного нахождения контролёра - возвращает ссылку на него из коллекции контролёров приложения, в противном случае - 
 *  возвращает undefined.
 *  <p>Метод удобно использовать для получения ссылки на контролёр из тел обработчиков элементов управления или объектов-моделей, указывая 
 *  методу в качестве аргумента вызова своё свойство <code>this</code>.</p>
 * 
 * @param  {object} obj MVCModel | MVCView | any - или любой объект, ассоциированный с имеющимся MVC-объектом
 * @returns {MVCController|undefined}     Возвращает ссылку на объект MVCController, в противном случае, если не найдено ни одного контролёра, 
 *                                        ассоциированного с аргументом - возвращает undefined.
 * @example <caption>Любой из вызовов поволит обнаружить ассоциированный контролёр:</caption>
 * myApp.findController(myModel); 
 * myApp.findController(myModel.value);
 * myApp.findController(myView);
 * myApp.findController(myView.control);
 * @example <caption>Получение контролёра, в обработчике элемента управления, связанного с Представлением. В данном
 *          примере создаётся модель, для которой определяется обработчик onChange - в происходит
 *          получение ссылки на контролёр и от него - на модель, после чего определяется состояние модели и в зависимости
 *          от него меняется цвет текста</caption>
 *  myApp.addView({ 
 *      id:"et", 
 *      view:"edittext { characters:30 }", 
 *      control:{
 *          onChanging:function() {
 *              // получаем ссылку на контролёр, чтобы получить ссылку
 *              // на модель, связанную с данным представлением:
 *              var ctrl = myApp.findController(this),
 *                  gfx = this.graphics;
 *              // в зависисмости от статуса модели меняем цвет текста:
 *              if (ctrl.model.isValid()) { 
 *                  gfx.foregroundColor = gfx.newPen (0, [0,0,0], 1); // gfx.PenType.SOLID_COLOR == 0
 *                  this.helpTip = "Всё хорошо";        
 *              } else {
 *                  gfx.foregroundColor = gfx.newPen (0, [1,0,0], 1);
 *                  this.helpTip = "Неправильное значение");
 *              }
 *          }
 *      }
 *  });
 */
MVCApplication.prototype.findController = function(obj) {
    var controllers = this.controllers;
    for (var i=0, max = controllers.length; i<max; i++) {
        try {  if (obj === controllers[i]||obj === controllers[i].view.control||obj === controllers[i].model||obj === controllers[i].view||
                  obj === controllers[i].view_obj||obj === controllers[i].model_obj) return controllers[i];
        } catch(e) { continue; }
    }
    return undefined;
};

// --------------------------------------------------------------
// Вспомогательные метод для быстрого поиска MVC-объектов в соответствующих коллекциях по их id
// 
/**
 * @method MVCApplication#getModelByID
 * @desc    Поиск по <code>id</code> модели в коллекции <code>MVCApplication.models</code>
 * @param   {string} id             id (идентификатор) объекта
 * @returns {MVCModel|undefined}    Возвращает ссылку на найденный объект MVCModel, если объект не обнаруживается - возвращает undefined.
 */
MVCApplication.prototype.getModelByID = function(id) {
    return this.models.getFirstByKeyValue('id', id);     
};

/**
 * @method  MVCApplication#getViewByID
 * @desc    Поиск по <code>id</code> объекта-представления в коллекции <code>MVCApplication.views</code>
 * @param   {string} id             id (идентификатор) объекта
 * @returns {MVCView|undefined}     Возвращает ссылку на найденный объект MVCView, если объект не обнаруживается - возвращает undefined.
 */    
MVCApplication.prototype.getViewByID = function(id) {
    return this.views.getFirstByKeyValue('id', id);     
};

/**
 * @method  MVCApplication#getControllerByID
 * @desc    Поиск по <code>id</code> объекта-контроллёра в коллекции <code>MVCApplication.controllers</code>
 * @param   {string} id                id (идентификатор) объекта
 * @returns {MVCController|undefined}  Возвращает ссылку на объект MVCController, если объект не обнаруживается - возвращает undefined.
 */    
MVCApplication.prototype.getControllerByID = function(id) {
    return this.controllers.getFirstByKeyValue('id', id);     
};
