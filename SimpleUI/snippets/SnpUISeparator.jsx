/**************************************************************************
 *  SnpUISeparator.jsx
 *  DESCRIPTION: Демонстрация создания и использования ScriptUI Сепараторов.
 *  @@@BUILDINFO@@@ SnpUISeparator.jsx 1.3 Thu Aug 14 2014 00:41:23 GMT+0300
 * 
 * NOTICE: 
 * 
/**************************************************************************
 * © Вячеслав aka SlavaBuck, 22.12.2013.  buck#bk.ru
 */
#include "../../_util.jsx" 
#include "../UIControls.jsx"

// example Пример включения сепаратора в ресурсную стору
// 	 также строку sp:"+SUI.Separator+" \
// 	 можно заменить на sp:Panel { isSeparator:true, dragged:false, width:2, margins:0, spacing:0, line:Panel  { margins:0, spacing:0, visible:false } }
// 	 (указав свои значения для dragged: и width:2) и затем использовать вызов SUI.initSeparator(w.sp) без дополнительных параметров.
var w = new Window("dialog { \
        txt:StaticText { text:'Ниже рассположен сепаратор:' }, \
        sp:"+SUI.Separator+" \
        txt:StaticText { text:'Выше рассположен сепаратор.' }  \
    }");
SUI.initSeparator(w.sp);
// Альтернативные формы вызовы метода (указанные параметры совпадают с параметрами по умолчанию)
SUI.initSeparator(w.sp, false);
SUI.initSeparator(w.sp, false, 2);
SUI.initSeparator(w.sp, { dragged:false } );
SUI.initSeparator(w.sp, { dragged:false, width:2 } );
w.show();

// example Пример вызова addSeparator() как метода ScriptUI-объекта - контейнера 
// (также метод поддерживается объектами Group и Panel):
var w = new Window("dialog");
w.add("statictext { text:'Ниже рассположен сепаратор:' }");
// аналогично SUI.initSeparator() - также поддерживаются альтернативные формы вызова данного метода.
w.addSeparator(); 
// можно и так: SUI.initSeparator(w.add(SUI.Separator));
w.add("statictext { text:'Выше рассположен сепаратор:' }");
w.show();

// example Пример вызова библиотечного метода addSeparator():
var w = new Window("dialog");
w.add("statictext { text:'Ниже рассположен сепаратор:' }");
// будет создан перемещаемый сепаратор (также поддерживаются альтернативные формы вызова).
SUI.addSeparator(w, true);
w.add("statictext { text:'Выше рассположен сепаратор:' }");
w.show();

///////////////////////

