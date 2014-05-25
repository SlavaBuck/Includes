/* *************************************************************************
*  SnpMVC_Model_multipleViews.jsx
*  DESCRIPTION: Пример связывания одной модели с несколькими представлениями
*  @@@BUILDINFO@@@ SnpMVC_Model_multipleViews.jsx 1.01 Wed Jan 22 2014 20:28:49 GMT+0200
* 
* NOTICE: 
* Продемонстрировано связывание различных свойств одной модели со множеством различных 
* представлений. Одновременно продемонстрированы дополнительные опции при создании 
* представлений (parent и render).
* Пример также демонстрирует, что при модификации определённого свойства модели срабатывают 
* только те контроллёры, которые связанны с данным свойством, а не все прочие, которые так или 
* иначе могут быть связаны с данной моделью.
* 
/* *************************************************************************
* © Вячеслав aka SlavaBuck, 22.01.2014.  slava.boyko@hotmail.com
*/
#include "../../MVC.jsx"

// Создаём объект приложения:
var myApp = new MVC.Application({ view:"dialog" });

// Инициализация:
// Вызов данной функции предусмотрен библиотекой MVC и происходит автоматически из функции run перед выводом главного окна приложения:
myApp.Init = function() { 
    // Настройка главного окна приложения
    var  app = this,
            w = app.window;
    w.alignChildren = 'left';
    // Добавляем модель
    app.addModel({
        id:"myData", 
        value:{ txt1:"Tекст 1",  txt2:"Tекст 2", txt3:"Tекст 3", txt4:"Текст 6" } 
    });
    // Добавляем представления
    var grp1 = w.add("group { st:StaticText { text:'myData.value.txt1:' } }"),
           grp2 = w.add("group { st:StaticText { text:'myData.value.txt2:' } }"),
           grp3 = w.add("group { st:StaticText { text:'myData.value.txt3:' } }"),
           grp4 = w.add("group { st:StaticText { text:'myData.value.txt4:' } }");
    // Размещаем группы представлений ( edittext и statictext ) по парам в соответствующих группах (grp1, grp2...), 
    app.addView({ id:"et1", parent:grp1, view:"edittext { characters:15 }" });   
    app.addView({ id:"st1", parent:grp1, view:"statictext", render:stResize }); 
    app.addView({ id:"et2", parent:grp2, view:"edittext { characters:15 }" });   
    app.addView({ id:"st2", parent:grp2, view:"statictext", render:stResize });
    // В данном представлении заглушаем синхронизацию данных в реальном времени 
    // путём блокировки обработчика onChanging
    app.addView({ id:"et3", parent:grp3, view:"edittext { characters:15 }", control:{onChanging:false} });
    app.addView({ id:"st3", parent:grp3, view:"statictext", render:stResize });
    app.addView({ id:"dd", parent:grp4, view:"dropdownlist { itemSize:[95,16], properties:{ items:['Текст 4', 'Текст 5', 'Текст 6'] } }" })//.control.selection = 0;
    app.addView({ id:"st4", parent:grp4, view:"statictext", render:stResize });    
    app.addView({ view:"button { text:'Ok', alignment:'center' }" });

    // Добавляем контролёры. 
    app.addController({ binding:"myData.value.txt1:st1.text", bind:false  }); // Параметр bind:false запрещает инициализацию представления в момент инициализации контролёра
    app.addController({ binding:"myData.value.txt1:et1.text" });
    app.addController({ binding:"myData.value.txt2:st2.text" });
    app.addController({ binding:"myData.value.txt2:et2.text" });
    app.addController({ binding:"myData.value.txt3:st3.text" });
    app.addController({ binding:"myData.value.txt3:et3.text" });
    app.addController({ binding:"myData.value.txt4:dd.selection.text" }); // Элемнты dropdownlist и listbox следует привязывать используя их свойство selection
    app.addController({ binding:"myData.value.txt4:st4.text" });
    
    // Корректировка размера для объектов StaticText: 
    // Если этого не делать - текст будет обрезаться если его длинна превысит длинну строки, заданную в момент создания 
    // представления statictext. 
    // Кроме того, с помощью вызова app.window.layout.layout(true); - корректируется размер главного окна приложения 
    // с целью подстройки под общий размер всех его графических элементов.
    function stResize(ctrl, newVal, oldVal, key) { this.size = this.graphics.measureString(this.text); app.window.layout.layout(true); };
};

// Запуск приложения:
myApp.run();