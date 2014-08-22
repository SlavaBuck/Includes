/**************************************************************************
*  SnpUIColors.jsx
*  DESCRIPTION: Демонстрация методов класса UIColor
*  @@@BUILDINFO@@@ SnpUIColors.jsx 1.0 Thu Aug 21 2014 23:44:47 GMT+0300
* 
* NOTICE: 
* 
/**************************************************************************
* © Вячеслав aka SlavaBuck, 22.12.2013.  buck#bk.ru
*/
#include "../../_util.jsx" 
#include "../UIColors.jsx"

log(SUI.UIColors.name);

$.writeln(cRed);                // => 1,0,0,1
$.writeln(parseColor(cRed));    // => 0xFF0000
$.writeln(COLORS.Red);          // => 16711680
$.writeln(toRGBA(COLORS.Red));  // => 1,0,0,1

