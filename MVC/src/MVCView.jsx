// --------------------------------------------------------------
// @@@BUILDINFO@@@
// MVCView - Представление (Вид)
// --------------------------------------------------------------

/**
 * @extends MVCObject#
 * @class   MVCView
 * @summary MVC-Объект <b>Представление (Вид)</b>.
 * @desc    <b>Представление</b> (или в другой терминологии – <b>Вид</b>) служит для отображения и управления (редактирования) 
 *  данных, представленых в Моделях. По сути, объекты MVCView является обёрткой вокруг ScriptUI-объектов, представляющими 
 *  элементамы управления пользовательского графического интерфейса - объекты <code>UIControl</code>.
 *  <p>'Родной' конструктор Представлений не предусматривает создание графического эл. управления, он выполняет лишь 'заворачивание'
 *  уже имеющегося элемента в необходимую 'обёртку'. А вот метод Приложения {@link MVCApplication#addView .addView({...})} напротив -
 *  всегда приводит к созданию нового элемента управления (объекта UIControl) в контексте тут же созданного объекта MVCView</p>
 *  <p>Таким образом, создания Представлений с использованием конструктора <code>MVCView()</code> требуется в случае, когда нам необходимо 
 *  существующий элемент управления «обернуть» в объект-Представление. После этого, как и в случае с Моделями, перед связыванием
 *  этого представления с моделью, его необходимо явно добавить в коллекцию представлений Приложения (<code>MVCApplication.views</code>) 
 *          
 * @param {string}                  идентификатор модели (при добавлении объекта в коллекцию - значение свойства id должено 
 *                                  быть уникальным в рамках этой коллекции);
 * @param {UIControl} [control = null] графический элемент управления - (кнопка, список, диалог и т.п.);
 * @param {string} [rcString = ""]  ресурсная ScriptUI-строка, представляющая элемент управления - присваивается свойству 
 *                                  .view объекта MVCView. Если задан только параметр control - rcString будет получена
 *                                  автоматически, путём вызова toSource(), в отношении указанного элемента управления.
 *                                 
 * @property {string}         id        id (идентификатор) объекта;
 * @property {UIControl}      control   графический элемент управления (кнопка, список, диалог и т.п.), представленный данным 
 *                                      объектом MVCView.
 * @property {string}         view      ресурсная строка в корректном ScriptUI-формате, представляющая элемент управления, на 
 *                                      который ссылается свойство <code>.control</code>;
 * @property {function}       render    метод, вызываемый автоматически диспетчером приложения при обновлении Представления 
 *                                      в связи с обновлением связанной с ним Модели (определяется пользователем).
 * @returns {MVCView}
 * @example
 * // Пусть главное окно приложения изначально включает 
 * // поля ввода (два элемента EditText):
 * var myApp = new MVCApplication({
 *     view:"dialog { et1:EditText{}, et2:EditText{} }"
 * });
 * var w = myApp.window;
 * var myView = new MVCView("et1", w.et1);
 * $.writeln(myView.id); // => `et1`
 * $.writeln(myView.view); // => `edittext {textDirection:null,type:edittext}`
 * $.writeln(myView.control === w.et1); // => true
 *
 * // Значение id не обязательно должно совпадать с локальным
 * // именем элемента...
 */
function MVCView(id, control, rcString) {
    if (!(this instanceof MVCView)) return new MVCView(id, control, rcString);
    MVCModel.prototype.__super__.constructor.call(this, id);
    this.control = (this.control)||(control)||null;
    this.view = (this.view)||(rcString)||(this.control ? this.control.toSource() : "");
};

inherit(MVCView, MVCObject);

/**
 * @method  MVCView#Init
 * @summary Инициализация <b>Представления</b>.
 * @desc    Метод вызывается при создании Представления в рамках метода приложения {@linkcode MVCApplication#addView MVCApplication.addView(...)}. 
 *  Вызов происходит в контексте элемнта управления (в контексте элемнта свойства <code>.control</code>). Метод предназначен 
 *  для переопределения с целью выполнения дополнительных действий по настройке графического элемента управления сразу 
 *  после его создания.
 * @abstract 
 * 
 * @returns {any} определяется пользователем.
 * @example
 * // добавит к главному окну приложения элемент управления ListBox
 * // после чего сразу сформирует в нём два пункта, включающие
 * // изображения, загружаемые из файлов на диске:
 * myApp.addView({ 
 *     view:"listbox { characters: 20 }", 
 *     Init:function() {
 *         with(this.add(“item”, “Строка 1”)) { image = ScriptUI.newImage(file_1)};
 *         with(this.add(“item”, “Строка 2”)) { image = ScriptUI.newImage(file_2)};
 *     }
 * });
 */
MVCView.prototype.Init = function() {
    return this;
};

/**
 * @method  MVCView#rebind
 * @summary Переключает <b>Представления</b> на заданную <b>Модель</b>.
 * @desc    После переключения все события, связанные с изменением свойства <code>view_key</code> данного представления будут приводить 
 *  к соответствующему изменению свойства <code>model_key</code> в указанной модели <code>model</code>.
 *  <p>Переключение происходит только со стороны представления, тоесть, события связанные с изменением свойства модели, которая 
 *  ранее являлась связанной с данным представлением, по прежнему будут отражаться на данном представлении.</p>
 * 
 * @param  {MVCModel|object}    model   Модель, на которую производится переключение;
 * @param  {string} [view_key = "text"] Имя свойства представления, значение которого будет привязываться к заданному свойству модели.
 *                                      Если не задано, подразумевается, что это свойство text (типично для <b>StaticText</b> и <b>EditText</b>)
 * @param  {string} [model_key = ""]    Имя свойства модели, если не задано, извлекается из свойства <code>binding</code> объекта-контролёра, 
 *                                      связанного с данной моделью. Если аргумент <code>model</code> не является объектом MVCModel - аргумент 
 *                                      <code>model_key</code> должен быть обязательно определён. 
 * 
 * @returns {MVCView} this - позволяет использовать цепочки вызовов.
 * @example myView.rebind(myOtherModel, "value.txt", "text");
 */
