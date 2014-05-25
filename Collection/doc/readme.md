# Collection
***Status:*** *Редактируемая версия...* | ***Version:*** *0.1* | ***Last update:*** *25.05.2014*

Модуль представлен объектом **ESCoolection**, который содержит ссылку на конструктор **Collection: `ESCollection.Collection`**

При подключении модуля, конструктор напрямую экспортируется в глобальную область видимости и доступен для использования по прямой ссылке:

```js
	#include "Collection.jsx"

	var c = new Collection();
```
> **Особенность включения Collection.jsx:**
>
> В связи с тем, что в ExtendScript присутствует свой тип *Collection*, не имеющий собственного конструктора (он выступает родительским в отношении встроенных в InDesign DOM /и др./ коллекций) случаются ситуации, когда экспортируемый *ESCollection.Collection* перекрывается таким встроенным типом, в результате при попытке создать коллекцию **`var c = new Collection()`** может возникать исключение: ***ReferenceError: Collection does not have a constructor***. Чтобы этого избегать, сразу после включения коллекций надёжней перестраховаться и явно указать ссылку на нужный конструктор:
>```js
>	#include "Collection.jsx"
>
>	var Collection = ESCollection.Collection;
>	var c = new Collection();
>```
> На работе встроенных объектов это никак не отражается.

Тип **Collection** задуман мной как сборная солянка методов для работы с массивами и коллекциями. Он напрямую наследуется от встроенного в ExtendScript типа Array и обладает всеми его методами и свойствами:

```js
	#include "Collection.jsx"

	var c = new Collection();
	$.writeln(c instanceof Collection); // => true
	$.writeln(c instanceof Array); 		// => true

	c.push(10);
	$.writeln(c.length); // => 1
	$.writeln(c[0]); 	 // => 10
```

Таким образом, объекты с типом **Collection** могут полностью и прозрачно использоваться везде наряду с объектами Array. Кроме встроенных методов массивов, соответствующих стандартам JavaScript 1.5 таких, как:

Методы JavaScript 1.5 | Краткое описание 
--------------- | -----------------
concat();		|
join();			|
pop();			|
push();			|
reverse();		|
shift();		|
slice();		|
sort();			|
splice();		|
unshift();		|
toLocaleString();|
toString();    	|
toSource();		|

все объекты Collection поддерживают методы массивов из стандартов 1.6 и 1.18:

Методы JavaScript 1.6 | Краткое описание 
--------------- | -----------------
indexOf();		|
indexAfter();	|
lastIndexOf();	|
every();		|
filter();		|
forEach();		|
map();			|
some();			|

Методы JavaScript 1.8 | Краткое описание 
--------------- | -----------------
compact();		|
contains();		|
first();		|
flatten();		|
last();			|
max();			|
min();			|
pluck();		|
reduce();		|
reduceRight();	|
reject();		|
select(); 		|
sum();			|

> **Collection/Array.jsx:**
>
> В папке с исходниками находится Файл *Array.jsx* который может быть включён независимо от модуля *Collection*. В этом файле порисходит расширение прототипа встроенного объекта Array методами из стандартов JavaScript 1.6 и 1.8.
>
> В рамках самого модуля, включение этого файла не происходит и прототипы встроенных типов не расширяются.

а также, несколько дополнительных функций и целое семейство методов, ориентированных на работу с коллекциями объектов:

Собственные методы Collection   | Краткое описание 
--------------------------------| -----------------
add(what, index);				|
append(what);					|
copy();							|
getAll();						|
getByIndex(index);				|
getByKey(name);					|
getByKeyValue(key, value);		|
getByValue(value);				|
getByValues(arr);				|
getFirst();						|
getFirstByKey(value);			|
getFirstByKeyValue(key, value);	|
getFirstByValue(value);			|
getFirstIndexByKey(name, index);|
getFirstIndexByKeyValue(name, value, index);|
getFirstIndexByValue(value, index);			|
getIndexByKey(name);			|
getIndexByKeyValue(name, value);|
getIndexByValue(value);			|
getIndexByValues(arr);			|
getLast();						|
getLastByKey(value);			|
getLastByKeyValue(key, value);	|
getLastByValue(value);			|
getLastIndexByKey(name, index);	|
getLastIndexByKeyValue(name, value, index);	|
getLastIndexByValue(value, index);			|
insert(what, index);			|
isValidIndex(index);			|
remove(validator);				|
removeAll();					|
removeByIndex(index);			|
removeByKey(name);				|
removeByKeyValue(name, value);	|
removeByValue(value);			|
removeByValues(arr);			|
rezet(arg);						|
set(what, startIndex);			|
swap(index1, index2);			|
toArray();						|

Имеется полная поддержка цепочек вызовов, кроме того в цепочке могут произвольно объединяться методы из разных функциональных групп:

```js
	var c = new Collection([0, 1], [2, 3], [4, 5], [false, null]);

	// результат: [1, 2, 3, 4, 5]
	$.writeln( c.reduceRight(function(a, b) { return a.concat(b); })
                .compact()
                .filter(function(num){ return num % 2 == 1; })
                .concat([2, 4])
                .sort()
             );
```

### Дополнительная информация:
Многие примеры работы с коллекциями можно найти в html-справке и папках с тестами и примерами: *Collection/snippets, Collection/test*

**Copyright:** © Вячеслав aka Buck, 2013-2014. <slava.boyko@hotmail.com>

**License:** Creative Commons (NonCommercial) [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
