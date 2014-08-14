// --------------------------------------------------------------
// @@@BUILDINFO@@@
// WebLink
// --------------------------------------------------------------
if (typeof CC_FLAG == 'undefined') {
    CC_FLAG = (function isCC() {
        return ($.global.app && $.global.app.name.match(/Adobe InDesign/)) ? parseInt($.global.app.version) > 8 : false;
    }());
}; // if

/**
 * @class       WebLink
 * @summary     ScriptUI элемент - Гиперссылка. Представляет собой надстройку над ScriptUI элементом StaticText. В диалоге данный 
 *              элемент имеет по умолчанию синий цвет, умеет реагировать на наведение мышкой, а также открывть в браузере ссылку,
 *              представленную элементом
 *              
 * @property {boolean} isWebLink    Статическое свойство (только для чтения), включаемое в ресурсную строку элемента, и определяющее тип 
 *                                  ScriptUI объекта как элемент Вебссылка (Используется библиотечным методом initWindow() для правильной
 *                                  идентификации и автоматической инициализации компонента в составе объекта Window, а также в составе
 *                                  любых ScriptUI объектов контейнерного типа)
 * @property {string} weblink  Свойство, включаемое в ресурсную строку элемента, содержащее url-ссылку в корректном для браузера формате,
 *                             например: http://domain.com/
 * @property {string} text     Нативное свойство элемента StaticText, отображаемое в качестве ссылки. Инициализируется автоматически путём
 *                             отсечения компонент 'http://' и заключительной '/' или может быть назначена явно.
 * @property {ScripUIPen} weblinkColor  Цвет ссылки (по умолчанию - синий)
 * 
 * @example Пример включения гиперссылки в ресурсную стору
 * //   также строку url:"+SUI.WebLink+" \
 * //   можно заменить на url:StaticText { isWebLink:true, weblink:'"http://slavabuck.wordpress.com/' }
 * //   и затем использовать вызов SUI.initWebLink(w.url) без параметров.
 * var w = new Window("dialog { \
 *         txt:StaticText { text:'Ниже рассположена гиперссылка (WebLink):' }, \
 *         url:"+SUI.WebLink+" \
 *     }");
 * SUI.initWebLink(w.url, "http://slavabuck.wordpress.com/");
 * // Альтернативные формы вызовы метода (указанные параметры совпадают с параметрами по умолчанию)
 * SUI.initWebLink(w.url, "http://slavabuck.wordpress.com/", "slavabuck.wordpress.com");
 * SUI.initWebLink(w.url, { weblink:"http://slavabuck.wordpress.com/" });
 * SUI.initWebLink(w.url, { weblink:"http://slavabuck.wordpress.com/", text:"slavabuck.wordpress.com" });
 * w.show();
 * 
 * @example Пример вызова addWebLink() как метода ScriptUI-объекта - контейнера 
 * // (метод также поддерживается объектами Group и Panel):
 * var w = new Window("dialog");
 * w.add("statictext { text:'Ниже рассположена гиперссылка (WebLink):' }");
 * // аналогично SUI.initWebLink() - также поддерживаются альтернативные формы вызова данного метода.
 * w.addWebLink("http://slavabuck.wordpress.com/"); 
 * w.show();
 * 
 * @example Пример вызова метода глобального метода:
 * var w = new Window("dialog");
 * w.add("statictext { text:'Ниже рассположена гиперссылка (WebLink):' }");
 * SUI.addWebLink(w, "http://slavabuck.wordpress.com/");
 * w.show();
 */
var WebLink = {
    // Ресурсная строка элемента:
    rcString:"statictext { isWebLink:true, weblink:'', text:'' },",
    // Для использрвания в Window.add(WebLink):
    toString:function() { return "StaticText" + this.rcString.slice(11, -1); },
    // Некоторые константы по умолчанию
    defBackgroundColor:(CC_FLAG ? [.286, .286, .286, 1] : [.94, .94, .94, 1]), // default backgroundColor
    defWebLinkColor:(CC_FLAG ? [.678, .847, .902, 1] : [0, 0, .8, 1])  // default WebLinkColor (LightBlue / lBlue)
};

/**
 * Инициализирует (модифицирует элемент управления StaticText) элемент WebLink - гиперссылка. Элемент
 * начинает реагировать на движение мыши и при клике - открывает браузер с адресом,
 * указанным в аргументе weblink вебадресом. В качестве отображаемого значения используется свойство
 * <code>.text</code> самого элемента управления StaticText.
 *
 * @name initWebLink
 * @function
 * 
 * @param {object} target         ScriptUI-объект StaticText, представляющий элемент WebLink
 * @param {string} [weblink='']   url-ссылка для передачи браузеру в формате http://domain.com/ (корректном для браузера)
 * @param {string} [text=weblink] Отображаемый текст (если не указан - формируется автоматически на основе значения аргумента weblink).
 *
 * @return {ScriptUIObject}       возвращает собственный (проинициализированный) аргумент target;
 */
