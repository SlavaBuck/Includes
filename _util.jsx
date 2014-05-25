/**
 * @@@BUILDINFO@@@ _util.jsx 0.1.3 Sat May 03 2014 22:58:38 GMT+0300
 * 
 * @module  _util
 * @summary Вспомогательные функции для работы с объектами и коллекциями javascript
 * @desc    Минимальный набор вспомогательных функций для работы с 
 *  объектами и коллекциями javascript, без которых не обходится
 *  ни один модуль в сборке.
 *
 * Подключается модуль _debug и, дополнительно, в глобальное пространство
 * имён добавляет методы для работы с:
 * <p><b>Объектами:</p></b>
 * * {@link extend extend()} расширение объекта, слиянием свойств;
 * * {@link merge merge()} получение нового объекта, путём объединения свойств;
 * * {@link clone clone()} полное клонирование объекта;
 * * {@link defaults defaults()} расширение объекта только отсутствующими в нём свойствами;
 * * {@link inherit inherit()} реализация прототипоного наследования;
 * * {@link keys keys()} получение списка свойств объекта в виде массива (Array)
 * <p><b>Архивами и Коллекциями:</p></b>
 * * {@link each each()} синоним <code>forEach()</code>, итерация;
 * * {@link indexOf indexOf()} получения индекса элемента в массиве;
 * <p><b>Функциями:</p></b>
 * * {@link bind bind()} привязка функции к контексту;
 * <p><b>Проверка типа:</p></b>
 * * {@link classof classof()} возвращает текстовую строку с наименованием класса/типа объекта;
 * * {@link isArray isArray()} проверяет, является ли объект массивом;
 * * {@link isLikeArray isLikeArray()} проверяет, является ли объект, подобным массиву (например, коллекцией).
 * <p><b>Дополнительно:</p></b>
 * * {@link doBatFile doBatFile()} выполнение команд DOS/Windows;
 * * {@link openURL openURL()} открытие URL в браузере.
 * 
 * @requires src/*.jsx
 * 
 * @version    0.1.3
 * @author     Slava Boyko <slava.boyko@hotmail.com>
 * @copyright  © Вячеслав aka SlavaBuck, 2014. 
 */

// _util также включает и _debug:
#include "_debug.jsx"

/// Имя модуля:
/** @alias _util */
var MODULE = "_util";

$.global.hasOwnProperty(MODULE)||(function(GLOBAL, MODULE) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
    
    // Модуль:
    MODULE["version"] = "0.1.3";
    MODULE["name"] = "_util";

    // --------------------------------------------------------------
    // Реализация...

    // коллекции и массивы:
    #include "_globals/src/collections.jsx"
    #include "_globals/src/indexOf.jsx"
    // объекты:
    #include "_globals/src/clone.jsx"
    #include "_globals/src/defaults.jsx"
    #include "_globals/src/extend.jsx"
    // прототипное наследование:
    #include "_globals/src/inherit.jsx"
    // функции:
    #include "_globals/src/bind.jsx"
    #include "_globals/src/merge.jsx"
    // утилиты:
    #include "_globals/src/classof.jsx"
    #include "_globals/src/doBatFile.jsx" 
    // TODO: включить методы с форматированием строк

    // --------------------------------------------------------------
    // Фасад модуля:
    // --------------------------------------------------------------
    var FACADE = {
            // коллекции и массивы:
            "each":each,
            "forEach":forEach,
            "indexOf":indexOf,
            // объекты:
            "clone":clone,
            "defaults":defaults,
            "extend":extend,
            "keys":keys,
            "merge":merge,
            // функции:
            "bind":bind,
            // прототипное наследование:
            "inherit":inherit,
            // утилиты:
            "classof":classof,
            "isArray":isArray,
            "isLikeArray":isLikeArray,
            "doBatFile":doBatFile,
            "openURL":openURL
        }
    
    // --------------------------------------------------------------
    // Экспорт в глобал всего фасада (если нужно)
    // --------------------------------------------------------------
    each(keys(FACADE), function(m){ GLOBAL[m] = MODULE[m] = FACADE[m];} );

    // --------------------------------------------------------------
    // Поддержка экспорта для модуля, включаемого с помощью eval():
    // --------------------------------------------------------------
    return MODULE;

})( $.global, { toString:function(){return MODULE;} } );