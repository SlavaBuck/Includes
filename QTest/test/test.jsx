/**
 * @@@BUILDINFO@@@ test.jsx 0.1 Wed May 21 2014 00:03:37 GMT+0300
 * Проверка простых методов для сверки скалярных типов в QTest:
 * 
 * тест методов:
 * ok();
 * equal();
 * notEqual();
 * strictEqual();
 * notStrictEqual();
 * propEqual();
 * notPropEqual();
 */

#include "../../QTest.jsx"

// Преднамеренно ошибочные тесты закоментированы для финального тестирования 
// (они использовались для внутреннего тестирование - все результаты ok!)
test( "Тестирование QTest: ok():", function() {
    ok( true, "true succeeds" );
    ok( !false, "!false succeeds" );    
    ok( "non-empty", "non-empty string succeeds" );
    //ok( 0, "0 - fails ok!" );
    //ok( NaN, "NaN - fails ok!" );
    //ok( "", "empty string - fails ok!" );
    //ok( null, "null - fails ok!" );
    //ok( undefined, "undefined - fails ok!" );
});

test( "Тестирование QTest: equal() & strictEqual():", function() {
    equal( "1", 1, '"1" == 1, equal succeeds');
    strictEqual( "1", "1", '"1" === "1", strictEqual - succeeds');
    //strictEqual( "1", 1, '"1" === 1, strictEqual - fails ok!');
    equal( true, 1, "true == 1, equal succeeds");
    //strictEqual( true, 1, 'true === 1, strictEqual - fails ok!');
    equal( "Received {0} bytes.".replace(/\{0\}/,"2"), "Received 2 bytes.", 
                        '"String {0}..." .replace(/\{0}\/,"2") == 2, equal succeeds');
    equal( "", false, '"" == false equal succeeds');
    equal( null, undefined, "null == undefined, equal succeeds!!!");
    //strictEqual( null, undefined, "null === undefined, strictEqual - fails ok!");
    //equal( null, "", 'null == "", Not equal - fails ok!');
    //equal( null, false, "null == false, Not equal - fails ok!");
    //equal( false, undefined, "false == undefined, Not equal - fails ok!");
});

test( "Тестирование QTest: notEqual() & notStrictEqual():", function() {
    //notEqual( "1", 1, '"1" == 1, equal  - fails ok');
    //notEqual( true, 1, "true == 1, equal  - fails ok");
    //notEqual( "Received {0} bytes.".replace(/\{0\}/,"2"), "Received 2 bytes.", 
    //                    '"String {0}..." .replace(/\{0}\/,"2") == 2, equal  - fails ok');
    //notEqual( "", false, '"" == false equal  - fails ok');
    //notEqual( null, undefined, "null == undefined, equal  - fails ok!!!");
    notEqual( null, "", 'null == "", is notEqual - succeeds');
    notEqual( null, false, "null == false, is notEqual - succeeds");
    notStrictEqual( 0, false, "0 === false, notStrictEqual - succeeds");
    //notStrictEqual( false, false, "false === false, notStrictEqual - fails ok!!!");
    notEqual( false, undefined, "false == undefined, is notEqual - succeeds");
});



test( "Тестирование QTest: propEqual() & notPropEqual():", function() {
        var obj1 = { prop1:'1', prop2:'', prop3:'' , prop4:'' }
           obj2 = { prop1:1, prop2:'', prop3:function() { throw Error("Не должна выполняться в ходе проверки!") } },
           obj3 = { prop1:'', prop2:'' },
           obj4 = { prop1:'' },
           obj5 = { prop1:'', prop2:'', prop5:'' };
    propEqual( obj1, obj2, "{ prop1:'', prop2:'', prop3:'', prop4:'' } & { prop1:'', prop2:'', prop3:'' }, propEqual - succeeds");
    propEqual( obj3, obj1, "{ prop1:'', prop2:'' } & { prop1:'', prop2:'', prop3:'', prop4:'' }, propEqual - succeeds" );
    propEqual( obj4, obj2, "{ prop1:'' } & { prop1:'', prop2:'', prop3:'' }, propEqual - succeeds" );
    propEqual( obj2, obj4, "{ prop1:'', prop2:'', prop3:'' } & { prop1:'' }, propEqual - succeeds" );
    //propEqual( obj5, obj2, "{ prop1:'', prop2:'', prop5:'' } & { prop1:'', prop2:'', prop3:'' }, propEqual - fails ok!" );
    notPropEqual( obj5, obj2, "{ prop1:'', prop2:'', prop5:'' } & { prop1:'', prop2:'', prop3:'' }, is notPropEqual - succeeds" );
});

