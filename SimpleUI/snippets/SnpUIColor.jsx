/**************************************************************************
*  SnpUIColor.jsx
*  DESCRIPTION: Демонстрация методов класса UIColor
*  @@@BUILDINFO@@@ SnpUIColor.jsx 1.01 Sun Dec 22 2013 16:33:29 GMT+0200
* 
* NOTICE: 
* 
/**************************************************************************
* © Вячеслав aka SlavaBuck, 22.12.2013.  buck#bk.ru
*/
#include "../../_all.jsx" 
#include "../UIColor.jsx"

log(ScriptUIColor.name);

var colors = ScriptUIColor.COLORS;

// Способы создания серого цвета
var c = ScriptUI.newColor(colors.dialog);
//var c = new UIColor(colors.dialog);
//_debug(c);
log(classof(c), c instanceof ScriptUIColor);

log('Default color value:', c);
log('Default dialog color: \r\tas Hex:', c.Set(colors.dialog).toHex(), 
	'\r\tas Integer:', c.toValue(), 
	'\r\tas channels:', c.channels,
	'\r\tas RGB Array:', c.toRGB(),
	'\r\tas RGBA Array (ScriptUI color Array[4]):', c ); // c.toRGBA === c.valueOf

log('\rGlobal function:');
log('RGBtoValue ( '+c.channels.toSource()+' ) =', RGBtoValue(c.channels));
var val = c.toValue();
log('toRGB ( '+val+' ) =', toRGB(val));
log('toRGBA ( '+val+' ) =', toRGBA(val));

///////////////////////

