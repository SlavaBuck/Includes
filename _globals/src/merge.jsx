/**
 * Возвращает новый объект, полученный путём объединения всех собственных свойств (перечисляемых методом 
 * .hasOwnProperty()) в переданных объектах. Кол-во передаваемых объектов не ограничено. Результатирующий объект
 * формируется таким, который не зависит от своих "родительских" объектов - значения всех свойств копируются по значениям а не
 * по ссылкам. При копировании используется рекурсивный метод обхода объектов на всю глубину вложенности их свойств, при этом,
 * все одноимённые свойства переписываются значением, встреченным последним.
 * Функции не изменяет свои аргументы.
 * 
 * @param   {any}   [...object]     Один или более объектов для объединения в результатирующем.
 * @returns {object}    Результат объединения всех объектов.
 * @global
 * 
 * @example 
 * var myObj = merge({ p1:'abc' }, { p2:'123' }, { p1:'cde', p3:'hi' });
 * // result: myObj = { p1:'cde', p2:'123', p3:'hi' }
 */
function merge() {
    var child = {};
    for (var i = 0, max =  arguments.length; i < max; i ++) {
        for (var prop in arguments[i]) if (arguments[i].hasOwnProperty(prop)) {
            switch (classof(arguments[i][prop])) {
                case 'Function': child[prop] = bind(child, arguments[i][prop]); break;
                case 'String': child[prop] = arguments[i][prop].substr(0); break;
                case 'Array': child[prop] = arguments[i][prop].slice(0); 
                                    for (var j=0, maxj = child[prop].length; j < maxj; j++) {
                                        child[prop][j] = (typeof arguments[i][prop][j] == 'object') ? merge(arguments[i][prop][j]) : arguments[i][prop][j]; 
                                    }
                                    break;
                default: child[prop] = (typeof arguments[i][prop] == 'object' ? merge(arguments[i][prop]) : arguments[i][prop]);
            } // switch
        } // for_if
    } // for arguments
    return child;
};