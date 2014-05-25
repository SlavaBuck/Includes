// --------------------------------------------------------------
// @@@BUILDINFO@@@
// asserts - набор unit-функций
// --------------------------------------------------------------

// -----

var assert = {
	/**
	 * Проверка простых типов. Осуществляется нестрогая проверка на соответствие двух операндов, при необходимости
	 * происходит автоматическое привидение типов - вызов equal("1", 1) вернёт true ("1" == 1 => true). 
	 * Годится только для скалярных величин.
	 * 
	 * @name equal
	 * @function 
	 * @example equal( "Received {0} bytes.".replace(/{0}/,2), "Received 2 bytes.", "String.replace(/{0}/,2)" );
	 */
	equal:function (first, second, msg) {
	    var expr = newExprObject(first, second, "equal", (msg)||"Операнды равны." );
	    QTest.beforeTest(expr);
	    expr.result = (first == second);
	    ok(expr);
	},

	/**
	 * Противоположная equal
	 * 
	 * @name notEqual
	 * @function
	 */
	notEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "notEqual", (msg)||"Операнды не равны." );
	    QTest.beforeTest(expr);
	    expr.result = (first != second);
	    ok(expr);
	},

	/**
	 * Строгая проверка простых типов. Осуществляется строгая проверка на соответствие двух операндов с
	 * учётом их типов - вызов equal("1", 1) вернёт false ("1" === 1 => false).
	 * 
	 * @name strictEqual
	 * @function
	 */
	strictEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "strictEqual", (msg)||"Операнды строго равны." );
	    QTest.beforeTest(expr);
	    expr.result = (first === second);
	    ok(expr);
	},


	/**
	 * Противоположная strictEqual
	 * 
	 * @name notStrictEqual
	 * @function
	 */
	notStrictEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "notStrictEqual", (msg)||"Операнды строго не равны." );
	    QTest.beforeTest(expr);
	    expr.result = (first !== second);
	    ok(expr);
	},

	/**
	 * Проверка объектов (и массивов). Проверяет в операндах наличие одноимённых свойств. При проверке, 
	 * значения самих свойств не учитываются.
	 * Для объектов:
	 * Проверяются только имена собственных свойств объектов (сравниваются свойства верхнего порядка - 
	 * без использования рекурсивного обхода объекта в глубину). Если кол-во свойств в операндах не совпадает - 
	 * осуществляется обход объекта с меньшим количеством свойств и если во втором объекте не будет обнаружено
	 * отсутствие по имени одного из свойств - возвращается true, в противном случае возвращается false.
	 * Для массивов:
	 * Если оба операнда массивы - осуществляется проверка только на их размер, в случае одинакового размера -
	 * возвращается true, в противном случае - false. (Коллекции сравниваются как объекты, а не массивы).
	 * 
	 * @name propEqual
	 * @function
	 */
	propEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "propEqual", (msg)||"Операнды имеют подобные свойства." );
	    QTest.beforeTest(expr);
	    if (classof(first) == classof(second) && classof(first) == "Array") {
	    	expr.result = (first.length == second.length);
	    } else {
	    	expr.result = compareProp(first, second);
	    }
	    ok(expr);
	},


	/**
	 * Противоположная propEqual
	 * 
	 * @name notPropEqual
	 * @function
	 */
	notPropEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "notPropEqual", (msg)||"Операнды имеют разноимённые свойства." );
	    QTest.beforeTest(expr);
	    if (classof(first) == classof(second) && classof(first) == "Array") {
	    	expr.result = (first.length != second.length);
	    } else {
	    	expr.result = !compareProp(first, second);
	    }
	    ok(expr);
	},


	/**
	 * Проверка объектов на подобие. Производится сравнение свойств и их значений у обоих объектов, если
	 * свойство представляются объектом - производится обход свойства в глубину. Проверка завершиться успешно,
	 * если оба операнда имеют идентичные свойства (число свойств также должно совпадать) и значения всех свойств
	 * совпадают. Для проверки значения свойств используется нестрогая проверка (==), аналогично equal();
	 *  
	 * @name deepEqual
	 * @function
	 */
	deepEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "deepEqual", (msg)||"Операнды полностью подобны." );
	    QTest.beforeTest(expr);
		expr.result = compareObject(first, second, "nostrict");
	    ok(expr);
	},


	/**
	 * Противоположная deepEqual
	 * 
	 * @name notDeepEqual
	 * @function
	 */
	notDeepEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "notDeepEqual", (msg)||"Операнды не подобны." );
	    QTest.beforeTest(expr);
		expr.result = !compareObject(first, second, "nostrict");
	    ok(expr);
	},

	/**
	 * Проверка объектов на подобие. Аналогична deepEqual, но для проверки значения свойств используется 
	 * строгая проверка (===), аналогично strictEqual();
	 *  
	 * @name strictDeepEqual
	 * @function
	 */
	strictDeepEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "strictDeepEqual", (msg)||"Операнды полностью и строго подобны." );
	    QTest.beforeTest(expr);
	    if (classof(first) == classof(second)) {
	    	expr.result = compareObject(first, second, "strict");
	    } else {
	    	expr.result = false;
	    }
	    ok(expr);
	},


	/**
	 * Противоположная strictDeepEqual
	 * 
	 * @name notStrictDeepEqual
	 * @function
	 */
	notStrictDeepEqual:function (first, second, msg) {
	    var expr = newExprObject(first, second, "notStrictDeepEqual", (msg)||"Операнды не подобны." );
	    QTest.beforeTest(expr);
		expr.result = !compareObject(first, second, "strict");
	    ok(expr);
	}	
};


