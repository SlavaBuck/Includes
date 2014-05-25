/* *************************************************************************
*  SnpMVC_View_rebind.jsx
*  DESCRIPTION: Пример простого приложения с использованием библиотеки MVC
*  @@@BUILDINFO@@@ SnpMVC_View_rebind.jsx 1.01 Wed Jan 23 2014 20:28:49 GMT+0200
* 
* NOTICE: 
*       Переключение представлений между различными моделями
* 
/* *************************************************************************
* © Вячеслав aka SlavaBuck, 23.01.2014.  slava.boyko@hotmail.com
*/
#include "../../MVC.jsx"

// Создаём объект приложения:
var myApp = new MVC.Application({ view:"palette" });

// Инициализация:
// Вызов данной функции предусмотрен библиотекой MVC и происходит автоматически из функции run перед выводом главного окна приложения:
myApp.Init = function() { 
    // Настройка главного окна приложения
    // Примечание:
    var  app = this,
            w = app.window;
    w.alignChildren = 'left';
    // Добавляем модель
    var m1 = app.addModel({ id:'model_1', value:{ txt1:"Модель 1", control:{ value: { obj1: { data:"Model 1" }}} } });
    var m2 = app.addModel({ id:'model_2', value:{ txt2:"Модель 2" }, data:"Model 2" });
    // Добавляем представления
    var grp1 = w.add("group { st:StaticText { text:'model_1.value.txt1:' } }"),
           grp2 = w.add("group { st:StaticText { text:'model_2.value.txt2:' } }"),
           grp3 = w.add("group { st:StaticText { text:'Выбор модели:' } }"),
           grp4 = w.add("group { st:StaticText { text:'Редактирование:' } }");
    // Размещаем группы представлений ( edittext и statictext ) по парам в соответствующих группах, добавленных к главному окну приложения. 
    // - Свойство parent при создании
    // представления служит для указания контейнера для добавления соответствующего элемента ScriptUI. По умолчанию, если данное свойство опущено, соответствующий 
    // элемент будет добавляться непосредственно в главное окно приложения.
    // - Свойство render имеет специальное назначение - это должна быть функция, которая (если она определена) будет вызывается диспетчером приложения автоматически 
    // каждый раз при выполнении обновлений связанного с данным представлением свойства модели. Вызов данной функции будет происходить в контексте элемента ScriptUI
    // так же, как и любой другой обработчик событий графического интерфейса (такой как onClick, onChange, onDraw и т.д.). Дополнительно функции будет передан единственный
    // параметр - ссылка на объект-контроллёр, ассоциированный с данным представлением, но в данном примере он не используется (см. пример SnpMVC03_Model_validators.jsx)
    app.addView({ id:"et1", parent:grp1, view:"edittext { characters:15 }" });   
    app.addView({ id:"st1", parent:grp1, view:"statictext", render:stResize }); 
    app.addView({ id:"et2", parent:grp2, view:"edittext { characters:15 }" });   
    app.addView({ id:"st2", parent:grp2, view:"statictext", render:stResize });
    app.addView({ id:"et3", parent:grp4, view:"edittext { characters:15 }", render:stResize });
    // В данном представлении заглушаем синхронизацию данных в реальном времени путём блокировки обработчика, подробнее про свойство control см. в SnpMVC03_Model_validators.jsx 
    app.addView({ id:"dd", parent:grp3, view:"dropdownlist { itemSize:[95,16] } }",
        Init:function() {
            this.add("item", myApp.models[0].value.txt1);
            this.items[0].model = myApp.models[0]; this.items[0].key =  'value.txt1';  this.items[0].key2 = 'value.control.value.obj1.data';
            this.add("item", myApp.models[1].value.txt2);
            this.items[1].model = myApp.models[1]; this.items[1].key =  'value.txt2'; this.items[1].key2 = 'data';
            log("selection", classof(this.selection));
            this.selection = null; log("selection", classof(this.selection));
            //this.selection = null; log("selection", classof(this.selection));            
        },
        control:{
            onChange:function() {
                if (this.selection) { myApp.getViewByID("et3").rebind(this.selection.model, 'text', this.selection.key); }
            }
        }
    });

  
    app.addView({ view:"button { text:'Ok', alignment:'center' }", control:{ onClick:function(){myApp.getViewByID("dd").control.selection = null}} });

    // Добавляем контролёры. 
    // Параметр bind:false запрещает инициализацию представления в момент инициализации контролёра
    app.addController({ binding:"model_1.value.txt1:st1.text", bind:false }); 
    app.addController({ binding:"model_1.value.txt1:et1.text" });
    app.addController({ binding:"model_1.value.txt1:dd.items.0.text" });
    app.addController({ binding:"model_2.value.txt2:st2.text" });
    app.addController({ binding:"model_2.value.txt2:et2.text" });
    app.addController({ binding:"model_2.value.txt2:dd.items.1.text" });
    
    // Корректировка размера для объектов StaticText. 
    // Данная функция нужна для того, чтобы корректировать размер элемента управления StaticText после обновления связанного
    // с ним текста. Если этого не делать - текст будет обрезаться если его длинна превысит длинну строки, заданную в момент инициализации представления (в момент создания
    // объекта statictext и присоединения к главному окну приложения). Кроме того с помощью вызова app.window.layout.layout(true); - корректируется размер главного окна приложе-
    // ния с целью подстройки под общий размер всех его графических элементов.
    function stResize() { 
        var size = this.graphics.measureString(this.text); 
        if (size[0] >= 30 && size[0] <= 300 ) { 
            this.size = [size[0]+30, size[1]+5]; 
            myApp.getViewByID("et3").control.size = this.size;
        }
        app.window.layout.layout(true);
    }
};

// Запуск приложения: Application.run()
myApp.run();