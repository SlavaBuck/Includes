/**
 * @@@BUILDINFO@@@ ESTKLib.jsx 0.1.1 2014 13:34:54 GMT+0200
 * 
 * @module      SUI.ESTKLib
 * @summary     Графические ресурсы ExtendScript Toolkit.
 * @desc        Содержит константы графических ресурсов ESTK в ICONS и методы для работы с ними
 *  - {@link getImage getImage(consts)} - возвращает ScriptUIImage на основе имени константы из ESTKLib.ICONS
 * Подтягивает модуль {@link SUI.UIImage SUI.UIImage}.
 * 
 * @requires   SUI.UIImage
 * 
 * @version    0.0.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// --------------------------------------------------------------
// Включение зависимостей:
#include "UIImage.jsx"

// Имя модуля:
/** @alias SUI.ESTKLib */
var MODULE = "ESTKLib";

$.global.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
        
    // Модуль:
    MODULE["version"] = "0.1.1";
    MODULE["name"] = "ESTK Resources libruary";

    // --------------------------------------------------------------
    // Реализация...
	#include "estkicons.jsxinc"

    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        // from estkicons.jsxinc
        "ICONS":ICONS,
        "getImage":getImage,
    };

    // Расширяем модуль фасадом:
    for (var prop in FACADE) if (FACADE.hasOwnProperty(prop)) {
        MODULE[prop] = FACADE[prop];
    };

    if (GLOBAL.hasOwnProperty("ICONS")) {
        for (var prop in GLOBAL.ICONS) if (GLOBAL.ICONS.hasOwnProperty(prop))
            GLOBAL["ICONS"][prop] = ICONS[prop];
    } else {
        GLOBAL["ICONS"] = ICONS;
    }
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