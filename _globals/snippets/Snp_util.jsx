/**************************************************************************
*  Snp_util.jsx
*  DESCRIPTION: Тест глобальных функций
*  @@@BUILDINFO@@@ Snp_util.jsx 1.0 Fri May 02 2014 07:21:25 GMT+0300
* 
* NOTICE: 
* 
/**************************************************************************
* © Вячеслав aka SlavaBuck, 02.05.2014.  slava.boyko#hotmail.com
*/

#include "../../_util.jsx"

log("Обзор и тестирования модуля", _util.name + " (v"+_util.version+") и", _debug.name + " (v"+_debug.version+")");
log("---");
log("forEach - псевдоним each:\neach([1, 2, 3], function(num){ log(num); }); => ");
each([1, 2, 3], function(num){ log(num); });
log("---");
var test_obj = {one : 1, two : 2, three : 3};
log("keys: keys({one : 1, two : 2, three : 3}); =>", keys(test_obj));
log("---");
log("_debug(one : 1, two : 2, three : 3}) - псевдоним inspect: = >"); 
inspect(test_obj);
log("---");
var cloned_obj = clone(test_obj),
    merged_obj = merge(test_obj),
    extended_obj = extend(test_obj); // Останется связан с test_obj

test_obj.one = 10;
test_obj.toString = function() { return "test_obj" };
log("Проверка методов с использованием asser(msg, expr):")
assert("assert: Проверка merge",      cloned_obj.one != test_obj.one  &&     cloned_obj.toString() != test_obj.toString());
assert("assert: Проверка clone",      merged_obj.one != test_obj.one  &&    merged_obj.toString() != test_obj.toString());
assert("assert: Проверка extend", extended_obj.one == test_obj.one && extended_obj.toString() == test_obj.toString());
log("---");
// Умышленная ошибка - arr[] ещё не определён во время выполнения _zero(): 
//try { _zero(); } catch(e) { 
//    trace(e, "Проверка на trace(err) с умышленной ошибкой:"); 
//}
trace(new Error("Ooops...", $.fileName, $.line), "Проверка на trace(err) с умышленной ошибкой:"); 

log("---");
var ln = 20000, counts = 0,
       arr = new Array(ln),
        tm = new _timer();
log("Мини таймер _timer (кол-во итераций: "+ ln + ")\n---");
// предварительная инициали (для чистоты эксперимента):
_zero();

tm.start(); _for (); tm.stop()
log("    Время выполнения for:", tm); 
var tm1 = tm.t;
_zero();
tm.start(); _feach (); tm.stop()
log("    Время выполнения foreach:", tm); 
var tm2 = tm.t;
log("    Разница: " + (tm2-tm1) + " ms.");
log("---");

// Вспомогательные функции
function _zero() {
    for (var i = 0, max = arr.length; i<max; i++) arr[i] = i;
};

function _feach() {
    each(arr, function(num, index, arr) { arr[index] = num + num } );
};

function _for() {
    for (var i = 0, max = arr.length; i<max; i++) arr[i] += arr[i];
};


