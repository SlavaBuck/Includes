/* *************************************************************************
*  SnpMVC_Model_and_Views.jsx
*  DESCRIPTION: Пример простого приложения с использованием библиотеки MVC
*  @@@BUILDINFO@@@ SnpMVC_Model_and_Views.jsx 1.01 Wed Jan 22 2014 20:37:46 GMT+0200
* 
* NOTICE: 
* Продемонстрировано совместное использование: 
*       - валидатора модели;
*       - пользовательская функция рендеринга представления, управляющая отображением элемента
*         управления в зависимости от состояния ассоциированной с ним модели. 
*
* В программе создаётся две модели, одна из которых служит в качестве надписи кнопки, вторая - 
* представляет основные данные приложения и связывается с несколькими представлениями (включая
* заголовок главного окна). В зависимости от длинны текста отображется поле редактирования - одно из
* представлений, связанных с этой моделью.
* Продемонстрировано, как операции редактирования данных модели сразу отображаются на всех её
* представлениях. 
/* *************************************************************************
* © Вячеслав aka SlavaBuck, 22.01.2014.  slava.boyko@hotmail.com
*/

#include "../../MVC.jsx"

var myApp = new MVC.Application({
    name:"Приложение MVC",
    version:"1.00",
    caption:"Приложение MVC (MVC v"+MVC.version+")",
    // Декларация гавного представления приложения (если не указано - по умолчанию dialog) 
    view:"dialog { properties:{resizeable:true} }"
});

myApp.Init = function() {
        
    var myData = myApp.addModel({
        id:"myData",
        value:{ txt:"Очень длинный текст, его можно редактировать." },
        validator:function(key, oldVal, newVal, ctrl) {
            return (newVal.length < 10 || newVal.length > 30) ? false : true;
        }
    });

    var myData1 = myApp.addModel({ 
        id:"myData_2",        
        value:{ txt:"Очистить заголовок окна" },
    });
    
    // Добавляем представления:
    myApp.addView({ id:"st", view:"statictext" });
    myApp.addView({ id:"st1", view:"statictext { alignment:'left' }" });

    myApp.addView({ 
        id:"et", 
        view:"edittext { characters:30 }", 
        render:function(ctrl) {
            var gfx = this.graphics;
            if (ctrl.model.isValid()) {
                gfx.foregroundColor = gfx.newPen (0, [0,0,0], 1); // gfx.PenType.SOLID_COLOR == 0
                this.helpTip = "Всё хорошо";        
            } else {
                gfx.foregroundColor = gfx.newPen (0, [1,0,0], 1);
                this.helpTip = "Неправильная длинна строки!\nСтрока слишком "+ 
                                ((this.text.length < 10) ? "короткая." : "длинная.");
            }
        }, 
        // Расширяем элемент управления
        control:{
            onChanging:function() {
               // получаем объект-контролёр, ассоциированный с переданным представлением:
               var controller = myApp.findController(this);
               // Поскольку мы переопределили обработчик onChanging - контролёр уже не сможет корректно обновить модель,
               // поэтому это нужно сделать явно:
               controller._updateModel();
               // Получаем представление кнопки ok:
               var btOk = myApp.getViewByID("btOk");
               // обновляем статус кнопки "ok" в соответствии со статусом модели,
               // если модель не валидна - кнопка станет неактивной
               btOk.control.enabled = controller.model._status_;  
               myData1.value.txt = "Очистить заголовок окна";
            }, 
            // Вызываем сообщение об ошибке каждый раз при попытке смены фокуса с элемента управления если
            // если с моделью в этот момент что-то не в порядке. 
            onChange:function() {
                var controller = myApp.findController(this);
                // Проверка статуса состояния модели:
                if (!controller.model.isValid()) { 
                    alert("Проверьте ввод! В строке данных содержаться некорректные данные!\n \
                        Строка слишком " + ((this.text.length < 10) ? "короткая." : "длинная."), 
                        controller.app.name, true);
                }
            }
        }
    });
    // Данное представление представляет кнопку для очистки заголовка главного окна приложения
    myApp.addView({
        id:"bt", view:"button", 
        control:{
            helpTip:"Click me!",
            onClick:function() {
                myApp.window.text = myApp.caption; // обновляем заголовок главного окна
                myData1.value.txt = "Готово!";
            }
        }
    }); 
    // Данное представление представляет кнопку для выхода из приложения. В случае если модель myData имеет некорректный статус, данная кнопка будет неактивна. При 
    // этом активностью данной кнопки управляет обработчик представления связанного с инспектируемой моделью.
    var btOk = myApp.addView({  
        id:"btOk", 
        view:"button { text:'Ok' }",
        // Функция Init() имеет особое назначения, она присоединяется к представлению и автоматически вызывается (однократно) сразу после подключения данного 
        // представления к главному окну приложения.Вызов функции происходит в контексте самого элемента управления ScriptUI а не объекта представления.
        Init:function() {
            this.enabled = false;
        },
        // Кнопка "Ok" для palette не закрывает окно так, как это происходит для dialog, поэтому делаем это явно (это необходимость вызвана особенностью ScriptUI а не MVC):
        control:{ 
            onClick:function() { 
                myApp.window.close();
            }
        }
    });

    // Добавляем контроллёры
    myApp.addController({ binding:"myData.value.txt:st.text" });
    myApp.addController({ binding:"myData.value.txt:st1.text" });
    myApp.addController({ binding:"myData.value.txt:et.text" });
    myApp.addController({ binding:"myData_2.value.txt:bt.text" });
    myApp.addController({ binding:"myData.value.txt:window.text" }); // Связь с представлением window - представление 'window' всегда представляет главное окно приложения.
};

// Запуск приложения:
myApp.run();