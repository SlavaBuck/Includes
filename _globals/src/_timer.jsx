/**
 * Простейший мини-таймер для расчёта времени выполнения операций:
 * @constructor
 */
function _timer() {
    if (!(this instanceof _timer)) return new _timer();
    this.t = 0;
};

/** Фиксирует текущее (стартовое) время и возвращает его в миллисекундах */
_timer.prototype.start = function() { return this.t = (new Date()).getTime(); }
/** Фиксирует текущее (конечное) время и возвращает разницу между
 *  старотовым временем в миллисекундах */
_timer.prototype.stop = function() { return this.t = (new Date()).getTime() - this.t; }
/** Простое форматирование вывода - возвращает строку `ххх ms.`, где
 *  ххх - значение миллисекунд внутреннего счётчика */
_timer.prototype.toString = function() { return this.t + " ms."; }