/**
 * Возвращает строку, содержащую тип объекта (имя конструктора), указанного в аргументе: Array, Function, Date и т.д.
 * @global
 * @param  {any} obj  Любой объект, тип которого следует получить.
 * @return {String}   Тип аргумента (имя конструктора)
 */
function classof(o) {
    if (o === undefined) return "Undefined";
    if (o === null) return "Null";
    if (typeof o == 'number' && isNaN(o)) return "NaN";
    return ((o.constructor) && o.constructor.name) ? o.constructor.name : Object.prototype.toString.call(o).slice(8,-1);
}

//-----------------------------------------------------------------------------
//  Вспомогательные функции проверки типа объекта на соответствие:
//-----------------------------------------------------------------------------
/** 
 * Возвращает true, если o - массив (Array) 
 * @param  {object}  o  Произвольный объект.
 * @global 
 */
function isArray(o) { return classof(o) == 'Array' };
/** 
 * Возвращает true, если o - объект, подобный массиву (Array, Collection и т.п.)
 * @param  {object}  o  Произвольный объект.
 * @global
 */
function isLikeArray(o) { 
    if (o === undefined) return false;
    return ( o instanceof Array || o instanceof Collection || 
    (typeof o.length == 'number' && (!isNaN(o.length)) && o.length >=0 && o.length === Math.floor(o.length)) ) ? true : false;
};
