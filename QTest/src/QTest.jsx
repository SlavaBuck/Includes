/**
 * @class   QTest
 * @desc    unit-тестирование 
 *
 * @param {string}   msg        общий заголовок для модуля тестов
 * @param {function} callback   функция с модульными тестами
 */

var QTest = {
    results:[],     // буфер результатов
    buffer:[],      // буфер вывода на консоль
    config:{      // объект настройки
        echo:true,       // Вывод в консоль если true
        autoflush:true,  // Очистка буфера результатов после каждого выполнения модуля тестов
    },
    counters:{
        passed:0,
        failed:0
    },
    // форматирует результат для вывода в консоль
    // также добавляется в буфер строк
    format:function(res) {
            if (typeof res == 'string') return res;
            var str = QTest.results.length + ".";
            str += (new Array(5 - str.length)).join(" ");
            str += (res.result ? "PASSED: " : "FAILE:  ") + res.msg;
            return str;
    },
    // Обработчики 
    beforeTest:function(e) { return true; },
    afterTest:function(e) { return true; }
};

var test = (function() {
    // функция добавления результатов в буфер, перед выполнением тестов и после вызывает событие
    // beforeTest() и afterTest()
    // param  { result:{boolean}, operands:[{}, {}], msg:{string}, test:{string} }
    function push(res) {
        if (typeof res == 'object') QTest.results.push(res);
        QTest.buffer.push(QTest.format(res));
        if (QTest.config.echo) $.writeln(QTest.buffer[QTest.buffer.length - 1]);
    };

    // преобазует аргументы вызова проверочный функций в объект result
    function newExprObject(actual, expected, test, message) {
        return { 'result':undefined,
                      'operands':[actual, expected],
                      'msg':message,
                      'test':test     }
    };
    
    /**
      * Основная проверочная функция, отвечает за проверку истинности выражения expr
      *       
      * @name ok
      * @function
      * @example
      * ok( 1 == "1", '1 == "1" - Нестрогое равенство, результат: true')
      */
    function ok(expr, msg) {
        // используется всеми проверочными функциями для регистрации своих результатов 
        // проверок, также выполняется вызов обработчиков:
        if (expr && typeof expr == 'object' && expr.operands && expr.operands.length) {
            push(expr);
        } else {
            var exp = newExprObject(expr, undefined, "ok", (msg)||"Утверждение истинно.");
            QTest.beforeTest(exp);
            exp.result = !!(expr);
            var expr = exp;
            push(expr);
        }
        // Если кто-то не выполнился - _allTrue останется в значении false!
        if (expr.result) QTest.counters.passed += 1; else QTest.counters.failed += 1;
        QTest.afterTest(expr);
        return expr.result;
    };
    
    // проверочные функции
    #include "assert.jsx"

    assert.ok = ok;

    // Прокидываем для фасада модуля и экспорта во внешний контекст:
    QTest.asserts = assert;
    //this.fullPath = File.decode($.fileName).split("/").slice(0, -1).join("/");
    //QTest.fileName = File.decode($.fileName).split("/").slice(-1);
    /*
    var equal = assert.equal;
    var notEqual = assert.notEqual;
    var deepEqual = assert.deepEqual;
    var notDeepEqual = assert.notDeepEqual;
    var propEqual = assert.propEqual;
    var notPropEqual = assert.notPropEqual;
    var strictEqual = assert.strictEqual;
    var notStrictEqual = assert.notStrictEqual;
    */
    var self = this;
    // Функция-контейнер для выполнения тестов
    return function(msg, callback) {
        var counts = QTest.counters,
            t_echo = trace.echo;
        counts.passed = counts.failed = 0;
        trace.echo = QTest.config.echo;
        if (QTest.config.autoflush) QTest.results.length = QTest.buffer.length = 0;
        try {
            push("------\nSTART: " + (msg)||"Начало тестирования");
            callback.call(this, assert);
            push("FINISH:      " + (counts.passed + counts.failed) + " assertions of " + 
                     counts.passed + " passed, " + counts.failed + " faild.");
        } catch(e) {
            push((counts.passed + counts.failed + 1) + ". FATAL ERROR: " + trace(e, "О ужас! Что это за...?!!"));
            push("FINISH:      error, unit abnormal terminated!!!");
            counts.failed += 1;
        }
        trace.echo = t_echo;
        return counts.failed === 0;
    };
}());
