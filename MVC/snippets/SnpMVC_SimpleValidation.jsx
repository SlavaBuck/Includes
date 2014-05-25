/* *************************************************************************
*  SnpMVC_SimpleValidation.jsx
*  DESCRIPTION: Пример простого приложения с использованием библиотеки MVC
*  @@@BUILDINFO@@@ SnpMVC_SimpleValidation.jsx 1.00 Sat May 24 2014 01:32:34 GMT+0300
* 
* NOTICE: 
*       Пример использования валидатора модели одновременно с 
*       пользовательской функцией рендеринга представления.
* 
*       Если введённое значение не число - подкрасит поле редактирования
*       и изменит текст всплывающей подсказки:
/* *************************************************************************
* © Вячеслав aka SlavaBuck, 02.01.2014.  slava.boyko@hotmail.com
*/

#include "../../MVC.jsx"

var myApp = new MVCApplication({ caption:"Введите число" });
myApp.Init = function() {
    var app = this,
        w = app.window;
        
    // --------------    
    // настройка главного окна:
    w.orientation = 'row';
    w.add("statictext {text:'Введите чило: '}");
    
    // --------------    
    // Представление:
    app.addView({
        id:"view",
        view:"EditText { characters:20 }",
        render:function(ctrl, newVal) {
            var gfx = this.graphics,
                status = ctrl.model.isValid(),
                SOLID = gfx.PenType.SOLID_COLOR;
            // красный, если модель не валидна:
            gfx.foregroundColor = gfx.newPen(SOLID, [(status ? 0 : 1), 0, 0], 1);
            this.helpTip = (status ? "Число: " + newVal : newVal + " не является числом");    
        }
    });

    // --------------    
    // Модель:
    app.addModel({
        id:"model",
        value:10,
        // Возвращает false если значение не является числом:
        validator:function(key, oldVal, newVal, ctrl) {
            return !isNaN(newVal);
        }
    });
    
    // --------------    
    // Контролёр:  
    app.addController({ binding:"model.value:view.text" });
}; // Init()

myApp.run();

