/* *************************************************************************
*  SnpMVC_SimpleApplication.jsx
*  DESCRIPTION: Пример простого приложения с использованием библиотеки MVC
*  @@@BUILDINFO@@@ SnpMVC_SimpleApplication.jsx 1.00 Thu Jan 02 2014 18:33:29 GMT+0200
* 
* NOTICE: 
* Продемонстрирован шаблон полноценного приложения в рамках архитектуры MVC. Все данные 
* инкапсулированы в рамках объекта прилоджения. Вся основная инициализация (в т.ч. построение 
* графического интерфейса) происходит в рамках метода Init() приложения. 
* Одновременно продемонстрирован подход к возможностям динамического создания и удаления 
* моделей и связанных с ними представлений, а также переключения представления (EditView) 
* между различными моделями.
* 
/* *************************************************************************
* © Вячеслав aka SlavaBuck, 02.01.2014.  slava.boyko@hotmail.com
*/

#include "../../MVC.jsx"

var myApp = new MVC.Application({
    name:"Приложение MVC",
    version:"1.00",
    caption:"Приложение MVC (MVC v"+MVC.version+")",
});

myApp.Init = function() {
    this.tabs = 0;    // Эта переменная будет выступать в качестве счётчика табов и одновременно учавствовать в формирования id для соответствующих им моделей и представлений
    var app = this; // Локальная ссылка на текущий объект-приложение (используется в  tbPanel.onChange() )
    // Настройка главного окна приложения
    var rc = "palette {  margins:0, spacing:5, preferredSize:[400, 350], properties:{resizeable:true}, \
                                gGrp1:Group { margins:5, spacing:5, alignment:['fill','fill'], alignChildren:['fill','fill'] }, \
                                gGrp2:Group { margins:5, spacing:5, alignment:['fill','bottom'], alignChildren:['left','bottom'] }, \
                                gGrp3:Group { margins:5, spacing:5, alignment:['fill','bottom'], alignChildren:['right','bottom'] } \
                             }";
    // Пересоздаём созданное по умолчанию окно приложения новым объектом окна: 
    app.CreateMainView(rc);
    // Добавляем TabbedPanel, а сам контейнер делаем глобальным свойством приложения для удобства быстрого доступа к нему, например из btAdd.onClick() {...}
    app.tbPanel = app.buildTabsView(app.window.gGrp1).control;
    // Добавляем представление (представляющее EditText) для редактирования заголовков табов и делаем ссылку на него глобальным свойством приложения
    app.EditView = app.buildEditView(app.window.gGrp2);
     // Добавляем представление, содержащие кнопки для добавления и удаления табов
    app.buildBtnsView(app.window.gGrp3);      

    // Переопределим обработчик onChange() для TabbedPanel так, чтобы при смене вкладки представление EditView переключалось на модель-заголовок активной вкладки
    app.tbPanel.onChange = function() {
        if (this.selection) {
            // Определяем модель, соответствующую активной вкладке, по значению её свойства text, которое в нашей программе отвечает (соответствует и равняется) заголовку самой вкладки
            var currentModel = app.models.getFirstByKeyValue('text', this.selection.text);
            // Переустанавливаем обработчик поля редактирования на активную модель (соответствующую активной вкладке)
            if (currentModel) app.EditView.rebind(currentModel);
        }
    }
};

// Добавляем элемент TabbedPanel к главному окну приложения
myApp.buildTabsView = function(cont) {
    return this.addView ({
        parent:cont,            // родительский контейнер
        view:"tabbedpanel", // добавляемый элемент
    });
};

// Добавляем представление, содержащие элемент edittext, с помощью которого можно будет редактировать заголовки табов
myApp.buildEditView = function(cont) {
    cont.add("statictext { text:'Имя вкладки:' }");
    return this.addView({
        parent:cont,
        view:"edittext { alignment:['fill','fill'] }"
    });
};

// Добавляем кнопки и тут-же определяем обработчики для них
myApp.buildBtnsView = function(cont) {
    var btAdd = cont.add("button { text:'+', helpTip:'Нажмите чтобы добавить вкладку' }");
    var btDel = cont.add("button { text:'-', helpTip:'Нажмите чтобы удалить вкладку' }");
    var app = this;
    // ---
    // Определяем обработчики:
    btAdd.onClick = function() {
        // Добавляем новую вкладку:
        var currentModel = app.addModel({ text:"myTab"+(app.tabs++) }); // модель представляет заголовок вкладки и служит для его редактирования
        var currentView = app.addView({                                                     // представлением является эл. Tab, добавляемый к эл.TabbedPanel
            parent:app.tbPanel,   
            view:"tab",              
            Init:function() {
                app.window.layout.layout(true); // Нужно для правильного обновления TabbedPanel в рамках ScriptUI
            }
        });
        app.tbPanel.selection = app.tbPanel.children[app.tbPanel.children.length-1];            // После добавления вкладки - делаем её активной
        app.addController({  binding:currentModel.id+".text:"+currentView.id +".text" });   // связываем вновь созданные модель и представления (сдесь произойдёт присвоение заголовка вкладке)
        // Переустанавливаем обработчик поля редактирования на активную модель (соответствующую активной вкладке), это также одновременно приведёт к инициализации
        // представления данными из модели. Теперь, мы можем редактировать заголовок вкладки и изминения будут сразу в ней отображаться...
        app.EditView.rebind(currentModel);
    };
    
    btDel.onClick = function() {
        // Удаляем текущую вкладку:
        if (app.tbPanel.selection) {
            // запоминаем index активной(удаляемой вкладки)
            var index = 0;
            while (app.tbPanel.children[index].text != app.tbPanel.selection.text) index++;
            var ctrl = app.findController(app.tbPanel.selection);
            if (ctrl) {
                app.removeMVC(ctrl);
                // После удаления - переустанавливаем активную вкладку и соответственно переинициализируем представление EditView (простым вызовом .notify(...) ).
                if (index < app.tbPanel.children.length) {
                    app.tbPanel.selection = index;
                } else {
                    if (index > 0) { 
                        app.tbPanel.selection = index -1;
                    } else {
                        // Вкладок нет - app.tbPanel.selection = null;
                        app.EditView.control.text = "";
                    }
                }
            }
            // Обновляем EditView:
            app.tbPanel.notify('onChange');
        }
    };

};

// Запуск приложения: Application.run()
myApp.run();