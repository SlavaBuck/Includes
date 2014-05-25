// --------------------------------------------------------------
// @@@BUILDINFO@@@ CreateObjectBrowser.jsx ver 1.13 Sat Oct 19 2013 21:03:53 GMT+0300
// Инспектор JavaScript объектов
// --------------------------------------------------------------
// © Вячеслав aka Buck, 2013-2014. slava.boyko#hotmail.com

/*
*       Просмоторщик свойств и методов иснпектируемого объекта, с возможностью просмотра исходного кода для методов и функций.
*       Для просмотра структуры объекта используется ReflectionInfo.
*
* Использовние
*      # include "<include path>/CreateObjectBrowser.jsx"
*       
*       var ObjectBrowser = CreateObjectBrowser();  // CreateObjectBrowser("palette"); // - для смены типа главного окна
*       ObjectBrowser.show($);      // в качестве аргумента принимается любой объект JavaScript
*                      Пример:
*                               ObjectBrowser.show(myObj);      // отображение методов и свойств объекта myObj
*                               ObjectBrowser.show($);                // отображение содержимого глобального вспомогательного объекта $ (helper object), который, в том числе, 
*                                                                                             содержит ссылку на глобальное пространство имён $.global - также доступное для просмотра.
*                               ObjectBrowser.show(alert)           // просмотр глобыльного метода alert. К сожелению просмотр исходного кода будет недоступен ("native code"),
*                                                                                             для этого нужен disassembler ;), но зато можно получить любую другую информацию по ней, доступную через
*                                                                                             интерфейс ReflectionInfo данного объекта.
*                               ObjectBrowser.show(new Window ("dialog") );  // Создание безымянного объекта ScriptUI Windows, и просмотр всех его свойств.
*
* Особенности использования:
*               а) для использования в цикле удобно создавать объект ObjectBrowser с модальным типом диалогового окна ( var ObjectBrowser = CreateObjectBrowser("dialog") -
*                   по умолчанию с этим окном и создаётся). Таким образом, каждый раз при вызове в теле цикла ObjectBrowser.show(...), - выполнение скрипта будет 
*                   приостанавливаться до закрытия окна (или нажатия кнопки Ok).
*               б) Немодальное окно ("palette") доступно всё время жизни Вашего активного приложения adobe. Запустив однажды ObjectBrowser  его можно использовать
*                   всё остальное время. 
*  Известные проблемы:
*          -  для ObjectBrowser с типом окна "palette": при открытии нового окна (при двойном клике по дереву) новое окно рассполагается под текущим, 
*             я пока не решил эту проблему, вместо этого я сделал открытие нового окна с небольшим смещением относительно текущего, таким образом 
*             пока работает переключение окон.
*          - иногда, при чтении свойств объекта происходят сбои, похоже на непредвиденные вызовы методов. Пока глубоко не вникал, и в качестве 
*             временного решения реализовал отлов таких ситуаций. При этом в правом окне будет помещена надпись в виде [Зафиксирован сбой чтения своства ....];
*          - недоделал метод btUpdate.onClick, который при обновлении левого окна должен востанавливать выделенное ранее свойство (так работает, но если выделен)
*             корневой узел (сам объект в корне дерева) - обновление не работает. Решение: - используя кнопку "Обновить" проследите, чтобы в левом окне было выбранно
*             что нибудь кроме самого верхнего пункта (допустимо чтобы вообще небыло ничего выделено)
*          - Есть проблемы с работой сепаратора, пока в процессе...
*                   - если сепаратор начал убегать от мышки, доведите мышку до границы окна или за окно, поймайте там сепаратор, и кликните по нему, 
*                      (сепаратор отработает mouseup), а затем спокойным движением переместите сепаратор в нужно положение;
*                   - для востановления правильной гиометрии правого от сепаратора окна - чуть измените размер основного окна. (отработают обработчики resize(), 
*                      которые всё вернут на место).
*/


