// --------------------------------------------------------------
// @@@BUILDINFO@@@
// Раширение MVCApplication
// --------------------------------------------------------------

// Локализация:
#include "locales.jsxinc"

/**
 * @extends MVCApplication#prototype
 * @method  MVCApplication#registerDocumentFactory
 * @summary Регистрация "фабрики" документов.
 * @desc    Вызов метода обязателен для подготовки объекта Приложения к работе с многодокументоной архитектурой.
 *  В процессе регистрации объект Приложения будет расширен рядом дополнительных свойств:
 *  - `documents:{Collection}`      - коллекция Документов в рамках приложения;
 *  - `activeDocument:{MVCDocument}` - указатель на активный объект MVCDocument;
 *  - `documentsView:{MVCView}`     - указатель на Представление-контейнер для представлений Документов.
 *  Кроме того, прототип MVCApplication расширяется рядом методов (см. {@link DOM MVC.DOM}) для работы с объектами MVCDocument 
 *  <p>В качестве необязательного параметра метод получает ссылку на объект MVCView - который в последствии используется как
 *  родительский контейнер для представлений всех документов, создаваемых в рамках Приложения. Для указания контейнера, его
 *  необходимо предварительно создать с использованием в качестве значения свойства <code>id</code> строки <code>"Documents"</code>
 *  и добавить в общую коллекцию представлений MVCApplication.views.</p>
 *  <p>Если параметр docsView упущен, происходит попытка отыскать представление со значением id:"Documents" и если таковое
 *  не обнаруживается - в качестве контейнера будет использоваться родительское представления самого Приложения 
 *  (<code>MVCApplication.mainView</code>). После определения представления, ссылка на него присваивается свойству приложения 
 *  <code>MVCApplication.documentsView</code>.</p> 
 * 
 * @param  {MVCView}  [docsView = MVCApplication.documentsView]    указатель на Представление, для использования в роли
 *                                  родительского контейнера представлений Документов.
 * @returns {MVCApplication}  this - позволяет использовать цепочки вызовов.
 */
MVCApplication.prototype.registerDocumentFactory = function (docsView) {
    /**
     * коллекция Документов в рамках приложения
     *  @type {Collection}
     */
    this.documents = new Collection();
    /**
     * указатель на активный объект MVCDocument
     * @type {MVCDocument}
     */
    this.activeDocument = null;
    /**
     * указатель на Представление-контейнер для представлений Документов
     * @type {MVCView}
     */
    this.documentsView = (typeof docsView != 'undefined' ? docsView : (this.getViewByID('Documents')||this.mainView)); 
    // расширение внутреннего счётчика id-шников для поддержки объектов-документов
    this._counters_['docs'] = 0;
    
    this.DEF_DOCNAME = localize(locales.DEF_DOCNAME);
    return this;
};

/**
 * @extends MVCApplication#prototype
 * @method  MVCApplication#addDocument
 * @summary Создаёт и добавляет новый <b>Документ</b> в коллекцию документов приложения <code>MVCApplication.documents</code>
 * @desc    Для получения нового Документа используется вызов метода {@link MVCApplication#CreateDocument MVCApplication.CreateDocument()}, 
 *     <p>При добавлении нового <b>Документа</b> с ним ассоциируется специально создаваемая <b>Модель</b>, имеющая единственное 
 *     свойство <code>document</code>, указывающее на созданный экземпляр MVCDocument и значение <code>id</code> такое же как 
 *     <code>id</code> созданного Документа.</p> 
 *     <p>Кроме того, в коллекцию представлений приложения (MVCApplication.views) добавляется ссылка на представление документа,
 *     при этом свойство <code>id</code> представления документа устанавливается в соответствии со значением свойства 
 *     <code>id</code> Модели Документа: <code>model.id == view.id == MVCDocument.mainView.id</code>.</p>
 *     <p><i><b>ПРИМЕЧАНИЕ:</b></i></p>
 *      * Расширение и определения функциональности самого объекта документа следует выполнять в рамках метода
 *        {@link MVCApplication#CreateDocument MVCApplication.CreateDocument()}, путём его переопределения;
 *      * В случае успешного создания документа на него переустанавливается указатель MVCApplication.activeDocument, 
 *        в противном случае - его текущее значение не изменяется.
 * 
 * @param {object} [obj]    литерал объекта, которым будет расширен базовый объект MVCDocument, полученный с помощью вызова 
 *                          фабричного метода {@link MVCApplication#CreateDocument MVCApplication#CreateDocument()}
 * @returns {MVCDocument|null}  В случае успеха возвращается созданный объект MVCDocument, в противном случае - null.
 *
 */
