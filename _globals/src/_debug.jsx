/**
 * Вывод в консоль
 * @returns {string} Возвращает строку, выведенную на экран
 */
function log(/*...*/) {
    var txt = arguments.length ? Array.prototype.join.call(arguments, " ") : "\n";
    $.writeln(txt);
    return txt;
};

/**
 * Выводит в консоль полное описание объекта <b>obj</b>.
 * @param  {object} obj             Любой JavaScript объект
 * @param  {string} [param = "all"] Задаёт подробность вывода:
 *  - "all" - вывод всех свойств и методов;
 *  - "prop" - только свойства;
 *  - "func" - только методы;
 * 
 * @returns {object}     Возвращает свой аргумент <b>obj</b>
 */
function _debug (obj, param) {
    if (this === $.global && arguments.length == 0) {
        return $.writeln('Inspect all:\nBad arguments list\n');
    } else { // На случай если _debug привязан не к глобальному контексту:
        if (this !== $.global && arguments.length == 0) { obj = this; param = 'all' }
    }
    var txt = (param)||'all'; // Необязательный пользовательский текст
    var type = _classof(obj);
    var val, p; 
    if (txt != '') $.writeln("\nInspect " + txt + ":");
    $.writeln("Type: " + type);
    if (['Undefined','Null','NaN'].toString().indexOf(type) != -1) return obj;
    if (!(obj instanceof Function)) {
        $.write("    toString: ");
        try { $.writeln(obj.toString()) } catch(e) { $.writeln("Ошибка: " + e.description) }
        $.write("    valueOf: ");
        try { $.writeln(obj.valueOf()) } catch(e) { $.writeln("Ошибка: " + e.description) }
    }
    if (obj.constructor && obj.constructor.name) {
        val = (obj.reflect.find(obj.constructor.name) === null) ? '' : obj.reflect.find(obj.constructor.name).arguments;
        $.writeln("    constructor: " + obj.constructor.name + "(" +val.toString().replace(/,/g, ', ') +");");
    }
    $.write("    proto chain: this -> ");
    var a = [], _p = obj.__proto__;
    while (_p) a.push(_classof (_p = _p.__proto__));
    (a.length > 0 ) ? $.writeln(a.join(" -> "))  : $.writeln("Null");
    if (txt == 'all' || txt == 'prop') {
        $.writeln("Properties:");
        var prop = obj.reflect.properties.sort();        
        for (p in prop) {
            try { type = _classof (obj[prop[p]]); } catch(e) { type = "Undefined" }
            val = (type == "Undefined" || type == "Null") ? type : obj[prop[p]].toString();
            if (val.length > 125)  { val = val.slice(0, 125) + "... (всего " + val.length + "символов)" }
            try { type = obj.reflect.find(prop[p]).dataType; } catch(e) { continue; }
            //try { type = obj.reflect.find(prop[p]).dataType; } catch(e) { type = "unknown" }
            if (type == "unknown") type = _classof (obj[prop[p]]);
            if (type == "") type = "unknown";
            $.writeln("    "+prop[p]+" {"+type+"} = " + val);
        }
    }
    if (txt == 'all' || txt == 'func') {
        var func = obj.reflect.methods.sort();
        $.writeln("Methods:");
         for (p in func) {
            try {
                val = obj.reflect.find(func[p])
                if (!val) continue; 
                val = val.arguments;
            } catch(e) {val = ""; }
            $.writeln("    "+func[p]+"(" +val.toString().replace(/,/g, ', ')+");");
        }
    }
    $.write("\n");
    return obj;
    
    // На всякий - локальная реализация стандартного classof
    function _classof (o) {
        if (o === undefined) return "Undefined";
        if (o === null) return "Null";
        if (typeof o == 'number' && isNaN(o)) return "NaN";
        return (o.constructor && o.constructor.name) ? o.constructor.name : Object.prototype.toString.call(o).slice(8,-1);
    }
};

/** @function inspect
 *  @desc    Псевдоним {@link _debug _debug()}
 *  @alias _debug    */
var inspect = _debug;

/**
 * Получение подробной информации об ошибке, включая текущий стек вызовов.
 * Выводом на экран и подробностью лога можно управлять включая и отключая флаги
 * перед использованием функции (по умолчанию все флаги включены): 
 *     * trace.time == true, выводить штамп времени;
 *     * trace.error == true, использовать подробный разбор ошибки;
 *     * trace.echo == true, выводить лог в консоль;
 *
 * @name trace
 * @function
 *
 * @param {Error|string}   err         Объект ошибки, или обычный текст, отображаемый в логе;
 * @param {...string}          msgs    Одно или более сообщений, добавляемых в лог (может использоваться с err);
 * 
 * @example
 * try {
 *      // код...
 * } catch(e) { trace(e, "что-то не то...") }
 * @return {string} Возвращает строку лога
 */
