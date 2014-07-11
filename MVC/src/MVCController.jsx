// --------------------------------------------------------------
// @@@BUILDINFO@@@
// MVCView - Контролёр
// --------------------------------------------------------------

/**
 * Комплексный объект - определяющий параметры создания объекта-контролёра (MVCController) 
 * @typedef cparams
 * @type {object}
 * @property {MVCApplication}   app             указатель на "родительское" приложение;
 * @property {string}           [id]            id (идентификатор) объекта, может генерироваться автоматически; 
 * @property {string}           [binding]       строка биндинга в формате 'ModelID.prop1[.prop2...]:ViewID.prop1[.prop2...]', 
 *                                              определяющая связываемые Модель и Представление;
 * @property {boolean}          [bind = true]   флаг, если false - Представление не будет проинициализировано данными Модели,
 *                                              по умолчанию true - в процессе связывания свойство Представления сразу 
 *                                              инициализируется значением свойства Модели.
 */
var cparams = { app:undefined, id:"", binding:"", bind:true }; // нужно только для jsdoc!!!


/**
 * @extends MVCObject#
 * @class   MVCController
 * @summary MVC-Объект <b>Контролёр</b>.
 * @desc    <b>Контролёр</b> обеспечивают «связывание» <b>Моделей</b> и <b>Представлений</b>. Связывание обеспечивает двухстороннюю 
 *  привязку значений заданных свойств Модели к заданным свойствам Представления. В процессе связывания на свойство модели навешивается
 *  "наблюдатель", который в случае изменения свойства выполнит обновление представления, в тоже время в представлении обработчики событий 
 *  <code>onChange</code> и <code>onChanging</code> настраиваются на обновления заданного свойства в привязанной Модели. 
 *  <p>К одной модели может привязываться множество представлений. В то же время, к представлению в каждый момент времени может быть привязана 
 *  только одна единственная Модель. Это связано с работой механизма обновлений - диспетчером обновлений Приложения, который вызывается 
 *  "наблюдателем" модели и осуществляет обход и обновление всех зарегистрированных представлений для данной модели, при этом обработчики в
 *  самих представлениях всегда обновляют только то свойство и ту модель, к которой они были привязаны последний раз. Представления можно 
 *  переключить на обновления другой модели используя интерфейс самого Представления — {@link MVCView#rebind rebind()}.</p>
 *  <p>Конструктор <code>MVCController()</code> требует обязательного указания ссылки на *"родительское"* приложение и может принимать 
 *  параметры как в составе комплексного объекта cparams так и раздельно, в связи с чем имеет три формы вызова:</p>
 *  * <code>MVCController(appRef, id, cparams);</code>
 *  * <code>MVCController(appRef, cparams);</code>
 *  * <code>MVCController(cparams);</code>
 *  <p> Для выполнения «связывания» использует поле cparams.binding, а способ связывания определяет свойство cparams.bind, при этом аргументы
 *  <code>appRef</code> и <code>id</code> могут указываться в составе комплексного объекта-параметра cparams (в полях app и id соответственно).</p>
 *  Строка биндинга, заданная в свойстве cparams.binding определяет: какие свойства Модели и Представления необходимо связать. Она имеет формат
 *  'ModelID.prop1[.prop2...]:ViewID.prop1[.prop2...]', где:</p>
 *  - ModelID и ViewID - определяют связываемые MVCModel и MVCView и представляют их id;
 *  - prop1..prop2 - конкретные связываемые свойства Модели и Представления (произвольной глубины вложенности).
 *  
 * @param {MVCApplication|cparams}   appRef  ссылка на "родительское" приложение, в рамках которого объявляется контроллер - указывается обязательно
 *                                           либо непосредственно первым аргументом, либо в поле cparams.app;
 * @param {string|cparams}           [id]    id (идентификатор) объекта контролёра;
 * @param {cparams}                  [param] комплексный объект с параметрами cparams.
 *                                 
 * @property {string}         id        id (идентификатор) объекта;
 * @property {MVCApplication} app       указатель на "родительское" приложение (задаётся при создании Контролёра);
 * @property {string}         binding   строка биндинга;
 * @property {MVCModel}       model     указатель на Модель, связанную с данным контролёром;
 * @property {string}         model_key имя связанного свойства Модели; 
 * @property {object}         model_obj указатель на родительский в отношении <code>model_key</code> объект;
 * @property {MVCView}        view      указатель на Представление, связанное с данным контролёром; 
 * @property {string}         view_key  имя связанного свойства Представления. 
 * @property {object}         view_obj  указатель на родительский в отношении <code>view_key</code> объект (как правило, это 
 *                                      объект UIControl)
 * 
 * @returns {MVCController}     Все свойства группы model (model, model_key, model_obj) и view (view, view_key, view_obj) инициализируются
 *                              автоматически путём парсинга строки биндинга, которая присваивается собственному свойству MVCController.binding
 *                              
 * @example <caption>Все вызовы эквиваленты между собой</caption>
 * var myCtrl = new MVCController(myApp, "myCtrl", { binding:"myModel.value.text:myView.text" });
 * var myCtrl = new MVCController(myApp, { id:"myCtrl", binding:"myModel.value.text:myView.text" });
 * var myCtrl = new MVCController({ app:myApp, id:"myCtrl", binding:"myModel.value.text:myView.text" });
 * // Запрет немедленной инициализации Представления:
 * var myCtrl = new MVCController({ app:myApp, id:"myCtrl", binding:"myModel.value.text:myView.text", bind:false });
 */
