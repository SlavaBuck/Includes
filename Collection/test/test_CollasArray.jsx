/**
 * @@@BUILDINFO@@@ 
 * Тест Collection на соответствие Array:
 * 
 */

#include "../../QTest.jsx"
#include "../../Collection.jsx"

var Collection = ESCollection.Collection;

// Методы массивов для стандарта ES3 (JS1.5 - соответствует ExtendScript)
var _ES3 = {
    "concat":function(obj) { return obj.concat([100, 200]); },
    "join":function(obj) { return obj.join(","); },
    "pop":function(obj) { return obj.pop(); },
    "push":function(obj) { return obj.push("5"); },
    "reverse":function(obj) { return obj.reverse(); },
    "shift":function(obj) { return obj.shift(); },
    "slice":function(obj) { return obj.slice(0, -1); },
    "sort":function(obj) { return obj.sort(); },
    "splice":function(obj) { return obj.splice(0, 5); },
    "toLocaleString":function(obj) { return obj.toLocaleString(); },
    "toString":function(obj) { return obj.toString(); },
    "unshift":function(obj) { return obj.unshift(15, 25); },
    //"toSource":function(obj) { return obj.toSource(); },
};

// подопытные
var a = [10, 20, 30];
var c = new Collection(a);
var res1, res2;

test( "Идентификация Collection:", function() {
	ok(c instanceof Collection, "c instanceof Collection");
	ok(c instanceof Array, "c instanceof Array");
	ok(isLikeArray(c), "isLikeArray(c);");
    ok(!isArray(c), "not isArray(c);");
	//ok(isArray(c), "isArray(c) - fail ok!");
});

test( "Тестирование Collection на соответствие Array (ES3)", function() {
	each(keys(_ES3), function(m) {
		if (ok(m in c, "Collection."+m)) {
            res1 = _ES3[m](a);
            res2 = _ES3[m](c);
            equal(res1.toString(), res2.toString(), "ret value for invoke " + m);
            deepEqual(a, c, " equals a & c");
		}
	})
});