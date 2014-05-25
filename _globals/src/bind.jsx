/**
 * Привязывает функцию, переданную в аргументе func к контексту объекта context. Возвращается ссылка на привязанную функцию,
 * при этом, поведение оригинальных объектов и функций, указанных в качестве аргументов, никоим образом не изменяется.  
 * В результате "привязки", свойство this в теле привязанной функции будет переустановлено на объект context. 
 * Реализация метода полностью аналогична реализации из underscore.js и позволяет осуществлять карринг функции путём 
 * дополнительного указания аргументов после func, которые будут использованы как аргументы оригинальной функции при вызове
 * её "перепривязанного" аналога (возвращённого данным методом).
 *
 * @global
 * @param  {object}   context Объект, к контексту которого следует привязать функцию.
 * @param  {function} func    Привязываемая функция.
 * @return {function}         Ссылку на привязанную функцию.
 *
 * @example 
 * var func = function(greeting){ return greeting + ': ' + this.name };
 * func = bind({name : 'moe'}, func, 'hi');
 * func(); // => вернет строку "hi: moe"
 */
function bind(context, func) {
    var ctor = function(){},
           slice = Array.prototype.slice,
           args = slice.call(arguments, 2),
           bound;
    if (typeof func != 'function') throw new TypeError;
    return bound = function() {
          if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
          ctor.prototype = func.prototype;
          var self = new ctor;
          var result = func.apply(self, args.concat(slice.call(arguments)));
          if (Object(result) === result) return result;
          return self;
    };
};