function MVCController (appRef, id, param) {
    if (!(this instanceof MVCController)) return new MVCController(appRef, id, param);
    if (arguments.length == 3 && arguments[2] !== undefined) {
        MVCController.prototype.__super__.constructor.call(this, arguments[2]);
        this.id = arguments[1];
        this.app = arguments[0];
    } else if (arguments.length == 2 && arguments[1] !== undefined) {
        MVCController.prototype.__super__.constructor.call(this, arguments[1]);
        this.app = arguments[0];
    } else if (arguments.length == 1 && typeof arguments[0] == 'object') {
        MVCController.prototype.__super__.constructor.call(this, arguments[0]);
    } else {
        throw Error ('MVCController: invalid arguments list');
    }
    if (!(this.app instanceof MVCApplication)) throw Error ('MVCController: Missing application reference');
    this.bind = (typeof this.bind == 'boolean' ? this.bind : true); 
    // Парсинг строки биндинга, инициализация
    this._initBinding();
};

inherit(MVCController, MVCObject);

 // На основе строки биндинга формирует ссылку на родительский в отношении заданного ключа объект (используется в
 // MVCApplication.addController() и MVCView.rebind())
 var _parseBind = function(obj, str) {
    var keys = str.split('.').slice(1);
    if (keys.length == 0) throw Error(localize(locales.ERR_BEDBIND, str));
    for (var i=0, o = obj; i<keys.length-1; i++) o = o[keys[i]];
    return { object:o, key:(keys[keys.length-1]).toString() };
}

/**
 * @private
 * @method MVCController#_initBinding
 * @desc   Вызывается конструктором MVCController - парсит строку binding и связывает Модель с Представлением, в результате 
 *         выполнения инициализирует свойства Контролёра группы .model_* и .view_*
 */
MVCController.prototype._initBinding = function() {
    // Настройка локальных ссылок
    var obj = this,
        app = this.app,
        models = app.models,
        views = app.views,
        strs = this.binding.split(':'), // strs[0] - соответствует модели, [1] = представлению
        id = strs[0].substr(0, strs[0].indexOf('.')), // получаем id модели
        object = {};    // для получения результат _parseBind()

    // Делаем биндинг - привязываем объект-модель к объекту-представление: 
    if (id == '') id = strs[0];
    obj.model = models.getFirstByKeyValue('id', id);  // попытка получить модель из коллекции
    if (obj.model === undefined) throw Error(localize(locales.ERR_KEYNOTF, id, "models" ));  // если модель не найдена - однозначно ошибка
    object = _parseBind(obj.model, strs[0]);
    obj.model_obj = object.object;
    obj.model_key = object.key;
    var model_value = obj.model_obj[obj.model_key];
    // Аналогично как для модели, парсим строку биндинга для представления и навешиваем обработчики по умолчанию на соответствующий ScriptUI єлемент
    id = strs[1].substr(0, strs[1].indexOf('.'));       // парсим вторую часть строки биндинга для view
    if (id == '') id = strs[1];
    obj.view = views.getFirstByKeyValue('id', id);      // попытка получить представление из коллекции
    if (obj.view === undefined) throw Error(localize(locales.ERR_KEYNOTF, id, "views" ));  // если представление не найдено - однозначно ошибка
    // процесс получения ссылки на свойство представления
    object = _parseBind(obj.view.control, strs[1]);
    obj.view_obj = object.object;
    obj.view_key = object.key;
    if (obj.binding.match(/selection/)) obj.view_obj = obj.view.control;

    // Пополняем приватную коллекцию контролёров в самой Модели:
    obj.model._controllers.add(obj);  
    
    // предварительный вызов валидатора для модели (если определён):
    if (typeof obj.model.validator == 'function') obj.model._status_ = obj.model.validator.call(obj.model_obj, obj.model_key, model_value, model_value, obj); 

    // Выполняем немедленную инициализацию представления (если требуется);
    if (obj.bind) obj._updateView();
    
    // Для организации двухсторонней связи между моделью и представлением - навешиваем на представление обработчик по умолчанию:
    // Если в модели задать что-то вроде onChange:false/onChanging:false - обработчики по умолчанию навешены не будут (используется для заглушки действия по умолчанию)
    var control = obj.view.control;
    if (control.hasOwnProperty("onChange")) {
        if (typeof control.onChange != 'function' ) delete control["onChange"];
    } else control.onChange = bind(obj, obj._updateModel); 
    if (control.hasOwnProperty("onChanging")) {
        if (typeof control.onChanging != 'function' ) delete control["onChanging"];
    } else control.onChanging = control.onChange;  
    
    obj.enable(); // Навешиваем наблюдатель на свойство model_key модели, который реализует диспетчеризацию событий изменения указанного свойства 
}

