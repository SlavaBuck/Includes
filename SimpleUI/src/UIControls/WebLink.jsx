// --------------------------------------------------------------
// @@@BUILDINFO@@@
// WebLink
// --------------------------------------------------------------


/**
 * Преобразует элемент управления StaticText в элемент, подобный гипер-ссылке. Элемент
 * начинает реагировать на движение мыши и при клике - открывает браузер с адресом,
 * указанным в аргументе weblink. В качестве отображаемого значения используется свойство
 * <code>.text</code> самого элемента управления StaticText. Гиппер-ссылка - отдельное свойство.
 *
 * @param {object} target  ScriptUI-объект StaticText
 * @param {string} weblink url-ссылка для передачи браузеру.
 */
function addWebLink(target, weblink) {  // target - объкт statictext, weblink строка с адресом ( "http://ya.ru/" )
    var SOLID = target.graphics.PenType.SOLID_COLOR,
           parent_color = (target.parent.graphics.backgroundColor ? target.parent.graphics.backgroundColor.color : 
                        [0.94, 0.94, 0.94, 1]), // default for CS
           weblink_color = [0, 0, 0.8, 1],
           gfx = target.graphics;
           
    target.weblink = target.helpTip = (weblink)||"";
    target.normalPen = gfx.newPen(SOLID, weblink_color, 1);
    gfx.foregroundColor = target.normalPen;
    target.parentPen = gfx.newPen(SOLID, parent_color, 1);
    target.currentPen = target.parentPen;
    target.preferredSize.height += 1;
    target.onDraw = function(d) {
        var gfx = this.graphics;
        gfx.drawOSControl();
        gfx.newPath();
        var sz = gfx.measureString(this.text, gfx.font);
        gfx.moveTo (0,sz[1]);
        gfx.lineTo (sz[0],sz[1]);
        gfx.strokePath(this.currentPen);
        //this.graphics.drawString(this.text,this.normalPen,0,0,this.graphics.font);
    };
    http://slavabuck.wordpress.com/
    target.addEventListener ('mousemove', function(e) {
        this.currentPen = this.normalPen;
        this.notify("onDraw");
    });

    target.addEventListener ('mouseout', function(e) {
        this.currentPen = this.parentPen;
        this.notify("onDraw");
    });

    #include "../../../_globals/src/doBatFile.jsx"
    target.addEventListener ('click', function(e) {
        // TODO: Выполнить открытие браузера:
        try {
            if (this.weblink) openURL(this.weblink);
        } catch(e) { 
            $.writeln(e.toSource()); 
        }
    });
};