MVCApplication.prototype.addDocument = function(obj) {
    var app = this,
        doc = app.CreateDocument(obj);
    // на всякий случай, но так быть не должно:    
    if (!doc) return null;
    // Создание и добавление связанных с документом модели и представления в соответствующие коллекции приложения:
    app.addModel({ id:doc.id, document:doc });
    // добавлем в коллекцию представлений приложения ссылку на представление документа, чтобы связать его контролёром:
    app.views.add(new MVCView(doc.id, doc.window, doc.view));
    // Этот контролёр просто связывает текстовое свойство text представления документа с его именем чтобы при смене
    // имени документа автоматически обновлялся заголовок представления документа:
    app.addController({ id:doc.id, binding:doc.id + ".document.name:"+doc.id+".text" });
    // добавляем документ в коллекцию и переустнавливаем ссылку на активный документ:      
    app.documents.add(doc);
    
    return this.activeDocument = doc;
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#CreateDocument
 * @summary     Фабричный метод для создания экземпляров Документов.
 * @desc    По умолчанию метод возвращает базовый объект MVCDocument, привязанный к данному Приложению (выполняется
 *  вызов <code>new MVCDocument(this)</code>, где this указывает на контекст Приложения). Чтобы определить необходимую
 *  функциональность базового объекта MVCDocument, следует переопределить данный метод в пользовательском объекте 
 *  Приложения, при этом, метод должен возвращать созданный экземпляр Документа или null, в случае проблем его создания. 
 *  <p><i><b>ПРИМЕЧАНИЕ:</b> Данный метод автоматически используется для получения объекта Документа при вызове методов
 *  {@link MVCApplication#addDocument MVCApplication.addDocument()} и {@link MVCApplication#loadDocument MVCApplication.loadDocument()}.</i></p>
 * 
 * @returns {MVCDocument}
 */
MVCApplication.prototype.CreateDocument = function() {
    return new MVCDocument(this);
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#loadDocument
 * @summary     Загружет документ из файла.
 * @desc    Метод обеспечивает создание диалогового окна для открытия файлов, настроенное на заданный фильтр файлов, 
 *    представленный в свойстве <code>MVCDocument.filters</code> - данное свойство, при создании документа инициализируется 
 *    данными из одноимённого свойства приложения <code>MVCApplication.filters</code> и в дальнейшем, в рамках данного 
 *    документа может быть независимо расширено.
 *    <p>Загрузка документа обеспечивается в три этапа:</p> 
 *     1. открытие диалога для выбора файла; 
 *     2. создание пустого объекта-Документа путём вызова {@link MVCApplication#addDocument MVCApplication.addDocument()};
 *     3. инициализация свойства .file у полученного на этапе (2) Документа значением, полученным на этапе (1)
 *        и вызов в контексте данного объекта-Документа его собственного метода {@link MVCDocument#load MVCDocument.load()}.
 *    <p>В случае успешного открытия происходит переустановка указателя <code>MVCApplication.activeDocument</code> на 
 *    созданный экземпляр документа и возвращается ссылка на данный экземпляр. В случае, если в окне выбора файла было нажато
 *    "Отмена" или метод документа <tt>.load()</tt> вернул <b>false</b> - Документ создан не будет, Значение указателя
 *    <code>MVCApplication.activeDocument</code> не изменится и методом будет возвращено значение <b>null</b>.</p>
 *    <p>Таким образом, для реализации открытия файла предполагается, что метод Документа {@link MVCDocument#load MVCDocument.load()} 
 *    должен быть определён, так как реальная работа по загрузке данных из файла должна обеспечиваться непосредственно собственным
 *    методом <code>load()</code> конкретного экземпляра Документа.
 *     
 * @returns {MVCDocument} Возвращает ссылку на открытый документ или null в случае ошибки открытия или выбора "Отмена" в
 *                        диалоговом окне выбора файлов.
 */
MVCApplication.prototype.openDocument = function() {
    var app = this,
        file = File.openDialog(localize(locales.MSG_OPENDOC), this.filters, false);
    if (!file) return null;
    var docName = File.decode(file.name);
    if (app.getDocumentByName(docName)) { 
        alert(localize(locales.MSG_DOCEXISTS, docName)+"\r\r"+File.decode(file.fullName), MVC.DOM.name+" v"+MVC.DOM.version);
        return null;
    };
    var activeDoc = this.activeDocument,
        doc = this.addDocument();
    if (!doc) return null;
    // Попытка загрузки файла документа:
    doc.file = file;
    doc.name = docName;
    if (!doc.load()) {
        app.closeDocument(doc);
        app.activeDocument = activeDoc;
        return null;
    }
    return doc;
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#closeDocument
 * @summary     Закрытие документа.
 * @desc    Процесс закрытия реализует удаление главного <b>Представления</b> и <b>Модели</b>, представляющих <b>Документ</b>, 
 *     из соответствующих коллекций <b>Приложения</b> и переустановку указателя <code>MVCApplication.activeDocument</code> на 
 *     другой ближайший в коллекции объект документа.
 *     <p>Вся специальная работа, связанная с удалением данных, представлений и пр... созданных в рамках документа, может быть 
 *     реализована в методе {@link MVCDocument#close .close()} реального экземпляра Документа. Данный метод должен возвращать 
 *     <b>true</b> в результате успешного выполнения, в противном случае операция удаления документа в рамках данного метода 
 *     (<tt>closeDocument()</tt>) прерывается (Представление, Модель и Контролёр, связанные с Документом - удалены не будут).</p> 
 *     <p>Удаление документа начинается с вызова его собственного метода {@link MVCDocument#close .close()}, после чего 
 *     происходит удаление связанных с ним основных MVC-объектов из соответствующих коллекций Приложения.</p> 
 * 
 * @param  {string|MVCDocument} [doc = activeDocument] Ссылка на удаляемый документ или его id. Если не указано - 
 *                                                     удаляется текущий активный документ (определяется по значению
 *                                                     свойства activeDocument)
 * @returns {MVCDocument}       Возвращает текущее значение <b>activeDocument</b> с учётом выполнения закрытия документа.
 */
MVCApplication.prototype.closeDocument = function(doc) {
    var app = this,
        documents = this.documents,
        doc = (doc)||this.activeDocument;
    if (doc instanceof String) doc = app.documents.getFirstIndexByKeyValue('id', doc);
    if (!doc) return;
    var id = doc.id,
        index = documents.getFirstIndexByKeyValue('id', id);
    if (index != -1 && documents[index].close()) {
        documents.removeByIndex(index);
        // Выделяем соседний (если есть)
        if (index < documents.length) app.activeDocument = documents[index]; else {
            app.activeDocument = (index > 0 ? documents[index-1] : null);
        }
        while(doc.models.length) { doc.removeModel(doc.models[0]) };
        app.removeMVC(app.getModelByID(id));
    }
    return app.activeDocument;
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#saveDocument
 * @summary     Сохранение документа в файл.
 * @desc    Данный метод обеспечивает вызов {@link MVCDocument#save .save()} в отношении указанного в параметре <tt>doc</tt> 
 *     Документа. Без параметров - в качестве "рабочего" документа используется документ, на который указывает свойство 
 *     <code>MVCApplication.activeDocument</code> текущего объекта Приложения.
 *     <p>Реальная работа по сохранению данных в файл должна быть реализована в собственном методе 
 *     {@link MVCDocument#save .save()} объекта MVCDocument.</p>   
 * 
 * @param  {string|MVCDocument} [doc = activeDocument] Ссылка на cохраняемый документ или его id. Если не указано - 
 *                                                     операция сохренения выполняется в отношении текущего активного 
 *                                                     документа (определяется значением свойства activeDocument)
 * @returns {boolean} результат, полученный в результате вызова MVCDocument.save() - false в случае ошибки сохранения. 
 */
MVCApplication.prototype.saveDocument = function(doc) {
    var app = this,
        doc = (doc)||app.activeDocument;
    if (doc instanceof String) doc = app.documents.getFirstIndexByKeyValue('id', doc);
    return (doc ? doc.save() : false);
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#saveAsDocument
 * @summary     Сохранение документа в файл под новым именем.
 * @desc    Данный метод обеспечивает вызов {@link MVCDocument#saveAs .saveAs()} в отношении указанного в параметре <tt>doc</tt> 
 *     Документа. Без параметров - в качестве "рабочего" документа используется документ, на который указывает свойство 
 *     <code>MVCApplication.activeDocument</code> текущего объекта Приложения.
 *     <p>Реальная работа по сохранению данных в файл должна быть реализована в собственном методе 
 *     {@link MVCDocument#saveAs .saveAs()} объекта MVCDocument.</p>   
 * 
 * @param  {string|MVCDocument} [doc = activeDocument] Ссылка на cохраняемый документ или его id. Если не указано - 
 *                                                     операция сохренения выполняется в отношении текущего активного 
 *                                                     документа (определяется значением свойства activeDocument)
 * @returns {boolean} Возвращает результат, полученный в результате вызова MVCDocument.save(), и <b>false</b> - в случае 
 *                   ошибки сохранения. 
 */
MVCApplication.prototype.saveAsDocument = function(doc) {
    var app = this,
        doc = (doc)||app.activeDocument;
    if (doc instanceof String) doc = app.documents.getFirstIndexByKeyValue('id', doc);
    return (doc ? doc.saveAs() : false);
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#saveAllDocument
 * @summary     "Быстрое" сохранение всех открытых документов в рамках текущего объекта Приложения.
 * @desc    Метод осуществляет обход коллекции <code>documents</code> и вызове метода {@link MVCDocument#save .save()} 
 *     в отношении всех объектов Документов, в ней присутствующих.
 *     <p>Реальная работа по сохранению данных в файл должна быть реализована в собственном методе 
 *     {@link MVCDocument#save .save()} объекта MVCDocument.</p>  
 * 
 * @returns {MVCDocument} Текущий активный Документ (значение свойства <code>MVCApplication.activeDocument</code>).
 */
MVCApplication.prototype.saveAllDocument = function() {
    each(this.documents, function(doc) { doc.save() });
    return this.activeDocument;
};

// --------------------------------------------------------------
// Вспомогательные методы для быстрого поиска документов в коллекции

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#getDocumentByName
 * @desc    Поиск Документа в коллекции <code>MVCApplication.documents</code> по имени - свойству <code>name</code>
 * 
 * @param  {string} name                значение свойства name искомого Документа.
 * @returns {MVCController|undefined}   Возвращает ссылку на найденный объект MVCDocument, 
 *                                      если объект не обнаруживается - возвращает undefined.
 */
MVCApplication.prototype.getDocumentByName = function(name) {
    var name1 = this.documents.getFirstByKeyValue('name', name),
        name2 = this.documents.getFirstByKeyValue('name', "*"+name);
    return name1||name2;
};

/**
 * @extends     MVCApplication#prototype
 * @method      MVCApplication#getDocumentByID
 * @desc    Поиск Документа в коллекции <code>MVCApplication.documents</code> по <code>id</code>
 * 
 * @param  {string} id                  id (идентификатор) объекта.
 * @returns {MVCController|undefined}   Возвращает ссылку на найденный объект MVCDocument, 
 *                                      если объект не обнаруживается - возвращает undefined.
 */
MVCApplication.prototype.getDocumentByID = function(id) {
    return this.documents.getFirstByKeyValue('id', id);  
};

// --------------------------------------------------------------
// required DOM/locales.jsxinc:

/*
 * @extends     MVCApplication#
 * @property {string} MVCApplication#DEF_DOCNAME  Имя по умолчанию для нового Документа.
 */
//MVCApplication.prototype.DEF_DOCNAME = localize(locales.DEF_DOCNAME);

/**
 * @extends     MVCApplication#
 * @property {Array.<string>} MVCApplication#  Фильтр для диалогов открытия/закрытия файлов. 
 */
MVCApplication.prototype.filters = [];

for (var i=0; i<locales.DEF_FILTERS.length; i++)
    MVCApplication.prototype.filters[i] = localize(locales.DEF_FILTERS[i]);