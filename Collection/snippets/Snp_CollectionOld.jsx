/**************************************************************************
*  Snp_Collection.jsx
*  DESCRIPTION: Демонстрация работы с классом Collection
*  @@@BUILDINFO@@@ Snp_Collection.jsx 1.5 Sun Dec 30 2013 19:30:13 GMT+0200
* 
* NOTICE: Использует Collection.jsx и _debug.jsx. Продемонстрированы не все методы Collection
* 
/**************************************************************************
* © Вячеслав aka SlavaBuck, 22.12.2013.  buck#bk.ru
*/

#include "../../Collection.jsx"
#include "../../_util.jsx"

// Простые операции с коллекциями: добавление и удаление элементов:
var a = new Collection (10, 20, 30, 40, 50, 60);
log("Обзор Класса Collection:")
//_debug(a);
log("Получаем новую коллекция в 'a':", a);
log("typeof a >>", typeof a);
log("a instanceof Collection >>", (a instanceof Collection));
log("a instanceof Array >>", (a instanceof Array));
log("a.push(100): >>", a.push(100), "  // добавили 100 в конец");
log("a.add(200,2): >>", a.add(200,2), "  // добавили 200 в позицию 2 (3-й элемент считая с позиции 0 или 2-й - с позиции 1-один)");
log("a.add(300, a.length): >>", a.add(300, a.length), "a.length = ", a.length, "    // вышло аналогично a.push(300)");
log("a.sort(): >>", a.sort(),  "    // Сортировка работает как и для массивов");
log("\nДля коллекций все методы массивов работают как родные:");
log("a.toSource():", a.toSource());
log("a.slice(2) >>", a.slice(2));
log("    a не изменился >>", a);
log("a.splice(6,3, 440,550,660, 700, 800) >>", a.splice(6,3, 440,550,660, 700, 800));
log("    a изменился >>", a);
log("a.unshift(5, 6, 7) >>", (a.unshift(5, 6, 7), a) );
log("a.shift() >>", (a.shift(), a) );
log("a.pop() >>", (a.pop(), a) );
log("a.concat(70,80,90) >>", a.concat(70,80,90), " // Исходная коллекция не изменяется" );
log("a.reverse() >>", a.reverse() );
log("a.join ('; ') >>", a.join ('; '), "\n... и т.д." );
log("\nНекоторые спецефические методы добавление и удаление элементов для коллекций:");
log("a.removeByIndex(0) >>", a.removeByIndex(0));
log("a.removeByValue(10) >>", a.removeByValue(10));
log("a.removeByValues([550,440,300,30,200]) >>", a.removeByValues([550,440,300,30,200]));
log("a.swap(0, a.length-1) >>", a.swap(0, a.length-1));
log("a.append(a) >>", a.append(a));
log("a.insert(2): >>", a.insert(2));
log("a.insert([2,3,4], 2): >>", a.insert([2,3,4], 2));
log("a.set(11, 2) >>", a.set(11, 1));
log("a.set([11,12,13], 2) >>", a.set([11,12,13], 1));
log("a.set(a, a.length) >>", a.set(a, a.length));
log("a.indexOf(12) >>", a.indexOf(12));
log("a.lastIndexOf(12) >>", a.lastIndexOf(12));
log("a.removeByValue(12) >>", a.removeByValue(12), "  // удалено 2 элемента!");
log("a.reduce(function(r){ return (r>13)} ) >>", a.reduce(function(r){ return (r>13)}) );
log("a.forEach(function(r, key, obj){ log('index:', key, 'old val:', r, 'new val:',  obj[key] = r+10); }) >>");
a.forEach(function(r, key, obj){ log("index:", key, "old val:", r, "new val:",  obj[key] = r+10); });
log("a.getIndexByValue(17) >>", a.getIndexByValue(17) );
log("a.getFirstIndexByValue(17) >>", a.getFirstIndexByValue(17));
log("a.getLastIndexByValue(17) >>", a.getLastIndexByValue(17));
log("a.getIndexByValues([21,23]) >>", a.getIndexByValues([21,23]));
log("a.removeAll() >>", a.removeAll(), "a.length =", a.length);
log("\nПроизводительность методов filter(validator, context); reduce(validator); getByKeyValue(name, value); getIndexByKeyValue(name, value), removeByKeyValue(name, value), insert(what, startIndex) и reset(what, counts) с большими коллекциями:");

var max = 5000, i = 0, obj = {},
      b = [], tm = new _timer(), c, total_tm = 0; 
log("\nОбработка коллекции простых объектов obj = { id:{string} value:{string} }, кол-во эл. в коллекции:", max);
tm.start();     for (i=0; i<max; i++) b[i] = { id:"id_"+i, value:"Позиция данных: "+i };    tm.stop(); total_tm += tm.t;
log("Время создания массива объектов:", tm);
tm.start();     a = new Collection(b);    tm.stop(); total_tm += tm.t;
log("Время заполнения коллекции объектов:", tm);
max = max - 1;
tm.start();    c = a.getByKeyValue("value", b[max].value);  tm.stop(); total_tm += tm.t;
log("getByKeyValue('value', '"+b[max].value+"'): найдено", c.length + " эл., время поиска", tm);
tm.start();    c = a.getIndexByKeyValue("value", b[max].value);  tm.stop(); total_tm += tm.t;
log("getIndexByKeyValue('value', '"+b[max].value+"'): найдено", c.length + " эл., время поиска", tm);
c = new Collection(a);
tm.start();    a.removeByKeyValue("value", b[0].value);  tm.stop(); total_tm += tm.t;
log("removeByKeyValue('value', '"+b[0].value+"'): удалено", (c.length - a.length), "эл., время удаления", tm);
var flat = 4;
tm.start();    c = a.filter(function (value, index, coll) { return (index % flat) ? false : true; });  tm.stop(); total_tm += tm.t;
log("a.filter(...) получения каждого "+flat+" эл. коллекции: получено", c.length, "эл., время выборки", tm);
c = new Collection(a);
tm.start();    a.remove(function (value, index, coll) { return (index % flat) ? false : true; });  tm.stop(); total_tm += tm.t;
log("a.remove(...) удаление каждого "+flat+" эл. коллекции: удалено",  (c.length - a.length), "эл., время удаления", tm);
var old_length = c.length
tm.start();    c.insert(a, 0);  tm.stop(); total_tm += tm.t;
log("a.insert(...) вставка "+a.length+" эл. в коллекцию из " + old_length +" эл.: Итоговый размер коллекции",  (c.length), "эл., время вставки", tm);
tm.start();    c.rezet(0);  tm.stop(); total_tm += tm.t;
log("a.reset(0) обнуление всех "+c.length+" эл. коллекции: время обнуления", tm);
log ("\nСуммарное время прохождения тестов:",  total_tm, "ms.")

c.length = a.length = 0; // Коллекции 'убиваются' аналогично встроенным объектам Array.