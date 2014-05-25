/**
 * @@@BUILDINFO@@@ test_deep.jsx 1.0 Wed May 21 2014 00:04:32 GMT+0300
 *
 * Проверка методов для сверки объектных типов в QTest (с рекурсивным 
 * обходом свойств в объектах):
 * 
 * тест методов:
 * deepEqual();
 * notDeepEqual();
 * strictDeepEqual();
 * notStrictDeepEqual();
 */

#include "../../QTest.jsx"

var obj1 = {
        prop1:"1",
        prop2:null,
        prop3:function() { throw Error("Не должна выполняться в ходе проверки!") },
        prop4:{
                arr1:[1,2,3],
                arr2:[2,3,"1"]
            }
    };

// Отличается от obj1 только свойством prop4.arr2[3] === 5
var obj2 = {
        prop1:"1",
        prop2:null,
        prop3:function() { throw Error("Не должна выполняться в ходе проверки!") },
        prop4:{
                arr1:[1,2,3],
                arr2:[2,3,5]
            }
    };
// отличается от obj1 только типами (нестрогое сравнение  даёт true)
var obj3 = {
        prop1:"1",
        prop2:null,
        prop3:function() { throw Error("Не должна выполняться в ходе проверки!") },
        prop4:{
                arr1:[1,2,3],
                arr2:[2,3,1]
            }
    };

// Преднамеренно ошибочные тесты закоментированы для финального тестирования 
// (они использовались для внутреннего тестирование - все результаты ok!)
test( "Тестирование QTest: deepEqual() & notDeepPropEqual():", function() {
    deepEqual( obj1, obj1 ); // true
    strictDeepEqual( obj1, obj1 ); // true
    deepEqual( obj1, obj3 ); // true
    //notDeepEqual( obj1, obj3 ); // false
    //strictDeepEqual( obj1, obj3 ); // false
    notStrictDeepEqual( obj1, obj3 ); // true
    //deepEqual( obj1, obj2 ); // fail - ok - свойство prop4.arr2[3] === 5
    notDeepEqual( obj1, obj2 ); // true
});