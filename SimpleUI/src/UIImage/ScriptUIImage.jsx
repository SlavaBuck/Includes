// --------------------------------------------------------------
// @@@BUILDINFO@@@
// ScriptUIImage
// --------------------------------------------------------------

/** @class ScriptUIImage */

/**
 * @extends ScriptUIImage#prototype
 * @method ScriptUIImage#onDraw
 * 
 * @description  Добавляет возможность пропорционального масштабирования объектов
 * ScriptUIImage в своих контейнерах.
 *
 * @example
 * var w = new Window ("dialog", "Картинка");
 * // открывается изображение размером 32x16 px
 * var pict = w.add ("image", undefined, File("/c/32x16mypic.png"));
 * // Масштабирование осуществляется путём явной
 * // установки свойства size:
 * pict.size = [250,250];
 * // Картинка растянется до размеров 250x250 px
 * w.show ();
 */
// 
Image.prototype.onDraw = function() {
	// written by Marc Autret
	// "this" is the container; "this.image" is the graphic
	if( !this.image ) return;
	var WH = this.size,
		wh = this.image.size,
		k = Math.min(WH[0]/wh[0], WH[1]/wh[1]),
		xy;
	// Resize proportionally:
	wh = [k*wh[0],k*wh[1]];
	// Center:
	xy = [ (WH[0]-wh[0])/2, (WH[1]-wh[1])/2 ];
	this.graphics.drawImage(this.image,xy[0],xy[1],wh[0],wh[1]);
	WH = wh = xy = null;
};



