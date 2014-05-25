/**
 * @extends Array
 * @class       Coolection
 * @summary     Коллекция.
 * @desc   Наследуется непосредственно от встроенного объекта Array и предоставляет расширенный набор методов 
 *     для работы с массивами и коллекциями.
 * 
 * 
 * @param {...any} arg Получает один или более аргументов. Если аргументов несколько - формируется новая коллекция,
 *                     содержащая все перечисленные аргументы. Если объект один и он представляет структуру, подобную
 *                     массиву (или коллекции) - данные копируются в новую коллекцию. Если аргумент представлен простым
 *                     значением или объектом - формируется коллекция, содержащая один данный объект.
 * @returns {Coolection}
 */

#include "array_extras.jsxinc";
#include "array_functions.jsxinc";

var Collection = function Collection(arg) {
    if (!(this instanceof Collection)) return new Collection.apply(this, arguments);
    Array.prototype.constructor.call(this);
    var args;
    switch (arguments.length) {
        case 0:     return this;
        case 1:     args = ((arg instanceof Array) ? arg : [arg]); break;
        default:    args = Array.prototype.slice.call(arguments);
    }
    for (var i = 0, max = args.length; i<max; i++) this.push(args[i]);
};

var inherit = (function () {
    var F = function () {};
    return function (C, P) {
        if (typeof P === 'undefined') { P = {} };
        F.prototype = P.prototype;
        C.prototype = new F();
        C.prototype.constructor = C;
        C.prototype.__super__ = P.prototype;
    }
}());

// Наследуемся от Коллекции
inherit (Collection, Array);

// Подключаем стандартные методы массивов (javascript 1.5):
exports.forEach(array_base, function(func) {
	Collection.prototype[func] = function() {
        var args = Array.prototype.slice.call(arguments);
        var result = Array.prototype[func].apply(this, args);
        return (result instanceof Array ? new Collection(result) : result);
    };
});



// Подключаем расширенные методы массивов (javascript 1.6 - 1.8):
exports.forEach(array_extras, function(func) {
	Collection.prototype[func] = function() {
        var self = this,
            args = [self].concat(Array.prototype.slice.call(arguments)),
            result = exports[func].apply(this, args);
		return (result instanceof Array ? new Collection(result) : result);
	};
});

// -------------------------------------------------------------------
// Расширения Collections
// -------------------------------------------------------------------

// Возвращает себя как объект Array
Collection.prototype.toArray = function () {
    //return new Array(this.slice(0));
    var a = [];
    for (var i=0, max = this.length; i<max; i++ ) a.push(this[i]);
    return a;
};

// Проверка индекса на вхождение в диапазон коллекции.
Collection.prototype.isValidIndex = function (index) {
    return (!isNaN(index) && (index in this));
};

// Добавляет элемент в коллекцию (Массивы и коллекции добавляются по ссылке а не по значениям).
// Если параметр index опущен или выходит за пределы коллекции - добавляет элемент в конец коллекции (аналогично 
// методу Array.push(element);), в противном случае вставляет элемент в позицию index со сдвигом всех елементов в коллекции. 
// Если параметр what опущен, добавляет значение undefined в коллекцию. В любом случае метод Collection.add(...) увеличивает 
// размер коллекции минимум на 1.
Collection.prototype.add = function (what, index) {
    if (!this.isValidIndex(index)) {
        this.push(what); 
    } else {
        for (var i = this.length; i >= index; i--) this[i] = this[i-1];
        this[index] = what;
    }
    return this;
};

// Добавляет элементы в конец коллекции (Массивы и коллекции добавляются по значениям).
// Отличия от add():
// - Массивы и Коллекции добавляются по значениям а не по ссылке;
Collection.prototype.append = function (what) {
    return this.insert(what);
}

