// --------------------------------------------------------------
// @@@BUILDINFO@@@
// ScrollablePanel
// --------------------------------------------------------------

/**
 * Добавляет в родительский контейнер настраиваемую скроллируемую панель.  
 * @see http://forums.adobe.com/thread/1229123?tstart=0
 *
 * @name addScrollablePanel
 * @function
 * 
 * @param {object} toTheParent      Родительский контейнер для панели
 * @param {number} locationX        Положение панели относительно верхнего левого угла родительского контейнера - координата x
 * @param {number} locationY        Положение панели относительно верхнего левого угла родительского контейнера - координата y
 * @param {number} outerPanelWidth  Собственный размер панели - ширина в точках
 * @param {number} outerPanelHeight Собственный размер панели - высота в точках
 * @param {number|boolean} innerPanelWidth  Виртуальная ширина либо false - для отключения горизонтальной прокрутки
 * @param {number|boolean} innerPanelHeight Виртуальная высота либо false - для отключения вертикальной прокрутки
 * @param {?number} [barThickness = 20]     Ширина элемента прокрутки в точках.
 *
 * @example
 * function hiJareck (toTheParent, accross, down, n, nn)  
 *     {  
 *         accross || accross = 1;  
 *         down || down = 1;  
 *         // if (!accross >1) accross = 1; 
 *         // if (!down >1) down = 1;  
 *         for (n = 0; n < down; n++) for (nn = 0; nn < accross; nn++) toTheParent.add('edittext',[20+nn * 140,15+n*30, 130 + nn * 140 ,35+n*30], "Hi Jareck #"+ (n+1) + " #"  + (nn+1) );  
 *     }  
 * var w = new Window ("dialog","My Horizontally Scrollable Panel",[100, 100, 900 , 600]);  
 * 
 * horizontalScrollablePanel = addScrollablePanel (w, 20, 20, 250, 70, 3700, false, 20);  
 * horizontalScrollablePanel2 = addScrollablePanel (w, 20, 100, 250, 70, 1000, false, 20);  
 * verticalScrollablePanel = addScrollablePanel (w, 300, 20, 200, 150, false, 1000, 20);  
 * verticalScrollablePanel2 = addScrollablePanel (w, 510, 20, 200, 150, false, 1000, 40);  
 * vertAndHorzScrollablePanel = addScrollablePanel (w, 250, 190, 310, 210, 3520, 820);  
 * hiJareck(horizontalScrollablePanel, 26, 1);  
 * hiJareck(horizontalScrollablePanel2, 7, 1);  
 * hiJareck(verticalScrollablePanel, 1, 30);  
 * hiJareck(verticalScrollablePanel2, 1, 30);  
 * hiJareck(vertAndHorzScrollablePanel, 25, 25);  
 * 
 * w.show();  
 */

function addScrollablePanel (   toTheParent,
                                locationX,
                                locationY,
                                outerPanelWidth,
                                outerPanelHeight,
                                innerPanelWidth,    
                                innerPanelHeight,   
                                barThickness      ) {
    var  padding = 5, innerPanel, outerPanel, scrollbarH, scrollbarV;
    if (!innerPanelWidth) innerPanelWidth = outerPanelWidth; 
    if (!innerPanelHeight) innerPanelHeight = outerPanelHeight;
    if (!barThickness) barThickness = 20;
    innerPanelWidth += padding;
    innerPanelHeight += padding;
    scrollbarH = (innerPanelWidth != outerPanelWidth + padding);
    scrollbarV = (innerPanelHeight != outerPanelHeight + padding);
    if ($.os.match(/Windows/i)) {
         scrollbarV && scrollbarV = toTheParent.add('scrollbar', [locationX + outerPanelWidth - barThickness -  padding, locationY + padding , locationX + outerPanelWidth  -  padding, locationY + outerPanelHeight  - padding - (scrollbarH && barThickness)]);
         scrollbarH && scrollbarH = toTheParent.add('scrollbar', [locationX + padding, locationY + outerPanelHeight - padding -barThickness,  locationX + outerPanelWidth - padding - (scrollbarV && barThickness), locationY + outerPanelHeight - padding]);
         scrollbarH && scrollbarV && toTheParent.add('statictext', [locationX + outerPanelWidth - barThickness - padding , locationY + outerPanelHeight - barThickness - padding, locationX + outerPanelWidth - padding, locationY + outerPanelHeight - padding]); // fill the gap between the scrollbarbuttons
         //outerPanel = toTheParent.add('panel',[locationX, locationY, locationX + outerPanelWidth, locationY + outerPanelHeight]);
         outerPanel = toTheParent.add('group',[locationX, locationY, locationX + outerPanelWidth, locationY + outerPanelHeight]);
    } else {// Mac
        //outerPanel = toTheParent.add('panel',[locationX, locationY, locationX + outerPanelWidth, locationY + outerPanelHeight]);
        outerPanel = toTheParent.add('group',[locationX, locationY, locationX + outerPanelWidth, locationY + outerPanelHeight]);
        scrollbarV && scrollbarV = toTheParent.add('scrollbar', [locationX + outerPanelWidth - barThickness -  padding, locationY + padding , locationX + outerPanelWidth  -  padding, locationY + outerPanelHeight  - padding - (scrollbarH && barThickness)]);
        scrollbarH && scrollbarH = toTheParent.add('scrollbar', [locationX + padding, locationY + outerPanelHeight - padding ,  locationX + outerPanelWidth - padding - (scrollbarV && barThickness), locationY + outerPanelHeight - padding - barThickness]);
        scrollbarH && scrollbarV && toTheParent.add('statictext', [locationX + outerPanelWidth - barThickness - padding , locationY + outerPanelHeight - barThickness - padding, locationX + outerPanelWidth - padding, locationY + outerPanelHeight - padding]);               
    }
    //innerPanel = outerPanel.add('panel'); // set the bounds after setting the maximumSize
    innerPanel = outerPanel.add('group'); // set the bounds after setting the maximumSize
    innerPanel.maximumSize = [innerPanelWidth * 2, innerPanelHeight * 2]; // This needs to be set to at lest the required size otherwise the panel size is limmited to the screen size
    innerPanel.bounds = [0, 0, innerPanelWidth, innerPanelHeight]; // now we can set the size :-)
    scrollbarV && scrollbarV.jumpdelta = 100 * outerPanelHeight / innerPanelHeight; // Make size of bar whatdoyoucallit (drag thing) propotional to the size of the windows
    scrollbarH && scrollbarH.jumpdelta = 100 * outerPanelWidth / innerPanelWidth; // Make size of bar whatdoyoucallit (drag thing) propotional to the size of the windows
    scrollbarV && scrollbarV.onChanging = function () {innerPanel.location.y = scrollbarV.value*(outerPanelHeight)/100 - scrollbarV.value*(innerPanelHeight)/100 - padding *(1-scrollbarV.value/100) };
    scrollbarH && scrollbarH.onChanging = function () {innerPanel.location.x = scrollbarH.value*(outerPanelWidth)/100 - scrollbarH.value*(innerPanelWidth)/100 - padding *(1-scrollbarH.value/100) };
    innerPanel.location.x -= padding;
    innerPanel.location.y -= padding;
    //outerPanel.margins = innerPanel.margins = [0, 0, 0, 0]; // Поправка
    outerPanel.margins = [5, 0, 0, 0]; // Поправка
    outerPanel.alignChildren = innerPanel.alignChildren = ['left','top'];
    return innerPanel;
};
