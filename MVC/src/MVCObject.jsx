// --------------------------------------------------------------
// @@@BUILDINFO@@@
// MVCObject - Родительский класс всех MVC-объектов
// --------------------------------------------------------------

/**
 * @class   MVCObject
 * @summary Базовый <b>MVC-Объект</b>.
 * @desc    Родительский класс для всех MVC-объектов (MVCModel, MVCView, MVCController, MVCApplication)
 *  <p><i><b>ПРИМЕЧАНИЕ:</b> Поскольку <code>MVCObject.prototype</code> является родительским для всех 
 *  основных MVC-объектов, его расширение позволит также расширять и их.</i></p>
 *          
 * @param {object|string} [id]  Если параметр представлен текстовой строкой - она присваивается собственному свойству id, в случае если в аргументе
 *                              представлен объект - экземпляр MVCObject расширется свойствами этого объекта (используется метод слияния <code>extend()</code>)
 *
 * @property {string}     id	id (идентификатор) объекта, если не указан в аргументах конструтора - инициализируется пустой строкой "";
 * 
 * @example
 * var obj = new MVCObject ("obj"); // obj -> { id:"obj" }
 * var obj = new MVCObject ({ text:"obj1"}); // obj -> { id:"", text:"obj1" }
 * var obj = new MVCObject ({ id:"obj", text:"obj1"}); // obj -> { id:"obj", text:"obj1" }
 */
function MVCObject(id) {
    this.id = (typeof id == 'string' ? id : "");
	if (typeof id == 'object') extend(this, id); 
};