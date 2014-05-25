// копия из  <include>/_globals/src/indexOf.jsx
// -------------------------------------------------------------
/*
 * Возвращает индекс элемента в массиве. При поиске производится точная проверка на соответствие - с помощью оператора '===',
 * поиск ведётся с начала массива и возвращается индекс первого вхождения искомого элемента в массив
 * @global
 * @param  {array}  arr   Массив, в котором будет происходить поиск значения.
 * @param  {any}    item  Искомое значение.
 * @param  {number} [from=0]  Начальная позиция поиска, отрицательные значения указывает на поиск с позиции
 *                            from элементов от конца
 * @return {number}       Возвращает индекс элемента item в массиве или -1 если элемент в массиве не обнаружиться.
 *
 * @name indexOf
 * @function
 * 
 * @example
 * var arr = [10, 20, 30, 40];
 * // поиск, начиная со 3го элемента = [30] 
 * // (length = 4 elements, startindex = 4 + (-2) = 2, arr[2] == 30) 
 * var index = indexOf[arr, 40, -2]; // => 3
 */
function indexOf (arr, item, from) {
	if (!arr) return -1;
	var from = Number(arguments[2])||0,
		len = arr.length;

    if (from < 0) from += len;
    if (from > len) throw Error("from - Out of array bounds.")

    for (; from < len; from++) if (arr[from] === item) return from;

    return -1;
};