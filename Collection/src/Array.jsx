/**
 * @fileOverview Расширение прототипа Arrays до уровня стандартов
 * Javascript 1.8 (включая Javascript 1.6)
 */
#include "array_extras.jsxinc";
#include "array_functions.jsxinc";

// extends Array.prototype
exports.forEach(array_extras, function(func) {
	Array.prototype[func] = function() {
        var self = this,
            args = [self].concat(Array.prototype.slice.call(arguments));
		return exports[func].apply(this, args);
	};
});

