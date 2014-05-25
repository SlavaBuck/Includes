## PNGLib - Работа с PNG форматом.
***Status:*** *Редактируемая версия...* | ***Version:*** *0.1* | ***Last update:*** *25.05.2014*

>  Основано на работах [Jongware](http://indesignsecrets.com/author/Jongware) и [др.](http://forums.adobe.com/thread/780105?tstart=0).
	
Формирование ScriptUIImage изображений в памяти для использования с графическими элементами управления ScriptUI	

Библиотека предоставляет метод makePng(), который экпортируется в глобальное пространство имён. В собственном пространстве имён дополнительно доступен ряд вспомогательных методов, например adler32(), crc32s(), i2s() и др...

### makePng(dim, RGB[])

Формирует изображение в виде прямоугольника с заданным цветом и возвращает его в формате изображения ScriptUIImage, пригодном для отображения в ScriptUI - элементах управления.

#### Использование:
```js
var cRed = [255, 0, 0];
var img = makePng(64, cRed);         // -> 64x64 image
var img = makePng([64, 32], cRed);   // -> 64x32 image
```
в дальнейшем объекты **img** могут быть использованы с любыми ScriptUI элементами управления (списками, кнопками и т.д.).

**Copyright:** © Вячеслав aka Buck, 2013-2014. <slava.boyko@hotmail.com>

**License:** Creative Commons (NonCommercial) [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)