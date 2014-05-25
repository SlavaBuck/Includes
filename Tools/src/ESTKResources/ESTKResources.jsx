// --------------------------------------------------------------
// @@@BUILDINFO@@@ ESTKResources.jsx 2.10 Fri May 23 2014 21:39:09 GMT+0300
// Обзор ESTK констант
// --------------------------------------------------------------
// © Вячеслав aka Buck, 2014. slava.boyko#hotmail.com

(function() {
    
    #include "../../../SimpleUI/UIColors.jsx"
    #include "../../../SimpleUI/ESTKLib.jsx"
    #include "../../../PNGLib.jsx"
    
try {
    var app = {};
    app.name = "QTestManager";
    app.version = "2.10";
    app.caption = app.name + " v"+ app.version;
        
   
    // Установка типа диалога
    // -------------------------------------
    var dlgtype = "palette";
    
    // Нострайка локальных ссылок 
    // -------------------------------------
    var image = ESTKLib.getImage;
    // Поправка для JSXBIN
    // --   /c/Program Files (x86)/Adobe/Adobe InDesign CS6/Scripts/Scripts Panel/Include/Tools/contrib/ESTKResources/res/icons/
    //      IOError: File or folder does not exist
    // --   /c/Program Files (x86)/Adobe/Adobe InDesign CS6/Scripts/Scripts Panel/Include/SimpleUI/res/icons/    
    if (image.iconsFolder.indexOf("ESTKResources") != -1) {
        image.iconsFolder = image.iconsFolder.replace (/Tools\/contrib\/ESTKResources/, "SimpleUI");
    };
    
    //var image = ScriptUI.newImage;
     
    // Рисуем основное окно;
    var w = new Window (dlgtype +" { margins:[10,10,10,5], spacing:5 }"); 
    w.txt = app.caption;

    // Оформляем заголовок
    var pCaption = w.add("group { orientation:'row', margins:[0,0,0,0], spacing:10, alignment:'fill', alignChildren:['left','top'], \
                                                    txtgrp:Group { orientation:'column', margins:[0,0,0,0], spacing:0, alignment:['fill', 'center'], alignChildren:['left','top'], \
                                                              txtrow1:Group { orientation:'row', margins:[0,0,0,0], spacing:0, alignment:['fill', 'fill'], alignChildren:['left','bottom'] },\
                                                              txtrow2:Group { orientation:'column', margins:[0,0,0,0], spacing:3, alignment:['fill', 'fill'], alignChildren:['fill','fill'] } \
                                                           }\
                                      } ");
    //~ var gr = c.txtgrp.txtrow1.add("iconbutton", undefined, File(ICONS.iconsFolder + "ESToolkit.png"),  {style: "toolbutton", toggle: false} );
    //~ gr.enabled = false;
    var cp1 = pCaption.txtgrp.txtrow1.add("statictext { text:'ESTK'}");
    var cp2 = pCaption.txtgrp.txtrow1.add("statictext { text:'UI'}");
    var cp3 = pCaption.txtgrp.txtrow1.add("statictext { text:'resources'}");
    var cp4 = pCaption.txtgrp.txtrow1.add("statictext { text:'"+app.version+"', alignment:['left','top'] }");

    cp1.graphics.font = cp2.graphics.font = cp3.graphics.font = ScriptUI.newFont ("Helvetica", "Bold", 25);
    cp4.graphics.font = ScriptUI.newFont ("Verdana", "Bold", 14);
    cp4.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, cSlateGray, 1);
    cp2.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, cRed, 1);

    var sp1 = pCaption.txtgrp.txtrow2.add("panel { alignment:['fill','top'], margins:[0,0,0,0], properties: { borderStyle:'gray' } }");
    var sp2 = pCaption.txtgrp.txtrow2.add("panel { alignment:['fill','bottom'], margins:[0,0,0,0], properties: { borderStyle:'gray' } }");
           sp1.minimumSize[1] = sp1.maximumSize[1] = 4;
           sp1.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR, cLightSlateGray, 1);
           sp2.minimumSize[1] = sp2.maximumSize[1] = 1;
           sp2.graphics.backgroundColor = w.graphics.newBrush (w.graphics.BrushType.SOLID_COLOR, cGray, 1);
   //var QUERYALERT = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x06\x00\x00\x00szz\u00F4\x00\x00\x00\tpHYs\x00\x00\x0B\x13\x00\x00\x0B\x13\x01\x00\u009A\u009C\x18\x00\x00\nOiCCPPhotoshop ICC profile\x00\x00x\u00DA\u009DSgTS\u00E9\x16=\u00F7\u00DE\u00F4BK\u0088\u0080\u0094KoR\x15\b RB\u008B\u0080\x14\u0091&*!\t\x10J\u0088!\u00A1\u00D9\x15Q\u00C1\x11EE\x04\x1B\u00C8\u00A0\u0088\x03\u008E\u008E\u0080\u008C\x15Q,\f\u008A\n\u00D8\x07\u00E4!\u00A2\u008E\u0083\u00A3\u0088\u008A\u00CA\u00FB\u00E1{\u00A3k\u00D6\u00BC\u00F7\u00E6\u00CD\u00FE\u00B5\u00D7>\u00E7\u00AC\u00F3\u009D\u00B3\u00CF\x07\u00C0\b\f\u0096H3Q5\u0080\f\u00A9B\x1E\x11\u00E0\u0083\u00C7\u00C4\u00C6\u00E1\u00E4.@\u0081\n$p\x00\x10\b\u00B3d!s\u00FD#\x01\x00\u00F8~<<+\"\u00C0\x07\u00BE\x00\x01x\u00D3\x0B\b\x00\u00C0M\u009B\u00C00\x1C\u0087\u00FF\x0F\u00EAB\u0099\\\x01\u0080\u0084\x01\u00C0t\u00918K\b\u0080\x14\x00@z\u008EB\u00A6\x00@F\x01\u0080\u009D\u0098&S\x00\u00A0\x04\x00`\u00CBcb\u00E3\x00P-\x00`'\x7F\u00E6\u00D3\x00\u0080\u009D\u00F8\u0099{\x01\x00[\u0094!\x15\x01\u00A0\u0091\x00 \x13e\u0088D\x00h;\x00\u00AC\u00CFV\u008AE\x00X0\x00\x14fK\u00C49\x00\u00D8-\x000IWfH\x00\u00B0\u00B7\x00\u00C0\u00CE\x10\x0B\u00B2\x00\b\f\x000Q\u0088\u0085)\x00\x04{\x00`\u00C8##x\x00\u0084\u0099\x00\x14F\u00F2W<\u00F1+\u00AE\x10\u00E7*\x00\x00x\u0099\u00B2<\u00B9$9E\u0081[\b-q\x07WW.\x1E(\u00CEI\x17+\x146a\x02a\u009A@.\u00C2y\u0099\x192\u00814\x0F\u00E0\u00F3\u00CC\x00\x00\u00A0\u0091\x15\x11\u00E0\u0083\u00F3\u00FDx\u00CE\x0E\u00AE\u00CE\u00CE6\u008E\u00B6\x0E_-\u00EA\u00BF\x06\u00FF\"bb\u00E3\u00FE\u00E5\u00CF\u00ABp@\x00\x00\u00E1t~\u00D1\u00FE,/\u00B3\x1A\u0080;\x06\u0080m\u00FE\u00A2%\u00EE\x04h^\x0B\u00A0u\u00F7\u008Bf\u00B2\x0F@\u00B5\x00\u00A0\u00E9\u00DAW\u00F3p\u00F8~<<E\u00A1\u0090\u00B9\u00D9\u00D9\u00E5\u00E4\u00E4\u00D8J\u00C4B[a\u00CAW}\u00FEg\u00C2_\u00C0W\u00FDl\u00F9~<\u00FC\u00F7\u00F5\u00E0\u00BE\u00E2$\u00812]\u0081G\x04\u00F8\u00E0\u00C2\u00CC\u00F4L\u00A5\x1C\u00CF\u0092\t\u0084b\u00DC\u00E6\u008FG\u00FC\u00B7\x0B\u00FF\u00FC\x1D\u00D3\"\u00C4Ib\u00B9X*\x14\u00E3Q\x12q\u008ED\u009A\u008C\u00F32\u00A5\"\u0089B\u0092)\u00C5%\u00D2\u00FFd\u00E2\u00DF,\u00FB\x03>\u00DF5\x00\u00B0j>\x01{\u0091-\u00A8]c\x03\u00F6K'\x10Xt\u00C0\u00E2\u00F7\x00\x00\u00F2\u00BBo\u00C1\u00D4(\b\x03\u0080h\u0083\u00E1\u00CFw\u00FF\u00EF?\u00FDG\u00A0%\x00\u0080fI\u0092q\x00\x00^D$.T\u00CA\u00B3?\u00C7\b\x00\x00D\u00A0\u0081*\u00B0A\x1B\u00F4\u00C1\x18,\u00C0\x06\x1C\u00C1\x05\u00DC\u00C1\x0B\u00FC`6\u0084B$\u00C4\u00C2B\x10B\nd\u0080\x1Cr`)\u00AC\u0082B(\u0086\u00CD\u00B0\x1D*`/\u00D4@\x1D4\u00C0Qh\u0086\u0093p\x0E.\u00C2U\u00B8\x0E=p\x0F\u00FAa\b\u009E\u00C1(\u00BC\u0081\t\x04A\u00C8\b\x13a!\u00DA\u0088\x01b\u008AX#\u008E\b\x17\u0099\u0085\u00F8!\u00C1H\x04\x12\u008B$ \u00C9\u0088\x14Q\"K\u00915H1R\u008AT UH\x1D\u00F2=r\x029\u0087\\F\u00BA\u0091;\u00C8\x002\u0082\u00FC\u0086\u00BCG1\u0094\u0081\u00B2Q=\u00D4\f\u00B5C\u00B9\u00A87\x1A\u0084F\u00A2\x0B\u00D0dt1\u009A\u008F\x16\u00A0\u009B\u00D0r\u00B4\x1A=\u008C6\u00A1\u00E7\u00D0\u00ABh\x0F\u00DA\u008F>C\u00C70\u00C0\u00E8\x18\x073\u00C4l0.\u00C6\u00C3B\u00B18,\t\u0093c\u00CB\u00B1\"\u00AC\f\u00AB\u00C6\x1A\u00B0V\u00AC\x03\u00BB\u0089\u00F5c\u00CF\u00B1w\x04\x12\u0081E\u00C0\t6\x04wB a\x1EAHXLXN\u00D8H\u00A8 \x1C$4\x11\u00DA\t7\t\x03\u0084Q\u00C2'\"\u0093\u00A8K\u00B4&\u00BA\x11\u00F9\u00C4\x18b21\u0087XH,#\u00D6\x12\u008F\x13/\x10{\u0088C\u00C47$\x12\u0089C2'\u00B9\u0090\x02I\u00B1\u00A4T\u00D2\x12\u00D2F\u00D2nR#\u00E9,\u00A9\u009B4H\x1A#\u0093\u00C9\u00DAdk\u00B2\x079\u0094, +\u00C8\u0085\u00E4\u009D\u00E4\u00C3\u00E43\u00E4\x1B\u00E4!\u00F2[\n\u009Db@q\u00A4\u00F8S\u00E2(R\u00CAjJ\x19\u00E5\x10\u00E54\u00E5\x06e\u00982AU\u00A3\u009AR\u00DD\u00A8\u00A1T\x115\u008FZB\u00AD\u00A1\u00B6R\u00AFQ\u0087\u00A8\x134u\u009A9\u00CD\u0083\x16IK\u00A5\u00AD\u00A2\u0095\u00D3\x1Ah\x17h\u00F7i\u00AF\u00E8t\u00BA\x11\u00DD\u0095\x1EN\u0097\u00D0W\u00D2\u00CB\u00E9G\u00E8\u0097\u00E8\x03\u00F4w\f\r\u0086\x15\u0083\u00C7\u0088g(\x19\u009B\x18\x07\x18g\x19w\x18\u00AF\u0098L\u00A6\x19\u00D3\u008B\x19\u00C7T071\u00EB\u0098\u00E7\u0099\x0F\u0099oUX*\u00B6*|\x15\u0091\u00CA\n\u0095J\u0095&\u0095\x1B*/T\u00A9\u00AA\u00A6\u00AA\u00DE\u00AA\x0BU\u00F3U\u00CBT\u008F\u00A9^S}\u00AEFU3S\u00E3\u00A9\t\u00D4\u0096\u00ABU\u00AA\u009DP\u00EBS\x1BSg\u00A9;\u00A8\u0087\u00AAg\u00A8oT?\u00A4~Y\u00FD\u0089\x06Y\u00C3L\u00C3OC\u00A4Q\u00A0\u00B1_\u00E3\u00BC\u00C6 \x0Bc\x19\u00B3x,!k\r\u00AB\u0086u\u00815\u00C4&\u00B1\u00CD\u00D9|v*\u00BB\u0098\u00FD\x1D\u00BB\u008B=\u00AA\u00A9\u00A19C3J3W\u00B3R\u00F3\u0094f?\x07\u00E3\u0098q\u00F8\u009CtN\t\u00E7(\u00A7\u0097\u00F3~\u008A\u00DE\x14\u00EF)\u00E2)\x1B\u00A64L\u00B91e\\k\u00AA\u0096\u0097\u0096X\u00ABH\u00ABQ\u00ABG\u00EB\u00BD6\u00AE\u00ED\u00A7\u009D\u00A6\u00BDE\u00BBY\u00FB\u0081\x0EA\u00C7J'\\'Gg\u008F\u00CE\x05\u009D\u00E7S\u00D9S\u00DD\u00A7\n\u00A7\x16M=:\u00F5\u00AE.\u00AAk\u00A5\x1B\u00A1\u00BBDw\u00BFn\u00A7\u00EE\u0098\u009E\u00BE^\u0080\u009ELo\u00A7\u00DEy\u00BD\u00E7\u00FA\x1C}/\u00FDT\u00FDm\u00FA\u00A7\u00F5G\fX\x06\u00B3\f$\x06\u00DB\f\u00CE\x18<\u00C55qo<\x1D/\u00C7\u00DB\u00F1QC]\u00C3@C\u00A5a\u0095a\u0097\u00E1\u0084\u0091\u00B9\u00D1<\u00A3\u00D5F\u008DF\x0F\u008Ci\u00C6\\\u00E3$\u00E3m\u00C6m\u00C6\u00A3&\x06&!&KM\u00EAM\u00EE\u009ARM\u00B9\u00A6)\u00A6;L;L\u00C7\u00CD\u00CC\u00CD\u00A2\u00CD\u00D6\u00995\u009B=1\u00D72\u00E7\u009B\u00E7\u009B\u00D7\u009B\u00DF\u00B7`ZxZ,\u00B6\u00A8\u00B6\u00B8eI\u00B2\u00E4Z\u00A6Y\u00EE\u00B6\u00BCn\u0085Z9Y\u00A5XUZ]\u00B3F\u00AD\u009D\u00AD%\u00D6\u00BB\u00AD\u00BB\u00A7\x11\u00A7\u00B9N\u0093N\u00AB\u009E\u00D6g\u00C3\u00B0\u00F1\u00B6\u00C9\u00B6\u00A9\u00B7\x19\u00B0\u00E5\u00D8\x06\u00DB\u00AE\u00B6m\u00B6}agb\x17g\u00B7\u00C5\u00AE\u00C3\u00EE\u0093\u00BD\u0093}\u00BA}\u008D\u00FD=\x07\r\u0087\u00D9\x0E\u00AB\x1DZ\x1D~s\u00B4r\x14:V:\u00DE\u009A\u00CE\u009C\u00EE?}\u00C5\u00F4\u0096\u00E9/gX\u00CF\x10\u00CF\u00D83\u00E3\u00B6\x13\u00CB)\u00C4i\u009DS\u009B\u00D3Gg\x17g\u00B9s\u0083\u00F3\u0088\u008B\u0089K\u0082\u00CB.\u0097>.\u009B\x1B\u00C6\u00DD\u00C8\u00BD\u00E4Jt\u00F5q]\u00E1z\u00D2\u00F5\u009D\u009B\u00B3\u009B\u00C2\u00ED\u00A8\u00DB\u00AF\u00EE6\u00EEi\u00EE\u0087\u00DC\u009F\u00CC4\u009F)\u009EY3s\u00D0\u00C3\u00C8C\u00E0Q\u00E5\u00D1?\x0B\u009F\u00950k\u00DF\u00AC~OCO\u0081g\u00B5\u00E7#/c/\u0091W\u00AD\u00D7\u00B0\u00B7\u00A5w\u00AA\u00F7a\u00EF\x17>\u00F6>r\u009F\u00E3>\u00E3<7\u00DE2\u00DEY_\u00CC7\u00C0\u00B7\u00C8\u00B7\u00CBO\u00C3o\u009E_\u0085\u00DFC\x7F#\u00FFd\u00FFz\u00FF\u00D1\x00\u00A7\u0080%\x01g\x03\u0089\u0081A\u0081[\x02\u00FB\u00F8z|!\u00BF\u008E?:\u00DBe\u00F6\u00B2\u00D9\u00EDA\u008C\u00A0\u00B9A\x15A\u008F\u0082\u00AD\u0082\u00E5\u00C1\u00AD!h\u00C8\u00EC\u0090\u00AD!\u00F7\u00E7\u0098\u00CE\u0091\u00CEi\x0E\u0085P~\u00E8\u00D6\u00D0\x07a\u00E6a\u008B\u00C3~\f'\u0085\u0087\u0085W\u0086?\u008Ep\u0088X\x1A\u00D11\u00975w\u00D1\u00DCCs\u00DFD\u00FAD\u0096D\u00DE\u009Bg1O9\u00AF-J5*>\u00AA.j<\u00DA7\u00BA4\u00BA?\u00C6.fY\u00CC\u00D5X\u009DXIlK\x1C9.*\u00AE6nl\u00BE\u00DF\u00FC\u00ED\u00F3\u0087\u00E2\u009D\u00E2\x0B\u00E3{\x17\u0098/\u00C8]py\u00A1\u00CE\u00C2\u00F4\u0085\u00A7\x16\u00A9.\x12,:\u0096@L\u0088N8\u0094\u00F0A\x10*\u00A8\x16\u008C%\u00F2\x13w%\u008E\ny\u00C2\x1D\u00C2g\"/\u00D16\u00D1\u0088\u00D8C\\*\x1EN\u00F2H*Mz\u0092\u00EC\u0091\u00BC5y$\u00C53\u00A5,\u00E5\u00B9\u0084'\u00A9\u0090\u00BCL\rL\u00DD\u009B:\u009E\x16\u009Av m2=:\u00BD1\u0083\u0092\u0091\u0090qB\u00AA!M\u0093\u00B6g\u00EAg\u00E6fv\u00CB\u00ACe\u0085\u00B2\u00FE\u00C5n\u008B\u00B7/\x1E\u0095\x07\u00C9k\u00B3\u0090\u00AC\x05Y-\n\u00B6B\u00A6\u00E8TZ(\u00D7*\x07\u00B2geWf\u00BF\u00CD\u0089\u00CA9\u0096\u00AB\u009E+\u00CD\u00ED\u00CC\u00B3\u00CA\u00DB\u00907\u009C\u00EF\u009F\u00FF\u00ED\x12\u00C2\x12\u00E1\u0092\u00B6\u00A5\u0086KW-\x1DX\u00E6\u00BD\u00ACj9\u00B2<qy\u00DB\n\u00E3\x15\x05+\u0086V\x06\u00AC<\u00B8\u008A\u00B6*m\u00D5O\u00AB\u00EDW\u0097\u00AE~\u00BD&zMk\u0081^\u00C1\u00CA\u0082\u00C1\u00B5\x01k\u00EB\x0BU\n\u00E5\u0085}\u00EB\u00DC\u00D7\u00ED]OX/Y\u00DF\u00B5a\u00FA\u0086\u009D\x1B>\x15\u0089\u008A\u00AE\x14\u00DB\x17\u0097\x15\x7F\u00D8(\u00DCx\u00E5\x1B\u0087o\u00CA\u00BF\u0099\u00DC\u0094\u00B4\u00A9\u00AB\u00C4\u00B9d\u00CFf\u00D2f\u00E9\u00E6\u00DE-\u009E[\x0E\u0096\u00AA\u0097\u00E6\u0097\x0En\r\u00D9\u00DA\u00B4\r\u00DFV\u00B4\u00ED\u00F5\u00F6E\u00DB/\u0097\u00CD(\u00DB\u00BB\u0083\u00B6C\u00B9\u00A3\u00BF<\u00B8\u00BCe\u00A7\u00C9\u00CE\u00CD;?T\u00A4T\u00F4T\u00FAT6\u00EE\u00D2\u00DD\u00B5a\u00D7\u00F8n\u00D1\u00EE\x1B{\u00BC\u00F64\u00EC\u00D5\u00DB[\u00BC\u00F7\u00FD>\u00C9\u00BE\u00DBU\x01UM\u00D5f\u00D5e\u00FBI\u00FB\u00B3\u00F7?\u00AE\u0089\u00AA\u00E9\u00F8\u0096\u00FBm]\u00ADNmq\u00ED\u00C7\x03\u00D2\x03\u00FD\x07#\x0E\u00B6\u00D7\u00B9\u00D4\u00D5\x1D\u00D2=TR\u008F\u00D6+\u00EBG\x0E\u00C7\x1F\u00BE\u00FE\u009D\u00EFw-\r6\rU\u008D\u009C\u00C6\u00E2#pDy\u00E4\u00E9\u00F7\t\u00DF\u00F7\x1E\r:\u00DAv\u008C{\u00AC\u00E1\x07\u00D3\x1Fv\x1Dg\x1D/jB\u009A\u00F2\u009AF\u009BS\u009A\u00FB[b[\u00BAO\u00CC>\u00D1\u00D6\u00EA\u00DEz\u00FCG\u00DB\x1F\x0F\u009C4<YyJ\u00F3T\u00C9i\u00DA\u00E9\u0082\u00D3\u0093g\u00F2\u00CF\u008C\u009D\u0095\u009D}~.\u00F9\u00DC`\u00DB\u00A2\u00B6{\u00E7c\u00CE\u00DFj\x0Fo\u00EF\u00BA\x10t\u00E1\u00D2E\u00FF\u008B\u00E7;\u00BC;\u00CE\\\u00F2\u00B8t\u00F2\u00B2\u00DB\u00E5\x13W\u00B8W\u009A\u00AF:_m\u00EAt\u00EA<\u00FE\u0093\u00D3O\u00C7\u00BB\u009C\u00BB\u009A\u00AE\u00B9\\k\u00B9\u00EEz\u00BD\u00B5{f\u00F7\u00E9\x1B\u009E7\u00CE\u00DD\u00F4\u00BDy\u00F1\x16\u00FF\u00D6\u00D5\u009E9=\u00DD\u00BD\u00F3zo\u00F7\u00C5\u00F7\u00F5\u00DF\x16\u00DD~r'\u00FD\u00CE\u00CB\u00BB\u00D9w'\u00EE\u00AD\u00BCO\u00BC_\u00F4@\u00EDA\u00D9C\u00DD\u0087\u00D5?[\u00FE\u00DC\u00D8\u00EF\u00DC\x7Fj\u00C0w\u00A0\u00F3\u00D1\u00DCG\u00F7\x06\u0085\u0083\u00CF\u00FE\u0091\u00F5\u008F\x0FC\x05\u008F\u0099\u008F\u00CB\u0086\r\u0086\u00EB\u009E8>99\u00E2?r\u00FD\u00E9\u00FC\u00A7C\u00CFd\u00CF&\u009E\x17\u00FE\u00A2\u00FE\u00CB\u00AE\x17\x16/~\u00F8\u00D5\u00EB\u00D7\u00CE\u00D1\u0098\u00D1\u00A1\u0097\u00F2\u0097\u0093\u00BFm|\u00A5\u00FD\u00EA\u00C0\u00EB\x19\u00AF\u00DB\u00C6\u00C2\u00C6\x1E\u00BE\u00C9x31^\u00F4V\u00FB\u00ED\u00C1w\u00DCw\x1D\u00EF\u00A3\u00DF\x0FO\u00E4| \x7F(\u00FFh\u00F9\u00B1\u00F5S\u00D0\u00A7\u00FB\u0093\x19\u0093\u0093\u00FF\x04\x03\u0098\u00F3\u00FCc3-\u00DB\x00\x00\x00 cHRM\x00\x00z%\x00\x00\u0080\u0083\x00\x00\u00F9\u00FF\x00\x00\u0080\u00E9\x00\x00u0\x00\x00\u00EA`\x00\x00:\u0098\x00\x00\x17o\u0092_\u00C5F\x00\x00\x06\u008EIDATx\u00DA\u00BC\u0097[l\x1CW\x19\u00C7\x7F3;\u00B3s\u00D9\u00B5w}\u008D\u00ED\u00C4I\x14\u009A\u00E0\x02!\u00A5U\u0085\u008A\u00CA\u00A5\x14h\x04y(\x04\u0090x\u00E0\u0081T\u00AAT\u00A4\u00AA\x14\u0084\u0080r\x11\x0F\\T\u0084ZEyHU\u00A4H!%\u00BD`@TP\u00A5\u0095\u00FB\u00924\u00B5\u00DC\u00A8\x18X5\u0094\u00C6\u0088&q|\u00DF\u009D]\u00EF\u00DCo\u0087\u0087\u00B5\u00B7^g\u009D:A\u00EA\u0091FZ\u00ED\u00CC\u00F9\u00FE\u00BF\u00EF\x7F\u00BE3\u00E7\x1BI\b\u00C1f\u00C6\u00D8xI\u00EC\u00D99H^\u0093\u00DB\u00DE\u00F7b\b\u00A2\x14\u0080][{%69\u00A4k\x01\u008C\u008D\u0097\u00C4\u00CD\u00EF\u00DB\u008A\u00A1\u0080\u00A6\u00E9\x00\x18\u0086\u00D1\x1E \u0088 \u008D\u00F1\u00C2\u0094 \nq\x1C\u009B\u00897.\u00F1\u00F5\x03wJ\u00D7\r\u00B06\u00DBw\x13n\x07\x12\u00C6\tI\u009C\u00B0\u00EC\u00FAX\u00B5en\u00FB\u00C0.i\u00D3\x00c\u00E3%1\u00B2\u00BD\x17\u00D3\u00D0\u00D04}\u00D3\u00C2\u00EBG\u00C5O!\u00F0\b\u00A2\u0090\u00B7\u00A6+L\u00CF\u00CC\u00B5u\u00A3\x05\u00A0E\u00DC\u00C8chj\u00DB\u00E0\x13o\u0095y\u00E9\u00F4\u00DB\u00D4\u009C\x10]\u0093\u00D9\u00BDC\u00E3\u0093\u00B7\f\u00B3s\u00B0\u00A7\u00E59WH\u00D4\u00AC:A\x100\u00BBTE\u00B8\x16w\u00DEq\u00BB\u00D4\x16`l\u00BC$n\u00DA\u00DA\u0085\u00AA\u009B\u0098\u0086A!\u00A7\u00B7\x042%A\u00C5O\u00F9\u00F6/\u00FF\u00CC\u0089gJ\u008C\u00EC\x1B\x01\u00E0\u00CD\u0089\u00D7!\u009E\u00A5\u00D0\u00DB\u00C5\u00C3\u00DF\u00FC\"\u00DF\u00B9\u00FF.\x00LI4\u00E7.-\u00D9\u00A4\u00B1\u00CF\u00F9\u008B\u008B\x14%\u00BB\x05\u00A2Y\u00D2\u00DB\x07\n\u00C8\u00AA\u00DE\"\u00EE\n\tWH\u00CD\u00DF?\x7F\u00E2O\u009C8\u00F62\u00BD\u0083E~\u00FB\u00E8\u00E7\x19{\u00F2K\u00DC\u00F2\u00D1]`\x0EP\u00F3;\u00F9\u00E9\u00CFF9\u00FC\u00BB\u00C9\u00E6\x12\u00AC\u0082\u00E7;\f\x12)\u00CB\u008E\u00A1~\u00FE[\x0E8\u00F1\u0097WD\x0B\u00C0\u00D8xI\x00dT\r\u00D54\u009A\u0082k\u0087\x1F$<\u00F5\u00CC\u00EBP\x18fi\u00B6\u00CA\u00C9?\u00BE\u00C6`Q\u00E1\u00DE\u00BB\u00DF\x0F\u00BE\u008B\u00D41\br\u008E\u00D1\u00E7'X\u00A85\u00B6c\u00CD\u0087Z*\u00D1\u00AD\u00CB\u0098z#\u00EE\u00B6\u00A1\x01\u00EC\u00F2L\x13B\x01\u00E8+\u009A(Y\x13\u00CD41%\u0081+$\u00FC i\x01\b\u00FC\x14\u00CB\x16\u00C8\u008AF\n\u00BC\u00FA\u00CF\x05j\u00A9\u00C4\u00D0p?\u00E8f\u00E3!=\u008B\u00E5\u00C8\u0094-\u0087\u00CEA\u0093 H\t\x02\u00A0S\u00C6\u00ECT)\u00DBY,7&\u00DF3\u00D4\u008C\u00AB\u008C\u008D\u0097D_\u00D1lY\u00EF\u00F5\u00E2\x00\u009A.\u00F3\u00E07>\u00CB\u00A9\u0089%\x06\u00B6\u00ED\u00E4\u008E=\x02U\u0082\u00FA\u00B2\u00BB\u00E6)\u0095\u00AE\\\u008Alt\x10\b\u0080\x15'B(d\x01UC\u00CDd\u00D0\u00F3\x05\u00C2\u00B97\u00F9\u00D6w\x7F(\x14\u0080XH$R\u00B6iu 2m\u00AB\u00FF\u00C1\u00FB\u00EE\u00E2\u00C0\x17\\L=\u00CB\u0096\u00A2B$\u00E0\u00EF\u00FF\u00BA\f\u00A1DV\u00D7\b\u00E9e\u00EF\u00CD\u00FD\f\x14 \b\u00D2\u00E6\u00BC\u00D4O\u00A9!\u00A3j*\u00BD]]L\u00CF\u00CD\u00E2\u00A35\x1C\u0088\u0093\x18?J\u00E9\\\u00B5z\x03\u00F1 H\u00D14\u0099\u0091\x1D\u00F9\u00E6\x7FS\x17\u00EB\u00BC|\u00FA\x02r\u00D7 \x1F\u00DE\u00BB\u0097\u00DD\u00C3:\u00F7\x7FmO\u00C3z\u00D6my_\x10\x05\x11n\x18\u0092QT\u00A2\u0095\x1AS\x00\u00C2\x04\u00C28m\u008A\u00AF\u00A5_\x0F\u00D1\\\x12M\u00E6\u00A5\u00B3S\u00CC\u00CC\u00F8\u00DC\u00FE\u00E9Oq\u00F0\u00C0>>s\u009BN\u0097~\u00B5\u00B8\u00EBK\u0098\u00BA \x12\r\u0097\u00D5\u00CC;I*\x00i\x1C\u0093\u00A6\u00C9\u0086\u00C2-\x10+\u00C1\u0083@\u00F0\u009B\u00A7\u00CF\u0091\u00DF\u00B2\u008D\u00FB\u00BE2\u00C4'n\u00D5\x00\u0081\u00E5\u00B7?\u00AC\u00FC\u00A81\u00CF\x0B\x13\u00A2$\u00C1\u00AE;\u008DmXs\x13D\x12a\u00FB\u00A2\u00AD\u00D8\u00FA\u00ABi\u00FF\u008C\u00CB\u00A5\u00F9\u0088\u00AF\x1E\u00F8\x10\u00F7|l\u00B8\u0099\u00E9F#M\u00C0\u00F3\u00BCFQ\u00D6<\u00CAs\u00D3\r\x07\u0082X\u00E0\x041R\x18b\x071\u00EA\x06\u00AF\u00DF\u00F5v\x02\u00EC\x18\u00EEfdd+\u009E/6\x14_\u009B\u0097\u00E5\u00A5D\u00BE\u0083Uw\u00F0\u00EAV\x03`z\u00AE\u008C\u00D4\u009F'\u0093\u00AD\u00E1d\u00B3\x14\u00FB{\u00DE5\x1B\u00D7\u0097\u00D8\u00D6\u0097\u00E3\u00E4\u00E3\x07\u00C9\u00EAY\\\u00BF\u00BD`\x0B\u0088\u009F\x10\u00D8\x15\u00EA5\u008F\u00C5\u00D9K(R\u00CC\u00AF\x7F\u00F5\u00A8$?rh\u00BFT\u00F7\"\x1C\u00DB\u00A1l{\u00B8\u00BEtM\u00F1\u00D5qz|\u008A\u00E7\u00FEp\u0086Sc\u0093T\u00BD\x04_\\-\u00EE\u00FBI\u00F3\u00B2\u00AC*u\u00DB\u00C3\n%\u00E6\u00AF\\fq~\u00EE\u009D\"\u00AC\u00D6\x032\u0092 \u00A2Q\u009D=\u00DD[\u00C8\u00EA\u00D9\u00B6V\u00EA\x12\u009C\x1A\u009B\u00E4G\u00DF{\u00ACy\u00EFs_\u00BE\u0097\u009F|\u00FF \u00BE\u009F\u00B4\u0085\u00B5\u00AC*\u00F5j\x19\u00D7\u00AE13[\u00A1~\u00A5\u00C4\u00EF\u009F~Jj\u009E\x05\u008F\x1C\u00DA/\u0095\u0097C\u0096kU\u00AA\u0095%\u00CA\u0095yB?lf\u00B563_\u00C0\u00E8\u00F3\x13 wB\u00D7\x07\u00C1\x1C\u00E0\u00CC\u00D9\x7F0\u00BD\u00E0\u0092Q3\u00EB\u008A8\u00D3\x14\u00B7\u00EA.\u00B3\u00E5:\u00FF9;\u008A\u0099]\u00B7\rW!~q\u00EC\u0094\u0088\u00E2\nQ\x04~\f]\u009D]\u00A0\x19\u00E8z\u00A6\u0099\u009D\u00AEg\u00E8\x1F\u00EC\x039G\u00A1\x7F\u0088|\u00EE&\u0094\u00B4BVUH\u00A2\u0084`\u00C5\u00C5\u00C0\x0Bq\u009D*\u00B5\u00AA\u0085\u00EF\u00BAT*\x15\u00A6J\u00E7\u00E8TB\u008E\x1F?.m\u00D8\x11\u00FD\u00F8\u00C9\x17Do\u0087\u0086btb\u00E6\x0B\u00E4;:\u00D1s\x1Dd\u008C\x1C\x1A\r\u0088\u00CBs6G\u009Fx\x01\u00B3g\x17\u00FB\u00EF\u00DE\u0087\u009C,q\u00EB\u00DEA\x022x\u008E\u008F\u00EF9\u00D8u\u0097\u00D0\u00B7\u0088\u00ECe*N\u00C8T\u00E9\x1C\u009Au\u00BEE|\u00C3\u009E\u00F0\u00E1\u00C7FE_1\u008Fn\u00E6\u00D1t\u008D\u00ACb\u00A2\u00E8*\u008Afb\x18\x06\u009A\u00AE\x13\u00A6\x19dYF3\x1A\u00B5R_v\u00F1\u00ECe\\\u00D7\u00C6w\u00EDFOP\u00A9\u00E0\u00D4*\u00CC\u009D\x7F\u0085ld]%~\u00CD\u00AE\u00F8\x07\u008F\u009F\x14\u0091\u00D6C\u00B7.@i\u0088$\x19\rY\u00CDa\u00A8\u00A0\u009ByL3OG\u00A1H\u009C\u00A4T\u00CBe\u009Cz\x19\u00C7u\b\u00FC\u0080e/faj\u0092`q\u008Am\u00DD:G\u008E\x1C\u0091\u00AE\u00BB-\x078\u00F4\u00C0C\x02\u00A0\u00B0\u00FB\u00E3\u00E4\u00F3&\"\u00A3\u00A3\u0086\x12QVP\u00EC\u00E9\u00A3\u00D8;\b@ui\u0096\u00C5\u00C5%f/Y\u0084\u00F5\x0B\u00D8o\u00BFFO!\u00DF6\u00EB\u00EB\x02X\x0F\x02\u00B0\u00F5#\u00F7\x00\u0090\u00CD\x15\u00E8\u00DF\u00B2\u009D\u008Cn0?3M\u00E9\u00D5\x17\x11\u00B3\x7F#\u00D7=\u00C0\u00B1\u00A3\u00877\u00F5q\u00A2l\u00B6\u00CD^\x1B\u00F0\u00D0\x03\x0F\u0089U\b;\b(\u00AC\u00B4[f0\u00C3\u00B1g\u009F\u0095\u00AE\u00A3{G\u00BE\u0091\u009E\u00FF\u00D8\u00D1\u00C3\u00D2\u0095\u00C9\x17\u0089\u0085\u0082\u00EF\u00D8DI\u008A\x15dn\u00E8\u00FB\u00E1\u0086\x00V!.\u009F=\u00C9\u00FC\u00C2\x02\u00AE\u00BD\u00DC8j#\u00E9\u00BD\x03X\u0085\u00B0\u00DF\u00F8+\x17\u00AF\u00CC\u00DFp\u008C\u00FF\x0B\u00A0\t1\u00F9\x1C\u00C9\u00E2\u00BF1T\u00F1\u00DE\x03\u00ACB\u00D4.\u009C\u00B9\u00A1\u00B9\u00FF\x1B\x00\x11\u00F3Y\u00D2`\x13G\u00AB\x00\x00\x00\x00IEND\u00AEB`\u0082");
    var btInfo = pCaption.add("iconbutton", undefined, image(ICONS.QUERYALERT));
           btInfo.alignment = ['right', 'fill'];
     
     // Выводим справочную информацию и Лицензионное соглашение
           btInfo.onClick = function() {
               var title = app.caption;
               var msg = "    " + app.caption +"\r    BUILDINFO: ESTKResources.jsx 3.00 Fri May 23 2014 21:39:09 GMT+0300\r----\r" +
                                "Графические ресурсы, используемые в библиотеках ESTK (v3.8.0.12 СS6) и функции для удобства работы с ними.\r\r" +
                                "    Лицензионное соглашение:\r" +
                                "    С библиотекой распространяются файлы ресурсов, найденные в библиотеках ExtendScript Toolkit CS6 " +
                                "(Jan 11, 2012 ESTK version 3.8). Авторство данных изображений принадлежит Adobe Systems Incorporated и все права " +
                                "на данные ресурсы закреплены за данной компанией и защищены законом «О защите авторских прав» (© 2012 Adobe " +
                                "Systems Incorporated. All rights reserved http://www.adobe.com/).\rДанные ресурсы были мною собраны, проименованы и организованы " + 
                                "в библиотеку, с использованием правил наименования, принятым в библиотечных файлах ExtendScript Toolkit.\r" +
                                "Библиотека распространяется как есть, я не несу ответственности за вред, который может принести её использование " +
                                "Вашему компьютеру или программному обеспечению. \n\n" +
                                "------------------------\n" +
                                "Все права защищены:\n" +
                                "    CC Attribution Non-Commercial ShareAlike (CC BY-NC-SA).\n" +
                                "    http://creativecommons.org/licenses/by-nc-sa/3.0/\n\n" +
                                "Библиотеки:\n    " +
                                ESTKLib.name + " v" +ESTKLib.version + " (© SlavaBuck, 2013-2014)\n" +
                                "------------------------\n\n" +
                                "© Slava Boyko aka SlavaBuck | 2013-2014 | slava.boyko@hotmail.com" 
               alert (msg, title);
           }

    // Панель для кнопок
    var pButtons = w.add("panel { text:'State-sensitive icons:', orientation:'row', alignment:'fill', margins:[5,10,5,5] }"); 
    // State-sensitive icons, see: ScriptUI.newImage (normal: String , disabled: String , pressed: String , rollover: String ): 
    // Все кнопочки, кроме первой получают наборы иконок для реализации State-sensitive
        pButtons.add("iconbutton", undefined, image(ICONS.RUN_R),  {style: "toolbutton", toggle: true} ); // Обычная (не State-sensitive) кнопка в стиле "toolbutton"
        pButtons.add("iconbutton", undefined, image(ICONS.RUN));                  // далее все кнопки идут State-sensitive
        pButtons.add("iconbutton", undefined, image(ICONS.PAUSE));              
        pButtons.add("iconbutton", undefined, image(ICONS.STOP));
        pButtons.add("iconbutton", undefined, image(ICONS.STOPOVER));
        pButtons.add("iconbutton", undefined, image(ICONS.STEPINFO));
        pButtons.add("iconbutton", undefined, image(ICONS.STEPOUT));
        pButtons.add("iconbutton", undefined, image(ICONS.CONNECTED));
        pButtons.add("iconbutton", undefined, image(ICONS.DISCONNECTED));
        pButtons.add("iconbutton", undefined, image(ICONS.CONNECTING));
        pButtons.add("iconbutton", undefined, image(ICONS.FLYOUT));
        pButtons.add("iconbutton", undefined, image(ICONS.SPLIT));
        // Добавляем кнопочкам реакцию на нажатия, при этом вид и поведение первой кнопки будет немного отличаться, так как она получила только одну 
        // иконку (#Run_R) и не является по настоящему State-sensitive
         for (var i = 0; i<pButtons.children.length; i +=1 ) {
             pButtons.children[i].onClick = function() {
                 this.enabled = false;
                 $.sleep(600);
                 this.enabled = true; //alert(this.enabled);
             };
        }
    // Центральная панель для отображения значений констант из списков myImageList и myColorList
    var pValue = w.add("panel { text:'eValue:', orientation:'column', margins:[5,15,5,5], spacing:5, alignment:['fill', 'fill'], \
                                               eValue:EditText { alignment:['fill', 'fill'] }, \
                                               eScript:EditText { alignment:['fill', 'fill'], helpTip:'Вариант использования в скрипте' }} ");
    // Группа списков
    var pMain = w.add("panel { text:'Icons and Colors:', orientation:'row', margins:[5,15,5,5] }");
          pMain.maximumSize[1] = 500;
    // Формируем список для всех иконок в библиотеке:
    var  icon, counter, i = 0;
           
    var myImageList = pMain.add("listbox", undefined, undefined, { numberOfColumns:3, showHeaders:true, columnTitles: ['№', 'Icon', 'ESTKUI name'] } );
          myImageList.alignment = ['left', 'fill'];
        // Заполняем иконками  
        for (counter in ICONS) if (!(ICONS[counter] instanceof Array)) {
            icon = image(ICONS[counter]);
            //icon = ScriptUI.newImage(ICONS[counter]);
            if ( (icon.size.width < 31 ) && (icon.size.height < 31) ) { 
                myImageList.add("item");
                myImageList.items[i].text = counter;
                myImageList.items[i].subItems[0].image = icon;
                myImageList.items[i].subItems[1].text = ICONS[counter];
                i += 1;
            }
        }

    // Формируем список для всех цветов в библиотеке:
    var myColorList = pMain.add("listbox", undefined, undefined, { numberOfColumns:3, showHeaders:true, columnTitles: ['№', 'Image', 'COLOR name'] } );
          myColorList.alignment = ['rigth', 'fill'];
          i=0;
        // Заполняем примерами цветов 
        for (counter in COLORS) {
            myColorList.add("item");
            myColorList.items[i].text = i;
            myColorList.items[i].subItems[0].image = makePng([32, 14], toRGB(COLORS[counter]));
            myColorList.items[i].subItems[1].text = counter;
            i += 1;        
        }
    // Обработка нажатий для myImageList
        myImageList.onChange = function () {
            var prop,
                   eValue = myImageList.selection.subItems[1].text;
            for (prop in ICONS) 
                if (ICONS[prop] == eValue) break;
                
            pValue.graphics.font = ScriptUI.newFont ("dialog", "Regular", 12);
            pValue.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, cBlack, 1);
            pValue.text = "ICONS." + prop;
            pValue.eValue.text = "ICONS." + prop + " = '" + eValue + "'";
            pValue.eScript.text = "var img = ScriptUI.newImage(\""+eValue+"\"); // getImage(ICONS."+prop+");"
            pValue.eValue.helpTip = "Имя и значение ресурсной константы ESTK";
        }

    // Обработка нажатий для myColorList
        myColorList.onChange = function () {
            var prop = myColorList.selection.subItems[1].text;
            // Разукрашиваем подпись на пенели в выбранный цвет
            pValue.graphics.font = ScriptUI.newFont ("dialog", "Bold", 12);
            pValue.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, toRGBA(COLORS[prop]), 1);  
            pValue.eValue.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, cBlack, 1);
            pValue.eScript.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, cBlack, 1);
            pValue.text = "COLORS." + prop;
            pValue.eValue.text = "c" +prop + " = " + "[" + toRGB(COLORS[prop]).toString().replace(/,/g, ', ') + "]" +
                                            "; // "+parseColor(COLORS[prop])+"; // ["+toRGBA(COLORS[prop]).toString().replace(/,/g, ', ')+"];";
            pValue.eScript.text = "foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, c"+prop+", 1);"
            pValue.eValue.helpTip = "Представление цвета в формате Array [R, B, G, A], используемое в ScriptUI функциях newPen() и newBrush()";
        }

    // Подпись снизу окна
    var ESTK_small = ScriptUI.newImage("\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x06\x00\x00\x00szz\u00F4\x00\x00\x00\x04sBIT\b\b\b\b|\bd\u0088\x00\x00\x00\tpHYs\x00\x00\x0B\x12\x00\x00\x0B\x12\x01\u00D2\u00DD~\u00FC\x00\x00\x00\x1CtEXtSoftware\x00Adobe Fireworks CS5q\u00B5\u00E36\x00\x00\x00\x16tEXtCreation Time\x0010/30/06|\u00B48\x1B\x00\x00\x03\u0093IDATX\u0085\u00C5\u0097\u00DDk\x14W\x18\u00C6\x7F\u00C7Lvg\u00AB\u0090\u00AC`4\u00BB\u0081\u00965\"H\x15\u0082\x1A#b01\u0096\u00E2\u0085D\u0088\u0096\u0080\u009A\u00A2\u0098\u00F8\x11\x05\u00FF\x11?\u0083\t\"\u00F4\u00A2\u00A5\x18\u008A\x05\u00EF\u008A\x12\x13jK\u008DJ{\u00D1Z%\u00EB\u00EAEvC\u00D7\u0092]\u0084d\u0097\u008Cf\u008E\x173\x13ggggg\u00C0\u00E0;\u009C9g\u00CE\u009Cy\u009F\u00E7\u00FD8\x1F#\u0080\x15@\r\x10\x02\x14\u00F3y9E\x07\u00DE\x01\x1A\u00B0\u00A8\u0098\u00E0\u00ABFGGs\x00B\b\u00EC\u00B5W\x1B@J\u00E9\u00D9v\u00D6V\u00BB\u00B7\u00B7w50\u00A7`X\x1E\u00B5\u00BF\x14B,\u00D5\u00F6\u008F\u00AD~\u00A78\u00FB\u00DC@]\u00C6F\x01\u00CD\u00F2\u00C0J'\u00A0\x1D\u00CCI\u00A4\u0092\u00F8\u00F5\u0086)+\u0081\x1A\u008B@\u00C8\x0E\u00EC\u00C7j\x00\u00ADP\u00E4\u00D7\u00E1\u009B\u00FC7\u0095dc\u00E7\x1E\u00B6\x1D>\x18\u0084P\b\u00A8Y\u00E1\x1C \u00A5\\*\u00CEg{Y(\x14\x18\u00BBx\u008D\u00EC\u00D4\x0B$\u00F0ll\u0082\u00D4\x1F\u008FJ\u00BE\u00F1j[\u00A2Tb\\\u00C9r!\x04Z\u00A1\u00C8\u00D8\u00A5!r\u00D3i$ %H$\u00B5\x11\u00B5b\u00D2\u00B9\u00B5K\b\u00F8\u0089\u00B7\x10\u0082\u0085\u00F9\x02\u00F7.\r\u0091\u009F\u00CE\x18\u00E3\u0090H \u00DA\x14\u00A7i\u00CB\u0097\u00BE\u0081]\txY\r0;\u009D\u00E6\u00EE\u00C5!\u00B4b\u00F1\u0083b \u00DA\x14c\u00DF\u0085\u00C1@3\u00A4\u008C@%\u0096\x16\u00A9\\:\u00C3/\x0Ep\u0080\u00E6\u009D\u00AD\u00EC8t\x10(\u008F\u00AF\x1F\x12%I\u00E8L@{\x7Fv\u00EA\x05\u00ED\u00C7\u008F\u00B2\u00BEm;:\x12\x1DI\u00A2m;\u00AD=\u00DD\u008C_\u00BE\u00CE\u00FD\u00CB\u00D7yk\u0092s\u00D3\u00E5\u00A6\u00BB\u00C4\x03^\t8~u\u0098\u00FF\u0093)B\u0091\u00CF\u00D8u\u00B2\u008F\u00F4T\u0092\u00C6\r\u00CD\u00EC\u00E8\u00E9f\u00E2\u00CA0\u00F9\u00F4\f\x12\u00F8\u00ED\u00C6w\u00EC9\x7F\u00DA\u00B7'\\=\u00E0fA6\u0099B\x02Z\u00B1\u00C0\u00EBd\u008AM\x1D\u00ED\u00B4\u00F5t3qe\u00C4\x047\u00AEl2\u00C5\u00E4\u00F7\u00B7\u00CA\u00BC\u00E75\x15=\u00D7\x01\u00AB\u00ACiN \u00A5\u00B1\u008B(\x11\u0095\u00F8\u0086f\u00C6\u00AF\u008E\u0090\u00CBd\u00CCp\x18SQ\u0097\u0092\u00D4\u00E4c\x1E\u00FEp\u00AB\u00E2\u00FA\u00E1\u00F4D\u00D5$\x04\u00D8u\u00A2\u008F\u00FB\u00D7Fx\u0093\u0099\u00E1\u00CF\u00DBw\x00\u00FB\u0086$mw\u00A3NM>!\u00B2:\u00CA\u00E6\u00AF\u00F7y\u00EAu\r\u0081\x1B\u00E3\u00DA\u0088J\u00E7\u00B9S\u00D4\u00C5c\u0086\u00B5\u00E6eY\u00AF\u009B\u00C0VrJ)y>\u00FE\u00C03\u00AC\u00BE\b\u00D8\u00FB\x155L\u00C7\u00B9\x01\u00EA\u00E3\u008D\x1F\u0080,\x12\u00D2*\u00D8B\x15\u00F65\x13\\\u0093\u00B0\x12)%\x1C\u00A6cp\u0080\u00BAX\f]R\x02hyF7\u0097\u00E4\u00DD'\u00FA\u0082'\u00A1\u009F\u00A2\u0084\u00C3t\x0E\u00F6S\u00E7\u00E6\t@Q#\u00EC=;@}\u00E3:_IXv\u00FC\u00F2ED\u0097\u00B4\x1F?f\u00F3\u0084\x11\x02EU\u00E9\x1A\u00EC\u00A7>\u00B6\u00CES\u009F]\\\x17\u00A2j\u00F2\u00D7\u00E8m\u00F2/_\u00D1\u00FA\u00ED\x11\x1E\u00FE|\u0087|f\u0086P$B\u00D7\u00D9\u00FE%\u00CB\u00FD\u00EA\r\x1C\u0082\u00CC?\u00FF\u0092\u00FE\u00FB)\u0085\u00F9\"\u008F\x7F\u00FC\u0089\u00CD_\u00EDEG\u00D2u\u00E6\u00A4\u00AB\u00DB+\u00E9\x0F\u00E4\x01\u00FBAT+\x16\u00D1\u00A4D Y\u00C8\u00CDR\u00AB\u00AA\u00EC\u00FC\u00E6P\u0099\u00E5n\u00E2\u00F6\u00BE*\x01\u00E7\u00BE\u00F0\u00F9\u00D6\x16f\u00D33<\x7F\u00F0;\r\u00EB\x13D\u00E3\u008D4$\u00BE\u00F0\x1D\u00C2\u00AA9\u00E0u\u00EC\u00B6\u00A4\u00E5\u00C0~Z\x0E\u00EC\u00F7\x05Pm\u008C\u00AF\x03IP\t\u00A2C\x01\x161\u00FER>\nx\x002\x1A\u00B0(0\u00CE\u00E7k\u0081\x04\u00D0\x00\u00AC\u00FA\u00E8,Je\x0Ex\r\u00BC\x04\u00B2\x02\u00A85A\u00A3&\u0099\u00D02\x13\u00D0\u0080y \x0F\u00CC\t>\u00F1\u00CF\u00A9X\u008E\u00B8\x07\u0091\u00E5\u00B6\u00B6\u00AA\u00BC\x07i\u00CF\u00B8\x02\u00D5\\s6\x00\x00\x00\x00IEND\u00AEB`\u0082");
    var pStatus = w.add("group { margins:[0,0,0,0], spacing:4, alignment:['fill','center'],  orientation:'row' }");
    var btImage = pStatus.add("iconbutton", undefined, ESTK_small,  {style: "toolbutton", toggle: true, aligment:['right','top'] } );
    btImage.enabled = false;
    var gStat = pStatus.add("group { margins:[0,0,0,5], spacing:4, alignment:['fill','fill'],  orientation:'row' }");
    var tStatText = gStat .add("statictext { text:'© Slava Boyko aka SlavaBuck | 2013-2014 | slava.boyko@hotmail.com', alignment:['fill','bottom']}");
    tStatText.graphics.foregroundColor = w.graphics.newPen (w.graphics.PenType.SOLID_COLOR, cMediumBlue, 1)
    var btOk = gStat .add("button { text:'Закрыть', name:'Ok', alignment:['right','bottom'] }");
    btOk.onClick = function () { w.close() } 

   w.show();
} catch(e) { $.writeln(e); }
}());


        

