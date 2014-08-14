/**************************************************************************
 *  SnpUIUnitBox.jsx
 *  DESCRIPTION: Демонстрация создания и использования UnitBox-поля
 *  @@@BUILDINFO@@@ SnpUIUnitBox.jsx 1.0 Thu Aug 14 2014 22:16:19 GMT+0300
 * 
 * NOTICE: 
 * 
/**************************************************************************
 * © Вячеслав aka SlavaBuck, 14.08.2014.  slava.boyko#hotmail.com
 */
#include "../../_util.jsx"
#include "../UIControls.jsx"


// example Пример включения UnitBox-поля в ресурсную строку
var w = new Window("dialog { \
        txt:StaticText { text:'Ниже рассположено поле UnitBox:' }, \
        box:"+SUI.UnitBox+" \
    }");
var box = w.box;
SUI.initUnitBox(box, { value: 25, stepdelta:20, minvalue:-80, maxvalue:120 });
w.show();


// example Пример вызова addUnitBox() как метода ScriptUI-объекта - контейнера 
// (метод также поддерживается объектами Group и Panel):
var w = new Window("dialog");
w.add("statictext { text:'Ниже рассположено поле UnitBox:' }");
// аналогично SUI.initWebLink() - также поддерживаются альтернативные формы вызова данного метода.
w.addUnitBox({ value:10, unittype:'pt' }); 
w.show();


// example Пример создания с помощью библиотечного метода:
var w = new Window("dialog");
w.add("statictext { text:'Ниже рассположено поле UnitBox:' }");
SUI.addUnitBox(w, { stepdelta:.25 });
w.show();

///////////////////////