// Вставляет элементы начиная с заданной позиции коллекции (Массивы и коллекции добавляются по значениям).
// Если параметр index указан, происходит добавление элемента what в конец коллекции
Collection.prototype.insert = function (what, index) {
    var index = (this.isValidIndex(index) ? index : this.length ),
        what = (what instanceof Collection ? what.toArray() : what),
        args = [index, 0].concat(what);
    this.splice.apply(this, args);
    return this;
};

// Очищает коллекцию и, при необходимости, устанавливает новые значения:
// Если arg - массив - значения помещаются в коллекцию, если arg число - инициализируется
// arg элементов коллекции в значение 0.
Collection.prototype.rezet = function (arg) {
    this.length = 0;
    if (arguments.length) this.set(0, arg);
    return this;
};

// Устанавливает значения элементов коллекции в соответствии со значением, переданным 
// в аргументе what, начиная с позиции startIndex (отсчёт от 0). 
// По умолчанию startIndex принимается равным 0. Если параметр startIndex больше фактического кол-ва элементов в коллекции - 
// недостающие элементы инициируются 0, остальные - значением what.
// Если параметр what представлен Массивом или Колекцией - В коллекции будет проинициализированы все значения в колличестве 
// элементов, содержащихся в переданном множестве, при необходимости размер коллекции может увеличиться при инициализации
// значениями из what.
Collection.prototype.set = function (what, startIndex) {
    if (arguments.length == 0 ) throw Error("Bad arguments list");
    var i = 0, max = 0, r = [],
          startIndex = (startIndex)||0;
    (what  instanceof Array) ? r = what : r.push(what);
    while (this.length < startIndex) this.push(0);
    for (i=0, max = r.length; i < max; i++) {
       this[i + startIndex] = r[i];
    }
    return this;
};

// Меняет местами элементы коллекции
Collection.prototype.swap = function(index1, index2) {
    if (!this.isValidIndex(index1)) throw Error("Index1 " + index1 + " is out of range!");
    if (!this.isValidIndex(index2)) throw Error("Index2 " + index2 + " is out of range!");
    // ?
    var _hold = this[index1];
    this[index1] = this[index2];
    this[index2] = _hold;
    return this;
};

// Удаляет все элементы в коллекции
Collection.prototype.removeAll = function () {
    this.length = 0;
    return this;
};

// Удаляет все элементы коллекции для которой функция validator возвращает true. 
// Функция  validator вызывается в контексте Коллекции  и получает параметры,
// аналогично как для forEach - (value, index, collection).
Collection.prototype.remove = function (validator) {
    if (typeof validator != 'function') throw TypeError("Bad argument type.");
    var i = this.length-1;
    while (i--) {
        if (validator.call(this, this[i], i, this)) this.splice(i, 1);
    }
    return this;
};

// Удаляет элемент под номером index из коллекции
Collection.prototype.removeByIndex = function (index) {   
    if (this.isValidIndex(index)) this.splice(index, 1);
    return this;
};

// Удаляет из коллекции все элементы со значеним равным val. Равенство проверяется с помощью оператора === в результате чего если val 
// представляет ссылку (массив или любой другой объект JavaScript, включае Boolean-значения), будет проверено равенство ссылок 
// и в случае если элемент коллекции также представляет ссылку на этот же объект, соответствующий  элемент будет удалён из коллекции.
// Проверяются все элементы коллекции, в результате чего может быть удалено более одного элемента коллекции.
Collection.prototype.removeByValue = function (value) {   
    if (arguments.length == 0) return this;
    for (var i = this.length-1; i > -1; i--) {
        if (this[i] === value) this.splice(i, 1);
    }
    return this;
};
// Удаляет из коллекции все элементы со значением равным одному из значений из массива arr. Равенство проверяется аналогично removeByValue()
// Проверяются все элементы коллекции, в результате чего может быть удалено более одного элемента коллекции.
Collection.prototype.removeByValues = function (arr) {   
    if (arguments.length == 0 || arr.length == 0) return this;
    for (var i = 0, max = arr.length; i<max; i++) {
        this.removeByValue(arr[i]);
    }
    return this;
};