/* ----------------------------------------------------------------------------------------
 * Выполняет сверку имён свойств в двух объектах. Если нет ни одного несовпадения по именам -
 * возвращает true. Кол-во свойств не учитывается, проверяется по объекту с меньшим кол-вом свойств.
 *
 */
function compareProp(op1, op2) {
	var keys1 = keys(op1),
		keys2 = keys(op2),
		first,		// тот, у кого меньше свойств:
		second, 	// тот, у кого больше свойств:
		porps = "", // шаблон сверки
		result = true;
		
	if (keys1.length < keys2.length) {
		first = keys1;
		second = keys2;
	} else {
		first = keys2;
		second = keys1;		
	};
	props = second.join(",");
	for (var i = 0, max = first.length; i < max; i++) {
		if (props.indexOf(first[i]) == -1) {
			result = false;
			break;
		}
	};

	return result;
};

/* ----------------------------------------------------------------------------------------
 * Выполняет сверку значений свойств в двух объектах. 
 * strict == false (default) - не строгое сравнение;
 * strict == true - строгое сравнение для методов strictXxxx(...); 
 */
function compareObject(op1, op2, strict) {
	var compare = {
			// метод сравнения:
			strict:function(a, b) { return (a === b); },
			nostrict:function(a, b) { return (a == b); },
		},
		method = (strict)||"nostrict",
		// итоговый результат сравнения:
		result = true,
		// массивы для ключей объектов
		keys1 = keys(op1),
		keys2 = keys(op2),
         type1 = "",
         type2 = ""; 
	// если кол-во свойств не совпадает - сразу на выход:
	if (keys1.length != keys1.length) return false;

	// обход свойств (рекурсивный)
	for (var prop in op1) if (op1.hasOwnProperty(prop)) {
        // если у второго объекта отсутствует одноимённое свойство -
        // сразу на выход:
        if (!op2.hasOwnProperty(prop)) return false;
        // Проверка на функции:
        type1 = classof(op1[prop]);
        type2 = classof(op2[prop]);
        if ( type1 == 'Function' || type2 == 'Function') {
            if ( type1 == type2 ) {
                continue; 
            } else {
                return false;
            }
        }

        switch (typeof op1[prop]) {
                    
            case 'object': 	// объекты и массивы:
                // поскольку null у нас - объект - это небольшой головняк!
                if (op1[prop] !== null && op2[prop] !== null) {
                    result = compareObject(op1[prop], op2[prop], strict);
                } else {
                    result = compare[method](op1[prop], op2[prop]);
                }
                break;
                default: 		// все простые свойства:
                    result = compare[method](op1[prop], op2[prop]);
            }
            if (!result) break;
        }
        return result;
};