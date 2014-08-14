/**
 * @@@BUILDINFO@@@ UIControls.jsx 0.1.1 2014 13:34:54 GMT+0200
 * 
 * @module      SUI.UIControls
 * @summary     Элементы управления
 * @desc        Содержит несколько вспомогательных функций общего назначения и
 *  коллекцию расширенных элементов управления
 * <p><b>Методы:</p></b>
 * * {@link isContainer isContainer()}
 * * {@link WindowInit WindowInit()}
 * <p><b>Элементы управления:</p></b>
 * * {@link Separator Separator} Динамический сепаратор; 
 * * {@link SeparatorInit SeparatorInit()} метод инициализации сепаратора;
 * * {@link ProgressBar ProgressBar()} Расширенный Прогрессбар;
 * * {@link addScrollablePanel addScrollablePanel()} функция, возвращающая скроллируемую панель;
 * * {@link addWebLink addWebLink()} функция, преобразующая <code>StaticText</code> в элемент 
 *                                   <code>WebLink</code>
 * 
 * @requires   
 * 
 * @version    0.1.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// Имя модуля:
/** @alias SUI.UIControls */
var MODULE = "UIControls";

// Поддержка частичного расширения супермодуля и включения
// субмодуля без наличия супермодуля:
/** @ignore */
var SUI = (typeof SUI == 'undefined' ? {} : SUI);

SUI.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE, SUI) {
    // Регистрация модуля
    SUI[MODULE] = MODULE;
        
    // Модуль:
    MODULE["version"] = "0.1.1";
    MODULE["name"] = "UIControls Libruary";

    // CC_FLAG Используется в WebLink и в UnitBox
    if (typeof CC_FLAG == 'undefined') {
        var CC_FLAG = (function isCC() {
            return ($.global.app && $.global.app.name.match(/Adobe InDesign/)) ? parseInt($.global.app.version) > 8 : false;
        }());
    };
    // --------------------------------------------------------------
    // Реализация...
    #include "src/UIControls/helpers.jsx"
	#include "src/UIControls/ProgressBar.jsx"
    #include "src/UIControls/ScrollablePanel.jsx"
    #include "src/UIControls/Separator.jsx"
    #include "src/UIControls/WebLink.jsx"
    #include "src/UIControls/UnitBox.jsx"

    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
        "ProgressBar":ProgressBar,
        "addScrollablePanel":addScrollablePanel,
        // WebLink.jsx
        "WebLink":WebLink,
        "addWebLink":addWebLink,
        "initWebLink":initWebLink,
        // Separator.jsx
        "Separator":Separator,
        "addSeparator":addSeparator,
        "initSeparator":initSeparator,
        // UnitBox.jsx
        "UnitBox":UnitBox,
        "addUnitBox":addUnitBox,
        "initUnitBox":initUnitBox,
        // helpers.jsx
        "isContainer":isContainer,
        "WindowInit":WindowInit,
    };
    // Расширяем модуль фасадом:
    // extend(SUI, FACADE);
    for (var prop in FACADE) if (FACADE.hasOwnProperty(prop)) {
        SUI[prop] = FACADE[prop];
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
    return SUI;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} }, SUI );