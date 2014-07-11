// --------------------------------------------------------------
// @@@BUILDINFO@@@
// MVCDocument
// --------------------------------------------------------------

/**
 * @extends MVCApplication
 * @class   MVCDocument
 * @summary Объект <b>MVC-Документ</b>. Определяется в {@link MVC.DOM MVC.DOM}.
 * @desc    Предсталяет комплексный объект, непосредственно унаследованный от объекта-Приложение MVCApplication, предназначен
 *  для управления неким общим набором данных, которые можно логически объеденить в рамках единой сущности - Документа.
 *  В дополнение к унаследованным от MVCApplication свойствам и метода, дополнительно предрсталяет интерфейс,
 *  характерный для управления множеством пользовательских данных как одним цельным объектом. 
 *  Например, предоставляет интерфейс для открытия/сохранения данных в файл, при этом в рамках соответствующих
 *  методов уже предусмотрены функции по созданию соответствующих диалоговых окон, автонастроенных в соответствии со
 *  значением соответствующих свойств Документа: <code>MVCDocument.filters</code> и <code>MVCDocument.file</code>
 *  Аналогично MVCApplication, каждый объект MVCDocument обладает собственным главным окном - Представлением, в рамках
 *  которого производит вывод всех представлений, ассоциированных с данными документа (и его моделями).
 *        
 * @param {MVCApplication} appRef   Указатель на "родительское" Приложение, в рамках которого управляется Документ
 * @param {object}         [prefs]  Параметры для создания Документа, аналогичные параметрам создания для MVCApplication
 *
 * @property {string}           id      Идентификатор документа
 * @property {MVCApplication}   app     Указатель на "родительское" Приложение
 * @property {file}             file    Файл документа
 * @property {Array}            filters Фильтр, используемый для открытия окон
 */
function MVCDocument(appRef, prefs) {
    if (!appRef) throw Error ('Missing application reference in first argument');    
    if (!(this instanceof MVCDocument)) return new MVCDocument(appRef, prefs);
    // Сохраняем текущее значение глобальной ссылки MVC.app, так как она перепишиться в конструкторе родительского класса 
    // MVCApplication при вызове MVCDocument.prototype.__super__.constructor.call(this, prefs);
    var mvcapp = MVC.app,
        docCounts = (app._counters_['docs']++),
        docDefName = localize(app.DEF_DOCNAME) + docCounts;
    // Вызов базового конструктора MVCApplication
    MVCDocument.prototype.__super__.constructor.call(this, extend({ id      : 'docs' + docCounts,
                                                                    app     : appRef,
                                                                    name    : docDefName,
                                                                    caption : docDefName }, prefs));
    // Востанавливаем MVC.app, который был переустановлен в кострукторе MVCApplication();
    MVC.app = mvcapp;
};

inherit(MVCDocument, MVCApplication);

/**
 * @method  MVCDocument#CreateMainView
 * @summary <i>Приватный</i> метод, формирующий <b>Представление</b> документа в рамках главного окна <b>MVC-Приложения</b>.
 * @desc    Внутренний метод Документа для формирования своего главного окна, представляет собой переопределённую версию
 * {@link MVCApplication#CreateMainView MVCApplication.CreateMainView()}. Метод создаёт Представление в рамках родительского
 * контэйнера, на которое указывает свойство <tt>MVCApplication.documentsView</tt> (устанавливается при регистрации 
 * фабрики документов).
 * @override
 * @param {string}  resStr  ресурсная строка, представляющая графический элемент управления (объект ScriptUI);
 */
MVCDocument.prototype.CreateMainView = function(resStr) {
    var mainView = {}, 
        app = this.app;
    if (app.documentsView) {
        var control = app.documentsView.control;
        if (resStr.match(/dialog|palette|window/i)) throw Error ("Cannot add "+resStr+" to Application.documentsView ("+contol.type+")");
        mainView = new MVC.View('window', control.add(resStr));
        if (control.parent) { control.parent.layout.layout(true); control.parent.layout.resize(); }
    } else {
        if (!resStr.match(/dialog|palette|window/i)) throw Error ("Cannot create "+resStr+" because app.documentsView not null");
        mainView = new MVC.View('window', new Window(resStr));
    }
    // mainView.control.text = this.caption;
    this.views[0] = this.mainView = mainView;
    var w = this.window = this.mainView.control;
    // дополнительная инициализация для resizeable:true окон
    if (w.properties && w.properties.resizeable) { w.onResizing = w.onResize = function() { w.layout.resize() } }; 
    return this.views[0];
}

// --------------------------------------------------------------
// Методы загрузки, сохранения и закрытия документов определяются в реальных пользовательских классах Документов
// -------------------------------------------------------------- 
/** 
 * @method  MVCDocument#save
 * @desc    Определяется в пользовательском объекте. 
 * @abstract
 * @return {boolean}    В случае ошибки выполнения операции должен возвращать false
 */
MVCDocument.prototype.save   = function() { return true; };
/** 
 * @method  MVCDocument#saveAs
 * @desc    Определяется в пользовательском объекте. 
 * @abstract
 * @return {boolean}    В случае ошибки выполнения операции должен возвращать false
 */
MVCDocument.prototype.saveAs = function() { return true; };
/** 
 * @method  MVCDocument#close
 * @desc    Определяется в пользовательском объекте. 
 * @abstract
 * @return {boolean}    В случае ошибки выполнения операции должен возвращать false
 */
MVCDocument.prototype.close  = function() { return true; };
/** 
 * @method  MVCDocument#load
 * @desc    Определяется в пользовательском объекте. 
 * @abstract
 * @return {boolean}    В случае ошибки выполнения операции должен возвращать false
 */
MVCDocument.prototype.load   = function() { return true; };