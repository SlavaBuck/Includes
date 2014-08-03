/**
 * @@@BUILDINFO@@@ MVC.jsx 1.12 Sun Aug 03 2014 15:28:51 GMT+0300
 * 
 * @module      MVC
 * @desc        Базовый модуль библиотеки MVC. Представляет основные классы для реализации приложения согласно 
 *     архитектурному паттерну MVC.
 *
 * @property {MVCApplication}   MVC.app             Указатель на экземпляр MVCApplication (переустанавливается 
 *  в конструкторе {@link MVCApplication MVCApplication()} и, таким образом, в рамках скрипта
 *  указывает на последний инициированный(активный) объект-приложение.
 * @property {MVCApplication}   MVC.fastmode        Специальный флаг (по умолчанию равен false), если true - проверки на 
 *  уникальность id при добавлении MVC-объектов в коллекции <code>MVCApplication.models</code>, <code>MVCApplication.views</code>
 *  и <code>MVCApplication.controllers</code> не производится. Может быть полезна для интенсивной работы с большими коллекциями 
 *  при условии реализованного в программе надёжного алгоритма для формирования уникальных id-шников.
 * @property {MVCApplication}   MVC.Application     Ссылка на конструктор {@link MVCApplication MVCApplication()}
 * @property {MVCModel}         MVC.Model           Ссылка на конструктор {@link MVCModel MVCModel()}
 * @property {MVCView}          MVC.View            Ссылка на конструктор {@link MVCView MVCView()}
 * @property {MVCController}    MVC.Controller      Ссылка на конструктор {@link MVCController MVCController()}
 * 
 * @requires _debug
 * @requires _util
 * @requires Collection
 * 
 * @version    1.1.0
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// --------------------------------------------------------------
// Включение зависимостей:
#include "_util.jsx"
#include "Collection.jsx"

/// Имя модуля: 
/** @alias MVC.DOM */
var MODULE = "MVC";

$.global.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE, Collection) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
    
    // Модуль:
    MODULE["version"] = "1.1.0";
    MODULE["name"] = "MVC Library";
    
    // Реализация
    #include "MVC/src/MVCObject.jsx"
    #include "MVC/src/MVCApplication.jsx"
    #include "MVC/src/MVCModel.jsx"
    #include "MVC/src/MVCView.jsx"
    #include "MVC/src/MVCController.jsx"
    
    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        "Object":MVCObject, // MVCBase ??
        "Application":MVCApplication,
        "Controller":MVCController,
        "Model":MVCModel,
        "View":MVCView
    };
    // Расширяем модуль фасадом:
    extend(MODULE, FACADE);

    // --------------------------------------------------------------
    // Экспорт в глобал всего фасада (если нужно)
    // --------------------------------------------------------------
    // extend(MODULE, FACADE);
    // Экспортируем по полному имени: "MVC"+"Application", и т.д...
    each(keys(FACADE), function(m) {GLOBAL[MODULE+m] = FACADE[m];} );

    // --------------------------------------------------------------
    // Поддержка экспорта для модуля, включаемого с помощью eval():
    // --------------------------------------------------------------
    return MODULE;

})( $.global, { toString:function(){return MODULE;} }, ESCollection.Collection );


