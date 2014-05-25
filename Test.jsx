/**
 * @fileOverview Пример использования Коллекций (к коллекциям применяются
 *  все методы из расширений стандартов JavaScript 1.6 & 1.8 и, дополнительно,
 *  собственные методы Collection)
 *
 * @author 	Slava Boyko <slava.boyko@hotmail.com>
 * @copyright © Вячеслав aka SlavaBuck, 2014. 
 */

#include "_util.jsx"
#include "Collection/src/Collection.jsx"

// ------------------
// Collection native:
var c = new Collection(10, 20, 30, 40); // [10,20,30,40]
log(classof(c.toArray())); // Array
log(c.isValidIndex(3)); // true
log(c.add(50), c); 10,20,30,40,50
log(c.append([60, 70, 80]), c); // 10,20,30,40,50,60,70,80
log(c.insert([200, 300, 400], 3), c); // 10,20,30,200,300,400,40,50,60,70,80
//c.removeAll(); // 
