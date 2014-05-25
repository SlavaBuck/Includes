/**
 * Проходит по всему списку элементов, вызывая для каждого из них функцию iterator, которая будет вызвана в 
 * контексте context, если он был передан. При каждом вызове в iterator будут переданы 3 аргумента: 
 * (element, index, list). В случае, если list является JavaScript объектом, то в iterator будут 
 * переданы (value, key, list). 
 * Реализация метода аналогична underscore.js и совпадает с методом Array.prototype.forEach в новых реализациях 
 * JavaScript (>= v1.6)
 *
 * @global
 * @param  {object|Array}   obj       Объект или массив, в отношении свойств которого (для массивов и коллекций - в отношении
 *                                    их элементов) вызывается функция iterator.
 * @param  {function}       iterator  Вызываемая функция-итератор. 
 * @param  {object}         [context] Контекст, в отношении которого вызывается функция-итератор (по умолчанию вызов происходит
 *                                    в контексте obj).
 * @example <caption>Примеры из underscore.js:</caption>
 * // выведет все элементы массива:
 * each([1, 2, 3], function(num){ alert(num); });
 * // выведет содержимое объекта в формате ключ:значение
 * each({one : 1, two : 2, three : 3}, function(num, key){ alert(key+":"+num); });
 */
function each(obj, iterator, context) {
    if (obj == null) return;
    var breaker = {};
    if (typeof obj.forEach == 'function') { // (В оригинале  if (nativeForEach && obj.forEach === nativeForEach) {... )
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, length = obj.length; i < length; i++) {
            if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
    } else {
        var _keys = keys(obj);
        for (var i = 0, length = _keys.length; i < length; i++) {
            if (iterator.call(context, obj[_keys[i]], _keys[i], obj) === breaker) return;
        }
    }
};

/** 
 * @function forEach
 * @desc    Псевдоним {@link each each()}
 * @alias each
 */
var forEach = each;

/**
 * Функция возвращает массив из строк, представляющих имена всех свойств объекта obj. 
 * @global
 * @param  {object}         obj Произвольный объект, перечень свойств которого требуется получить.
 * @return {Array.<string>}     Массив строк - названий свойств объекта obj.
 */
function keys (obj) {
    //if (obj !== Object(obj)) throw new TypeError('Invalid object'); конфликт совместимости с Array
    var keys = [];
    for (var key in obj) if (obj.hasOwnProperty(key)) keys.push(key);
    return keys;
};