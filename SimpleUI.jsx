/**
 * @@@BUILDINFO@@@ SimpleUI.jsx 0.4.1 2014 13:34:54 GMT+0200
 * 
 * @module      SUI
 * @summary     Расширения для ScriptUI и пользовательского интерфейса.
 * @desc        Объдиняет группу библиотек, перечисленных в зависимостях:
 * 
 * @requires   SUI.ESTKLib
 * @requires   SUI.UIColors
 * @requires   SUI.UIСontrols
 * @requires   SUI.UIImage
 * 
 * @version    0.4.1
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// --------------------------------------------------------------

// TODO: Это единственное место, где нужно прописать 
// Имя модуля:
/** @alias  SUI */
SUI = (typeof SUI == 'undefined' ? {} : SUI);

if (!SUI.name) {
    SUI.name = "SimpleUI Library";
    SUI.version = "0.4.1";
}

#include "SimpleUI/ESTKLib.jsx"
#include "SimpleUI/UIColors.jsx"
#include "SimpleUI/UIControls.jsx"
#include "SimpleUI/UIImage.jsx"
