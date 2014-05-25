/* *************************************************************************
*  SnpMVC_SimpleValidation.jsx
*  DESCRIPTION: ������ �������� ���������� � �������������� ���������� MVC
*  @@@BUILDINFO@@@ SnpMVC_SimpleValidation.jsx 1.00 Sat May 24 2014 01:32:34 GMT+0300
* 
* NOTICE: 
*       ������ ������������� ���������� ������ ������������ � 
*       ���������������� �������� ���������� �������������.
* 
*       ���� �������� �������� �� ����� - ��������� ���� ��������������
*       � ������� ����� ����������� ���������:
/* *************************************************************************
* � �������� aka SlavaBuck, 02.01.2014.  slava.boyko@hotmail.com
*/

#include "../../MVC.jsx"

var myApp = new MVCApplication({ caption:"������� �����" });
myApp.Init = function() {
    var app = this,
        w = app.window;
        
    // --------------    
    // ��������� �������� ����:
    w.orientation = 'row';
    w.add("statictext {text:'������� ����: '}");
    
    // --------------    
    // �������������:
    app.addView({
        id:"view",
        view:"EditText { characters:20 }",
        render:function(ctrl, newVal) {
            var gfx = this.graphics,
                status = ctrl.model.isValid(),
                SOLID = gfx.PenType.SOLID_COLOR;
            // �������, ���� ������ �� �������:
            gfx.foregroundColor = gfx.newPen(SOLID, [(status ? 0 : 1), 0, 0], 1);
            this.helpTip = (status ? "�����: " + newVal : newVal + " �� �������� ������");    
        }
    });

    // --------------    
    // ������:
    app.addModel({
        id:"model",
        value:10,
        // ���������� false ���� �������� �� �������� ������:
        validator:function(key, oldVal, newVal, ctrl) {
            return !isNaN(newVal);
        }
    });
    
    // --------------    
    // ��������:  
    app.addController({ binding:"model.value:view.text" });
}; // Init()

myApp.run();