// Удаляет из коллекции все элементы, имеющие собственное свойство с именем name. Параметр name должен иметь тип { String }
// Проверяются все элементы коллекции, в результате чего может быть удалено более одного элемента коллекции.
Collection.prototype.removeByKey = function (name) {
    if (arguments.length == 0) return this;
    for (var i = this.length-1; i > -1; i--) {
        if (this[i].hasOwnProperty(name)) this.splice(i, 1);
    }
    return this;
};

// Удаляет из коллекции все элементы, имеющие собственное свойство с именем name равное значению value. Параметр name должен иметь 
// тип { String }, параметр value может иметь любой тип, включая ссылочный на массивы и любые другме объекты JavaScript.
// Проверяются все элементы коллекции, в результате чего может быть удалено более одного элемента коллекции.
Collection.prototype.removeByKeyValue = function (name, value) {
    if (arguments.length < 2) return this;
    for (var i = this.length-1; i > -1; i--) {
        if (this[i].hasOwnProperty(name) && this[i][name] === value) this.splice(i, 1);
    }
    return this;
};

// Возвращает все елементы данной коллекции как новую коллекцию
Collection.prototype.getAll = function () {
    return this.copy();
};

// Возвращает первый элемент коллекции
Collection.prototype.getFirst = function () {
    return this[0];
};
// Возвращает последний элемент коллекции
Collection.prototype.getLast = function () {
    return this.last();
};


//////////////////
// TODO: 
// Переработать циклы для задействования нативных методов filter, map, reduce и т.д...

// Если Index выходит за пределы данной колекции, вернёт пустую коллекцию
Collection.prototype.getByIndex = function (index) {
    return (this.isValidIndex(index)) ? new Collection(this[index]): new Collection();
};

Collection.prototype.getByValue = function (value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = new Collection();
    for (var i = this.length-1; i > -1; i--) {
        if (this[i] === value) c.push(this[i]);
    }
    return c;
};

Collection.prototype.getFirstByValue = function (value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var index = this.getFirstIndexByValue (value);
    return (index > -1) ? this[index] : undefined;
};

Collection.prototype.getLastByValue = function (value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var index = this.getLastIndexByValue (value);
    return (index > -1) ? this[index] : undefined;
};

Collection.prototype.getByValues = function (arr) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = new Collection();
    for (var i = 0, max = arr.length; i<max; i++) {
        c.append(this.getByValue(arr[i]));
    }
    return c;
};

Collection.prototype.getByKey = function (name) {
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = new Collection();
    for (var i = this.length-1; i > -1; i--) {
        if (this[i].hasOwnProperty(name)) c.push(this[i]);
    }
    return c;
};

Collection.prototype.getFirstByKey = function (value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var index = this.getFirstIndexByKey (value);
    return (index > -1) ? this[index] : undefined;
};

Collection.prototype.getLastByKey = function (value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var index = this.getLastIndexByKey (value);
    return (index > -1) ? this[index] : undefined;
};

Collection.prototype.getByKeyValue = function (key, value) {
    if (arguments.length < 2) throw Error("Bad arguments list");
    var c = new Collection();
    for (var i = 0, max = this.length; i < max; i++) {
        if (this[i].hasOwnProperty(key) && this[i][key] === value) c.push(this[i]);
    }
    return c;
};

Collection.prototype.getFirstByKeyValue = function (key, value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var index = this.getFirstIndexByKeyValue (key, value);
    return (index > -1) ? this[index] : undefined;
};

Collection.prototype.getLastByKeyValue = function (key, value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var index = this.getLastIndexByKeyValue (key, value);
    return (index > -1) ? this[index] : undefined;
};