CreateObjectBrowser = (function() {
    
    #include "../../../SimpleUI/src/UIControls/Separator.jsx"
    var SUI = {};
    SUI.Separator = Separator;
    SUI.SeparatorInit = SeparatorInit;
        
    // TODO: Переделать в MVC like...
    function BaseObjectBrowser(dstr) {
        if (! this instanceof BaseObjectBrowser) return new BaseObjectBrowser(dstr); // принудительный вызов конструтора с помощью new
        
        this.name = "ObjectBrowser";
        this.version = "1.13";

        this.type = (dstr) || "dialog";
        if ( (this.type != "palette") && (this.type != "dialog") ) {
            throw new Error ("Недопустимый тип окна " + this.type +". Ожидается 'palette' или 'dialog'.");
        }
        // Если окно имеет тип palette, а скрипт запущен с ESTK под целевое приложение в обычной main сессии - окно сразу же закрется, 
        // выведем об этом предуприждение в консоль (я сам часто забываю правильно настроить окружение...)
        if (this.type == "palette") {
    //~         if ( (app.name != 'ExtendScript Toolkit') && ($.engineName == 'main') ){
    //~             $.writeln ("Если окно мгновенно пропало, значит Вы забыли указать директиву #targetengine - укажите её в начале Вашего скрипта. Пример: #targetengine 'session';");
    //~         }
        }
        // Рисуем главное окно:
        var w = new Window (this.type + " { margins:4, spacing:2, properties:{resizeable: true } }");
        w.text = this.name + " v" +this.version;
        w.onResizing = w.onResize = function() { this.layout.resize () };
        
        var pCaption = w.add("panel { margins:5, spacing:0,alignment:['fill','top'], orientation:'row'}");
        var pMain = w.add("panel { margins:[0,0,0,0], spacing:2, alignment:['fill','fill'], orientation:'row' }");
        // установим белый фон для pMain, чтобы уменьшить мерцания myTree и myEdit при обновлениях (особенно в циклах)
        pMain.graphics.backgroundColor = w.graphics.newBrush(w.graphics.BrushType.SOLID_COLOR,[1,1,1], 1); 
        var ln1 = w.add(SUI.Separator);
        var pStatusBar = w.add("group { margins:[4,0,4,0], spacing:4, alignment:['fill','bottom'],  orientation:'row' }");
        // Сюда будем выводить собственное значение объекта 
        var myCaption = pCaption.add("statictext { text:'[Object]:', alignment:['fill','center'], helpTip:'Значение toString()' }");
        // Главное окно
        var myTree = pMain.add ("treeview { alignment:['left', 'fill'], preferredSize:[250,300] }");  // Object Info TreeView
        var sp = pMain.add(SUI.Separator); // Сепаратор
        var myEdit = pMain.add("edittext { alignment:['fill', 'fill'], preferredSize:[400,300], properties:{multiline: true} }"); // Properties Reflection Info EditText
        // Статус Бар
        var t_status = pStatusBar.add("statictext { text:'© Slava Boyko aka SlavaBuck | 2013-2014 | slava.boyko@hotmail.com', alignment:['fill','centre']}");
        t_status.graphics.foregroundColor = t_status.graphics.newPen (t_status.graphics.PenType.SOLID_COLOR,  [0, 0, 0.50196078431373, 1], 1); // Navy
        var ln2 = pStatusBar.add(SUI.Separator);
        var btGrp = pStatusBar.add("group { margins:[4,0,4,0], spacing:10, alignment:['right',''] \
                                                                btUpdate:Button {text:'Обновить' } \
                                                                btClouse:Button {text:'Закрыть', name:'Ok' } }");
        btGrp.btClouse.helpTip = "Закрыть окно"; 
        btGrp.btUpdate.helpTip = "Обновить данные свойств объекта";
        btGrp.btClouse.onClick = function () { return w.hide() } 
        btGrp.btUpdate.onClick =  function () { _buildTree() }      // принудительное обновление окна myTree c данными
        myTree.onChange = function () { _buildEdit () }             // обновляем myEdit при клике в myTree
        myTree.onDoubleClick = function () { _newObjectBrowser() }  // новое окно при двойном клике в myTree
        // Настройка основного окна
        SUI.SeparatorInit(ln1, "line"); // Эти сепараторы ведут себя как обычные разделительные линии
        SUI.SeparatorInit(ln2, "line");
        SUI.SeparatorInit(sp); // а этот можно перемещать.

        // Приватные методы и свойства
        // Ссылка на исследуемый объект, устанавливается либо в методе show(), используется в  _buildTree (),  _buildEdit(),  _buildCaption() и в _newObjectBrowser()
        var hrefObj = null; 
        var counts = 0;     // Счётчик запусков this.show() - для модальных окон нужно будет каждый раз пересоздавать диалог
        // Иконки для дерева свойств:
        var icons = {};
        icons._class = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\b\x06\x00\x00\x00\x1F\u00F3\u00FFa\x00\x00\x00\x04gAMA\x00\x00\u00D6\u00D8\u00D4OX2\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\u0095IDATx\u00DAlRmHSQ\x18>\u00F7n:\u00B0eK\u00B3_\u008E\u00E6\u00CFU43\u00A2\u0089\u00A6\"\x18De\t\x11&\u00A6Q\x11ZD\u0099}\u00A0c\u00B62!#\u00CC(\x1A\u008C\u00FA\x11\u0092\u00FB\x11B i%R\u00CB\x12\x13\u00CD\u00A2\x1F\n%c\u00A8\u0091\u00A8i\u00CDyw\u00EF=\x1F\u009Ds=Wn\u00D2\u0081\u0087s\u00DE\u00AF\u00E7}\u00CE9\u00AF\x00\u00FE\u00B3<\u00FDS\x19b\u0082\u00E5.A\u00C4\u0085\x01\u00F8\x12\u009B\u009F\u00AD\u00BD\u00B7\u00D7\x19\u00A6!\u00C2\u00B1\u00B2D\u00A3q}h\u00D6\u00E6\x1D\u009Ci\x15E\u00CB\x1B\u00E9w\u00F4\u00C1Mw\u009A3:3\u00ED\u00B7XSz/\u00BD\u009Dj\u00AD\b\u00BCJ]]#\u00E8\x07\u00DF\u00F0\u009C\x0FaP)/IM\u00B7\u00F3\u00D3\u009F\u00F2D\u0091\u00E7\u0090\u00EA\u00CE\u00D12\u00B35\u00B9\x0EB\u00B5\u00CD_\u00E4\u00F0Q\x1Ff~-\u00E1\u00DA\u00D0\\\x18\u00A9(c4\u00F4\u00D2M\u008B\u0083\u00D4g\u00A60qn\u0096\b\u00FC\x07\u009C\u00C1\u0091g\u008Fs\u0091\u008C\x1C\u00A7\u00BB\"\u00E3<G\\\u00EE\u0080\u0088\u00A0\x12P`we\u00D7\u00E4\u009C\u00B8\u009C\u00C6\u00BB\"\nUGn\u00CD\x1D\u00EB\u00A6\u00C2\u00C3g%l\u00CA\u0093 bq\x0B#\u00D1\b\x14\u008C\"\u00B7\u00B27n\u0097\x17\x17\x17w\u0095_\bU\u00BD\x18\u00AB\u00E6\x04\u0090\x15\u0097?\u00FF~\u00C6\u0091W\u00D2\x1F\u0097\u0095\u0085\u00B6bG\u0096\x14\u0093&\u00A8?\u0091\u00A9d2\x04\u00841c\x14\x1F\u0096l\x0Bd\u0095V\x073\u00CB\u00CE\u009D:\u00D9\x15\x19\u0093e\u00B5\u008D\u00F6:\x16\u00A7\u00FB\u00E4\u00C7\u00D7\u00EE\u0081\u0096\u00F3K\u00AC0./\u00E7\u00EB\x0Fj\u00AE\u00ED\u00FB\u00F1\u008E\u00EE)\x1C\u00EB)\u0092\u008B\u009A\u0082[J;\u00C6I\u00FE\u008D\u00F6\u00CD\u00D4\u00B6R\u00ACe~\x16/\n\f\u00BF\u00E7\u00B9I\x1A\x03F\u00DA\u00DF\x1A\u00EF\u008Cz<G'T\bA\u00A8\u00A1l\u009A\u00DA\t\u00C6wQT\u008C\u00F9\u0099\u00985\x02\u00CD\x06\u00BA\x13\u00E9\u00C3\u00A2(\u00C8\u00F8\u00D5z\x03!.#`\u00FCF\u00B0L\u00A8-\u00C2\x03\u009A\nY]\u00F1#\x03\x01V\x14H\u00FE\u0099D\u0082\u00B1\u00AD\u00B2c\u00B4>\u00E7b\u008B\u00CDH\x04!\u00D2\u008B\x19\x13\u00DE\u00D1\u00FCa\u009D\u00AB)\u00E4%*\u00B4qe\u0082F\u00E0\u00DF\u00E3p#B\u0080}w\u00F1\u00C0\u00A1'\u009F\u008E\u00F3!\x12\x10\\Q\x00\\\u008D\u00BD\x15P\u00C5#P\u0091\u00C5\u00CF\u00DE\u0082\x1C\u00E3(\u009B\u00F8T%fV\u00D6\u00D9\u00EC\u0085G\u00AE\"\u0092\u00B0\x7F\u00E1\u00E7d\u0095\u00B8fC\u00F7|d\u00EC\u00A0%\u00D5q_\u008DK\u009D\x7F\u00BE\r6F\u00DA=1\u00AE\u009C\u00A9T\x04Nb6@\u00D8y\u00E5\u0091=)}k\u00B3\n\u00CC\u00FB\u00E4X\u00B4\u00FB\u00D7\u00D7\u00BE\u00FAp{C\u0098_E\u00E0\u00C5l\u00C8\u00A0N\u00A0+\u00D1!\x1A\bM\u0086\u00A9\u0084\u00AB~\x0B\u00FD\x15`\x00f25i\u00C9]ky\x00\x00\x00\x00IEND\u00AEB`\u0082");
        icons._prop_rw = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\b\x06\x00\x00\x00\x1F\u00F3\u00FFa\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\nOiCCPPhotoshop ICC profile\x00\x00x\u00DA\u009DSgTS\u00E9\x16=\u00F7\u00DE\u00F4BK\u0088\u0080\u0094KoR\x15\b RB\u008B\u0080\x14\u0091&*!\t\x10J\u0088!\u00A1\u00D9\x15Q\u00C1\x11EE\x04\x1B\u00C8\u00A0\u0088\x03\u008E\u008E\u0080\u008C\x15Q,\f\u008A\n\u00D8\x07\u00E4!\u00A2\u008E\u0083\u00A3\u0088\u008A\u00CA\u00FB\u00E1{\u00A3k\u00D6\u00BC\u00F7\u00E6\u00CD\u00FE\u00B5\u00D7>\u00E7\u00AC\u00F3\u009D\u00B3\u00CF\x07\u00C0\b\f\u0096H3Q5\u0080\f\u00A9B\x1E\x11\u00E0\u0083\u00C7\u00C4\u00C6\u00E1\u00E4.@\u0081\n$p\x00\x10\b\u00B3d!s\u00FD#\x01\x00\u00F8~<<+\"\u00C0\x07\u00BE\x00\x01x\u00D3\x0B\b\x00\u00C0M\u009B\u00C00\x1C\u0087\u00FF\x0F\u00EAB\u0099\\\x01\u0080\u0084\x01\u00C0t\u00918K\b\u0080\x14\x00@z\u008EB\u00A6\x00@F\x01\u0080\u009D\u0098&S\x00\u00A0\x04\x00`\u00CBcb\u00E3\x00P-\x00`'\x7F\u00E6\u00D3\x00\u0080\u009D\u00F8\u0099{\x01\x00[\u0094!\x15\x01\u00A0\u0091\x00 \x13e\u0088D\x00h;\x00\u00AC\u00CFV\u008AE\x00X0\x00\x14fK\u00C49\x00\u00D8-\x000IWfH\x00\u00B0\u00B7\x00\u00C0\u00CE\x10\x0B\u00B2\x00\b\f\x000Q\u0088\u0085)\x00\x04{\x00`\u00C8##x\x00\u0084\u0099\x00\x14F\u00F2W<\u00F1+\u00AE\x10\u00E7*\x00\x00x\u0099\u00B2<\u00B9$9E\u0081[\b-q\x07WW.\x1E(\u00CEI\x17+\x146a\x02a\u009A@.\u00C2y\u0099\x192\u00814\x0F\u00E0\u00F3\u00CC\x00\x00\u00A0\u0091\x15\x11\u00E0\u0083\u00F3\u00FDx\u00CE\x0E\u00AE\u00CE\u00CE6\u008E\u00B6\x0E_-\u00EA\u00BF\x06\u00FF\"bb\u00E3\u00FE\u00E5\u00CF\u00ABp@\x00\x00\u00E1t~\u00D1\u00FE,/\u00B3\x1A\u0080;\x06\u0080m\u00FE\u00A2%\u00EE\x04h^\x0B\u00A0u\u00F7\u008Bf\u00B2\x0F@\u00B5\x00\u00A0\u00E9\u00DAW\u00F3p\u00F8~<<E\u00A1\u0090\u00B9\u00D9\u00D9\u00E5\u00E4\u00E4\u00D8J\u00C4B[a\u00CAW}\u00FEg\u00C2_\u00C0W\u00FDl\u00F9~<\u00FC\u00F7\u00F5\u00E0\u00BE\u00E2$\u00812]\u0081G\x04\u00F8\u00E0\u00C2\u00CC\u00F4L\u00A5\x1C\u00CF\u0092\t\u0084b\u00DC\u00E6\u008FG\u00FC\u00B7\x0B\u00FF\u00FC\x1D\u00D3\"\u00C4Ib\u00B9X*\x14\u00E3Q\x12q\u008ED\u009A\u008C\u00F32\u00A5\"\u0089B\u0092)\u00C5%\u00D2\u00FFd\u00E2\u00DF,\u00FB\x03>\u00DF5\x00\u00B0j>\x01{\u0091-\u00A8]c\x03\u00F6K'\x10Xt\u00C0\u00E2\u00F7\x00\x00\u00F2\u00BBo\u00C1\u00D4(\b\x03\u0080h\u0083\u00E1\u00CFw\u00FF\u00EF?\u00FDG\u00A0%\x00\u0080fI\u0092q\x00\x00^D$.T\u00CA\u00B3?\u00C7\b\x00\x00D\u00A0\u0081*\u00B0A\x1B\u00F4\u00C1\x18,\u00C0\x06\x1C\u00C1\x05\u00DC\u00C1\x0B\u00FC`6\u0084B$\u00C4\u00C2B\x10B\nd\u0080\x1Cr`)\u00AC\u0082B(\u0086\u00CD\u00B0\x1D*`/\u00D4@\x1D4\u00C0Qh\u0086\u0093p\x0E.\u00C2U\u00B8\x0E=p\x0F\u00FAa\b\u009E\u00C1(\u00BC\u0081\t\x04A\u00C8\b\x13a!\u00DA\u0088\x01b\u008AX#\u008E\b\x17\u0099\u0085\u00F8!\u00C1H\x04\x12\u008B$ \u00C9\u0088\x14Q\"K\u00915H1R\u008AT UH\x1D\u00F2=r\x029\u0087\\F\u00BA\u0091;\u00C8\x002\u0082\u00FC\u0086\u00BCG1\u0094\u0081\u00B2Q=\u00D4\f\u00B5C\u00B9\u00A87\x1A\u0084F\u00A2\x0B\u00D0dt1\u009A\u008F\x16\u00A0\u009B\u00D0r\u00B4\x1A=\u008C6\u00A1\u00E7\u00D0\u00ABh\x0F\u00DA\u008F>C\u00C70\u00C0\u00E8\x18\x073\u00C4l0.\u00C6\u00C3B\u00B18,\t\u0093c\u00CB\u00B1\"\u00AC\f\u00AB\u00C6\x1A\u00B0V\u00AC\x03\u00BB\u0089\u00F5c\u00CF\u00B1w\x04\x12\u0081E\u00C0\t6\x04wB a\x1EAHXLXN\u00D8H\u00A8 \x1C$4\x11\u00DA\t7\t\x03\u0084Q\u00C2'\"\u0093\u00A8K\u00B4&\u00BA\x11\u00F9\u00C4\x18b21\u0087XH,#\u00D6\x12\u008F\x13/\x10{\u0088C\u00C47$\x12\u0089C2'\u00B9\u0090\x02I\u00B1\u00A4T\u00D2\x12\u00D2F\u00D2nR#\u00E9,\u00A9\u009B4H\x1A#\u0093\u00C9\u00DAdk\u00B2\x079\u0094, +\u00C8\u0085\u00E4\u009D\u00E4\u00C3\u00E43\u00E4\x1B\u00E4!\u00F2[\n\u009Db@q\u00A4\u00F8S\u00E2(R\u00CAjJ\x19\u00E5\x10\u00E54\u00E5\x06e\u00982AU\u00A3\u009AR\u00DD\u00A8\u00A1T\x115\u008FZB\u00AD\u00A1\u00B6R\u00AFQ\u0087\u00A8\x134u\u009A9\u00CD\u0083\x16IK\u00A5\u00AD\u00A2\u0095\u00D3\x1Ah\x17h\u00F7i\u00AF\u00E8t\u00BA\x11\u00DD\u0095\x1EN\u0097\u00D0W\u00D2\u00CB\u00E9G\u00E8\u0097\u00E8\x03\u00F4w\f\r\u0086\x15\u0083\u00C7\u0088g(\x19\u009B\x18\x07\x18g\x19w\x18\u00AF\u0098L\u00A6\x19\u00D3\u008B\x19\u00C7T071\u00EB\u0098\u00E7\u0099\x0F\u0099oUX*\u00B6*|\x15\u0091\u00CA\n\u0095J\u0095&\u0095\x1B*/T\u00A9\u00AA\u00A6\u00AA\u00DE\u00AA\x0BU\u00F3U\u00CBT\u008F\u00A9^S}\u00AEFU3S\u00E3\u00A9\t\u00D4\u0096\u00ABU\u00AA\u009DP\u00EBS\x1BSg\u00A9;\u00A8\u0087\u00AAg\u00A8oT?\u00A4~Y\u00FD\u0089\x06Y\u00C3L\u00C3OC\u00A4Q\u00A0\u00B1_\u00E3\u00BC\u00C6 \x0Bc\x19\u00B3x,!k\r\u00AB\u0086u\u00815\u00C4&\u00B1\u00CD\u00D9|v*\u00BB\u0098\u00FD\x1D\u00BB\u008B=\u00AA\u00A9\u00A19C3J3W\u00B3R\u00F3\u0094f?\x07\u00E3\u0098q\u00F8\u009CtN\t\u00E7(\u00A7\u0097\u00F3~\u008A\u00DE\x14\u00EF)\u00E2)\x1B\u00A64L\u00B91e\\k\u00AA\u0096\u0097\u0096X\u00ABH\u00ABQ\u00ABG\u00EB\u00BD6\u00AE\u00ED\u00A7\u009D\u00A6\u00BDE\u00BBY\u00FB\u0081\x0EA\u00C7J'\\'Gg\u008F\u00CE\x05\u009D\u00E7S\u00D9S\u00DD\u00A7\n\u00A7\x16M=:\u00F5\u00AE.\u00AAk\u00A5\x1B\u00A1\u00BBDw\u00BFn\u00A7\u00EE\u0098\u009E\u00BE^\u0080\u009ELo\u00A7\u00DEy\u00BD\u00E7\u00FA\x1C}/\u00FDT\u00FDm\u00FA\u00A7\u00F5G\fX\x06\u00B3\f$\x06\u00DB\f\u00CE\x18<\u00C55qo<\x1D/\u00C7\u00DB\u00F1QC]\u00C3@C\u00A5a\u0095a\u0097\u00E1\u0084\u0091\u00B9\u00D1<\u00A3\u00D5F\u008DF\x0F\u008Ci\u00C6\\\u00E3$\u00E3m\u00C6m\u00C6\u00A3&\x06&!&KM\u00EAM\u00EE\u009ARM\u00B9\u00A6)\u00A6;L;L\u00C7\u00CD\u00CC\u00CD\u00A2\u00CD\u00D6\u00995\u009B=1\u00D72\u00E7\u009B\u00E7\u009B\u00D7\u009B\u00DF\u00B7`ZxZ,\u00B6\u00A8\u00B6\u00B8eI\u00B2\u00E4Z\u00A6Y\u00EE\u00B6\u00BCn\u0085Z9Y\u00A5XUZ]\u00B3F\u00AD\u009D\u00AD%\u00D6\u00BB\u00AD\u00BB\u00A7\x11\u00A7\u00B9N\u0093N\u00AB\u009E\u00D6g\u00C3\u00B0\u00F1\u00B6\u00C9\u00B6\u00A9\u00B7\x19\u00B0\u00E5\u00D8\x06\u00DB\u00AE\u00B6m\u00B6}agb\x17g\u00B7\u00C5\u00AE\u00C3\u00EE\u0093\u00BD\u0093}\u00BA}\u008D\u00FD=\x07\r\u0087\u00D9\x0E\u00AB\x1DZ\x1D~s\u00B4r\x14:V:\u00DE\u009A\u00CE\u009C\u00EE?}\u00C5\u00F4\u0096\u00E9/gX\u00CF\x10\u00CF\u00D83\u00E3\u00B6\x13\u00CB)\u00C4i\u009DS\u009B\u00D3Gg\x17g\u00B9s\u0083\u00F3\u0088\u008B\u0089K\u0082\u00CB.\u0097>.\u009B\x1B\u00C6\u00DD\u00C8\u00BD\u00E4Jt\u00F5q]\u00E1z\u00D2\u00F5\u009D\u009B\u00B3\u009B\u00C2\u00ED\u00A8\u00DB\u00AF\u00EE6\u00EEi\u00EE\u0087\u00DC\u009F\u00CC4\u009F)\u009EY3s\u00D0\u00C3\u00C8C\u00E0Q\u00E5\u00D1?\x0B\u009F\u00950k\u00DF\u00AC~OCO\u0081g\u00B5\u00E7#/c/\u0091W\u00AD\u00D7\u00B0\u00B7\u00A5w\u00AA\u00F7a\u00EF\x17>\u00F6>r\u009F\u00E3>\u00E3<7\u00DE2\u00DEY_\u00CC7\u00C0\u00B7\u00C8\u00B7\u00CBO\u00C3o\u009E_\u0085\u00DFC\x7F#\u00FFd\u00FFz\u00FF\u00D1\x00\u00A7\u0080%\x01g\x03\u0089\u0081A\u0081[\x02\u00FB\u00F8z|!\u00BF\u008E?:\u00DBe\u00F6\u00B2\u00D9\u00EDA\u008C\u00A0\u00B9A\x15A\u008F\u0082\u00AD\u0082\u00E5\u00C1\u00AD!h\u00C8\u00EC\u0090\u00AD!\u00F7\u00E7\u0098\u00CE\u0091\u00CEi\x0E\u0085P~\u00E8\u00D6\u00D0\x07a\u00E6a\u008B\u00C3~\f'\u0085\u0087\u0085W\u0086?\u008Ep\u0088X\x1A\u00D11\u00975w\u00D1\u00DCCs\u00DFD\u00FAD\u0096D\u00DE\u009Bg1O9\u00AF-J5*>\u00AA.j<\u00DA7\u00BA4\u00BA?\u00C6.fY\u00CC\u00D5X\u009DXIlK\x1C9.*\u00AE6nl\u00BE\u00DF\u00FC\u00ED\u00F3\u0087\u00E2\u009D\u00E2\x0B\u00E3{\x17\u0098/\u00C8]py\u00A1\u00CE\u00C2\u00F4\u0085\u00A7\x16\u00A9.\x12,:\u0096@L\u0088N8\u0094\u00F0A\x10*\u00A8\x16\u008C%\u00F2\x13w%\u008E\ny\u00C2\x1D\u00C2g\"/\u00D16\u00D1\u0088\u00D8C\\*\x1EN\u00F2H*Mz\u0092\u00EC\u0091\u00BC5y$\u00C53\u00A5,\u00E5\u00B9\u0084'\u00A9\u0090\u00BCL\rL\u00DD\u009B:\u009E\x16\u009Av m2=:\u00BD1\u0083\u0092\u0091\u0090qB\u00AA!M\u0093\u00B6g\u00EAg\u00E6fv\u00CB\u00ACe\u0085\u00B2\u00FE\u00C5n\u008B\u00B7/\x1E\u0095\x07\u00C9k\u00B3\u0090\u00AC\x05Y-\n\u00B6B\u00A6\u00E8TZ(\u00D7*\x07\u00B2geWf\u00BF\u00CD\u0089\u00CA9\u0096\u00AB\u009E+\u00CD\u00ED\u00CC\u00B3\u00CA\u00DB\u00907\u009C\u00EF\u009F\u00FF\u00ED\x12\u00C2\x12\u00E1\u0092\u00B6\u00A5\u0086KW-\x1DX\u00E6\u00BD\u00ACj9\u00B2<qy\u00DB\n\u00E3\x15\x05+\u0086V\x06\u00AC<\u00B8\u008A\u00B6*m\u00D5O\u00AB\u00EDW\u0097\u00AE~\u00BD&zMk\u0081^\u00C1\u00CA\u0082\u00C1\u00B5\x01k\u00EB\x0BU\n\u00E5\u0085}\u00EB\u00DC\u00D7\u00ED]OX/Y\u00DF\u00B5a\u00FA\u0086\u009D\x1B>\x15\u0089\u008A\u00AE\x14\u00DB\x17\u0097\x15\x7F\u00D8(\u00DCx\u00E5\x1B\u0087o\u00CA\u00BF\u0099\u00DC\u0094\u00B4\u00A9\u00AB\u00C4\u00B9d\u00CFf\u00D2f\u00E9\u00E6\u00DE-\u009E[\x0E\u0096\u00AA\u0097\u00E6\u0097\x0En\r\u00D9\u00DA\u00B4\r\u00DFV\u00B4\u00ED\u00F5\u00F6E\u00DB/\u0097\u00CD(\u00DB\u00BB\u0083\u00B6C\u00B9\u00A3\u00BF<\u00B8\u00BCe\u00A7\u00C9\u00CE\u00CD;?T\u00A4T\u00F4T\u00FAT6\u00EE\u00D2\u00DD\u00B5a\u00D7\u00F8n\u00D1\u00EE\x1B{\u00BC\u00F64\u00EC\u00D5\u00DB[\u00BC\u00F7\u00FD>\u00C9\u00BE\u00DBU\x01UM\u00D5f\u00D5e\u00FBI\u00FB\u00B3\u00F7?\u00AE\u0089\u00AA\u00E9\u00F8\u0096\u00FBm]\u00ADNmq\u00ED\u00C7\x03\u00D2\x03\u00FD\x07#\x0E\u00B6\u00D7\u00B9\u00D4\u00D5\x1D\u00D2=TR\u008F\u00D6+\u00EBG\x0E\u00C7\x1F\u00BE\u00FE\u009D\u00EFw-\r6\rU\u008D\u009C\u00C6\u00E2#pDy\u00E4\u00E9\u00F7\t\u00DF\u00F7\x1E\r:\u00DAv\u008C{\u00AC\u00E1\x07\u00D3\x1Fv\x1Dg\x1D/jB\u009A\u00F2\u009AF\u009BS\u009A\u00FB[b[\u00BAO\u00CC>\u00D1\u00D6\u00EA\u00DEz\u00FCG\u00DB\x1F\x0F\u009C4<YyJ\u00F3T\u00C9i\u00DA\u00E9\u0082\u00D3\u0093g\u00F2\u00CF\u008C\u009D\u0095\u009D}~.\u00F9\u00DC`\u00DB\u00A2\u00B6{\u00E7c\u00CE\u00DFj\x0Fo\u00EF\u00BA\x10t\u00E1\u00D2E\u00FF\u008B\u00E7;\u00BC;\u00CE\\\u00F2\u00B8t\u00F2\u00B2\u00DB\u00E5\x13W\u00B8W\u009A\u00AF:_m\u00EAt\u00EA<\u00FE\u0093\u00D3O\u00C7\u00BB\u009C\u00BB\u009A\u00AE\u00B9\\k\u00B9\u00EEz\u00BD\u00B5{f\u00F7\u00E9\x1B\u009E7\u00CE\u00DD\u00F4\u00BDy\u00F1\x16\u00FF\u00D6\u00D5\u009E9=\u00DD\u00BD\u00F3zo\u00F7\u00C5\u00F7\u00F5\u00DF\x16\u00DD~r'\u00FD\u00CE\u00CB\u00BB\u00D9w'\u00EE\u00AD\u00BCO\u00BC_\u00F4@\u00EDA\u00D9C\u00DD\u0087\u00D5?[\u00FE\u00DC\u00D8\u00EF\u00DC\x7Fj\u00C0w\u00A0\u00F3\u00D1\u00DCG\u00F7\x06\u0085\u0083\u00CF\u00FE\u0091\u00F5\u008F\x0FC\x05\u008F\u0099\u008F\u00CB\u0086\r\u0086\u00EB\u009E8>99\u00E2?r\u00FD\u00E9\u00FC\u00A7C\u00CFd\u00CF&\u009E\x17\u00FE\u00A2\u00FE\u00CB\u00AE\x17\x16/~\u00F8\u00D5\u00EB\u00D7\u00CE\u00D1\u0098\u00D1\u00A1\u0097\u00F2\u0097\u0093\u00BFm|\u00A5\u00FD\u00EA\u00C0\u00EB\x19\u00AF\u00DB\u00C6\u00C2\u00C6\x1E\u00BE\u00C9x31^\u00F4V\u00FB\u00ED\u00C1w\u00DCw\x1D\u00EF\u00A3\u00DF\x0FO\u00E4| \x7F(\u00FFh\u00F9\u00B1\u00F5S\u00D0\u00A7\u00FB\u0093\x19\u0093\u0093\u00FF\x04\x03\u0098\u00F3\u00FCc3-\u00DB\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008E|\u00FBQ\u0093\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\x01\u00F3IDATx\u00DA\u00A4\u0093=h\x14A\x18\u0086\u009F]\u0092@L'\u00D8Y\u00A9\u008DAs\u00C6\x1F\u0090\u0080\u0091\u00B3\u00BA\u0088\x10L\u009A\u009C\u00A4IH\u00CCi#\b\u0082\u0088\u00F6\x16!\u009DI\u00E4\x12\x04\u0083\u0091C\u00A2\u00A8\u0088\u00A2\u00A2r6\u00C6\u00E6$`aag\u009F\u00C6\u009F\u00E2v\u00BE\u00D7bf\u00F66\u0085\u0095\x0B\x0B\u00C3,\u00F3\u00FE<\u00F3m\"\u0089\u00FFy\u0092\u00E2\u00FA\u00E1\u009BM\x03\u0090\u0084\x01&a&\u009C\u00FC:sB\x12\u0097GOu\x03\x06()\x1E\u00EE/\x1DE\u00F2\x07\u00A0s\u00C8I8\x13\u0099\u0089\u00B63\u00BEm\u00B5\u00B826\u00DC\x0B\u00B4S Y\x7F\u00FD\u00C9\x0E\x0E\f\"\u0089X(\u00BA\x0B\u0090\u00C0D\u00FE\u00ED\u00C0\u00A1A\x166\u009A\x7F\u0080\u009E4\u00D6\x10\u0084\u00A8A\u00C0\u0084\t\u0086\u00AA\u008BX\u00E0d&*Su\f_\x11\u00E8M\u0081\u00D4\u00F7-\u00C6\u00B6 \u00E87\u00EF66q\x12\u00AB\u008F>\x07\u00A1\u009C[o\n$&\u00E5\x07]p\u00CELH\u00F0a\u00AD\u00C6\u00FA\u00F3\x16\u00993\x1A/\u00BE\u00F0le\u00C6\x03\u00F6\u008E\u00DD]@b\u00E6!\u009D\u009CX\u00DCqE\u00EF\u00D7j\u0098\u00C4\u00F5\u00DA\x19*Su\u00AE],\u00A3BR \u00ED\"t\u00CFL||p\t\u00E1\u009D3\u00F3\u00F4\u00CD:sb\"w\u008F\u00BB^ $8=\u00B9\u00BC#\u00C1\u00AB{\u00B3\u0098\u00E0\u00F6\u00F2;\u009E\u00D6g\x18\u009D]a\u00E8\u00F8>\\A4\x17\u00C8L\u00BC\u00BD?\u0087\u0082st<;]g|\u00A4\u0084\x01\u00E7+%\u00C6\u00E7Vi,M\u00E7\t\u00D2\u00D8\u00A7\u00ED\u008C\u00CC\x19\u00ED\x00\u00D1\u0099\u00AF\x0109v\x023Q\x1D=F\u00BC\u00F2\u00A8\u0090'0\u0085\u0081\t\f\u00E24>\u00A9\u00CF\x10!\x0Bh,M{\x16!e\x02t\x03}\x0B\u008F\u009B\u00DB\u00FB\u00FB\u008F`\x05\x06\x11V\u00EC\x1C\u00A7\u00F2\u00FB\u00D7\x167'\u00CA\u0087\u0081\u009F]\u0080\u00CE\u00DD\u00B8\u00B3\u00E7\u00EA\u00D8\u00F0\u00DE\u00F9\u008D\u00E6\u008FH=:\u00A8\u0093\x16\u00E4\u00C5nU\u00CB\u0083\x03#\x17vo\u00BD\\\u00DFN\x02\u0087\x1E\u00A0/\u00BC\u00BBB\u00B5\u00E4\x1F\x7F\u00B0\u0080\f\u00F8\r\u00FC\u00FA;\x00;\u00B2_\u00A6YE\u00DA\x04\x00\x00\x00\x00IEND\u00AEB`\u0082");
        icons._prop_ro = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\b\x06\x00\x00\x00\x1F\u00F3\u00FFa\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\nOiCCPPhotoshop ICC profile\x00\x00x\u00DA\u009DSgTS\u00E9\x16=\u00F7\u00DE\u00F4BK\u0088\u0080\u0094KoR\x15\b RB\u008B\u0080\x14\u0091&*!\t\x10J\u0088!\u00A1\u00D9\x15Q\u00C1\x11EE\x04\x1B\u00C8\u00A0\u0088\x03\u008E\u008E\u0080\u008C\x15Q,\f\u008A\n\u00D8\x07\u00E4!\u00A2\u008E\u0083\u00A3\u0088\u008A\u00CA\u00FB\u00E1{\u00A3k\u00D6\u00BC\u00F7\u00E6\u00CD\u00FE\u00B5\u00D7>\u00E7\u00AC\u00F3\u009D\u00B3\u00CF\x07\u00C0\b\f\u0096H3Q5\u0080\f\u00A9B\x1E\x11\u00E0\u0083\u00C7\u00C4\u00C6\u00E1\u00E4.@\u0081\n$p\x00\x10\b\u00B3d!s\u00FD#\x01\x00\u00F8~<<+\"\u00C0\x07\u00BE\x00\x01x\u00D3\x0B\b\x00\u00C0M\u009B\u00C00\x1C\u0087\u00FF\x0F\u00EAB\u0099\\\x01\u0080\u0084\x01\u00C0t\u00918K\b\u0080\x14\x00@z\u008EB\u00A6\x00@F\x01\u0080\u009D\u0098&S\x00\u00A0\x04\x00`\u00CBcb\u00E3\x00P-\x00`'\x7F\u00E6\u00D3\x00\u0080\u009D\u00F8\u0099{\x01\x00[\u0094!\x15\x01\u00A0\u0091\x00 \x13e\u0088D\x00h;\x00\u00AC\u00CFV\u008AE\x00X0\x00\x14fK\u00C49\x00\u00D8-\x000IWfH\x00\u00B0\u00B7\x00\u00C0\u00CE\x10\x0B\u00B2\x00\b\f\x000Q\u0088\u0085)\x00\x04{\x00`\u00C8##x\x00\u0084\u0099\x00\x14F\u00F2W<\u00F1+\u00AE\x10\u00E7*\x00\x00x\u0099\u00B2<\u00B9$9E\u0081[\b-q\x07WW.\x1E(\u00CEI\x17+\x146a\x02a\u009A@.\u00C2y\u0099\x192\u00814\x0F\u00E0\u00F3\u00CC\x00\x00\u00A0\u0091\x15\x11\u00E0\u0083\u00F3\u00FDx\u00CE\x0E\u00AE\u00CE\u00CE6\u008E\u00B6\x0E_-\u00EA\u00BF\x06\u00FF\"bb\u00E3\u00FE\u00E5\u00CF\u00ABp@\x00\x00\u00E1t~\u00D1\u00FE,/\u00B3\x1A\u0080;\x06\u0080m\u00FE\u00A2%\u00EE\x04h^\x0B\u00A0u\u00F7\u008Bf\u00B2\x0F@\u00B5\x00\u00A0\u00E9\u00DAW\u00F3p\u00F8~<<E\u00A1\u0090\u00B9\u00D9\u00D9\u00E5\u00E4\u00E4\u00D8J\u00C4B[a\u00CAW}\u00FEg\u00C2_\u00C0W\u00FDl\u00F9~<\u00FC\u00F7\u00F5\u00E0\u00BE\u00E2$\u00812]\u0081G\x04\u00F8\u00E0\u00C2\u00CC\u00F4L\u00A5\x1C\u00CF\u0092\t\u0084b\u00DC\u00E6\u008FG\u00FC\u00B7\x0B\u00FF\u00FC\x1D\u00D3\"\u00C4Ib\u00B9X*\x14\u00E3Q\x12q\u008ED\u009A\u008C\u00F32\u00A5\"\u0089B\u0092)\u00C5%\u00D2\u00FFd\u00E2\u00DF,\u00FB\x03>\u00DF5\x00\u00B0j>\x01{\u0091-\u00A8]c\x03\u00F6K'\x10Xt\u00C0\u00E2\u00F7\x00\x00\u00F2\u00BBo\u00C1\u00D4(\b\x03\u0080h\u0083\u00E1\u00CFw\u00FF\u00EF?\u00FDG\u00A0%\x00\u0080fI\u0092q\x00\x00^D$.T\u00CA\u00B3?\u00C7\b\x00\x00D\u00A0\u0081*\u00B0A\x1B\u00F4\u00C1\x18,\u00C0\x06\x1C\u00C1\x05\u00DC\u00C1\x0B\u00FC`6\u0084B$\u00C4\u00C2B\x10B\nd\u0080\x1Cr`)\u00AC\u0082B(\u0086\u00CD\u00B0\x1D*`/\u00D4@\x1D4\u00C0Qh\u0086\u0093p\x0E.\u00C2U\u00B8\x0E=p\x0F\u00FAa\b\u009E\u00C1(\u00BC\u0081\t\x04A\u00C8\b\x13a!\u00DA\u0088\x01b\u008AX#\u008E\b\x17\u0099\u0085\u00F8!\u00C1H\x04\x12\u008B$ \u00C9\u0088\x14Q\"K\u00915H1R\u008AT UH\x1D\u00F2=r\x029\u0087\\F\u00BA\u0091;\u00C8\x002\u0082\u00FC\u0086\u00BCG1\u0094\u0081\u00B2Q=\u00D4\f\u00B5C\u00B9\u00A87\x1A\u0084F\u00A2\x0B\u00D0dt1\u009A\u008F\x16\u00A0\u009B\u00D0r\u00B4\x1A=\u008C6\u00A1\u00E7\u00D0\u00ABh\x0F\u00DA\u008F>C\u00C70\u00C0\u00E8\x18\x073\u00C4l0.\u00C6\u00C3B\u00B18,\t\u0093c\u00CB\u00B1\"\u00AC\f\u00AB\u00C6\x1A\u00B0V\u00AC\x03\u00BB\u0089\u00F5c\u00CF\u00B1w\x04\x12\u0081E\u00C0\t6\x04wB a\x1EAHXLXN\u00D8H\u00A8 \x1C$4\x11\u00DA\t7\t\x03\u0084Q\u00C2'\"\u0093\u00A8K\u00B4&\u00BA\x11\u00F9\u00C4\x18b21\u0087XH,#\u00D6\x12\u008F\x13/\x10{\u0088C\u00C47$\x12\u0089C2'\u00B9\u0090\x02I\u00B1\u00A4T\u00D2\x12\u00D2F\u00D2nR#\u00E9,\u00A9\u009B4H\x1A#\u0093\u00C9\u00DAdk\u00B2\x079\u0094, +\u00C8\u0085\u00E4\u009D\u00E4\u00C3\u00E43\u00E4\x1B\u00E4!\u00F2[\n\u009Db@q\u00A4\u00F8S\u00E2(R\u00CAjJ\x19\u00E5\x10\u00E54\u00E5\x06e\u00982AU\u00A3\u009AR\u00DD\u00A8\u00A1T\x115\u008FZB\u00AD\u00A1\u00B6R\u00AFQ\u0087\u00A8\x134u\u009A9\u00CD\u0083\x16IK\u00A5\u00AD\u00A2\u0095\u00D3\x1Ah\x17h\u00F7i\u00AF\u00E8t\u00BA\x11\u00DD\u0095\x1EN\u0097\u00D0W\u00D2\u00CB\u00E9G\u00E8\u0097\u00E8\x03\u00F4w\f\r\u0086\x15\u0083\u00C7\u0088g(\x19\u009B\x18\x07\x18g\x19w\x18\u00AF\u0098L\u00A6\x19\u00D3\u008B\x19\u00C7T071\u00EB\u0098\u00E7\u0099\x0F\u0099oUX*\u00B6*|\x15\u0091\u00CA\n\u0095J\u0095&\u0095\x1B*/T\u00A9\u00AA\u00A6\u00AA\u00DE\u00AA\x0BU\u00F3U\u00CBT\u008F\u00A9^S}\u00AEFU3S\u00E3\u00A9\t\u00D4\u0096\u00ABU\u00AA\u009DP\u00EBS\x1BSg\u00A9;\u00A8\u0087\u00AAg\u00A8oT?\u00A4~Y\u00FD\u0089\x06Y\u00C3L\u00C3OC\u00A4Q\u00A0\u00B1_\u00E3\u00BC\u00C6 \x0Bc\x19\u00B3x,!k\r\u00AB\u0086u\u00815\u00C4&\u00B1\u00CD\u00D9|v*\u00BB\u0098\u00FD\x1D\u00BB\u008B=\u00AA\u00A9\u00A19C3J3W\u00B3R\u00F3\u0094f?\x07\u00E3\u0098q\u00F8\u009CtN\t\u00E7(\u00A7\u0097\u00F3~\u008A\u00DE\x14\u00EF)\u00E2)\x1B\u00A64L\u00B91e\\k\u00AA\u0096\u0097\u0096X\u00ABH\u00ABQ\u00ABG\u00EB\u00BD6\u00AE\u00ED\u00A7\u009D\u00A6\u00BDE\u00BBY\u00FB\u0081\x0EA\u00C7J'\\'Gg\u008F\u00CE\x05\u009D\u00E7S\u00D9S\u00DD\u00A7\n\u00A7\x16M=:\u00F5\u00AE.\u00AAk\u00A5\x1B\u00A1\u00BBDw\u00BFn\u00A7\u00EE\u0098\u009E\u00BE^\u0080\u009ELo\u00A7\u00DEy\u00BD\u00E7\u00FA\x1C}/\u00FDT\u00FDm\u00FA\u00A7\u00F5G\fX\x06\u00B3\f$\x06\u00DB\f\u00CE\x18<\u00C55qo<\x1D/\u00C7\u00DB\u00F1QC]\u00C3@C\u00A5a\u0095a\u0097\u00E1\u0084\u0091\u00B9\u00D1<\u00A3\u00D5F\u008DF\x0F\u008Ci\u00C6\\\u00E3$\u00E3m\u00C6m\u00C6\u00A3&\x06&!&KM\u00EAM\u00EE\u009ARM\u00B9\u00A6)\u00A6;L;L\u00C7\u00CD\u00CC\u00CD\u00A2\u00CD\u00D6\u00995\u009B=1\u00D72\u00E7\u009B\u00E7\u009B\u00D7\u009B\u00DF\u00B7`ZxZ,\u00B6\u00A8\u00B6\u00B8eI\u00B2\u00E4Z\u00A6Y\u00EE\u00B6\u00BCn\u0085Z9Y\u00A5XUZ]\u00B3F\u00AD\u009D\u00AD%\u00D6\u00BB\u00AD\u00BB\u00A7\x11\u00A7\u00B9N\u0093N\u00AB\u009E\u00D6g\u00C3\u00B0\u00F1\u00B6\u00C9\u00B6\u00A9\u00B7\x19\u00B0\u00E5\u00D8\x06\u00DB\u00AE\u00B6m\u00B6}agb\x17g\u00B7\u00C5\u00AE\u00C3\u00EE\u0093\u00BD\u0093}\u00BA}\u008D\u00FD=\x07\r\u0087\u00D9\x0E\u00AB\x1DZ\x1D~s\u00B4r\x14:V:\u00DE\u009A\u00CE\u009C\u00EE?}\u00C5\u00F4\u0096\u00E9/gX\u00CF\x10\u00CF\u00D83\u00E3\u00B6\x13\u00CB)\u00C4i\u009DS\u009B\u00D3Gg\x17g\u00B9s\u0083\u00F3\u0088\u008B\u0089K\u0082\u00CB.\u0097>.\u009B\x1B\u00C6\u00DD\u00C8\u00BD\u00E4Jt\u00F5q]\u00E1z\u00D2\u00F5\u009D\u009B\u00B3\u009B\u00C2\u00ED\u00A8\u00DB\u00AF\u00EE6\u00EEi\u00EE\u0087\u00DC\u009F\u00CC4\u009F)\u009EY3s\u00D0\u00C3\u00C8C\u00E0Q\u00E5\u00D1?\x0B\u009F\u00950k\u00DF\u00AC~OCO\u0081g\u00B5\u00E7#/c/\u0091W\u00AD\u00D7\u00B0\u00B7\u00A5w\u00AA\u00F7a\u00EF\x17>\u00F6>r\u009F\u00E3>\u00E3<7\u00DE2\u00DEY_\u00CC7\u00C0\u00B7\u00C8\u00B7\u00CBO\u00C3o\u009E_\u0085\u00DFC\x7F#\u00FFd\u00FFz\u00FF\u00D1\x00\u00A7\u0080%\x01g\x03\u0089\u0081A\u0081[\x02\u00FB\u00F8z|!\u00BF\u008E?:\u00DBe\u00F6\u00B2\u00D9\u00EDA\u008C\u00A0\u00B9A\x15A\u008F\u0082\u00AD\u0082\u00E5\u00C1\u00AD!h\u00C8\u00EC\u0090\u00AD!\u00F7\u00E7\u0098\u00CE\u0091\u00CEi\x0E\u0085P~\u00E8\u00D6\u00D0\x07a\u00E6a\u008B\u00C3~\f'\u0085\u0087\u0085W\u0086?\u008Ep\u0088X\x1A\u00D11\u00975w\u00D1\u00DCCs\u00DFD\u00FAD\u0096D\u00DE\u009Bg1O9\u00AF-J5*>\u00AA.j<\u00DA7\u00BA4\u00BA?\u00C6.fY\u00CC\u00D5X\u009DXIlK\x1C9.*\u00AE6nl\u00BE\u00DF\u00FC\u00ED\u00F3\u0087\u00E2\u009D\u00E2\x0B\u00E3{\x17\u0098/\u00C8]py\u00A1\u00CE\u00C2\u00F4\u0085\u00A7\x16\u00A9.\x12,:\u0096@L\u0088N8\u0094\u00F0A\x10*\u00A8\x16\u008C%\u00F2\x13w%\u008E\ny\u00C2\x1D\u00C2g\"/\u00D16\u00D1\u0088\u00D8C\\*\x1EN\u00F2H*Mz\u0092\u00EC\u0091\u00BC5y$\u00C53\u00A5,\u00E5\u00B9\u0084'\u00A9\u0090\u00BCL\rL\u00DD\u009B:\u009E\x16\u009Av m2=:\u00BD1\u0083\u0092\u0091\u0090qB\u00AA!M\u0093\u00B6g\u00EAg\u00E6fv\u00CB\u00ACe\u0085\u00B2\u00FE\u00C5n\u008B\u00B7/\x1E\u0095\x07\u00C9k\u00B3\u0090\u00AC\x05Y-\n\u00B6B\u00A6\u00E8TZ(\u00D7*\x07\u00B2geWf\u00BF\u00CD\u0089\u00CA9\u0096\u00AB\u009E+\u00CD\u00ED\u00CC\u00B3\u00CA\u00DB\u00907\u009C\u00EF\u009F\u00FF\u00ED\x12\u00C2\x12\u00E1\u0092\u00B6\u00A5\u0086KW-\x1DX\u00E6\u00BD\u00ACj9\u00B2<qy\u00DB\n\u00E3\x15\x05+\u0086V\x06\u00AC<\u00B8\u008A\u00B6*m\u00D5O\u00AB\u00EDW\u0097\u00AE~\u00BD&zMk\u0081^\u00C1\u00CA\u0082\u00C1\u00B5\x01k\u00EB\x0BU\n\u00E5\u0085}\u00EB\u00DC\u00D7\u00ED]OX/Y\u00DF\u00B5a\u00FA\u0086\u009D\x1B>\x15\u0089\u008A\u00AE\x14\u00DB\x17\u0097\x15\x7F\u00D8(\u00DCx\u00E5\x1B\u0087o\u00CA\u00BF\u0099\u00DC\u0094\u00B4\u00A9\u00AB\u00C4\u00B9d\u00CFf\u00D2f\u00E9\u00E6\u00DE-\u009E[\x0E\u0096\u00AA\u0097\u00E6\u0097\x0En\r\u00D9\u00DA\u00B4\r\u00DFV\u00B4\u00ED\u00F5\u00F6E\u00DB/\u0097\u00CD(\u00DB\u00BB\u0083\u00B6C\u00B9\u00A3\u00BF<\u00B8\u00BCe\u00A7\u00C9\u00CE\u00CD;?T\u00A4T\u00F4T\u00FAT6\u00EE\u00D2\u00DD\u00B5a\u00D7\u00F8n\u00D1\u00EE\x1B{\u00BC\u00F64\u00EC\u00D5\u00DB[\u00BC\u00F7\u00FD>\u00C9\u00BE\u00DBU\x01UM\u00D5f\u00D5e\u00FBI\u00FB\u00B3\u00F7?\u00AE\u0089\u00AA\u00E9\u00F8\u0096\u00FBm]\u00ADNmq\u00ED\u00C7\x03\u00D2\x03\u00FD\x07#\x0E\u00B6\u00D7\u00B9\u00D4\u00D5\x1D\u00D2=TR\u008F\u00D6+\u00EBG\x0E\u00C7\x1F\u00BE\u00FE\u009D\u00EFw-\r6\rU\u008D\u009C\u00C6\u00E2#pDy\u00E4\u00E9\u00F7\t\u00DF\u00F7\x1E\r:\u00DAv\u008C{\u00AC\u00E1\x07\u00D3\x1Fv\x1Dg\x1D/jB\u009A\u00F2\u009AF\u009BS\u009A\u00FB[b[\u00BAO\u00CC>\u00D1\u00D6\u00EA\u00DEz\u00FCG\u00DB\x1F\x0F\u009C4<YyJ\u00F3T\u00C9i\u00DA\u00E9\u0082\u00D3\u0093g\u00F2\u00CF\u008C\u009D\u0095\u009D}~.\u00F9\u00DC`\u00DB\u00A2\u00B6{\u00E7c\u00CE\u00DFj\x0Fo\u00EF\u00BA\x10t\u00E1\u00D2E\u00FF\u008B\u00E7;\u00BC;\u00CE\\\u00F2\u00B8t\u00F2\u00B2\u00DB\u00E5\x13W\u00B8W\u009A\u00AF:_m\u00EAt\u00EA<\u00FE\u0093\u00D3O\u00C7\u00BB\u009C\u00BB\u009A\u00AE\u00B9\\k\u00B9\u00EEz\u00BD\u00B5{f\u00F7\u00E9\x1B\u009E7\u00CE\u00DD\u00F4\u00BDy\u00F1\x16\u00FF\u00D6\u00D5\u009E9=\u00DD\u00BD\u00F3zo\u00F7\u00C5\u00F7\u00F5\u00DF\x16\u00DD~r'\u00FD\u00CE\u00CB\u00BB\u00D9w'\u00EE\u00AD\u00BCO\u00BC_\u00F4@\u00EDA\u00D9C\u00DD\u0087\u00D5?[\u00FE\u00DC\u00D8\u00EF\u00DC\x7Fj\u00C0w\u00A0\u00F3\u00D1\u00DCG\u00F7\x06\u0085\u0083\u00CF\u00FE\u0091\u00F5\u008F\x0FC\x05\u008F\u0099\u008F\u00CB\u0086\r\u0086\u00EB\u009E8>99\u00E2?r\u00FD\u00E9\u00FC\u00A7C\u00CFd\u00CF&\u009E\x17\u00FE\u00A2\u00FE\u00CB\u00AE\x17\x16/~\u00F8\u00D5\u00EB\u00D7\u00CE\u00D1\u0098\u00D1\u00A1\u0097\u00F2\u0097\u0093\u00BFm|\u00A5\u00FD\u00EA\u00C0\u00EB\x19\u00AF\u00DB\u00C6\u00C2\u00C6\x1E\u00BE\u00C9x31^\u00F4V\u00FB\u00ED\u00C1w\u00DCw\x1D\u00EF\u00A3\u00DF\x0FO\u00E4| \x7F(\u00FFh\u00F9\u00B1\u00F5S\u00D0\u00A7\u00FB\u0093\x19\u0093\u0093\u00FF\x04\x03\u0098\u00F3\u00FCc3-\u00DB\x00\x00\x00\x04gAMA\x00\x00\u00B1\u008E|\u00FBQ\u0093\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\x01\u00DFIDATx\u00DA\u00A4\u0093\u00B1kSQ\x18\u00C5\x7F\u00EF\u00F1Z\u00A8N\u008A\u008A\u00D5\u00B4\n\x0E\x1D\u00ACb\u0084*\u00944\u008E\u008A$\u009B(X\u00AAX\u00B5\u00B4t\u00B0E\x03\u00FA\x1F(\u00B1C\u0085\x12!\"\x04E\u00D4I7\u00D7\u0086t\u00A9\u00BA\u00A8\u008BS\u0087D\x11\x1C\u009C\u00D4\u00A1\u00E6;\x0E\u00F7\u00BE\u00D7\u00F7\x02N>\u00B8\u00BC\u00CB\u00E5\u00FB\u00CEw\u00CE\u00B9\u00E7\x06\u0092\u00F8\u009F/*\u0097\u00CB\u00F1>\u00B8\u00BEx\u00C7\x00$!@\x02\u00F3{\x13\u0098\t!\u009E\u00ADT\u00FB\x00\x03\x14\u00A5\u009B\x07s\u00C3H\u00C2\u00FC\u00A1|\u0093\u00E1\u00FF\x12]\x13\x17\u00E6*\u009B/j\u00D5\x01`3\x04\u0082k\x0B\u00B7m\u00EF\u00FE!\u00D2r\u00A4,\x13\u00E1\x16\u00C0\u009E}C\u009C\u009F\u00AD\u00FC\x06\u00FAC \u0088\u009B\u00CC\u00AFD\u0086\u00E0\u00DE\u00A3\u00D5\x04X\u0082\u00E5F\u00CBIre\x03!\x10*\u00D3\x18k\u00DD:k\u00BE\u00DB\u00C0$\u00D6\u00DEo$5\u00A4\x00\x02GwK\u00A73\u00CF\u009D\u00DD\u009A.\u00B2\u00FE\u00A1\u008D\u0099x\u00FB\u00B1\u00C3\u00FC\u00A5\u0082s\u00CF\u00A1\u00F4E@`r\u008Dw\u00EB\u00AB\u0099+\u00BA9]D\x12g\u008A#,7Z\u009C\u009E\x18I\u008C\u00F0,\u00C2\bo\u008E\t*WO\x01J\u00AE/f\u00D3\u00EBQl.@\x04`\u00E6\u00E8\u00DF\x7F\u00DC\u00CC0\u00B8q\u00B9\u0080\u00807\u00CD\u00CF\u00CCO\x15Xy\u00D2\u00E2\u00D0\u0081]X\n\u00D5\x01\u00F8i\u008BW&\u00C0O\u008F\u0099=h\u00B48>\u009A\u00C3\u0080\u00FC\u00E1\x1C\x0F\u009F\u00AE139\u009E\x00\u0084\u00AE\u00D0\x05\u00C4LtS\u00C9\u00EB\u00FAA'\u00F3\x07\u0091\u00C4\u00D8\u00B1\u00E1\x04\u0098^\t\u00BD\u00811_57Up\u00E9\u00F4\u00ACf&\u00C7\u0093\u0090\u00C5\f\u00F4\u00BCV\u00DD\u00F1\u00EDK;\u0099jJ\u0087I\x19I\x12|\u00FF\u00DA\u00E6U}\u00E9\b`\x11\u00A0\u00A3g/\u00EE~Y\u00AB\u00E6\u00CE\u00CDV:\u00E9\u00D4\u00F5\u00D2\u008D\u00FDz]_\u00CA\u00E7FO\u00EC\u00EC|Z\u00FF\x11\u0094J\u00A5\x10\u00E8\x07\u00B6\u00FB\u00B5\u00CDK\x0B\u00FE\u00F1\u0082\x05\u00FC\x01~\x01?\u00FF\x0E\x00h\u00F17\u00E2v\u00FF\u00EA\u00B1\x00\x00\x00\x00IEND\u00AEB`\u0082");
        icons._method = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\b\x06\x00\x00\x00\x1F\u00F3\u00FFa\x00\x00\x00\x04gAMA\x00\x00\u00D6\u00D8\u00D4OX2\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02jIDATx\u00DA\u00A4S=kTA\x14=\u00FBv\u00B3\u00B2\u009A\u00D8\u008AB\x02n\x157\u00C4O\u00D04Z\u00E8O\u00B0Y\x10Q\u00A2\u00EE\x1F\u00B0\u00B2\x12\x1B\u00D1\u00A8\u0098 \u00F1\x07\u0088\u0082\x10\x0BED\u00D0\u00C2\u00C2\u00C2\"\x06E%Y\x04\u00ADR\u00A8(j\u00CC\u00DB7\u00DF\u00E3\u00B9\u00B3/\u00B2\u00BD\x03\u00C3\u00CE\u00DC\u00BD\u00F7\u00DCs\u00CE\u009DW\u00891\u00E2\x7FVe\u00F0\u00FCra!\u00C8!\u0081\u00CA\x0E\u00BCz\u008F\x18R\u0098\u00D7\u0090\u00CEG\u00A7\u00A7\u0087\u00E4*\u00A9\u0095\u00C1\u00E2}\x13\x13\u0088\u00CE\u00F5\u008BK\u0080\u00E0\u00FBE!\u00F2\u0097`\x02\u00F8\u00B6\u00DB\u00C5\u00B1N\u00A7\u00C1:\u009B\u00FD+n\u00B5R\u0082]^\u00C1\u00F7=\x07\x10\b\u00E4Y\u00EC\x18\u00F3,\u00FE8u\x04\u00FA\u00CBWD\u00EB\u00B0{g\x13\u00CF\u00E7o\x17\u00AC\u00AD'\x00\u00A1,]\u00A4\u00FB\u00AF\u00F6\t4n\u00CDA\x1B\x07c}\u0092\x13\u00AD\u00C5\u00B6\u0099\u00CBX9\u00DE\u0086R\x05\u00AC\u00B6\b\u008Cq5\x04 \u00DB\u00D0\x19B\x04IB\u00BD{\x0F\u00AD\x15\u009CQ\bZs[\u00F4\u0096\u00BBp\u00B4\u00CC*\x05[\u00E4\u0088l \x00\u00B5d\u00A4\u00E8%\u0088#\u00AA\x12_\u009BM\x04&fY\x15\u0091\u00F7\x10,\u00B2\u00B1Q\x18&\x17\u00EB9\u0086\u00B2\u008C@\u00A2\u0080\u00C7$At\x1A\u008BOS\u00871|\u00FF.0\u00D9\x02\u00C4\x03mH\u0095\f\n\u008D\u00FA\u00AEq\u008C\u00DD\u00B8\u0082\u00C5S\u00E7\u00C8@\u00C3\u0091\x19W5K\u00E3\u00F1!\u008Dh\u00F4\u00C53\u00AC\u00B6OB/.\u00C1+K\u00ED\u0086\u00BF\u0086t\r\u00D6^/\u00E1\u00C3\u00F9\x0B\u0098\u00BCy\r\u00B6\u0097\u00A7\u00B8\u00ACZ\u009A{\u00F0\bF\x12\u00A9\u0095\u0094G\u00E8\u00F4&\u00EF\b\x10\u00E0\x1D\u00FFs\u0086\x1DE\x1E\u009B\x15*5\u00F3}\t\u0095\x04\u00C0Y%\u00CA\u00C1Y\u00E42\\\x1A\u00E4\u008A\x1E}\t\u00A8\u00D2X\x017\u0094\u0093\x13\u00DC\u00E4=Ti\u0099SIBL\x00R(\x1E\u0080\u00C15IbG\u00CF)D\x17\u00D3h\x03\x19ij\x16pW\u00A4\u00CEd\u0090\x00\u00D0\u00F7\u0080\f\")\x07\u009A\u00B9\x7F\u00F6*\u00DE\u00CC\u00CESg\u0091h:N\u00C3\u00B1\u00EB\u00AB;\u00F7p\u00F0\u00CC\u00E9$\u00C1s\u00C7\u00BE\u0089\u00E9)\u00CB\u00BB\u00DE\u00F2t\u00E6\u00FA\u00CF\u00F1\u00ED;\u00A0{=\x14,\x0E\u00BA@\u00CDs\u0088\u0094#\x12$\u00AEX\u00E4y\u00FF\u00FC\u00E3\x1B\u00CE>z\u00B0\u0097u\u00BF+\u00A5\u0091\u00F2\u00AE\u00B7>\u00BExiU\u00B4Z\u00D2L\u00A6\u0092z&\x12\u00E4U\x1A\u008E\u008E2\u0085i\u00E7\u00C9\u00C3C\u00CC_\u00DF\x00\x10\x19u\u00EE\u00CD\u00DC#\u00DC\u00C3%\u00AB\u00AC\u00FC\u00E2B\u00F9\u00C1e\x031[\x02\u00FC\u00F9+\u00C0\x00\u00A2\u00FC\u00C8v\u00BAm4d\x00\x00\x00\x00IEND\u00AEB`\u0082");
        icons._method_static = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x10\x00\x00\x00\x10\b\x06\x00\x00\x00\x1F\u00F3\u00FFa\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\nOiCCPPhotoshop ICC profile\x00\x00x\u00DA\u009DSgTS\u00E9\x16=\u00F7\u00DE\u00F4BK\u0088\u0080\u0094KoR\x15\b RB\u008B\u0080\x14\u0091&*!\t\x10J\u0088!\u00A1\u00D9\x15Q\u00C1\x11EE\x04\x1B\u00C8\u00A0\u0088\x03\u008E\u008E\u0080\u008C\x15Q,\f\u008A\n\u00D8\x07\u00E4!\u00A2\u008E\u0083\u00A3\u0088\u008A\u00CA\u00FB\u00E1{\u00A3k\u00D6\u00BC\u00F7\u00E6\u00CD\u00FE\u00B5\u00D7>\u00E7\u00AC\u00F3\u009D\u00B3\u00CF\x07\u00C0\b\f\u0096H3Q5\u0080\f\u00A9B\x1E\x11\u00E0\u0083\u00C7\u00C4\u00C6\u00E1\u00E4.@\u0081\n$p\x00\x10\b\u00B3d!s\u00FD#\x01\x00\u00F8~<<+\"\u00C0\x07\u00BE\x00\x01x\u00D3\x0B\b\x00\u00C0M\u009B\u00C00\x1C\u0087\u00FF\x0F\u00EAB\u0099\\\x01\u0080\u0084\x01\u00C0t\u00918K\b\u0080\x14\x00@z\u008EB\u00A6\x00@F\x01\u0080\u009D\u0098&S\x00\u00A0\x04\x00`\u00CBcb\u00E3\x00P-\x00`'\x7F\u00E6\u00D3\x00\u0080\u009D\u00F8\u0099{\x01\x00[\u0094!\x15\x01\u00A0\u0091\x00 \x13e\u0088D\x00h;\x00\u00AC\u00CFV\u008AE\x00X0\x00\x14fK\u00C49\x00\u00D8-\x000IWfH\x00\u00B0\u00B7\x00\u00C0\u00CE\x10\x0B\u00B2\x00\b\f\x000Q\u0088\u0085)\x00\x04{\x00`\u00C8##x\x00\u0084\u0099\x00\x14F\u00F2W<\u00F1+\u00AE\x10\u00E7*\x00\x00x\u0099\u00B2<\u00B9$9E\u0081[\b-q\x07WW.\x1E(\u00CEI\x17+\x146a\x02a\u009A@.\u00C2y\u0099\x192\u00814\x0F\u00E0\u00F3\u00CC\x00\x00\u00A0\u0091\x15\x11\u00E0\u0083\u00F3\u00FDx\u00CE\x0E\u00AE\u00CE\u00CE6\u008E\u00B6\x0E_-\u00EA\u00BF\x06\u00FF\"bb\u00E3\u00FE\u00E5\u00CF\u00ABp@\x00\x00\u00E1t~\u00D1\u00FE,/\u00B3\x1A\u0080;\x06\u0080m\u00FE\u00A2%\u00EE\x04h^\x0B\u00A0u\u00F7\u008Bf\u00B2\x0F@\u00B5\x00\u00A0\u00E9\u00DAW\u00F3p\u00F8~<<E\u00A1\u0090\u00B9\u00D9\u00D9\u00E5\u00E4\u00E4\u00D8J\u00C4B[a\u00CAW}\u00FEg\u00C2_\u00C0W\u00FDl\u00F9~<\u00FC\u00F7\u00F5\u00E0\u00BE\u00E2$\u00812]\u0081G\x04\u00F8\u00E0\u00C2\u00CC\u00F4L\u00A5\x1C\u00CF\u0092\t\u0084b\u00DC\u00E6\u008FG\u00FC\u00B7\x0B\u00FF\u00FC\x1D\u00D3\"\u00C4Ib\u00B9X*\x14\u00E3Q\x12q\u008ED\u009A\u008C\u00F32\u00A5\"\u0089B\u0092)\u00C5%\u00D2\u00FFd\u00E2\u00DF,\u00FB\x03>\u00DF5\x00\u00B0j>\x01{\u0091-\u00A8]c\x03\u00F6K'\x10Xt\u00C0\u00E2\u00F7\x00\x00\u00F2\u00BBo\u00C1\u00D4(\b\x03\u0080h\u0083\u00E1\u00CFw\u00FF\u00EF?\u00FDG\u00A0%\x00\u0080fI\u0092q\x00\x00^D$.T\u00CA\u00B3?\u00C7\b\x00\x00D\u00A0\u0081*\u00B0A\x1B\u00F4\u00C1\x18,\u00C0\x06\x1C\u00C1\x05\u00DC\u00C1\x0B\u00FC`6\u0084B$\u00C4\u00C2B\x10B\nd\u0080\x1Cr`)\u00AC\u0082B(\u0086\u00CD\u00B0\x1D*`/\u00D4@\x1D4\u00C0Qh\u0086\u0093p\x0E.\u00C2U\u00B8\x0E=p\x0F\u00FAa\b\u009E\u00C1(\u00BC\u0081\t\x04A\u00C8\b\x13a!\u00DA\u0088\x01b\u008AX#\u008E\b\x17\u0099\u0085\u00F8!\u00C1H\x04\x12\u008B$ \u00C9\u0088\x14Q\"K\u00915H1R\u008AT UH\x1D\u00F2=r\x029\u0087\\F\u00BA\u0091;\u00C8\x002\u0082\u00FC\u0086\u00BCG1\u0094\u0081\u00B2Q=\u00D4\f\u00B5C\u00B9\u00A87\x1A\u0084F\u00A2\x0B\u00D0dt1\u009A\u008F\x16\u00A0\u009B\u00D0r\u00B4\x1A=\u008C6\u00A1\u00E7\u00D0\u00ABh\x0F\u00DA\u008F>C\u00C70\u00C0\u00E8\x18\x073\u00C4l0.\u00C6\u00C3B\u00B18,\t\u0093c\u00CB\u00B1\"\u00AC\f\u00AB\u00C6\x1A\u00B0V\u00AC\x03\u00BB\u0089\u00F5c\u00CF\u00B1w\x04\x12\u0081E\u00C0\t6\x04wB a\x1EAHXLXN\u00D8H\u00A8 \x1C$4\x11\u00DA\t7\t\x03\u0084Q\u00C2'\"\u0093\u00A8K\u00B4&\u00BA\x11\u00F9\u00C4\x18b21\u0087XH,#\u00D6\x12\u008F\x13/\x10{\u0088C\u00C47$\x12\u0089C2'\u00B9\u0090\x02I\u00B1\u00A4T\u00D2\x12\u00D2F\u00D2nR#\u00E9,\u00A9\u009B4H\x1A#\u0093\u00C9\u00DAdk\u00B2\x079\u0094, +\u00C8\u0085\u00E4\u009D\u00E4\u00C3\u00E43\u00E4\x1B\u00E4!\u00F2[\n\u009Db@q\u00A4\u00F8S\u00E2(R\u00CAjJ\x19\u00E5\x10\u00E54\u00E5\x06e\u00982AU\u00A3\u009AR\u00DD\u00A8\u00A1T\x115\u008FZB\u00AD\u00A1\u00B6R\u00AFQ\u0087\u00A8\x134u\u009A9\u00CD\u0083\x16IK\u00A5\u00AD\u00A2\u0095\u00D3\x1Ah\x17h\u00F7i\u00AF\u00E8t\u00BA\x11\u00DD\u0095\x1EN\u0097\u00D0W\u00D2\u00CB\u00E9G\u00E8\u0097\u00E8\x03\u00F4w\f\r\u0086\x15\u0083\u00C7\u0088g(\x19\u009B\x18\x07\x18g\x19w\x18\u00AF\u0098L\u00A6\x19\u00D3\u008B\x19\u00C7T071\u00EB\u0098\u00E7\u0099\x0F\u0099oUX*\u00B6*|\x15\u0091\u00CA\n\u0095J\u0095&\u0095\x1B*/T\u00A9\u00AA\u00A6\u00AA\u00DE\u00AA\x0BU\u00F3U\u00CBT\u008F\u00A9^S}\u00AEFU3S\u00E3\u00A9\t\u00D4\u0096\u00ABU\u00AA\u009DP\u00EBS\x1BSg\u00A9;\u00A8\u0087\u00AAg\u00A8oT?\u00A4~Y\u00FD\u0089\x06Y\u00C3L\u00C3OC\u00A4Q\u00A0\u00B1_\u00E3\u00BC\u00C6 \x0Bc\x19\u00B3x,!k\r\u00AB\u0086u\u00815\u00C4&\u00B1\u00CD\u00D9|v*\u00BB\u0098\u00FD\x1D\u00BB\u008B=\u00AA\u00A9\u00A19C3J3W\u00B3R\u00F3\u0094f?\x07\u00E3\u0098q\u00F8\u009CtN\t\u00E7(\u00A7\u0097\u00F3~\u008A\u00DE\x14\u00EF)\u00E2)\x1B\u00A64L\u00B91e\\k\u00AA\u0096\u0097\u0096X\u00ABH\u00ABQ\u00ABG\u00EB\u00BD6\u00AE\u00ED\u00A7\u009D\u00A6\u00BDE\u00BBY\u00FB\u0081\x0EA\u00C7J'\\'Gg\u008F\u00CE\x05\u009D\u00E7S\u00D9S\u00DD\u00A7\n\u00A7\x16M=:\u00F5\u00AE.\u00AAk\u00A5\x1B\u00A1\u00BBDw\u00BFn\u00A7\u00EE\u0098\u009E\u00BE^\u0080\u009ELo\u00A7\u00DEy\u00BD\u00E7\u00FA\x1C}/\u00FDT\u00FDm\u00FA\u00A7\u00F5G\fX\x06\u00B3\f$\x06\u00DB\f\u00CE\x18<\u00C55qo<\x1D/\u00C7\u00DB\u00F1QC]\u00C3@C\u00A5a\u0095a\u0097\u00E1\u0084\u0091\u00B9\u00D1<\u00A3\u00D5F\u008DF\x0F\u008Ci\u00C6\\\u00E3$\u00E3m\u00C6m\u00C6\u00A3&\x06&!&KM\u00EAM\u00EE\u009ARM\u00B9\u00A6)\u00A6;L;L\u00C7\u00CD\u00CC\u00CD\u00A2\u00CD\u00D6\u00995\u009B=1\u00D72\u00E7\u009B\u00E7\u009B\u00D7\u009B\u00DF\u00B7`ZxZ,\u00B6\u00A8\u00B6\u00B8eI\u00B2\u00E4Z\u00A6Y\u00EE\u00B6\u00BCn\u0085Z9Y\u00A5XUZ]\u00B3F\u00AD\u009D\u00AD%\u00D6\u00BB\u00AD\u00BB\u00A7\x11\u00A7\u00B9N\u0093N\u00AB\u009E\u00D6g\u00C3\u00B0\u00F1\u00B6\u00C9\u00B6\u00A9\u00B7\x19\u00B0\u00E5\u00D8\x06\u00DB\u00AE\u00B6m\u00B6}agb\x17g\u00B7\u00C5\u00AE\u00C3\u00EE\u0093\u00BD\u0093}\u00BA}\u008D\u00FD=\x07\r\u0087\u00D9\x0E\u00AB\x1DZ\x1D~s\u00B4r\x14:V:\u00DE\u009A\u00CE\u009C\u00EE?}\u00C5\u00F4\u0096\u00E9/gX\u00CF\x10\u00CF\u00D83\u00E3\u00B6\x13\u00CB)\u00C4i\u009DS\u009B\u00D3Gg\x17g\u00B9s\u0083\u00F3\u0088\u008B\u0089K\u0082\u00CB.\u0097>.\u009B\x1B\u00C6\u00DD\u00C8\u00BD\u00E4Jt\u00F5q]\u00E1z\u00D2\u00F5\u009D\u009B\u00B3\u009B\u00C2\u00ED\u00A8\u00DB\u00AF\u00EE6\u00EEi\u00EE\u0087\u00DC\u009F\u00CC4\u009F)\u009EY3s\u00D0\u00C3\u00C8C\u00E0Q\u00E5\u00D1?\x0B\u009F\u00950k\u00DF\u00AC~OCO\u0081g\u00B5\u00E7#/c/\u0091W\u00AD\u00D7\u00B0\u00B7\u00A5w\u00AA\u00F7a\u00EF\x17>\u00F6>r\u009F\u00E3>\u00E3<7\u00DE2\u00DEY_\u00CC7\u00C0\u00B7\u00C8\u00B7\u00CBO\u00C3o\u009E_\u0085\u00DFC\x7F#\u00FFd\u00FFz\u00FF\u00D1\x00\u00A7\u0080%\x01g\x03\u0089\u0081A\u0081[\x02\u00FB\u00F8z|!\u00BF\u008E?:\u00DBe\u00F6\u00B2\u00D9\u00EDA\u008C\u00A0\u00B9A\x15A\u008F\u0082\u00AD\u0082\u00E5\u00C1\u00AD!h\u00C8\u00EC\u0090\u00AD!\u00F7\u00E7\u0098\u00CE\u0091\u00CEi\x0E\u0085P~\u00E8\u00D6\u00D0\x07a\u00E6a\u008B\u00C3~\f'\u0085\u0087\u0085W\u0086?\u008Ep\u0088X\x1A\u00D11\u00975w\u00D1\u00DCCs\u00DFD\u00FAD\u0096D\u00DE\u009Bg1O9\u00AF-J5*>\u00AA.j<\u00DA7\u00BA4\u00BA?\u00C6.fY\u00CC\u00D5X\u009DXIlK\x1C9.*\u00AE6nl\u00BE\u00DF\u00FC\u00ED\u00F3\u0087\u00E2\u009D\u00E2\x0B\u00E3{\x17\u0098/\u00C8]py\u00A1\u00CE\u00C2\u00F4\u0085\u00A7\x16\u00A9.\x12,:\u0096@L\u0088N8\u0094\u00F0A\x10*\u00A8\x16\u008C%\u00F2\x13w%\u008E\ny\u00C2\x1D\u00C2g\"/\u00D16\u00D1\u0088\u00D8C\\*\x1EN\u00F2H*Mz\u0092\u00EC\u0091\u00BC5y$\u00C53\u00A5,\u00E5\u00B9\u0084'\u00A9\u0090\u00BCL\rL\u00DD\u009B:\u009E\x16\u009Av m2=:\u00BD1\u0083\u0092\u0091\u0090qB\u00AA!M\u0093\u00B6g\u00EAg\u00E6fv\u00CB\u00ACe\u0085\u00B2\u00FE\u00C5n\u008B\u00B7/\x1E\u0095\x07\u00C9k\u00B3\u0090\u00AC\x05Y-\n\u00B6B\u00A6\u00E8TZ(\u00D7*\x07\u00B2geWf\u00BF\u00CD\u0089\u00CA9\u0096\u00AB\u009E+\u00CD\u00ED\u00CC\u00B3\u00CA\u00DB\u00907\u009C\u00EF\u009F\u00FF\u00ED\x12\u00C2\x12\u00E1\u0092\u00B6\u00A5\u0086KW-\x1DX\u00E6\u00BD\u00ACj9\u00B2<qy\u00DB\n\u00E3\x15\x05+\u0086V\x06\u00AC<\u00B8\u008A\u00B6*m\u00D5O\u00AB\u00EDW\u0097\u00AE~\u00BD&zMk\u0081^\u00C1\u00CA\u0082\u00C1\u00B5\x01k\u00EB\x0BU\n\u00E5\u0085}\u00EB\u00DC\u00D7\u00ED]OX/Y\u00DF\u00B5a\u00FA\u0086\u009D\x1B>\x15\u0089\u008A\u00AE\x14\u00DB\x17\u0097\x15\x7F\u00D8(\u00DCx\u00E5\x1B\u0087o\u00CA\u00BF\u0099\u00DC\u0094\u00B4\u00A9\u00AB\u00C4\u00B9d\u00CFf\u00D2f\u00E9\u00E6\u00DE-\u009E[\x0E\u0096\u00AA\u0097\u00E6\u0097\x0En\r\u00D9\u00DA\u00B4\r\u00DFV\u00B4\u00ED\u00F5\u00F6E\u00DB/\u0097\u00CD(\u00DB\u00BB\u0083\u00B6C\u00B9\u00A3\u00BF<\u00B8\u00BCe\u00A7\u00C9\u00CE\u00CD;?T\u00A4T\u00F4T\u00FAT6\u00EE\u00D2\u00DD\u00B5a\u00D7\u00F8n\u00D1\u00EE\x1B{\u00BC\u00F64\u00EC\u00D5\u00DB[\u00BC\u00F7\u00FD>\u00C9\u00BE\u00DBU\x01UM\u00D5f\u00D5e\u00FBI\u00FB\u00B3\u00F7?\u00AE\u0089\u00AA\u00E9\u00F8\u0096\u00FBm]\u00ADNmq\u00ED\u00C7\x03\u00D2\x03\u00FD\x07#\x0E\u00B6\u00D7\u00B9\u00D4\u00D5\x1D\u00D2=TR\u008F\u00D6+\u00EBG\x0E\u00C7\x1F\u00BE\u00FE\u009D\u00EFw-\r6\rU\u008D\u009C\u00C6\u00E2#pDy\u00E4\u00E9\u00F7\t\u00DF\u00F7\x1E\r:\u00DAv\u008C{\u00AC\u00E1\x07\u00D3\x1Fv\x1Dg\x1D/jB\u009A\u00F2\u009AF\u009BS\u009A\u00FB[b[\u00BAO\u00CC>\u00D1\u00D6\u00EA\u00DEz\u00FCG\u00DB\x1F\x0F\u009C4<YyJ\u00F3T\u00C9i\u00DA\u00E9\u0082\u00D3\u0093g\u00F2\u00CF\u008C\u009D\u0095\u009D}~.\u00F9\u00DC`\u00DB\u00A2\u00B6{\u00E7c\u00CE\u00DFj\x0Fo\u00EF\u00BA\x10t\u00E1\u00D2E\u00FF\u008B\u00E7;\u00BC;\u00CE\\\u00F2\u00B8t\u00F2\u00B2\u00DB\u00E5\x13W\u00B8W\u009A\u00AF:_m\u00EAt\u00EA<\u00FE\u0093\u00D3O\u00C7\u00BB\u009C\u00BB\u009A\u00AE\u00B9\\k\u00B9\u00EEz\u00BD\u00B5{f\u00F7\u00E9\x1B\u009E7\u00CE\u00DD\u00F4\u00BDy\u00F1\x16\u00FF\u00D6\u00D5\u009E9=\u00DD\u00BD\u00F3zo\u00F7\u00C5\u00F7\u00F5\u00DF\x16\u00DD~r'\u00FD\u00CE\u00CB\u00BB\u00D9w'\u00EE\u00AD\u00BCO\u00BC_\u00F4@\u00EDA\u00D9C\u00DD\u0087\u00D5?[\u00FE\u00DC\u00D8\u00EF\u00DC\x7Fj\u00C0w\u00A0\u00F3\u00D1\u00DCG\u00F7\x06\u0085\u0083\u00CF\u00FE\u0091\u00F5\u008F\x0FC\x05\u008F\u0099\u008F\u00CB\u0086\r\u0086\u00EB\u009E8>99\u00E2?r\u00FD\u00E9\u00FC\u00A7C\u00CFd\u00CF&\u009E\x17\u00FE\u00A2\u00FE\u00CB\u00AE\x17\x16/~\u00F8\u00D5\u00EB\u00D7\u00CE\u00D1\u0098\u00D1\u00A1\u0097\u00F2\u0097\u0093\u00BFm|\u00A5\u00FD\u00EA\u00C0\u00EB\x19\u00AF\u00DB\u00C6\u00C2\u00C6\x1E\u00BE\u00C9x31^\u00F4V\u00FB\u00ED\u00C1w\u00DCw\x1D\u00EF\u00A3\u00DF\x0FO\u00E4| \x7F(\u00FFh\u00F9\u00B1\u00F5S\u00D0\u00A7\u00FB\u0093\x19\u0093\u0093\u00FF\x04\x03\u0098\u00F3\u00FCc3-\u00DB\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\x02/IDATx\u00DA\u00A4\u0093MK\u00D4Q\x14\u00C6\x7F\u00F7?3\u0095\x14h/\u00A6\u008B\u00C1\u0082\x16E\x10\u00B4\u00CBo\u0090X\u00D1\u00A6\u0097Uc$.\u0082\u00C0h\u00D3\u00B7p\x15\u00A5\u00B9+\u008A\x1C[\u00D6\x07\b\u00B1E\u00AD\u00A4\u00A8p\x19)YQi\f\u00EA=o-\u00FE3\u0083\u00AD\u00BBp\u00B9gq\u00CE\u00F3\u009C\u00E7\u009C\u00E7\u00A6\u0088\u00E0\x7FNull\u00AC\x13\u00A7\u00BB\u0093\u0093\x0E@\x074\u0082p\u00A7C\u00E2\u00EDxjf\u00A6\x068\x10\u00D5\u009D\u00C5C\u00F5:a\u00C6N\x10\u00B7\x0E@\x10m\u00C0;\x13\x1325;\u00DB\x03H\u00F1O\u00B1;[\u00DF\x7F\u00B0|\x7F\x1Aw\u00C7\u00CC\u00DB\u00AC\u00CE\u00D2\u00F4C\u00B66\u00FE\u0080;\u00F5\u0081An\u008F\u008Fo\x02\u00BB\n u[5\u00E3\u00F3\u00FCs\x06GGP5\u00CC\u00AC\u00CB|d\u00E4,\u00EF\u009F<%\u008B\u00A0\u00AA\u00B89@O\x15(\u00882\u00C9\u00A3\x14\u00D6\u00FA\u00BAF\u00E5P?E\u0091\u0088\u0094\u00C0\u0083\u00D6\u00DA7\x02\u00D0\u009CI\x01\u00E1\u00D6\x05H\u00ED\t\x11f\u0088;\u0095\u00BE>\u00DC\u008C\u00E4\tR\u00C2\u00C3\u00A9\u00F5\u00F6b\u00E1log\u00AAE\u0081e\x01\u00A8\x15@r3\u00DC\u009Cw3\u00B3\f]\u00BE\u00C4\u00EE\u0081\u00C3\u0084\x1Bn\u00A5\f\x13eO\u00FFA\u008E\u008D\u008E\u00B2\u00D4\u009CGsFU\x01*EI\x1ED8'n\\gy\u00AEIke\x15\x17\u00C3U1UB\u0095\u008D\u0095U>\u00BCx\u00C9\u00C9\u00F3\u00E70U\\\u00CBmU\u00CB\u008D9nF\u0098\u00A1\x11\u0098\x19\u00EEFjo3\u00DCp5$\u00C0T\u00B1\b\\\x05 \u0095>\u00F0\x00\x0F<\u0082\u00EC\u008E\u00A9\u0095\u00CC\x11\x14\x01f\u008A\u00AA\"\u00EE\u00E8v\u00A6\x00L\u0094\u00AE\u0091J\u00BDJ\u00E4\u00CC\u00B6\x07jJ\u00A8`\x01fN\u00B8#\"h\x04*B%%\u00AC\u00EC\u0080\u00EE\f:6=u\u00F1\x02\u009F^- Y\u00B0\u009Cq)\u00DF\u008Fo\u00DEr|x\u0098P\u00C5D:3\u0088\u00D4h4j\u00C0\u00DE[\u00D7\x1A\u00BF\x06\u00F7\x1F@r&\u00E7\u008C\u009BP\x04\u0084Z\u00D9A\u00CE\u0088*\u00A6\u00C6\u00CF\u00F5\u00DF<[\\8\r\u00ACW\u0081\x00\u00EC\u00DE\u00E3G\u00F5\u009BW\u00AE~\x11U\\\u00A4\x1C\u00AA\x07\u0098\u00E1\u00EE\u00A5\u00FBT\u0089p\u009A\u00AF\x17\u00CF\x00\x02H\u00B5\u00FD\u00AB\x04\u00D8|\u00D0\u009C;\n\u00EC\x03jmy\u00DE\u00BE\x1D\u00B9\u00C5\u008E\u00FC\x16\u00B0\u00F9w\x00\u00D7F\u00C9\u0098\u00FD\u00C9Z&\x00\x00\x00\x00IEND\u00AEB`\u0082");
        
        // Формируем данные в левом окне
        function _buildTree () {
            var func = [], prop = [], prop_str = [];
            var p ='', i=0, max = 0, maxp=0, maxf=0, valueof_p = '', typeof_p = '';
            var t = {}; // Сюда будем строить наше дерево...
            // В конце востановим выделение (если было)
            var mySel = (myTree.selection !== null) ? { type:myTree.selection.type,  index:myTree.selection.index } : null;
            if (hrefObj === undefined) { hrefObj = "undefined"; } // На всякий случай, в принципе - не нужно...
            for (p in hrefObj) {
                try { 
                    typeof_p = (hrefObj[p].constructor.name) || _classof(hrefObj[p]);
                    if ( typeof_p == 'Function' ) {
                        func.push( p + '()' );
                    } else {
                        if (hrefObj.reflect.find(p).isCollection) {
                            typeof_p = _classof(hrefObj[p]);
                            i = typeof_p.search(/\]/);
                            valueof_p = " Collection of " + ( ( i == -1 ) ? typeof_p : typeof_p.substr(0, i) );                       
                            typeof_p = 'Collection';
                        } else { // p != 'Collection' 
                            valueof_p = " = " + hrefObj[p].toString();
                            //$.writeln (valueof_p.substr(3, 7));
                            if  ( (valueof_p == " = undefined")||(valueof_p.substr(3, 7) == "[object") ) { 
                                valueof_p = "";
                            } else { 
                                if (valueof_p == " = ") { valueof_p = " is empty" 
                                } else {
                                    if (valueof_p.length > 30) { valueof_p = valueof_p.substr(0, 30) + "..." }
                                }
                            }  
                        } 
                        prop.push ( p + ' [' + typeof_p + ']' + valueof_p);
                    } // else ( typeof_p != 'Function' )
                } catch (e) {
                    prop.push ( p + ' [Unknown]');
                }
            } //  for (p in hrefObj)
            prop.sort();
            func.sort();
            myTree.visible = false; // Боремся с мерцанием (нормально работает если цвет родительского контейнера белый)
            myTree.removeAll();
            try {
                typeof_p = (hrefObj.constructor.name) || _classof(hrefObj);
            } catch (e) { typeof_p = 'Unknown' } 
            
            var t = myTree.add('node', "[" + typeof_p + "]");
            t.image = icons._class; 

            for (i=0, maxp = prop.length; i<maxp; i++) {
                p = prop[i].substr(0, prop[i].search(/\s\[/ ));
                t.add("item", prop[i]);
                try {
                     hrefObj[p]; // проверка на вшивость, если p неопределено - получим исключение и попадём в блок catch (e)
                     if  (hrefObj.reflect.find(p).type == 'readwrite') {
                        t.items[i].image =  icons._prop_rw;
                    } else {
                        t.items[i].text = prop[i] + " (Read only)";
                        t.items[i].image = icons._prop_ro;
                    }
                } catch (e) {
                        t.items[i].image = icons._prop_ro;
                }
            }
            for (i=0, maxf = func.length; i<maxf; i++) {
                t.add ( "item", func[i]);
                t.items[i+maxp].image = icons._method; 
            }
            func.length = 0;
            // получим список статический функций объекта
            func = hrefObj.reflect.staticMethods;
            for (i=0; i<func.length; i++) {
                t.add ( "item", func[i] +"() static");
                t.items[i+maxp + maxf].image = icons._method_static; 
            }
            t.expanded = true;
           // Освобождаем память из под массивов
           prop.length = func.length = 0;
            if (mySel !== null) {
                if (mySel.type == 'node') {
                    myTree.selection = myTree.items[0];
                } else { 
                    myTree.selection = myTree.items[0].items[mySel.index]; 
                }
            }
           myTree.visible = true;
           _buildEdit();
        }
        
        // Формируем данные в правом окне
        function _buildEdit() {
            // Если в myTree не выбрано ничего - считаем что выбран корневой элемент
            var prop = ( myTree.selection === null ) ? new String(myTree.items[0].text) : new String(myTree.selection.text);
            prop = (prop.search(/\s\[/) == -1) ? prop.substr(0, prop.search (/\(\)/)) : prop.substr(0, prop.search(/\s\[/)); // чистим от мусора нахлобученного в myTree
            var txt = "";       // сюда формируем весь вывод в myEdit
            var _obj = null; // сюда получаем объект/свойство, выбранное в myTree
            if (prop == '') {
                _obj = hrefObj;
            } else {
                try {
                    _obj = hrefObj[prop];
                } catch (e) {
                    txt = "Зафиксирова сбой чтения свойства " + prop + 
                            ".\r--------------------------------------------------------------\rПричина: " + e.description;
                    myEdit.text = txt;
                    myCaption.text = _classof(hrefObj) + "." + prop + " = undefined";
                    pCaption.layout.resize();                
                    return;
                }            
            }
            var txt = "Reflection Info:\r-------------------------------";
            if (prop == '') {
                    if (_obj.reflect.name !== undefined) txt = txt + "\r    Class: " + _obj.reflect.name;
                    if (_obj.reflect.description !== undefined) txt = txt + "\r    Description: " + _obj.reflect.description;
                    if (_obj.reflect.help !== undefined) txt = txt + "\r    Help: " + _obj.reflect.help;
                    if (_obj.reflect.sampleCode !== undefined) txt = txt + "\r    Sample code: " + _obj.reflect.sampleCode;
                    if (_obj.reflect.sampleFile !== undefined) txt = txt + "\r    Sample file: " + _obj.reflect.sampleFile;
            } else {
                txt = txt + "\r    Name: " + hrefObj.reflect.find(prop).name;
                if ( hrefObj[prop] instanceof Array ) {
                    txt = txt + "\r    Type: " + "Array";
                } else {
                    txt = txt + "\r    Type: " + hrefObj.reflect.find(prop).dataType;
                }
                txt = txt + "\r    Description: " + hrefObj.reflect.find(prop).description;
                txt = txt + "\r    Help string: " + hrefObj.reflect.find(prop).help;
                if  (_obj instanceof Function) { // что-то тут нето ...
                    try {
                        txt = txt + "\r    Arguments: " + hrefObj.reflect.find(prop).arguments.length;
                    } catch(e)  { txt = txt + "\r    Arguments: [Зафиксирован сбой чтения своства. Причина: " + e.description + "]" }
                } else {
                    txt = txt + "\r    isCollection: " + hrefObj.reflect.find(prop).isCollection;
                    txt = txt + "\r    Value (default): " + hrefObj.reflect.find(prop).defaultValue;
                    txt = txt + "\r    Value (min): " + hrefObj.reflect.find(prop).min;
                    txt = txt + "\r    Value (max): " + hrefObj.reflect.find(prop).max;
                }
                    txt = txt + "\r    Changeable: ( " + hrefObj.reflect.find(prop).type + " )";
            }
            if (hrefObj[prop] instanceof Function) {
                txt = txt + "\r\rFunction definition:\r-------------------------------\r" + hrefObj[prop];
            } else { // hrefObj[prop] not a Function
                if (_obj !== undefined) {
                    var info = [],       // массив свойств объекта, получаемых через его ReflectionInfo интерфейс
                           p, tx;             // вспомогательные строки 
                    txt = txt + "\r\rAdditional properties info:\r    Properties:\r    ---------------------------";
                    info = _obj.reflect.properties;
                    info.sort();
                    for (p in info) {
                        try {
                            if ( info[p] != 'source') { // маленький патч (что бы не выплювывал целые файлв в edittext).
                                if (info[p].length <=8) tx = "\t\t"; else tx = "\t";
                                txt = txt + "\r    " + info[p] + tx + ( ( info[p] == 'fileName') ? File.decode( _obj[info[p]] ) : _obj[info[p]].toString() ); // ещё один патч для понятного представления путей и имён файлов
                            }
                        } catch(e) { txt = txt + "\r    " + info[p] + "\t[Зафиксирован сбой чтения своства. Причина: " + e.description + "]"}
                    }
                    info.length = 0; // Освободили память от теперь уже не нужных данных
                    txt = txt + "\r    ---------------------------\r    Methods:\r    ---------------------------";
                    info = _obj.reflect.methods;
                    info.sort();
                    for (p in info) {
                        try {
                            if (info[p].length <=8) tx = "\t\t"; else tx = "\t";
                            txt = txt + "\r    " + info[p] + "()";
                        } catch(e) { txt = txt + "\r    " + info[p] + "\t[Зафиксирован сбой чтения своства. Причина: " + e.description + "]"}
                    }
                     txt = txt + "\r\rtoString() returned:\r-------------------------------\r" + _obj.toString();
                 } else {
                     txt = txt + "\r\rProperty '" + prop + "' is Undefined.";
                 }
                 info.length = 0; // Освободили память от теперь уже не нужных данных;
            }  //if (_obj instanceof Function) else
            myEdit.text = txt;
            _buildCaption(_obj);
        } // _buildEdit (p)

        // Формирование строки в pCaption (вызывается из _buildEdit)
        function _buildCaption(_obj) {
            var typeof_obj = (_obj.constructor.name) || _classof(_obj);
            var valueof_obj;
            switch ( typeof_obj ) {
                case 'Array':
                    valueof_obj = "length = " + _obj.length + ", value = [" +_obj.toString().replace (/','/g, ", ") + "]";
                    break;                    
                case 'Function':
                    var prop = new String(myTree.selection);
                    prop = prop.substr(0, prop.search (/\(\)/));
                    valueof_obj = prop + " " + _obj.toString().slice(_obj.toString().search (/\(/), _obj.toString().search (/\)/)+1 ) + " { ... }";
                    break;
                case 'String':
                case 'Number':
                case 'Boolean':
                case 'UnitValue':
                default:
                    valueof_obj = "= " + _obj;
            }           
            myCaption.text =  "[" + typeof_obj + "] " + valueof_obj;
            pCaption.layout.resize(); // нужно чтобы адаптировать statictext под новую длинну строки...
        }
            
        // При двойном клике по TreeView слева - создаём и показываем новый BaseObjectBrowser с выбранным объёктом из списка
        // К сожелению, новое окно сразу после открытия спрячется под текущее (как оставить новое окно активным, пока не знаю...)
        function  _newObjectBrowser () {
            if (myTree.selection.type == 'node') return;  // Если клик был по 0 узлу ( вызов нового BaseObjectBrowser() не произойдёт )
            var prop = new String (myTree.selection.text);
            prop = (prop.search(/\s\[/) == -1) ? prop.substr(0, prop.search (/\(\)/)) : prop.substr(0, prop.search(/\s\[/)); // чистим от мусора, нахлабученнjго в _buildTree
            var myBrowser = new BaseObjectBrowser(this.type); // создаём окно того же типа что и текущее
            myBrowser.show(hrefObj[prop]);
            // Выдвинем окно из под нашего:
            myBrowser.getMainWin().bounds = w.bounds; // уравняем размер, иначе оно всё равно останется скрыто...
            myBrowser.getMainWin().location = [ w.location[0] + 30, w.location[1] + 30 ]; // подвинем вправо-вниз
        }
        ///////////////////////////////////////////////////////
        // Вспомогательнае функции. Перенесены сюда из других моих библиотек
        // Возвращает строку с именем класса объекта Obj.
        function _classof (Obj) {
            switch (Obj) {
                case undefined: return "Undefined";
                case null: return "Null";
            }
            return Object.prototype.toString.call(Obj).slice(8,-1);
        }
        ///////////////////////////////////////////////////////
        
        // Публичные методы и свойства
        this.getMainWin = function() { return w; } // Важно, используется в _newObjectBrowser() для масштабирования окна потомка
        this.close = function() { return w.close(); };
        this.hide = function() { return w.hide(); };    

        // Основной метод - чтобы просмотреть свойства объекта - его нужно передать методу show() объекта BaseObjectBrowser
        this.show = function(Obj) {
            hrefObj = (Obj === undefined) ? "undefined" : Obj; // способ hrefObj = (Obj) || "undefined"; нулевое значение Obj приравнивал к undefined, что неверно!
            if (this.type == 'palette') {
                _buildTree ();
                return w.show();
            } else {
                // Ход конём: если мы 'Dialog' и для нас ещё ни разу небыло вызвано show() значит спокойно выполняем...
                if (counts == 0) {
                    counts += 1;
                    _buildTree ();
                    return w.show();
                } else {
                    // ... иначе вызов w.show() привёл бы к исключению, так как метод hide() для диалога, работает так же как и close() для окна - уничтожает окно и 
                    // освобождает всё память от его структур (для palette это не так, поэтому мы можем делать w.hide()/w.show() без ограничений.
                    // Поэтому для дилого нам прийдётся создать новый BaseObjectBrowser, так как старое окно w сейчас уже не существует а пересоздавать его сдесь -
                    // нет ни малейшего желания:
                    var myBrowser = new BaseObjectBrowser(this.type); // создаём окно того же типа что и текущее
                    return myBrowser.show(Obj);
                    // П.С. изначально я предполагал что тут могла бы быть утечка памяти, но поскольку мы тут, а значит тип главного окна 'dialog' - то всё ок! Окно
                    // будет корректно уничтожено сборщиком мусора! (В отличии от окон dialog - окна 'palette' продолжают висеть в памяти всё время, пока их не
                    // прибить явно с помощью w.close() )
                }
            }
        }
    }; // BaseObjectBrowser


    // Идея: добавить интерфейс вроде Data Provaider, чтобы можно было однажды в скрипте сделать так:
    //      myObjectBrowser.attach(someObj);
    // и окно браузера обновлялось бы автоматически при каждом изменении объекта...
    //~ BaseObjectBrowser.attach = function (objBrowser, propName) { 
    //~     // Не рабочий вариант!
    //~     var context = this;
    //~     context.watch ( propName, { f:function (propName, oldValue, newValue) {
    //~                                                     //$.writeln(propName);
    //~                                                     try { 
    //~                                                         context[propName] = newValue;
    //~                                                         objBrowser.show(context[propName]);
    //~                                                     } catch (e) { 
    //~                                                         var err = "Произошла ошибка при присвоении свойству " + propName + " значения: " + newValue +
    //~                                                                         "\rСтарое значение: " + oldValue + "\rОписание ошибки: " + e.description;
    //~                                                         objBrowser.show(err);
    //~                                                     }
    //~                                                  }
    //~                                              }
    //~                            );
    //~ }
    return function(wtype) { return new BaseObjectBrowser(wtype); }
}());