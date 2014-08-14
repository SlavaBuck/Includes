/**************************************************************************
 *  SnpUIWebLink.jsx
 *  DESCRIPTION: Демонстрация создания и использования ScriptUI гиперссылок.
 *  @@@BUILDINFO@@@ SnpUIWebLink.jsx 1.0 Thu Aug 14 2014 18:53:03 GMT+0300
 * 
 * NOTICE: 
 * 
/**************************************************************************
 * © Вячеслав aka SlavaBuck, 14.08.2014.  slava.boyko#hotmail.com
 */
#include "../../_util.jsx" 
#include "../UIControls.jsx"

// example Пример включения гиперссылки в ресурсную стору
// 	 также строку url:"+SUI.WebLink+" \
// 	 можно заменить на url:StaticText { isWebLink:true, weblink:'"http://slavabuck.wordpress.com/' }
// 	 и затем использовать вызов SUI.initWebLink(w.url) без параметров.
var w = new Window("dialog { \
        txt:StaticText { text:'Ниже рассположена гиперссылка (WebLink):' }, \
        url:"+SUI.WebLink+" \
    }");
SUI.initWebLink(w.url, "http://slavabuck.wordpress.com/");
// Альтернативные формы вызовы метода (указанные параметры совпадают с параметрами по умолчанию)
SUI.initWebLink(w.url, "http://slavabuck.wordpress.com/", "slavabuck.wordpress.com");
SUI.initWebLink(w.url, { weblink:"http://slavabuck.wordpress.com/" });
SUI.initWebLink(w.url, { weblink:"http://slavabuck.wordpress.com/", text:"slavabuck.wordpress.com" });
w.show();

// example Пример вызова addWebLink() как метода ScriptUI-объекта - контейнера 
// (метод также поддерживается объектами Group и Panel):
var w = new Window("dialog");
w.add("statictext { text:'Ниже рассположена гиперссылка (WebLink):' }");
// аналогично SUI.initWebLink() - также поддерживаются альтернативные формы вызова данного метода.
w.addWebLink("http://slavabuck.wordpress.com/"); 
w.show();

// example Пример вызова метода глобального метода:
var w = new Window("dialog");
w.add("statictext { text:'Ниже рассположена гиперссылка (WebLink):' }");
SUI.addWebLink(w, "http://slavabuck.wordpress.com/");
w.show();

///////////////////////

