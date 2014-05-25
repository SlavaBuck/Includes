/**
 * @@@BUILDINFO@@@ test.jsx 0.1 Wed May 21 2014 00:03:37 GMT+0300
 * Проверка методов массивов из стандартов JavaScript 1.6 & 1.8
 * 
 */

#include "../../QTest.jsx"
#include "../src/Array.jsx"

// JavaScript 1.6
test("JavaScript 1.6", function() {
    var a = [10, 20, 30, 40, 30, 20]; 
    equal(a.indexOf(30), 2, "indexOf()");
    equal(a.indexAfter(30), 3, "indexAfter()");
    equal(a.lastIndexOf(30), 4, "lastIndexOf()");
    
    a = [true, 1, null, 'yes'];
    strictEqual(a.every(function(el) { return el }), false, "every()");
    strictEqual(a.some(function(el){ return el; }), true, "some()");
    
    a = [1, 2, 3, 4, 5, 6];
    deepEqual(a.filter(function(num){ return num % 2 == 0; }), [2,4,6], "filter()");
    deepEqual(a.select(function(num){ return num % 2 == 0; }), [2,4,6], "select()");
    
    a.forEach(function(num, index, array){ array[index] = num * 10; });
    deepEqual(a, [10,20,30,40,50,60], "forEach()");
    
    a = [1, 2, 3];
    deepEqual(a.map(function(num){ return num * 3; }), [3,6,9], "map()");
});

test("JavaScript 1.8", function() {
    var a = [0, 1, false, 2, '', 3];
    deepEqual(a.compact(), [1, 2, 3], "compact()");
    strictEqual(a.first(), 0, "first()");
    strictEqual(a.last(), 3, "last()");
    
    a = [10, 5, 100, 2, 1000];
    deepEqual(a.min(), 2, "min()");
    deepEqual(a.max(), 1000, "max()");
    
    var people = [
		{'name': 'Alfred'}, 
		{'name': 'Zed'}
	];
    strictDeepEqual(people.max(function (obj) { return obj.name; }), {'name': 'Zed'}, "max() с массивом объектов.");
    strictDeepEqual(people.min(function (obj) { return obj.name; }), {'name': 'Alfred'}, "min() с массивом объектов.");
    
    a = [1, 2, [[3, 4, 5], 6], [7, 8], 9];
    deepEqual(a.flatten(), [1, 2, 3, 4, 5, 6, 7, 8, 9], "map()");
    
    a = [
        {name : 'moe', age : 40}, 
        {name : 'larry', age : 50}, 
        {name : 'curly', age : 60}
    ];
    deepEqual(a.pluck('name'), ["moe", "larry", "curly"], "pluck()");
    
    var people = [
            {'name': 'Alfred', age: 33}, 
            {'name': 'Zed', age: 45}
        ];
    deepEqual(people.pluck('age'), [33, 45], "pluck(), вариант 2");
    equal(people.pluck('age').sum(), 78, "Цепочка: pluck().sum()");
    
    equal(people.sum('age'), 78, "sum('property') сумма по имени свойства");
    equal(people.sum(function (person) { return person.age }), 78, 
                                               "sum(function(){}) настройка суммы");
    var persons = [
        {'name': 'Abraham', 'children': 5},
        {'name': 'Joe', 'children': 3},
        {'name': 'Zed', 'children': 0}
    ];
    equal(persons.sum('children'), 8, "sum('property') сумма по имени свойства вариант 2");
    
    a = [1, 2, 3];
    equal(a.reduce(function(memo, num){ return memo + num; }, 0), 6, "reduce()");
    
    a = [[0, 1], [2, 3], [4, 5]];
    deepEqual(a.reduceRight(function(a, b) { return a.concat(b); }), [4,5,2,3,0,1], "reduceRight()");
    
    a = [1, 2, 3, 4, 5, 6];
    deepEqual(a.reject(function(num){ return num % 2 == 0; }), [1, 3, 5], "reject()");
});

test("Длинная цепочка вызовов (все стандарты вместе)", function() {
    deepEqual(  [[0, 1], [2, 3], [4, 5], [false, null]].reduceRight(function(a, b) { return a.concat(b); })
                        .compact()
                        .filter(function(num){ return num % 2 == 1; })
                        .concat([2, 4])
                        .sort(),
                       [1, 2, 3, 4, 5],
                       "Цепочка [].reduceRight().compact().filter().concat().sort()");
});

