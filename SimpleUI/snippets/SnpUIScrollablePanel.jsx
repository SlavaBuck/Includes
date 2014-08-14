/**************************************************************************
 *  SnpUIScrollablePanel.jsx
 *  DESCRIPTION: Демонстрация создания и использования ScriptUI Сепараторов.
 *  @@@BUILDINFO@@@ SnpUIScrollablePanel.jsx 1.0 Thu Aug 14 2014 20:01:31 GMT+0300
 * 
 * NOTICE: 
 * 
/**************************************************************************
 * © Вячеслав aka SlavaBuck, 22.12.2013.  buck#bk.ru
 */
#include "../../_util.jsx" 
#include "../UIControls.jsx"

function hiJareck (toTheParent, accross, down, n, nn) {  
    accross || accross = 1;  
    down || down = 1;  
    // if (!accross >1) accross = 1; 
    // if (!down >1) down = 1;  
    for (n = 0; n < down; n++) for (nn = 0; nn < accross; nn++) toTheParent.add('edittext',[20+nn * 140,15+n*30, 130 + nn * 140 ,35+n*30], "Hi Jareck #"+ (n+1) + " #"  + (nn+1) );  
}

var w = new Window ("dialog","My Horizontally Scrollable Panel",[100, 100, 900 , 600]);  

horizontalScrollablePanel = SUI.addScrollablePanel (w, 20, 20, 250, 70, 3700, false, 20);  
horizontalScrollablePanel2 = SUI.addScrollablePanel (w, 20, 100, 250, 70, 1000, false, 20);  
verticalScrollablePanel = SUI.addScrollablePanel (w, 300, 20, 200, 150, false, 1000, 20);  
verticalScrollablePanel2 = SUI.addScrollablePanel (w, 510, 20, 200, 150, false, 1000, 40);  
vertAndHorzScrollablePanel = SUI.addScrollablePanel (w, 250, 190, 310, 210, 3520, 820);  
hiJareck(horizontalScrollablePanel, 26, 1);  
hiJareck(horizontalScrollablePanel2, 7, 1);  
hiJareck(verticalScrollablePanel, 1, 30);  
hiJareck(verticalScrollablePanel2, 1, 30);  
hiJareck(vertAndHorzScrollablePanel, 25, 25);  

w.show();