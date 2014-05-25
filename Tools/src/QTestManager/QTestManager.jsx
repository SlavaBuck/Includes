// --------------------------------------------------------------
// @@@BUILDINFO@@@ BaseQTestManager.jsx 1.00 Tue May 20 2014 01:32:37 GMT+0300
// GUI модуль для библиотеки QTest
// --------------------------------------------------------------
// © Вячеслав aka Buck, 2014. slava.boyko#hotmail.com

#include "../../../QTest.jsx"

// Использование:
// QTestManager.run();      // - открытие GUI
// QTestManager.run(file);  // - автоматическое выполнение и открытие GUI (file.jsx, file.config или file.log)

QTestManager = (function(QTest) {
    // --------------------------------------------------------------
    // Включение зависимостей
    #include "../../../SimpleUI/src/UIControls/WebLink.jsx"
    #include "../../../SimpleUI/src/UIControls/ScrollablePanel.jsx"
    // --------------------------------------------------------------

    // Class BaseQTestManager
    function BaseQTestManager() {
        if (!(this instanceof BaseQTestManager)) return new BaseQTestManager();
        var app = this;
        app.name = "QTestManager";
        app.version = "1.00";
        app.caption = app.name + " v"+ app.version + " (" + QTest.name+" v"+QTest.version+")";
        app.files = [];
        app.protocol = []; // Протокол испытаний
        app.run = function() { app.Init.apply(this, arguments); app.window.show(); };
        app.autoStart = false;
    };

    // Если указан file (при вызове QTestManager.run(file))- он сразу открывается и выполняется 
    // (в зависимости от типа файла в аргументе происходит пакетная обработка и автоматически 
    // сохраняется протокол в папку с открываемым файлом file)
    BaseQTestManager.prototype.Init = function(file) {
        // Настройка главного окна:
        var dx = 600, dy = 300, app = this;
        var w = app.window = new Window("palette { \
             text:'"+app.caption+"', margins:['5', '10', '5', '5'], spacing:5, \
            gCaption:Group {alignment:['fill', 'top'],  \
                txt:StaticText {text:'Протокол тестирования:', alignment:['left', 'bottom']},  \
                bOpen:Button {text:'Выбрать файл(ы)...', alignment:['right', 'center']}, \
                bRefresh:Button {text:'Обновить', alignment:['right', 'center'], enabled:false },  \
                bAbout:Button {text:'?', alignment:['right', 'center'], preferredSize:['23', 23]}}, \
            gBody:Panel {alignment:['fill', 'fill'], preferredSize:['"+dx+"', '"+dy+"'], alignChildren:['left','top'] },  \
            gStatus:Group {alignment:['fill', 'bottom'],  \
                stCprt:StaticText {text:'© Slava Boyko aka SlavaBuck | 2013-2014 | slava.boyko@hotmail.com', alignment:['left', 'top']},  \
                bSave:Button {text:'Сохранить...', alignment:['right', 'center'], enabled:false },  \
                bClose:Button {text:'Выход', alignment:['right', 'center']}}}");
        var gfx = w.graphics,
            SOLID = gfx.BrushType.SOLID_COLOR;
        w.gCaption.txt.graphics.font = ScriptUI.newFont("Segoe Ui-Bold:12.0");
        w.gBody.graphics.backgroundColor = gfx.newBrush(SOLID, [1, 1, 1, 1], 1);
        w.gStatus.stCprt.graphics.foregroundColor = gfx.newPen(SOLID, [0, 0, 0.50196078431373, 1], 1);
        
        // Настрока кнопок
        w.gStatus.bClose.onClick = function() { app.window.close(); };
        w.gStatus.bSave.onClick = function() { app.saveProtocol(); };
        w.gCaption.bRefresh.onClick = function() { app.doFiles(); };
        w.gCaption.bOpen.onClick = function() { app.OpenFiles(); };
        w.gCaption.bAbout.onClick = function() { app.about(); };
        
        // Если запустились с параметром, значит запускаем автоматизацию:
        if (file) {
            app.autoStart = true;
            app.autoFile = file;
            // В зависимости от типа файла в аргументе откроет либо .jsx файл, либо .config, после этого 
            // автоматом выполнит тесты и сохранит результат в тойже папке в файле с тем же именем 
            // и расширением .log (существующий файл перезапишеться):
            app.OpenFiles(file);
        };
    };

    BaseQTestManager.prototype.saveProtocol = function() {
        var app = this;
        var w = new Window("dialog {alignChildren:['left', 'top'], margins:[15, 10, 15, '5'], spacing:5, properties:{resizeable:true}, \
        stText0:StaticText {text:'Протокол тестирования:'},  \
        sp0:Panel { isSeparator:true },  \
        tPrtl:StaticText { preferredSize:['600', '300'], alignment:['fill', 'fill'], properties:{multiline:true, scrolling:true}},  \
        sp1:Panel { isSeparator:true },  \
            gGroup0:Group {alignment:['right', 'bottom'],  \
                stText3:StaticText {text:'Сохранить в папке с файлами как protocol.log'},  \
                btOk:Button {text:'Ok'},  \
                btSaveAs:Button {text:'Сохранить как...'}}}");
        w.text = app.caption + " - сохранение протокола...";
        w.onResizing = w.onResize = function() { this.layout.resize () };
        var gfx = w.stText0.graphics;
        gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, [0, 0, 0, 1], 1);
        var sp0 = w.sp0;
        if (w.orientation == 'column') { sp0.maximumSize[1] = 1; sp0.alignment = ['fill', 'top']; } else { sp0.maximumSize[0] = 1; sp0.alignment = ['left', 'fill']; };
        var sp1 = w.sp1;
        if (w.orientation == 'column') { sp1.maximumSize[1] = 1; sp1.alignment = ['fill', 'top']; } else { sp1.maximumSize[0] = 1; sp1.alignment = ['left', 'fill']; };
        w.tPrtl.text = app.protocol.join("\n");
        w.gGroup0.btOk.onClick = function() {
            if (app.savetoFile(new File(File.decode(app.files[0]).split("/").slice(0,-1).join("/") + "/protocol.log"), w.tPrtl.text)) w.close();
        };
        w.gGroup0.btSaveAs.onClick = function() {
            if (app.savetoFile(File.saveDialog ("Сохранить файл протокола как:"), w.tPrtl.text)) w.close();
        };
        w.show();
    };

    BaseQTestManager.prototype.savetoFile = function(file, text) {
        if (!file) return false;
        if (file.exists) 
            if (!confirm("Файл "+file.displayName+" уже существует и будет перезаписан. Продолжить?", 
                true, this.window.text)) return false;
        try {
            file.open("w");
            file.write(text);
            file.close();
        } catch(e) { trace(e, "Ошибка сохранения файла: "+file); return false }
        return true;
    };

    // Выполняются тесты для всех app.files и формируется буффер вывода для app.Refresh()
    BaseQTestManager.prototype.doFiles = function() {
        var app = this,
              gBody = app.window.gBody;
              
        if (gBody.children.length) {
            while(gBody.children.length) gBody.remove(0);
            gBody.layout.layout();
        };
        if (!(app.files && app.files.length)) {
            app.window.gCaption.bRefresh.enabled = false;
            //app.window.gStatus.bSave.enabled = false;
            return;
        };
       try {

        // Запоминаем старые настройки
        var config = merge(QTest.config),
              beforeTest = QTest.beforeTest,
              afterTest = QTest.afterTest;
              
        QTest.config.echo = false;
        QTest.config.autoflush = false;
        /*
        QTest.afterTest = function() {
            //log(QTest.results[QTest.results.length -1].toSource());
            var body = gBody.scPanel,
                  txt = body.add("statictext"),
                  gfx = txt.graphics,
                  text = QTest.buffer[QTest.buffer.length - 1];
            txt.text = text;
            if (text.match(/FAILE:/)) {
                gfx.font = ScriptUI.newFont("Segoe Ui-Bold:12.0");
                gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, [1, 0, 0, 1], 1);
            } else {
                gfx.font = ScriptUI.newFont("Segoe Ui:12.0");
                gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, [0, 0, 0, 1], 1);
            };
            body.layout.layout(1);
        };
        */
        app.protocol.length = 0;
        
        var dt = new Date(),
            dd = dt.getDate(),
            mm = dt.getMonth(),
            yy = dt.getFullYear(),
            f = function(n) { return (n < 10 ? "0" + n : n); };
            
        app.protocol.push(app.caption);
        app.protocol.push("Протокол тестирования от: " + ( [ f(dd), f(mm), yy].join(".") + " " + dt.toLocaleTimeString()));
        
        var tm = new _timer(),
            state_trace = trace.echo;
        trace.echo = false;
        tm.start();
        // Выполняем тесты со всеми выбранными файлами:
        each(app.files, function(f) { 
            var _tm = new _timer(),
                dt = (new Date()).toLocaleTimeString();
            QTest.buffer.push("------\n[начало: " + dt + "]: Файл: " + File.decode(f.absoluteURI)); 
            _tm.start(); 
            try {
                $.evalFile(f); 
            } catch(e) {
                 QTest.buffer.push("CRITICAL ERROR: \n" + trace(e));
             }
            _tm.stop();
            QTest.buffer.push("------\n    Время обработки: " + _tm);
        });
        tm.stop();
        QTest.buffer.push("    Всего обработано файлов: " + app.files.length + ", общее время: " + tm)
        trace.echo = state_trace;
        
        each(QTest.buffer, function(str) { 
            app.protocol = app.protocol.concat(str.split("\n"));
        });
        // ------------------------------------------------------------------
        // Если это был автоматизированный запуск (с параметорм) - 
        // предварительно сохраним результат и сбросим флаг
        // автоматизации:
        if (app.autoStart) {
            // срабатывает только один раз при старте
            app.autoStart = false;
            // определяем имя открытого файла и под тем же именем
            // с расширением .log сохраняем протокол:
            var file = (app.autoFile.split("/").slice(-1)[0])
            file = file.split(".").slice(0, -1).join(".") + ".log";
            var filename = (app.autoFile.charAt(0) == "/" ? app.autoFile.split("/").slice(0, -1).join("/") + "/" + file : 
                                                                                     File.decode(File($.fileName).parent) + "/" + file);
            file = new File(filename);
            if (file.exists) {
                mf = "пере";
                file.remove();
                file = new File(filename);
            }
            var msg = "";
            if (app.savetoFile(file, app.protocol.join("\n"))) {
                msg = "Автоматизированное тестирование успешно завершенно.\n" +
                        "Файл протокола:\n" + File.decode(file.absoluteURI);
                alert(msg, app.caption);
            } else {
                msg = "Возникла ошибка при выполнении автоматизированного тестирования\n" +
                        "Файл протокола сформирован не был."
                alert(msg, app.caption, true);
            }
        };
    
        app.Refresh();

        // ------------------------------------------------------------------
        QTest.results.length = QTest.buffer.length = 0;
        // Востанавливаем старые настройки
        extend(QTest.config, config);
        //QTest.beforeTest = beforeTest;
        //QTest.afterTest = afterTest; 
        app.window.gStatus.bSave.enabled = !!app.protocol.length;
        } catch(e) { trace(e) }
    };
    
    // Обновление тестов (тесты выполняются по новой для всего текущего 
    // списка из app.files)
    BaseQTestManager.prototype.Refresh = function() {
        var app = this,
              gBody = app.window.gBody;
              
        if (gBody.children.length) {
            while(gBody.children.length) gBody.remove(0);
            gBody.layout.layout();
        };
        if (!(app.protocol.length)) {
            app.window.gCaption.bRefresh.enabled = false;
            //app.window.gStatus.bSave.enabled = false;
            return;
        };
        
        if( !app.window.visible) app.window.show();
        
        // Базовые настройки
        var gfx = gBody.graphics,
               SOLID = gfx.PenType.SOLID_COLOR,
               sz = gBody.preferredSize,
               BOLD = ScriptUI.FontStyle.BOLD,
               REG = ScriptUI.FontStyle.REGULAR,
               baseFont = "Segoe Ui",
               baseSize = 12;
        // Стиль надписей
        var normalStyle = {
                   font:ScriptUI.newFont(baseFont, REG, baseSize),
                   fontColor:gfx.newPen(SOLID, [0,0,0,1], 1), // cBlack
                   backColor:gfx.newBrush(SOLID, [1,1,1,1]) // cWhite
               },
               passedStyle = {
                   font:ScriptUI.newFont(baseFont, REG, baseSize),
                   fontColor:gfx.newPen(SOLID, [0,.50,0,1], 1), // cGreen
                   backColor:gfx.newBrush(SOLID, [ .56,.93,.56,1]) // cLightGreen
               },
               faileStyle = {
                   font:ScriptUI.newFont(baseFont, REG, baseSize),
                   fontColor:gfx.newPen(SOLID, [1,0,0,1], 1), // cRed
                   backColor:gfx.newBrush(SOLID, [1,.71,.75,1]) // cLightPink
               },
               fatalStyle = {
                   font:ScriptUI.newFont(baseFont, BOLD, baseSize),
                   fontColor:gfx.newPen(SOLID, [1,0,0,1], 1), // cRed
                   backColor:gfx.newBrush(SOLID, [1,.71,.75,1]) // cLightPink
               },       
               startStyle = {
                   font:ScriptUI.newFont(baseFont, BOLD, baseSize),
                   fontColor:gfx.newPen(SOLID, [0,0,0,1], 1), // cBlack
                   backColor:gfx.newBrush(SOLID, [ .83, .83, .83, 1]) // cLightGray
               };
        // Расчётные величины для панели
        var t_higth = gfx.measureString ("T", normalStyle.font, 0)[1], // Высота текста
               // отступы между строками
               spacing = 2, 
               // расчёт виртуальной высоты вывода;
               v_higth = sz[1] + Math.max(10, app.protocol.length * (t_higth+spacing) - sz[1])+10;
        
        // Настройка панели
        gBody.orientation = 'stack';
        var body  = addScrollablePanel(gBody, 0, 0, sz[0], sz[1], false, v_higth);
        extend (body, { spacing:spacing,
                                margins:[10,10,5,5],
                                orientation:'column' } );

        // Заполняем панель:
        each(app.protocol, function(str) {
            var grp = body.add("group { alignChildren:'left', alignment:['fill', 'top'] }"),
                   txt = grp.add("statictext"),
                   t_gfx = txt.graphics,
                   g_gfx = grp.graphics,
                   style;
                   
            txt.text = str;
            txt.preferredSize[0] = sz[0] - 32;
            
            if (str.match(/START:/) || str.match(/FINISH:/)) {
                style = startStyle;
            } else if (str.match(/PASSED:/)) {
                style = passedStyle;
            } else if (str.match(/FAILE:/)) {
                style = faileStyle; 
            } else if (str.match(/FATAL/) || str.match(/ERROR:/)) {
                style = fatalStyle; 
            } else {
                style = normalStyle;
            }
            t_gfx.font = style.font;
            t_gfx.foregroundColor = style.fontColor;
            g_gfx.backgroundColor = style.backColor;
            
            //grp.addEventListener ("mouseover", onOver, false);
            //grp.addEventListener ("mouseout", onOut, false);
        });
        
        body.layout.layout(1);
        /*
        var oldStyle = 0;
        function onOver(e) {
            var txt = this.children[0],
                  font = txt.graphics.font;
            
            oldStyle = font.style;
            txt.graphics.font = ScriptUI.newFont(font.name, BOLD, font.size);
            this.layout.layout();
        };
        function onOut(e) {
            var txt = this.children[0],
                  font = txt.graphics.font;
            txt.graphics.font = ScriptUI.newFont(font.name, oldStyle, font.size);
            this.layout.layout();
        };
        */
    }; // BaseQTestManager.Refresh
    
    // Открытие файла (функция вызывается с параметром при автоматизированном запуске QTestManager.run(file))
    BaseQTestManager.prototype.OpenFiles = function(file) {
        var app = this,
            filters = [ "Все типы:*.*", "Файлы скрипта: *.jsx", "Файл протокола:*.log", "Пакетный файл: *.config"],
            file = (file)||"",
            files = [];
        if (typeof file == 'string') file = new File(file);
        if (!(file && file.exists)) {
            files = File.openDialog ("Открытие файлов", filters, true);
            if (!files) return;
        } else {
            files.push(file);
        }
        // Определяем тип файла
        var type = File.decode(files[0]).split(".").slice(-1);
        if (type == 'log') {
            app.files.length = 0;
            files[0].open("r");
            app.protocol.length = 0;
            app.protocol = (files[0].read()).split("\n");
            files[0].close();
            app.window.gCaption.bRefresh.enabled = app.window.gStatus.bSave.enabled = false;
            app.Refresh();
            return;
        } else if (type == 'config') {
            app.parseConfig(files[0]);
        } else if (type == 'jsx' || type == 'js') {
            app.files = files.slice();
        }
        app.window.gCaption.bRefresh.enabled = true;
        app.doFiles();

    }; // BaseQTestManager.OpenFiles

    // Разбор конфигурационного файла
    BaseQTestManager.prototype.parseConfig = function(file) {
        var app = this;
    try {
        app.files.length = 0;
        if (!file) return;
        try {
            file.open("r");
            var f = file.read();
            file.close();
            var obj = eval("("+f+")");
        } catch(e) {
            trace(e, "Ошибка парсинга конфигурационного файла.");
            return;
        }
        var base_dir = File.decode(file.parent),
            filter = (obj.includePattern)||"test*.jsx",
            files = [];
        // Если includePath - строка - образуем массив из одного эл.
        if (typeof obj.includePath == 'string') {
            var tstr = obj.includePath;
            obj.includePath = [];
            obj.includePath.push(tstr);
        }
        // Если includePath не указан или указан как пустой массив [] - считаем это относительным путём, 
        // соответствующим папке файла:
        if (!obj.includePath || (obj.includePath && obj.includePath.length == 0)) obj.includePath = ["./"];
        // обходим все пути и собираем все файлы в общий массив app.files:
        each(obj.includePath, function(folder) {
            var fd = folder.replace (/[\\|:\\]/g, "/"),
                dir = "";
            if (fd.charAt(0) == "/") { dir = fd; } else {
                for(var base_b = base_dir;;) {
                    if (fd.substring(0,2) == "./")
                        fd = fd.substring(2);
                    else if (fd.substring(0,3) == "../") {
                        fd = fd.substring(3);
                        base_b = base_b.substring(0, base_b.lastIndexOf("/"));
                    }  else break;
                }
                dir = base_b+"/"+fd
            }
            app.files = app.files.concat(Folder(dir).getFiles(obj.includePattern));
        });
    } catch(e) { trace(e) }
    };

    // Окно About()
    BaseQTestManager.prototype.about = function() {
        var app = this;
        var w = new Window("dialog {margins:[15, 8, 15, 10], spacing:6,  \
                gGroup0:Group {alignment:['fill', 'top'],  \
                    pImage:Group {alignment:['left', 'top'] },  \
                    stText0:StaticText {text:'QTestMeneger v1.00', alignment:['left', 'centre'] }},  \
            stText1:StaticText {text:'stText1', preferredSize:['400', '200'], properties:{multiline:true, scrolling:true}},  \
            sp1:Panel { isSeparator:true },  \
                gGroup3:Group {alignment:['fill', 'bottom'],  \
                    stText2:StaticText {text:'slavabuck.wordpress.com', alignment:['left', 'bottom']},  \
                    btButton1:Button {text:'Ok', alignment:['right', 'top'], preferredSize:['80', '20']}}}");

        //var img = w.gGroup0.pImage.add("image", undefined, "/Program Files (x86)/Adobe/Adobe InDesign CS6/Scripts/Scripts Panel/Include/SimpleUI/res/icons/ESToolkit.png");
        var img = w.gGroup0.pImage.add("image", undefined, ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x06\x00\x00\x00szz\u00F4\x00\x00\x00\x04sBIT\b\b\b\b|\bd\u0088\x00\x00\x00\tpHYs\x00\x00\x0B\x12\x00\x00\x0B\x12\x01\u00D2\u00DD~\u00FC\x00\x00\x00\x1CtEXtSoftware\x00Adobe Fireworks CS5q\u00B5\u00E36\x00\x00\x00\x16tEXtCreation Time\x0010/30/06|\u00B48\x1B\x00\x00\x03\u0093IDATX\u0085\u00C5\u0097\u00DDk\x14W\x18\u00C6\x7F\u00C7Lvg\u00AB\u0090\u00AC`4\u00BB\u0081\u00965\"H\x15\u0082\x1A#b01\u0096\u00E2\u0085D\u0088\u0096\u0080\u009A\u00A2\u0098\u00F8\x11\x05\u00FF\x11?\u0083\t\"\u00F4\u00A2\u00A5\x18\u008A\x05\u00EF\u008A\x12\x13jK\u008DJ{\u00D1Z%\u00EB\u00EAEvC\u00D7\u0092]\u0084d\u0097\u008Cf\u008E\x173\x13ggggg\u00C0\u00E0;\u009C9g\u00CE\u009Cy\u009F\u00E7\u00FD8\x1F#\u0080\x15@\r\x10\x02\x14\u00F3y9E\x07\u00DE\x01\x1A\u00B0\u00A8\u0098\u00E0\u00ABFGGs\x00B\b\u00EC\u00B5W\x1B@J\u00E9\u00D9v\u00D6V\u00BB\u00B7\u00B7w50\u00A7`X\x1E\u00B5\u00BF\x14B,\u00D5\u00F6\u008F\u00AD~\u00A78\u00FB\u00DC@]\u00C6F\x01\u00CD\u00F2\u00C0J'\u00A0\x1D\u00CCI\u00A4\u0092\u00F8\u00F5\u0086)+\u0081\x1A\u008B@\u00C8\x0E\u00EC\u00C7j\x00\u00ADP\u00E4\u00D7\u00E1\u009B\u00FC7\u0095dc\u00E7\x1E\u00B6\x1D>\x18\u0084P\b\u00A8Y\u00E1\x1C \u00A5\\*\u00CEg{Y(\x14\x18\u00BBx\u008D\u00EC\u00D4\x0B$\u00F0ll\u0082\u00D4\x1F\u008FJ\u00BE\u00F1j[\u00A2Tb\\\u00C9r!\x04Z\u00A1\u00C8\u00D8\u00A5!r\u00D3i$ %H$\u00B5\x11\u00B5b\u00D2\u00B9\u00B5K\b\u00F8\u0089\u00B7\x10\u0082\u0085\u00F9\x02\u00F7.\r\u0091\u009F\u00CE\x18\u00E3\u0090H \u00DA\x14\u00A7i\u00CB\u0097\u00BE\u0081]\txY\r0;\u009D\u00E6\u00EE\u00C5!\u00B4b\u00F1\u0083b \u00DA\x14c\u00DF\u0085\u00C1@3\u00A4\u008C@%\u0096\x16\u00A9\\:\u00C3/\x0Ep\u0080\u00E6\u009D\u00AD\u00EC8t\x10(\u008F\u00AF\x1F\x12%I\u00E8L@{\x7Fv\u00EA\x05\u00ED\u00C7\u008F\u00B2\u00BEm;:\x12\x1DI\u00A2m;\u00AD=\u00DD\u008C_\u00BE\u00CE\u00FD\u00CB\u00D7yk\u0092s\u00D3\u00E5\u00A6\u00BB\u00C4\x03^\t8~u\u0098\u00FF\u0093)B\u0091\u00CF\u00D8u\u00B2\u008F\u00F4T\u0092\u00C6\r\u00CD\u00EC\u00E8\u00E9f\u00E2\u00CA0\u00F9\u00F4\f\x12\u00F8\u00ED\u00C6w\u00EC9\x7F\u00DA\u00B7'\\=\u00E0fA6\u0099B\x02Z\u00B1\u00C0\u00EBd\u008AM\x1D\u00ED\u00B4\u00F5t3qe\u00C4\x047\u00AEl2\u00C5\u00E4\u00F7\u00B7\u00CA\u00BC\u00E75\x15=\u00D7\x01\u00AB\u00ACiN \u00A5\u00B1\u008B(\x11\u0095\u00F8\u0086f\u00C6\u00AF\u008E\u0090\u00CBd\u00CCp\x18SQ\u0097\u0092\u00D4\u00E4c\x1E\u00FEp\u00AB\u00E2\u00FA\u00E1\u00F4D\u00D5$\x04\u00D8u\u00A2\u008F\u00FB\u00D7Fx\u0093\u0099\u00E1\u00CF\u00DBw\x00\u00FB\u0086$mw\u00A3NM>!\u00B2:\u00CA\u00E6\u00AF\u00F7y\u00EAu\r\u0081\x1B\u00E3\u00DA\u0088J\u00E7\u00B9S\u00D4\u00C5c\u0086\u00B5\u00E6eY\u00AF\u009B\u00C0VrJ)y>\u00FE\u00C03\u00AC\u00BE\b\u00D8\u00FB\x155L\u00C7\u00B9\x01\u00EA\u00E3\u008D\x1F\u0080,\x12\u00D2*\u00D8B\x15\u00F65\x13\\\u0093\u00B0\x12)%\x1C\u00A6cp\u0080\u00BAX\f]R\x02hyF7\u0097\u00E4\u00DD'\u00FA\u0082'\u00A1\u009F\u00A2\u0084\u00C3t\x0E\u00F6S\u00E7\u00E6\t@Q#\u00EC=;@}\u00E3:_IXv\u00FC\u00F2ED\u0097\u00B4\x1F?f\u00F3\u0084\x11\x02EU\u00E9\x1A\u00EC\u00A7>\u00B6\u00CES\u009F]\\\x17\u00A2j\u00F2\u00D7\u00E8m\u00F2/_\u00D1\u00FA\u00ED\x11\x1E\u00FE|\u0087|f\u0086P$B\u00D7\u00D9\u00FE%\u00CB\u00FD\u00EA\r\x1C\u0082\u00CC?\u00FF\u0092\u00FE\u00FB)\u0085\u00F9\"\u008F\x7F\u00FC\u0089\u00CD_\u00EDEG\u00D2u\u00E6\u00A4\u00AB\u00DB+\u00E9\x0F\u00E4\x01\u00FBAT+\x16\u00D1\u00A4D Y\u00C8\u00CDR\u00AB\u00AA\u00EC\u00FC\u00E6P\u0099\u00E5n\u00E2\u00F6\u00BE*\x01\u00E7\u00BE\u00F0\u00F9\u00D6\x16f\u00D33<\x7F\u00F0;\r\u00EB\x13D\u00E3\u008D4$\u00BE\u00F0\x1D\u00C2\u00AA9\u00E0u\u00EC\u00B6\u00A4\u00E5\u00C0~Z\x0E\u00EC\u00F7\x05Pm\u008C\u00AF\x03IP\t\u00A2C\x01\x161\u00FER>\nx\x002\x1A\u00B0(0\u00CE\u00E7k\u0081\x04\u00D0\x00\u00AC\u00FA\u00E8,Je\x0Ex\r\u00BC\x04\u00B2\x02\u00A85A\u00A3&\u0099\u00D02\x13\u00D0\u0080y \x0F\u00CC\t>\u00F1\u00CF\u00A9X\u008E\u00B8\x07\u0091\u00E5\u00B6\u00B6\u00AA\u00BC\x07i\u00CF\u00B8\x02\u00D5\\s6\x00\x00\x00\x00IEND\u00AEB`\u0082"));
        //img.size = [26, 26]
        var stText0 = w.gGroup0.stText0;
        var gfx = stText0.graphics;
        gfx.font = ScriptUI.newFont("Segoe Ui-Bold:14.0");
        gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, [0.4, 0.4, 0.4, 1], 1);

        var sp1 = w.sp1;
        sp1.maximumSize[1] = 1; sp1.alignment = ['fill', 'top'];
        
        addWebLink(w.gGroup3.stText2, "http://slavabuck.wordpress.com/")
        
        w.text = app.caption;
        
        var f = new File(File($.fileName).parent + "/BaseQTestManager.md"), 
            msg = "";
        // Попвтка найти файл на два уровня выше (если заруск из scr или contrib)    
        if (!f.exists) {
            try {
                f = new File(File($.fileName).parent.parent.parent + "/QTestManager.md");
            } catch(e) { e.description = e.description }
            if (!f.exists) {
                msg = app.caption + "\n\nФайл справки отсутствует.\n\n" +
                    "------------------------\n" +
                    "Все права защищены:\n" +
                    "    CC Attribution Non-Commercial ShareAlike (CC BY-NC-SA).\n" +
                    "    http://creativecommons.org/licenses/by-nc-sa/3.0/\n\n" +
                    "Библиотеки:\n    " +
                    QTest.name + " v" +QTest.version + " (© SlavaBuck, 2013-2014)\n" +
                    "------------------------\n\n" +
                    "© Slava Boyko aka SlavaBuck | 2013-2014 | slava.boyko@hotmail.com" 
            }
        }
        if (f.exists) {
            f.open("r");
            msg = f.read();
            f.close();
        };
        w.stText1.text = msg;
        
        w.show()
    }
   
    return new BaseQTestManager();
}(QTest));

//QTestManager.run();