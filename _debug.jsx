/**
 * @@@BUILDINFO@@@ util.jsx 0.1.2 Sat May 03 2014 22:58:38 GMT+0300
 * 
 * @module  _debug
 * @summary Кучка вспомогательных функций для вывода в консоль
 * @desc
 * Расширяет глобальное пространство имён набором функций:  
 * * {@link log log()} вывод в консоль;
 * * {@link _debug _debug()} синоним <code>inspect()</code>, вывод подробной информации об объекте;
 * * {@link trace trace()} вывод подробной информации об ошибке, включая стек и т.д.;
 * * {@link assert assert()} простая функция тестирования;
 * * {@link _timer _timer()} простой таймер для замера времени выполнения кода.
 * 
 * @requires ./_globals/src/*.jsx
 * 
 * @version    0.1.2
 * @author     Slava Bojko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

/// Имя модуля:
/** @alias _debug */
var MODULE = "_debug";

$.global.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
    
    // Модуль:
    MODULE["version"] = "0.1.2";
    MODULE["name"] = "_debug";

    // --------------------------------------------------------------
    //  TODO: Пока, сделаем сразу всё в глобал
    
    // вывод в консоль
    #include "_globals/src/_debug.jsx"
    // мини таймер
    #include "_globals/src/_timer.jsx"
    // итого:
    var FACADE = {
            "log":log,
            "trace":trace,
            "assert":assert,
            "inspect":inspect,
            "_debug":_debug,
            "_timer":_timer
        }
    
    // --------------------------------------------------------------
    // Фасад и экспорт в глобал
    // --------------------------------------------------------------
    for (var fn in FACADE) if (FACADE.hasOwnProperty(fn)) {
        GLOBAL[fn] = MODULE[fn] = FACADE[fn]; 
    }
    // --------------------------------------------------------------
    // Поддержка экспорта для модуля, включаемого с помощью eval():
    return MODULE;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} } );