///////
// Все методы группы getIndex возвращают массивы индексов, соответствующих указанному критерию. Если критерий отбора не будет
// соответствовать ни одному элементу коллекции - будет возвращан пустой массив. Если критерий отбора будет соответствовать 
// только одному элементу коллекции - возвращается массив из одного элемента
Collection.prototype.getIndexByValue = function (value) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = [];
    for (var i = 0, max = this.length; i < max; i++) {
        if (this[i] === value) c.push(i);
    }
    return c;
};

Collection.prototype.getIndexByValues = function (arr) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = new Collection();
    for (var i = 0, max = arr.length; i<max; i++) {
        c.append(this.getIndexByValue(arr[i]));
    }
    return c.toArray();
};

Collection.prototype.getIndexByKey = function (name) {
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = [];
    for (var i = this.length-1; i > -1; i--) {
        if (this[i].hasOwnProperty(name)) c.push(i);
    }
    return c;
};

Collection.prototype.getIndexByKeyValue = function (name, value) {
    if (arguments.length < 2) throw Error("Bad arguments list");
    var c = [];
    for (var i = 0, max = this.length; i < max; i++) {
        if (this[i].hasOwnProperty(name) && this[i][name] === value) c.push(i);
    }
    return c;
};

///////
// Все методы группы getFirstIndex и getLastIndex возвращают -1 либо число, представляющее индекс элемента в коллекции соответствующий указанному 
// критерию. Если критерий отбора не будет соответствовать ни одному элементу коллекции - будет возвращёно значение null.
// Все методы данной группы принимают второй необязательный параметр, представляющий index в коллекции с которого начинается обход. Данный 
// параметр должен входить в пространство коллекции иначе он игнарируется.
Collection.prototype.getFirstIndexByValue = function (value, index) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = -1,
           index = (this.isValidIndex(index)) ? index : 0;
    for (var i = index, max = this.length; i < max; i++) {
        if (this[i] === value) { c = i; break; }
    }
    return c;
};

Collection.prototype.getLastIndexByValue = function (value, index) {   
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = -1,
           index = (this.isValidIndex(index)) ? index : this.length-1;
    for (var i = index; i > -1; i--) {
        if (this[i] === value) { c = i; break; }
    }
    return c;
};

Collection.prototype.getFirstIndexByKey = function (name, index) {
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = -1,
           index = (this.isValidIndex(index)) ? index : 0;
    for (var i = index, max = this.length; i < max; i++) {
        if (this[i].hasOwnProperty(name)) { c = i; break; }
    }
    return c;
};

Collection.prototype.getLastIndexByKey = function (name, index) {
    if (arguments.length == 0) throw Error("Bad arguments list");
    var c = -1,
           index = (this.isValidIndex(index)) ? index : this.length-1;
    for (var i = index; i > -1; i--) {
        if (this[i].hasOwnProperty(name)) { c = i; break; }
    }
    return c;
};

Collection.prototype.getFirstIndexByKeyValue = function (name, value, index) {
    if (arguments.length < 2) throw Error("Bad arguments list");
    var c = -1,
           index = (this.isValidIndex(index)) ? index : 0;
    for (var i = index, max = this.length; i < max; i++) {
        if (this[i].hasOwnProperty(name) && this[i][name] === value) { c = i; break; }
    }
    return c;
};

Collection.prototype.getLastIndexByKeyValue = function (name, value, index) {
    if (arguments.length < 2) throw Error("Bad arguments list");
    var c = -1,
           index = (this.isValidIndex(index)) ? index : this.length-1;
    for (var i = index; i > -1; i--) {
        if (this[i].hasOwnProperty(name) && this[i][name] === value) { c = i; break; }
    }
    return c;
};

////////////////////
// Некоторые сервисные функции
// Возвращает свою копию
Collection.prototype.copy = function() {
    return (this.length ? new Collection(this) : new Collection());
};

Collection.prototype.toSource = function() {
    return String.prototype.concat("[", this.join(", "), "]");
};