/**
 * @fileOverview Пример использования методов Массива из расширения
 *     стандартов JavaScript 1.6 & 1.8
 *
 * @author 	Slava Boyko <slava.boyko@hotmail.com>
 * @copyright © Вячеслав aka SlavaBuck, 2014. 
 */

#include "../../_util.jsx"
#include "../src/Array.jsx"

// ------------------
// JavaScript 1.6
//        indexOf();		
//        indexAfter();		
//        lastIndexOf();		
//        every();		
//        filter();		
//        forEach();		
//        map();		
//        some();

var a = [10, 20, 30, 40, 30, 20];
log(a); // 10,20,30,40,30,20
log(a.indexOf(30)); // 2
log(a.indexAfter(30)); // 3
log(a.lastIndexOf(30)); // 4

// вернет false
var a = [true, 1, null, 'yes'];
log(a.every(function(el) { return el }));

// вернет true
var a = [true, 1, "abc", 'yes'];
log(a.every(function(el) { return el }));

// вернет [2,4,6]
var a = [1, 2, 3, 4, 5, 6];
log(a.filter(function(num){ return num % 2 == 0; }));
// select - псевдоним для filter
log(a.select(function(num){ return num % 2 == 0; }));

// последовательно выведет все элементы коллекции
a.forEach(function(num){ log(num); });

// последовательно выведет все элементы коллекции
a.forEach(function(num, index, array){ array[index] = num * 10; });

// вернет [3,6,9]
var a = [1, 2, 3];
log(a.map(function(num){ return num * 3; }));
// вернет [3,6,9]
log(map(a, function(num){ return num * 3; }));
log(a); // 1,2,3

log(some([true, 1, null, 'yes'], function(el){ return el; } )); // true
log(a.some(function(el){ return el; })); // true

// ------------------
// JavaScript 1.8
//         compact();        
//         contains();        
//         first();        
//         flatten();        
//         last();        
//         max();        
//         min();        
//         pluck();        
//         reduce();        
//         reduceRight();        
//         reject();        
//         select();         // alias for _JS16 - 'filter'
//         sum();
var a = [0, 1, false, 2, '', 3];
log(a); // 0,1,false,2,,3

log(a.compact()); // вернет [1, 2, 3]

log(a.contains(false)); // true

log(a.first()); // 0
log(a.last()); // 3
log(a.max()); // 3

var people = [
		{'name': 'Alfred'}, 
		{'name': 'Zed'}
	];
log(people.max(function (obj) { return obj.name; }).toSource() ); //  ({'name': 'Zed'})

var a = [10, 5, 100, 2, 1000];
log(a.min()); // 2

var a = [1, 2, [[3, 4, 5], 6], [7, 8], 9];
$.writeln(a.flatten()); //  [1,2,3,4,5,6,7,8,9];

var people = [
        {'name': 'Alfred', age: 33}, 
        {'name': 'Zed', age: 45}
    ];
$.writeln(people.pluck('age')); // [33,45]
$.writeln(people.pluck('age').sum()); // 78
$.writeln(people.sum('age')); // 78
$.writeln(people.sum(function (person) { return person.age })); // 78
 
var persons = [
        {'name': 'Abraham', 'children': 5},
        {'name': 'Joe', 'children': 3},
        {'name': 'Zed', 'children': 0}
    ];
$.writeln(persons.sum('children')); // 8
 
var a = [
        {name : 'moe', age : 40}, 
        {name : 'larry', age : 50}, 
        {name : 'curly', age : 60}
    ];
// вернет ["moe", "larry", "curly"]
log(a.pluck('name'));


var a = [1, 2, 3];
log(a.reduce(function(memo, num){ return memo + num; }, 10)); // 6

var a = [[0, 1], [2, 3], [4, 5]];
// вернет [4,5,2,3,0,1]
log(a.reduceRight(function(a, b) { return a.concat(b); }));

var a = [1, 2, 3, 4, 5, 6];
// вернет [1, 3, 5]
log(a.reject(function(num){ return num % 2 == 0; }));

