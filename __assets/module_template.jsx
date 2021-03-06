﻿/**
 * @@@BUILDINFO@@@ MODULE.jsx 0.0.1 2014 13:34:54 GMT+0200
 * 
 * @module      <ModuleName>
 * @summary     Короткое описание
 * @desc        Полное описание
 * 
 * @requires   Module 
 * 
 * @version    0.0.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// --------------------------------------------------------------
// TODO: Включение глобальных зависимостей (внешних модулей):
// #include "Module.jsx"

// TODO: Это единственное место, где нужно прописать 
// Имя модуля:
/** @alias  */
var MODULE = "ModuleName";

$.global.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
        
    // Модуль:
    MODULE["version"] = "0.0.1";
    MODULE["name"] = "My Libruary";

    // --------------------------------------------------------------
    // Реализация...
    // TODO:
    // Файлы с классами и прочим можно разместить в подчинённой папке
    // ./ModuleName/src/... затем включить их и оформить фасад модуля.
	#include "ModuleName/src/file.jsx"

    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        "ClassName":ClassName,
        "propName":propName,
        // ...
    };
    // Расширяем модуль фасадом:
    extend(MODULE, FACADE);

    // --------------------------------------------------------------
    // Экспорт в глобал всего фасада (если нужно)
    // --------------------------------------------------------------
    // each(keys(FACADE), function(m) {GLOBAL[MODULE + m] = FACADE[m];} );
    // 
    // extend(GLOBAL, FACADE);

    // --------------------------------------------------------------
    // Поддержка экспорта для модуля, включаемого с помощью eval():
    // --------------------------------------------------------------
    return MODULE;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} } /*, импорт внешних модулей */ );