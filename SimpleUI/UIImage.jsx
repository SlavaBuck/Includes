/**
 * @@@BUILDINFO@@@ UIImage.jsx 0.1.1 2014 13:34:54 GMT+0200
 * 
 * @module      SUI.UIImage
 * @summary     
 * @desc        Расширяет прототип ScriptUIImage для поддержки масштабирования объектов image в 
 *  пользовательских элементах управления.
 *
 * В глобальное пространство имён добавляет методы:
 * * {@link imagetoString imagetoString()} конвертирует изображение в ресурсную текстовую строку;
 * * {@link imagefromString imagefromString()} получает изображение из текстовой ресурсной строки.
 * 
 * 
 * @version    0.1.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */


/** @alias SUI.UIImage */
var MODULE = "UIImage";

// Поддержка частичного расширения супермодуля и включения
// субмодуля без наличия супермодуля:
/** @ignore */
var SUI = (typeof SUI == 'undefined' ? {} : SUI);

SUI.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE, SUI) {
    // Регистрация модуля
    SUI[MODULE] = MODULE;
        
    // Модуль:
    MODULE["version"] = "0.1.1";
    MODULE["name"] = "UIImage Libruary";

    // --------------------------------------------------------------
    // Реализация...
    // TODO:
    // Файлы с классами и прочим можно разместить в подчинённой папке
    // ./ModuleName/src/... затем включить их и оформить фасад модуля.
	#include "src/UIImage/ScriptUIImage.jsx"
    #include "src/UIImage/imageconverts.jsx"
    
    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        "imagetoString":imagetoString,
        "imagefromString":imagefromString
    };
    // Расширяем модуль фасадом:
    for (var prop in FACADE) if (FACADE.hasOwnProperty(prop)) {
        GLOBAL[prop] = MODULE[prop] = FACADE[prop];
    };

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
})( $.global, { toString:function(){return MODULE;} }, SUI );