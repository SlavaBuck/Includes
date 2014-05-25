# ObjectBrowser

Просмоторщик свойств и методов инспектируемого объекта, с возможностью просмотра исходного кода для методов и функций. Для просмотра структуры объекта используется ReflectionInfo.

### Использование:

```js
# include "<include path>/CreateObjectBrowser.jsx"

var ObjectBrowser = CreateObjectBrowser();  // CreateObjectBrowser("palette"); // - смена типа главного окна
ObjectBrowser.show($);      // в качестве аргумента принимается любой объект JavaScript

// Пример:
ObjectBrowser.show(myObj);      // отображение методов и свойств объекта myObj
ObjectBrowser.show($);          // отображение содержимого глобального вспомогательного объекта $ (helper object), который, в том числе, 
                                // содержит ссылку на глобальное пространство имён $.global - также доступное для просмотра.
ObjectBrowser.show(alert)       // просмотр глобального метода alert. К сожалению просмотр исходного кода будет недоступен 
								// для нативных функций ("native code"),
ObjectBrowser.show(new Window ("dialog") );  // Создание безымянного объекта ScriptUI Windows, и просмотр всех его свойств.
```

**Copyright:** © Вячеслав aka Buck, 2014. <slava.boyko@hotmail.com>