// TODO: Перечитать и, возможно, поправить описание:
// Обновление модели данными представления
// Данная функция является обработчиком onChange и onChanging (идентична для обоих событий) для представлений, к которым она подключается по умолчанию в контролёре, если на этапе
// создания представления не были определены другие обработчики (тоже происходит и при переключении представлений из метода MVCView.rebind(...).
// Обновление модели происходит только при соблюдении необходимых условий - состояние модели и представления должны быть корректным, в противном случае (либо отсутствует
// возможность доступа к объекту модели по ссылке obj.model_obj - когда  obj.model_obj неопределена, либо к свойству представления obj.view_obj, что может быть связано либо уже с фактическим
// отсутствием самой модели, либо к отсутствию свойства модели). Если одно из условий нарушется - воизбежание программных исключений в скрипте - обновление модели не происходит.
// Аналогично как для _updateView используется две стратегии обновлений модели из представления - для элементов со свойством selection и без.
// Для элементов со свойством selection: ListBox, DropDownList, TreeView, TabbedPanel
// -    если строка binding-а содержит ссылку на selection, и свойство selection проинициализированно - происходит инициализация модели согласно ключу selection[obj.view_key], в случае если свойство 
//      selection неопределено и obj.view_key при этом не равно самому свойству "selection" - инициализация не происходит (если obj.view_key == "selection" а само свойство selection == null - модель обновится
//      значением null)
// Стандартный механизм инициализации предусматривает обновление модели obj.model_obj[obj.model_key] значением obj.view_obj[obj.view_key], где obj.view_obj может указвать либо на сам елемент 
//      control (ScriptUI объект), либо на какое либо свойство в рамках элемента (например на properties или graphics). Инициализация произойдёт только при существовании данного свойства (оно должно 
//      быть унициализированным и доступным для чтения и доступа - не null и не undefined); и только при условии доступности самой модели по ссылке obj.model_obj. При этом если в модели на момент 
//      обновления ключ(свойство) obj.model_key отсутствует, он будет автоматически создан в результате операции присвоения
MVCController.prototype._updateModel = function() {
    var obj = this, 
        control = obj.view.control;
    if (obj.model_obj && control) {
        if (control.hasOwnProperty('selection') && obj.binding.match(/selection/) && obj.view_key != 'selection') {
            obj.model_obj[obj.model_key] = control.selection[obj.view_key]; 
        } else { 
            if (obj.view_obj) obj.model_obj[obj.model_key] = obj.view_obj[obj.view_key]; 
        }
    }
};

