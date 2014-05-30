// --------------------------------------------------------------
// @@@BUILDINFO@@@ ObjectBrowser.jsx ver 1.10 Sat Oct 19 2013 21:03:53 GMT+0300
// Инспектор JavaScript объектов
// --------------------------------------------------------------
// © Вячеслав aka Buck, 2014. slava.boyko#hotmail.com
/*
*       Просмоторщик свойств и методов инспектируемого объекта, с возможностью просмотра исходного кода для методов и функций.
*       Для просмотра структуры объекта используется ReflectionInfo.
*
* Использование:
*       # include "<include path>/CreateObjectBrowser.jsx"
*       
*       var ObjectBrowser = CreateObjectBrowser();  // CreateObjectBrowser("palette"); // - смена типа главного окна
*       ObjectBrowser.show($);      // в качестве аргумента принимается любой объект JavaScript
*       
*       // Пример:
*       ObjectBrowser.show(myObj);      // отображение методов и свойств объекта myObj
*       ObjectBrowser.show($);          // отображение содержимого глобального вспомогательного объекта $ (helper object), который, в том числе, 
*                                       // содержит ссылку на глобальное пространство имён $.global - также доступное для просмотра.
*       ObjectBrowser.show(alert)       // просмотр глобального метода alert. К сожалению просмотр исходного кода будет недоступен 
*										// для нативных функций ("native code"),
*       ObjectBrowser.show(new Window ("dialog") );  // Создание безымянного объекта ScriptUI Windows, и просмотр всех его свойств.
*/

// Технический релиз
// #include "src/ObjectBrowser/CreateObjectBrowser.jsx"
// Последний релиз
$.evalFile(File($.fileName).parent + "/contrib/ObjectBrowser/CreateObjectBrowser.jsxbin");

var ObjectBrowser = CreateObjectBrowser(); // CreateObjectBrowser("palette"); // - для смены типа главного окна
// ObjectBrowser.show($); 