MVCView.prototype.rebind = function(model, view_key, model_key) {
    if (!model) return this.control;  // если модель не определены - ничего не делаем!
    var object, ctrl = null,
           control = this.control, 
           obj = {}; // Пустой псевдо-контроллер
    obj.model = model;
    obj.view = this;
    if (model_key !== undefined) {
        object = _parseBind(obj.model, "model."+model_key);
        obj.model_obj = object.object;
        obj.model_key = object.key;
    } else {
        if (model._controllers && model._controllers.length) { // Пополняем коллекцию контролёров модели) {
            obj.model_obj = model._controllers[0].model_obj; 
            obj.model_key = model._controllers[0].model_key; 
        } else { 
            obj.model_obj = model; 
            obj.model_key = undefined;
            obj.model._status_ = true;
        }
    }
    obj.binding = obj.view_key =  (view_key) || (control.hasOwnProperty('selection') ? 'selection.text' : 'text');
    object = _parseBind(obj.view.control, "model."+obj.view_key);
    obj.view_obj = object.object;
    obj.view_key = object.key;
    if (obj.binding.match(/selection/)) obj.view_obj = obj.view.control;
    // Сперва отвязываемся
    this.unbind();
    var model_value = obj.model_value = (obj.model_key === undefined) ? obj.model_obj : obj.model_obj[obj.model_key];
    // Теперь выполняем немедленную инициализацию представления
    MVCController.prototype._updateView.call(obj, model_value);
   // Устанавливаем обработчики на новую модель (или обычный объект)
    if (obj.model_key !== undefined) {
        control.onChange = bind(obj, MVCController.prototype._updateModel);
    } else {
        control.onChange =  function() {
            if (obj.model_obj && control) { // Обновление не происходит если отсутствует доступ к модели или представлению!
                if (control.hasOwnProperty('selection') && obj.binding.match(/selection/) && obj.view_key != 'selection') obj.model_obj = control.selection[obj.view_key]; else { 
                    obj.model_obj = obj.view_obj[obj.view_key]; 
                }
            }
        };
    }
    control.onChanging = control.onChange;
    //return this.control;
    return this;
};    

/**
 * @method  MVCView#unbind
 * @summary «Отвязывает» <b>Представление</b> от <b>Модели</b>.
 * @desc    В результате вызова данного метода, любые события изменения данных в Представлении перестают отражаться на связанной
 *  с ним Модели. При этом, связанное свойство представления очищается (например, если в качестве представления выступал
 *  компонент <b>EditBox</b> - его свойству <b>.text</b> присваивается пустая строка "", а свойству <b>.selection</b> для 
 *  элементов-списков, таких как <b>ListBox, DropDownList</b> и <b>TreeView</b> - присваивается <b>null</b>). 
 * 
 * @returns {MVCView} this - позволяет использовать цепочки вызовов.
 * @example myView.unbind();
 */
MVCView.prototype.unbind = function() {
    if (!this.control) return;
    var control = this.control;
    delete control.onChange; delete control.onChanging; 
    if (control.hasOwnProperty("selection") && control.type != 'tabbedpanel') control.selection = null; 
        else if (control.hasOwnProperty("text")) control.text = "";
};

/**
 * @method  MVCView#remove
 * @summary <i>Приватный</i> метод удаление объекта UIControl, представленного в свойстве <code>control</code> Представления. 
 * @desc    Удаляет из родительского контейнера элемент управления, инкапсулированный в данном Представлении. Как правило, 
 *  специальный вызов данного метода не требуется. Вызов метода происходит автоматически в процессе удаления самого объекта 
 *  Представления - в результате вызова методов Приложения - {@linkcode MVCApplication#removeView .removeView()} или 
 *  {@linkcode MVCApplication#removeMVC .removeMVC()}.
 * <p>Вызов данного метода приводит к срабатыванию обработчика {@linkcode MVCView#event:onRemove onRemove()} в контексте данного 
 * объекта MVCView.</p>
 * 
 * @fires MVCView#onRemove
 * 
 * @returns {boolean} в результате успешного удаления возвращает true, в противном случае false.
 */
MVCView.prototype.remove = function() {
    if (!this.control) return false;
    var control = this.control,
        parent = control.parent;
    // отвязываемся от модели и перед удалением самого элемента вызываем обработчик onRemove():
    this.unbind();
    this.onRemove();
    try { 
        if (!parent) control.close(); else {
            parent.remove(control); 
            parent.layout.layout(true);
        }
    } catch(e) { return false; }
    return true;
};

/**
 * @event   MVCView#onRemove
 * @desc    Вызов данного обработчика происходит в момент удаления объекта MVCView непосредственно перед удалением графического 
 * элемента управления, представленного в данном объекте MVCView (как правило, в результате удаления самого Представления). 
 * По умолчанию данный обработчик никаких действий не выполняет.
 * @example <caption>При удалении Представления в консоль будет выдано сообщение. Обработчик определяется в контсексте
 *          объекта MVCView, а не в контексте его элемента управления MVCView.control: {UIControl}</caption>
 * myApp.addView({
 *     onRemove:function() {
 *         $.writeln("Удаление:"+this.id)
 *     }
 * });
 */
MVCView.prototype.onRemove = function() {
    return this;
};
