/**
 * Ааналог метода [merge()]{@link merge} с той разницей, что при объединении копируются все свойства в объектах, а не только
 * собственные (для объода свойств в объектах в их отношении не используется проверка hasOwnPropperty())
 * Функции не изменяет свои аргументы.
 * 
 * @param   {any}   [...object]     Один или более объектов для объединения в результатирующем.
 * @returns {object}    Результат объединения всех объектов.
 * @global
 * 
 * @example 
 * var myObj = clone({ p1:'abc' }, { p2:'123' }, { p1:'cde', p3:'hi' });
 * // result: myObj = { p1:'cde', p2:'123', p3:'hi' }
 */
function clone () {
    var child = {};
    for (var i = 0, max =  arguments.length; i < max; i ++) {
        for (var prop in arguments[i]) {
            switch (classof(arguments[i][prop])) {
                case 'Function': child[prop] = bind(child, arguments[i][prop]); break;
                case 'String':  child[prop] = arguments[i][prop].substr(0); break;
                case 'Array':   child[prop] = arguments[i][prop].slice(0); 
                                for (var j=0, maxj = child[prop].length; j < maxj; j++) 
                                    child[prop][j] = (typeof arguments[i][prop][j] == 'object') ? merge(arguments[i][prop][j]) : arguments[i][prop][j]; 
                                break;
                default: child[prop] = (typeof arguments[i][prop] == 'object' ? merge(arguments[i][prop]) : arguments[i][prop]);
            } // switch
        } // for
    } // for arguments
    return child;
};