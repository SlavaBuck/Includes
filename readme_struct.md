### Соглашение по структуре библиотеки:
* Корневая папка содержит набор модулей и других библиотек, которые могут быть совершенно независимо использованы друг от друга кроме тех случаев, когда для них не указана зависимость от кода другой библиотеки/модуля;
* Каждая библиотека представлена в корне основной папки своим заголовочным файлом и папкой с файлами библиотеки (исходники, справка и т.д...);
* Имя заголовочного файла и папки должны иметь одинаковое название и соответствовать имени библиотеки;
* Для подключения и работы с выбранной библиотекой необходимо подключить её заголовочный файл и только его (все зависимости должны быть уже включены в самом заголовочном файле). 

### Структура папок
* Корневая папка содержит заголовочные файлы и папки с исходниками для всех библиотек/модулей;
* Вся реализация модулей/библиотек должна находится в файлах, собранных в папке *src* соответствующей папки модуля;
* Если у модуля/библиотеки имеются расширения и/или дополнения, такой модуль должен иметь собственную папку внутри папки модуля с аналогичной структурой:

> * *`'Имя модуля.jsx'`* 			- заголовочный файл основного модуля
> * *`'Имя модуля.Подмодуль.jsx'`* 	- заголовочный файл	расширения (если есть)
> * < Имя модуля >	- папка модуля      
> 	* `./doc`		- документация, файлы readme и пр...
> 	* `./src`		- исходники 
> 	* `./snippets` - примеры использования
> 	* `./test`	- тесты
> 	* < Под-модуль >: 	папка для расширений (если они есть), внутри родительской
> 		* `./doc`		- аналогично структуре родительской папки модуля
> 		* `./src`		- ...
> 		* `./snippets`
> 		* `./test`
> 

### Соглашение по организации файлов модуля/библиотеки:
* Файлы-заголовки, расположенные в основной корневой папке, представляют собой 'модульные' обёртки для файлов-исходников соответствующего модуля/библиотеки. Если данная библиотека зависит от кода внешних компонентов, в заголовочном файле должны быть включены директивы по их включению. Таким образом, для включения в скрипт того или иного модуля, всегда достаточно в самом скрипте включить только единственный заголовочный файл данного модуля. Всё необходимое должно быть предусмотрено уже в самом заголовочном файле;
* Для файлов исходников практикуется подход: для каждого класса - свой файл, при этом, имена классов и файлов должны соответствовать друг-другу;
* Файлы исходники, представляющие независимые наборы функций (функциональные) по возможности должны содержать функции для работы только с одним классом объектов (с файлами, папками, строками, объектами, массивами и т.д.) и иметь понятное короткое имя во множественном числе, исходя из рода их содержимого (*arrays.jsx, string.jsx, ...*)
* Файлы, представляющие исключительно данные и не содержащие определения каких бы то нибыло методов и функций имеют, как правило, расширение *.jsxinc* (напрмер, константы, строковые либо любые иные ресурсы и т.п.); 
* Файлы, содержащие данные в корректном формате JSON могут иметь расширение *.json*;
* Все прочие файлы имеют расширения *.jsx* и, по возможности, представляют максимально независимые 'боевые' единицы с возможностью их самостоятельного использования без необходимости в остальном коде библиотеки (только там, где это возможно и оправдано).
* Любая библиотека и модуль должны сопровождаться файлами тестов, расположенных в папке тест (методика организации тестирования не регламентируется) и, желательно, файлами с практическими примерами использования в папке snippets
* Всю сопроводительную документацию (в том числе, скомпилированную с исходников) необходимо размещать в папке doc
* Файлы, не имеющие прямого отношения к модулю/библиотеке, но используемые для работы с ней (настройки сборщиков, редакторов и IDE, генераторов документации и т.п.), можно размещать в папке assets;
* Папки модулей/библиотек, помимо оговоренных в соглашении, могут содержать любые другие папки и данные. Главное, чтобы смысл содержимого основных папок не нарушался.

**Copyright:** © Вячеслав aka Buck, 2014. <slava.boyko@hotmail.com>