// TODO: Перечитать и, возможно, поправить описание:
// Обновление представления данными модели.
// Обновление происходит согласно одной из двух стратегий, в зависимости от типа элемента представления:
// Для элементов со свойством selection: ListBox, DropDownList, TreeView, TabbedPanel
// -    если строка binding-а содержит ссылку на selection, происходит поиск элемента по всем элементам списка согласно ключу obj.view_key, в случае если свойство отсутствует - свойству
//      selection присваивается null (за исключением TabbedPanel - присваивание игнорируется)
// -    если строка binding-а содержит ссылку на selection - отрабатывает стандартный механизм инициализации
// Стандартный механизм инициализации:
// -    конечный объект инициализации в контексте элемента управления адресуется ссылкой obj.view_obj[obj.view_key], где obj.view_obj может указвать либо на сам елемент control (ScriptUI объект),
//      либо на какое либо свойство в рамках элемента (например на properties или graphics). Инициализация произойдёт только при существовании данного свойства (оно должно быть унициализированным
//      и доступным для чтения и доступа - не null и не undefined);
// -    наличие свойства obj.view_key никак не контролируется. В результате инициализации оно будет проинициализированно значением model_value, если до этого свойство отсутствовало в контексте
//      элемента - оно будет создано.
// -    в результате инициализации (в зависисмости от свойства) может срабатывать обработчик onChange/onChanging и соответственно приводить к обновлению связанной модели.
// -    элемент управления инициализируется значением model_value, оно берёться либо из первого (необяхательного) аргумента, который может передаваться при вызове данной функции, либо из самой 
//      модели, на которую ссылается указатель obj.model_obj[obj.model_key]. Значением инициализации может оказаться значение null,  undefined, NaN и т.п. в зависимости от имеющихся данных.
MVCController.prototype._updateView = function(newVal, oldVal, key) { // Пересмотреть на предмет selection!!!!!!!!!
    var obj = this,
          control = obj.view.control, //obj.view_obj,
          key = obj.view_key;
    if (obj.model_obj && control) { // Обновление не происходит если отсутствует доступ к модели или представлению!
        var newVal = (arguments.length) ? newVal : obj.model_obj[obj.model_key];  // obj.model_obj[obj.model_key] может быть неопределено - это допустимо в отличиии от отсутствия obj.model_obj
        if (control.hasOwnProperty('selection') && obj.binding.match(/selection/) && obj.view_key != 'selection') {
            switch (obj.view_key) {
                case 'index' || 'listitem': control.selection = newVal; break;
                case 'text': control.selection = control.find(newVal); break;
                default: 
                    for (var i=0, items = control.items, max = items.length; i<max; i++) { 
                        if (items[i][key] === newVal) control.selection = items[i]; break; 
                    }
            }
        } else {
            if (obj.view_obj) obj.view_obj[obj.view_key] = newVal;
        }
        if (typeof obj.view.render == 'function') obj.view.render.call(control, obj, newVal, oldVal, key);
    }
    return obj.model_obj[obj.model_key]; 
};

/**
 * @method MVCController#disable
 * @desc   "Отвязывает", связанные в рамках данного Контролеры, объекты Модель и Представление. В рузультате чего, 
 *  изменения их свойств больше не будут отражаться друг на друге.
 * 
 * @returns {MVCController} this - позволяет использовать цепочки вызовов.
 */
MVCController.prototype.disable = function() {
    if (this.model_obj && this.model_key !== undefined) this.model_obj.unwatch(this.model_key);
    return this;
};

/**
 * @method MVCController#enable
 * @desc   Используется после вызова {@link MVCController#disable .disable()} - cвязывает <b>Модель</b> и <b>Представление</b>, 
 *  определённые ранее в рамках данного <b>Контролера</b>. 
 * 
 * @returns {MVCController} this - позволяет использовать цепочки вызовов.
 */
// Навешивание "наблюдателя" на свойство модели. Наблюдатель выполняет функция диспетчера собтия изменения свойства от самого свойства - ко всем связанным представлениям
MVCController.prototype.enable = function() {
    var obj = this;
    if (!obj.model_obj || obj.model_key === undefined) return;
    obj.model_obj.watch (obj.model_key, function _handler (key, oldVal, newVal) {
       return (function(key, oldVal, newVal) {
            var ctrl = this;             // this - указывает на экземпляр контролёра;
            key = key.toString();        // для массивов (преобразуем индекс в текст)
            ctrl.model_obj.unwatch(key); // временно убиваем watch
                try { ctrl.model_obj[key] = newVal; } catch(e) { log('watch: ', e.description); }
                //Вызов валидатора модели (если определён)
                if (typeof ctrl.model.validator == 'function') ctrl.model._status_ = ctrl.model.validator.call(ctrl.model_obj, key, oldVal, newVal, ctrl); 
                // Реализация диспетчера для оповещения всех связанных представлений (обход всех контролёров связанных с данным объектом и свойством и обновление соответствующих представлений)
                for (var i=0, ctrls = ctrl.app.controllers, max = ctrls.length; i<max; i++) 
                    if (ctrls[i].model_obj === this.model_obj && ctrls[i].model_key === key) 
                        ctrls[i]._updateView(newVal, oldVal, key);
            ctrl.model_obj.watch(key, _handler);  // востанавливаем watch
            return ctrl.model_obj[key];
        }).apply(obj, arguments);
    }); //obj.model_obj.watch
    return this;
};