function initWebLink(target, weblink, text) {  // target - объект statictext, weblink строка с адресом ( "http://ya.ru/" ), text отображаемый текст
    if (typeof weblink == 'object') return initWebLink(target, weblink.weblink, weblink.text);
    var SOLID = target.graphics.PenType.SOLID_COLOR,
        parent_color = (target.parent.graphics.backgroundColor ? 
                            target.parent.graphics.backgroundColor.color : WebLink.defBackgroundColor),
        weblink_color = WebLink.defWebLinkColor, // Blue
        gfx = target.graphics;
    if (!target.hasOwnProperty("weblink")) target.weblink = "";
    if (typeof weblink != 'undefined') target.weblink = weblink;
    var weblink = target.helpTip = target.weblink;
    target.text = (target.text)||"";
    if (typeof text != 'undefined') target.text = text; else if (weblink) {
        target.text = weblink.indexOf("http:") == -1 ? weblink : weblink.slice(7);
        if (target.text[target.text.length-1] == "/") target.text = target.text.slice(0, -1);
    }
    // установка цветов:
    target.weblinkColor = gfx.newPen(SOLID, weblink_color, 1);
    gfx.foregroundColor = target.weblinkColor;
    target.parentPen = gfx.newPen(SOLID, parent_color, 1);
    target.currentPen = target.parentPen;
    target.preferredSize.height += 1;
    // Настрока обработчиков
    target.unwatch("weblinkColor");
    target.watch("weblinkColor", function(name, oldVal, newVal) {
        // TODO: сделать обработку для разных типов данных (int/RGB/RGBA...)
        if (newVal instanceof ScriptUIPen) target.graphics.foregroundColor = newVal;
        return newVal;
    });

    target.onDraw = function(d) {
        try {
        var gfx = this.graphics,
            sz = gfx.measureString(this.text, gfx.font);
        gfx.drawOSControl();
        gfx.newPath();
        gfx.moveTo (0,sz[1]); gfx.lineTo (sz[0],sz[1]);
        gfx.strokePath(this.currentPen);
        if (CC_FLAG) gfx.drawString(this.text, this.weblinkColor, 0, 0, gfx.font);
        } catch(e) { trace(e) }
    };

    target.addEventListener ('mousemove', function(e) {
        this.currentPen = this.weblinkColor;
        this.notify("onDraw");
    });

    target.addEventListener ('mouseout', function(e) {
        this.currentPen = this.parentPen;
        this.notify("onDraw");
    });

    target.addEventListener ('click', function(e) {
        // TODO: Выполнить открытие браузера:
        try {
            if (this.weblink) openURL(this.weblink);
        } catch(e) { 
            $.writeln(e.toSource()); 
        }
    });

    if (typeof openURL != 'function') {
        #include "../../../_globals/src/doBatFile.jsx"
    };

    return target;
};

/**
 * Добавляет и инициализирует элемент WebLink (Гиперссылку) в заданный контэйнер
 *
 * @name addWebLink
 * @function
 * 
 * @param {object} target          заданный контэйнер;
 * @param {string} [weblink='']    текстовое свойство - url-ссылка в корректном для браузера формате, например 'http://domain.com/' либо
 *                                 параметризированный объект с соответствующими полями { weblink:string [, text:string ] }.
 * @param {string} [text=weblink]  отображаемый текст вместо ссылки, если не указан - формируется автоматически на основе значения weblink -
 *                                 путём отбрасывания части 'http://' и заключительного слеша '/' (если имеются).
 *                                   
 * @return {ScriptUIObject}     возвращает созданный объект WebLink (StaticText)
 */
function addWebLink(target, weblink /* string || object { weblink:'ссылка включая http://', text:'отображаемое имя' } */, text /* string=''; */) {
    return initWebLink(target.add(WebLink.rcString), weblink, text);
};

/**
 * Расширение нативных ScriptUI объектов контэйнерного типа методом addWebLink(weblink, text):
 *      Window.addWebLink(weblink, text);
 *      Panel.addWebLink(weblink, text);
 *      Group.addWebLink(weblink, text);
 * Аналогично методу initWebLink() метод addWebLink() поддерживает сокращённую (без аргументов) и альтернативную 
 * формы вызова (аргументы weblink и text могут передаваться в составе параметризированного объекта)
 */
Window.prototype.addWebLink = Panel.prototype.addWebLink = Group.prototype.addWebLink = function(weblink, text) {
    return addWebLink(this, weblink, text);
};