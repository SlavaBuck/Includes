/* *************************************************************************
*  SnpMVC_tutorial.jsx
*  DESCRIPTION: Пример простого приложения с использованием библиотеки MVC
*  @@@BUILDINFO@@@ SnpMVC_tutorial.jsx 1.00 Thu Jan 02 2014 18:33:29 GMT+0200
* 
* NOTICE: 
*       Пример использования влаидптора модели одновременно с 
*       пользовательской функцией рендеринга представления.
* 
*       Рисует диалоговое окно с полем редактирования данных модели. 
*       Если строка данных длиннее 10 символов - модель считается невалидной.
*       Отображение модели происходит одновременно в нескольких
*       связанных с ней представлениях.
* 
/* *************************************************************************
* © Вячеслав aka SlavaBuck, 02.01.2014.  slava.boyko@hotmail.com
*/

#include "../../MVC.jsx"

// Создаём приложение
var myApp = new MVC.Application({ 
        view:"dialog { properties:{resizeable:true} }" 
    });

// Инициализация:
myApp.Init = function() {
    var app = this;
    
    // редактируемая модель
    app.addModel({
        id:"myData",
        value:{ txt:"Очень длинный текст, его можно редактировать." },
        validator:function(key, oldVal, newVal, ctrl) {
            return (newVal.length < 10 || newVal.length > 30) ? false : true;
        }
    });

    // модель-надпись для кнопки очистки
    app.addModel({ 
        id:"myData_2",        
        value:{ txt:"Очистить заголовок окна" },
    });

    // Добавляем представления:
    app.addView({ id:"st", view:"statictext" });
    app.addView({ id:"st1", view:"statictext { alignment:'left' }" });

    // Это представление предназначено для редактирования данных модели:
    app.addView({ 
        id:"et", 
        view:"edittext { characters:30 }", 
        // полная сигнатура параметров метода (ctrl, newVal, oldVal, key):
        // будет вызываться каждый раз при обновлении модели:
        render:function(ctrl) {
            var gfx = this.graphics;
            // меняем цвет текста в зависимости от состояния модели:
            if (ctrl.model.isValid()) { 
                gfx.foregroundColor = gfx.newPen (0, [0,0,0], 1); 
            } else {
                gfx.foregroundColor = gfx.newPen (0, [1,0,0], 1);
            }
        }, 
        // Расширяем элемент управления
        control:{
            onChanging:function() {
                   // получаем объект-контролёр, ассоциированный с данным представлением:
               var ctrl = app.findController(this),
                   // получаем ссылку на модель-надпись для кнопки очистки
                   model = app.getModelByID("myData_2"),
                   // получаем ссылку на кнопку
                   btOk = app.getViewByID("btOk").control;
                   
               // Поскольку мы переопределили обработчик onChanging - контролёр уже не 
               // сможет корректно обновить модель, поэтому это нужно сделать явно:
               ctrl._updateModel();
               
               // в зависимости от состояния меняем всплывающую подсказку и включаем
               // или выкбчаем кнопку btOk:
               if (ctrl.model.isValid()) {
                   btOk.enabled = true;
                   this.helpTip = "Всё хорошо!"; 
               } else {
                   btOk.enabled = false;
                   this.helpTip = "Строка слишком некоректной длинны!";
               }

               model.value.txt = "Очистить заголовок окна";
            }, 
            // Вызываем сообщение об ошибке каждый раз при попытке смены фокуса 
            // с элемента управления, если с моделью в этот момент что-то не в порядке: 
            onChange:function() {
                var ctrl = app.findController(this);
                // Проверка статуса состояния модели:
                if (!ctrl.model.isValid()) { 
                    alert( "Проверьте ввод! \
                            В строке данных содержаться некорректные данные!\n \
                            Строка слишком " + (this.text.length < 10 ? 
                                                       "короткая." : "длинная."), 
                            ctrl.app.name, 
                            true);
                }
            }
        }
    });

    // Данное представление инкапсулирует кнопку для очистки заголовка главного 
    // окна приложения:
    myApp.addView({
        id:"bt", view:"button", 
        control:{
            helpTip:"Click me!",
            onClick:function() {
                // обновляем заголовок главного окна:
                app.window.text = app.caption;
                // меняем надпись на кнопке:
                app.getModelByID("myData_2").value.txt = "Готово!";
            }
        }
    });     

    // Представление для кнопки выхода из приложения. 
    // В случае если модель myData имеет некорректный статус, 
    // данная кнопка становится неактивной.
    app.addView({  
        id:"btOk", 
        view:"button { text:'Ok' }",
        // Делаем кнопку изначально неактивной
        Init:function() {
            this.enabled = false;
        },
        // Кнопка "Ok" для palette не закрывает окно так, как это происходит 
        // для dialog, поэтому делаем это явно (эта необходимость вызвана 
        // особенностью ScriptUI а не MVC):
        control:{ 
            onClick:function() { 
                app.window.close();
            }
        }
    });

    // Добавляем контроллёры
    app.addController({ binding:"myData.value.txt:st.text" });
    app.addController({ binding:"myData.value.txt:st1.text" });
    app.addController({ binding:"myData.value.txt:et.text" });
    // Связываем модель ещё и с заголовком главного окна приложения:
    app.addController({ binding:"myData.value.txt:window.text" }); 
    // привязаваем модель-подпись к представлению-кнопке:
    app.addController({ binding:"myData_2.value.txt:bt.text" });    
};

// Запуск приложения:
myApp.run();


