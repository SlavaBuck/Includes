/**
 * Выборочное слияние свойств.
 * Аналогично extend, только слияние происходит для тех свойств, которые отсутствуют (или не определены) в объекте obj (свойство
 * либо отсутствует в нём, либо имеет значение undefined). Функция работает аналогично реализации из underscore.js.
 *
 * @global
 * @param  {object} obj    Расширяемый объект. Следом, через запятую, перечисляются объекты-источники, свойствами которых
 *                         расширяется данный объект.
 * @return {object}        Возвращает свой первый аргумент - расширенный объект obj.
 *
 * @example 
 * var iceCream = {flavor: "chocolate"};
 * defaults(iceCream, {flavor: "vanilla", sprinkles: "lots"});
 * // iceCream => {flavor: "chocolate", sprinkles: "lots"}
 */
//      Для перечисления свойств объектов использует функция each(...) и keys(...) из underscore.js (перенесены в этот файл)
function defaults (obj) {
    each(   Array.prototype.slice.call(arguments, 1), 
            function(source) {
                if (source) for (var prop in source) if (obj[prop] === undefined) obj[prop] = source[prop];
        }); // each
    return obj;
};