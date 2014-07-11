/**
 * @@@BUILDINFO@@@ MVC.DOM.jsx 1.12 Fri Jul 11 2014 20:03:05 GMT+0300
 * 
 * @module      MVC.DOM
 * @summary     Расширение базового модуля MVC
 * @desc        Дополняет объект {@link MVCDocument MVCDocument} к базовому набору MVC-классов и расширяет
 *  базовый класс {@link MVCApplication MVCApplication} для включения в приложение поддержку фрхитектуры 
 *  многодокументных интерфейсов:
 *  - {@link MVCApplication#registerDocumentFactory MVCApplication.registerDocumentFactory(docFactory, docsView)}
 *  - {@link MVCApplication#addDocument MVCApplication.addDocument(obj)}
 *  - {@link MVCApplication#getDocumentByID MVCApplication.getDocumentByID(id)}
 *  - {@link MVCApplication#getDocumentByName MVCApplication.getDocumentByName(name)}
 *  - {@link MVCApplication#closeDocument MVCApplication.closeDocument(doc)}
 *  - {@link MVCApplication#loadDocument MVCApplication.loadDocument()}
 *  - {@link MVCApplication#saveDocument MVCApplication.saveDocument()}
 *  - {@link MVCApplication#saveAllDocument MVCApplication.saveAllDocument()}
 *  - {@link MVCApplication#saveAsDocument MVCApplication.saveAsDocument()}
 *
 * Расщиряет модуль MVC:
 * 
 * @property {MVCDocument} MVC.Document Ссылка на конструктор {@link MVCDocument MVCDocument()}
 *                                               
 * @requires MVC
 * 
 * @version    1.0.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// --------------------------------------------------------------
// Включение зависимостей:
#include "MVC.jsx"

/// Имя модуля: 
/** @alias MVC.DOM */
var MODULE = "DOM";

MVC.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE, MVC, Collection) {
    // Регистрация модуля
    MVC[MODULE] = MODULE;
    
    // Модуль:
    MODULE["version"] = "1.0.1";
    MODULE["name"] = "MVC.DOM Extension";
    
    // --------------------------------------------------------------
    // TODO:
    // Расширение MVCApplication
    #include "MVC/src/DOM/DOM.MVCApplication.jsx"
        
    // MVCDocument (наследуется от MVCApplication)
	#include "MVC/src/DOM/MVCDocument.jsx"

    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    // вместо MVC.DOM расширяем фасад MVC ->
    MVC["Document"] = MVCDocument;

    // --------------------------------------------------------------
    // Экспорт в глобал:
    // --------------------------------------------------------------
    // Экспорт типов, чтобы работал instanceof:
    GLOBAL["MVCDocument"] = MVCDocument;
    
    // --------------------------------------------------------------
    // Поддержка экспорта для модуля, включаемого с помощью eval():
    return MODULE;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} }, MVC, ESCollection.Collection );