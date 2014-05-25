/**
 * @fileOverview Пример использования Коллекций (к коллекциям применяются
 *  все методы из расширений стандартов JavaScript 1.6 & 1.8 и, дополнительно,
 *  собственные методы Collection)
 *
 * @author 	Slava Boyko <slava.boyko@hotmail.com>
 * @copyright © Вячеслав aka SlavaBuck, 2014. 
 */

#include "../../_util.jsx"
#include "../../Collection.jsx"

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

var c = new Collection(10, 20, 30, 40, 30, 20);
log(c); // 10,20,30,40,30,20
log(c.indexOf(30)); // 2
log(c.indexAfter(30)); // 3
log(c.lastIndexOf(30)); // 4

// вернет false
var c = new Collection(true, 1, null, 'yes');
log(c.every(function(el) { return el }));

// вернет true
var c = new Collection(true, 1, "abc", 'yes');
log(c.every(function(el) { return el }));

// вернет [2,4,6]
var c = new Collection(1, 2, 3, 4, 5, 6);
log(c.filter(function(num){ return num % 2 == 0; }));
// select - псевдоним для filter
log(c.select(function(num){ return num % 2 == 0; }));

// последовательно выведет все элементы коллекции
c.forEach(function(num){ log(num); });

// вернет [3,6,9]
var c = new Collection(1, 2, 3);
log(c.map(function(num){ return num * 3; }));
log(c); // 1,2,3

log(c.some(function(el){ return el; })); // true

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

var c = new Collection(0, 1, false, 2, '', 3);
log(c); // 0,1,false,2,,3

log(c.compact()); // вернет [1, 2, 3]

log(c.contains(false)); // true

log(c.first()); // 0
log(c.last()); // 3
log(c.max()); // 3
var people = new Collection({'name': 'Alfred'}, {'name': 'Zed'});
log(people.max(function (obj) { return obj.name; }).toSource() ); //  ({name:"Zed"})

var c = new Collection(10, 5, 100, 2, 1000);
log(c.min()); // 2

var c = new Collection(1, 2, [[3, 4, 5], 6], [7, 8], 9);
$.writeln(c.flatten()); //  [1,2,3,4,5,6,7,8,9];

var people = new Collection( 
        {'name': 'Alfred', age: 33}, 
        {'name': 'Zed', age: 45}
    );
log(people.pluck('age')); // [33,45]
log(people.pluck('age').sum()); // 78
log(people.sum('age')); // 78
log(people.sum(function (person) { return person.age })); // 78

var persons = new Collection(
        {'name': 'Abraham', 'children': 5},
        {'name': 'Joe', 'children': 3},
        {'name': 'Zed', 'children': 0}
    );
log(persons.sum('children')); // 8

var c = new Collection(
        {name : 'moe', age : 40}, 
        {name : 'larry', age : 50}, 
        {name : 'curly', age : 60}
    );
// вернет ["moe", "larry", "curly"]
log(c.pluck('name'));

var c = new Collection(1, 2, 3)
log(c.reduce(function(memo, num){ return memo + num; }, 0)); // 6

var c = new Collection([[0, 1], [2, 3], [4, 5]]);
// 4,5,2,3,0,1
log(c.reduceRight(function(a, b) { return a.concat(b); }));

var c = new Collection(1, 2, 3, 4, 5, 6);
// вернет [1, 3, 5]
log(c.reject(function(num){ return num % 2 == 0; }));


// ------------------
// Collection native:
var c = new Collection(1, 2, 3, 4, 5, 3);
// вернет [1, 3, 5]
log(c.getByValue(3)); // 3,3

log (c.length);
c.insert([30,40,50, 60, 70]);
log(c);
log (c.length);
