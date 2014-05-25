/**
 * @@@BUILDINFO@@@ PNGLib.jsx 0.1.1 2014 13:34:54 GMT+0200
 * 
 * @module      PNGLib
 * @summary     Работа с PNG форматом.
 * @desc        Формирование ScriptUIImage изображений в памяти для использования с графическими
 *  элементами управления ScriptUI
 *
 * Добавляет в глобальное пространство имён метод {@link makePng makePng()}. В собственном пространство
 * имён расширяет группой вспомогательных методов, например adler32(), crc32s(), i2s() и др...
 * 
 * @version    0.1.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// Имя модуля:
/** @alias PNGLib */
var MODULE = "PNGLib";

$.global.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
        
    // Модуль:
    MODULE["version"] = "0.1.1";
    MODULE["name"] = "PNGLib";

    // --------------------------------------------------------------
    // Реализация...
    // TODO:
    // Файлы с классами и прочим можно разместить в подчинённой папке
    // ./ModuleName/src/... затем включить их и оформить фасад модуля.
	#include "PNGLib/src/makePng.jsx"

    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        "CRC_256":CRC_256,
        "crc32s":crc32s,
        "i2s":i2s,
        "chunk":chunk,
        "adler32":adler32,
        "makePng":makePng
    };
    
    // Расширяем модуль фасадом:
    // extend(MODULE, FACADE);
    for (var prop in FACADE) if (FACADE.hasOwnProperty(prop)) {
        MODULE[prop] = FACADE[prop];
    };

    // --------------------------------------------------------------
    // Экспорт в глобал только makePng
    // --------------------------------------------------------------
    GLOBAL["makePng"] = FACADE["makePng"];
    
    // --------------------------------------------------------------
    // Поддержка экспорта для модуля, включаемого с помощью eval():
    // --------------------------------------------------------------
    return MODULE;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} } /*, импорт внешних модулей */ );