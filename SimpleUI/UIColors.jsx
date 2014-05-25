/**
 * @@@BUILDINFO@@@ UIColors.jsx 0.1.1 2014 13:34:54 GMT+0200
 * 
 * @module      SUI.UIColors
 * @summary     Работа с цветом в формате RGB и RGBA
 * @desc  Содержит базовый набор цветовых констант COLORS (в uint формате) и набор
 *  функций для работы с ними:
 * * {@link toRGB toRGB()}
 * * {@link toRGBA toRGBA()}
 * * {@link RGBtoRGBA RGBtoRGBA()}
 * * {@link RGBAtoRGB RGBAtoRGB()}
 * * {@link RGBtoValue RGBtoValue()}
 * * {@link RGBAtoValue RGBAtoValue()}
 * * {@link parseColor parseColor()} Преобразование цвета в любом из доступных форматов в Шестнадцатиричном представление.
 * 
 * @version    0.1.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// Имя модуля:
/** @alias SUI.UIColors */
var MODULE = "UIColors";

// Поддержка частичного расширения супермодуля и включения
// субмодуля без наличия супермодуля:
/** @ignore */
var SUI = (typeof SUI == 'undefined' ? {} : SUI);

SUI.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE, SUI) {
    // Регистрация модуля
    SUI[MODULE] = MODULE;
        
    // Модуль:
    MODULE["version"] = "0.1.1";
    MODULE["name"] = "UIColors Libruary";

    // --------------------------------------------------------------
    // Реализация...
    #include "colors.jsxinc"
    // Безопасное расширение глобальных констант COLORS (на тот случай, 
    // если в скриптах уже был включён и модифицирован набор COLORS)
    // глобально: cRed = [1,0,0,1]; ... для всех COLORS
    if (!GLOBAL.hasOwnProperty("COLORS")) GLOBAL["COLORS"] = COLORS;
    for (var prop in COLORS)  if (COLORS.hasOwnProperty(prop)) {
        GLOBAL["c"+prop] = toRGBA(COLORS[prop]);
    }
    
    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        "toRGB":toRGB,
        "toRGBA":toRGBA,
        "RGBtoRGBA":RGBtoRGBA,
        "RGBAtoRGB":RGBAtoRGB,
        "RGBtoValue":RGBtoValue,        
        "RGBAtoValue":RGBAtoValue,
        "parseColor":parseColor,
    };

    // --------------------------------------------------------------
    // Экспорт фасада в глобал и модуль
    // --------------------------------------------------------------
    // extend(SUI, FACADE); extend(GLOBAL, FACADE);
    for (var prop in FACADE) if (FACADE.hasOwnProperty(prop)) {
        SUI[prop] = GLOBAL[prop] = FACADE[prop];
    };

    // TODO:
    // Класс UIColor ...

    return SUI;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} }, SUI );