function trace(err /* error object | string */, msgs /* [, .., strings] */) {
    var str = "",
           errMsg = "Error:",
           msg = "",
           proto = Array.prototype,
           arr = proto.slice.call(arguments),
           length = arr.length;
    
    if (length) {
        if (arr[0] instanceof Error) {
            errMsg += "\n    name = "+(arr[0].name)||"";
            errMsg += "\n    description = "+(arr[0].description)||"";
            if (arr[0].description != arr[0].message) str += "\n\tmessage = "+(arr[0].message)||"";
            errMsg += "\n    fileName = " + ( arr[0].fileName ? File.decode(arr[0].fileName).split("/").slice(-1) :"");
            errMsg += "\n    line {number} = " + (arr[0].line)||"";
            if (arr[0].source && arr[0].line) {
                try {
                    errMsg += "\n    source {string} => \n[line: "+arr[0].line+"]: " + 
                            arr[0].source.split("\n").slice(arr[0].line-1, arr[0].line)[0];
                } catch(e) { $.writeln(e.description) }
            }
            arr.shift();
            if (arr.length) msg = arr.join(" ");
        }
    };

    if (trace.time) {
        var dt = new Date();
        str += "[" + [ dt.getHours(), dt.getMinutes(), dt.getSeconds() ].join(":") + 
                   "." + dt.getMilliseconds() + "]: ";
    };
    if (msg) str += msg + "\n";
    // Стек вызовов: удаляем вызов самой trace()
    str += "Trace:\n    " + $.stack.split("\n").slice(0,-2).join("->") +"\n"; 
    if (trace.error && err) str += errMsg;
    
    if (trace.echo) $.writeln(str);
    return str;
};

// флаги trace, отвечающие за подробность и вывод в консоль
trace.time = trace.error = trace.echo = true;

/** 
 * Выводит на экран сообщение <b>msg</b> и звершает его строчкой ": Ok!", если 
 * второй аргумент имеет значение <b>true</b>, в противном случае выводит ": Fail!"
 *
 * @param {string} msg    Диагностическое (информационное) сообщение, функция
 *                        вызвана только с одним аргументом - трактуется как
 *                        <b>expr</b>.
 * @param {any}    [expr] Выражение, результат которого трактуется как логическое
 *                        значение и определяет формат вывода сообщения msg и
 *                        возвращаемое функцией значение (true или false).
 * 
 * @returns {boolean} Значение выражения <b>expr</b> 
 *  */
function assert(msg, expr) {
    if (arguments.length < 2) {
        var expr = arguments[0],
            msg = "";
    }
    var txt = (msg ? msg + ": " : "") + (expr ? "Ok!" : "Fail!");
    $.writeln(txt);
    return !!expr;
};

/*
 * @desc This is a simple string formatting method, loosely inspired on the one in Python 3.
 * 
 * * In unnamed mode, specify placeholders with the **{}** symbol.
 * * In named mode, specify placeholders with **{propname}**.
 *
 * @param {String} replacements
 *     For each **{}** symbol in the text, ``format`` expects a replacement argument.
 *     Calls `.toString()` on each replacement, so you can pass in any data type.
 *     You may also specify a single replacement object, which will do named formatting.
 *
 * @example
 *     > var person = {'salutation': 'mister', 'name': 'John Smith'};
 *     > var hello = "Hello there, {}, I've heard your name is {}!".format(person.salutation, person.name);
 *     > $.writeln(hello);
 *     "Hello there, mister, I've heard your name is John Smith"
 *

String.prototype.format = function() {
	var str = this;
	var replacements = arguments.to('array');
	var named = replacements.length == 1 && replacements[0].reflect.name == 'Object';
	if (named) {
		var dict = replacements[0];
        dict.keys().forEach(function (key) {
			// replace globally (flagged g)
			str = str.replace("{" + key + "}", dict[key], "g");
		});
		return str;
	} else {
		// split the string into parts around the substring replacement symbols ({}).
		var chunks = str.split("{}");
		// fill in the replacements
		for (var i in chunks) {
			var replacement = replacements.shift();
			if (replacement) chunks[i] += replacement.toString();
		}
		// join everything together
		return chunks.join('');
	}
}
*/