// --------------------------------------------------------------
// @@@BUILDINFO@@@
// UnitBox
// --------------------------------------------------------------

// TODO:
// Настроить отработку значений UnitBox.value вне допустимого диапазона minvalue и maxvalue... (скачет при использовании счётчика)

/**
 * @class       UnitBox
 * @summary     ScriptUI элемент - настраиваемое редактируемое поле ввода. Представляет собой надстройку над ScriptUI элементом EditText,
 *              предназначен для вывода форматированных величин числового значения и дополнен боксом с кнопками для приращения/уменьшения
 *              значения в элементе.
 *              
 * @property {boolean} isUnitBox    Статическое свойство (только для чтения), включаемое в ресурсную строку элемента, и определяющее тип 
 *                                  ScriptUI объекта как элемент UnitBox (Используется библиотечным методом initWindow() для правильной
 *                                  идентификации и автоматической инициализации компонента в составе объекта Window, а также в составе
 *                                  любых ScriptUI объектов контейнерного типа)
 * @property {UnitValue} [value=0]      Значение поля редактирования (при инициализации указывается как число, после инициализации
 *                                      представляет объект UnitValue с типом, указанным в свойстве unittype)
 * @property {string}   [unittype='cm'] Тип объекта UnitValue, представленного в данном UnitBox-е (см. раздел UnitValue object в
 *                                      справочном документе Adobe JavaScript Tools Guide)
 * @property {number}   [maxvalue=100]  Верхняя граница значений value
 * @property {number}   [minvalue=0]    Нижняя граница значений value
 * @property {number}   [stepdelta=1]   Шаг изминения значения value при нажатии на счётчики
 * @property {number}   [jumpdelta=20]  не используется
 * @property {number}   [characters=8]  Размер поля редактирования
 *
 * @method init         Инициазация элемента управлени. В качестве аргумента получает параметризированный объект с полями, представляющими 
 *                      соответствующие свойства: <div><code>
 *                      {
 *                          value:{number}, 
 *                          unittype:{string}, 
 *                          minvalue:{number}, 
 *                          maxvalue:{number}, 
 *                          stepdelta:{number}, 
 *                          jumpdelta:{number},
 *                          characters:{number} 
 *                      }
 * @method isValid      Возвращает true если объект UnitBox.value содержит корректное значение в пределах допустимого диапазона значений minvalue <= value <= maxvalue
 * 
 * @example Пример включения UnitBox-поля в ресурсную строку
 * var w = new Window("dialog { \
 *         txt:StaticText { text:'Ниже рассположено поле UnitBox:' }, \
 *         box:"+SUI.UnitBox+" \
 *     }");
 * var box = w.box;
 * SUI.initUnitBox(box, { value: 25, stepdelta:20, minvalue:-80, maxvalue:120 });
 * w.show();
 * 
 * 
 * @example Пример вызова addUnitBox() как метода ScriptUI-объекта - контейнера 
 * // (метод также поддерживается объектами Group и Panel):
 * var w = new Window("dialog");
 * w.add("statictext { text:'Ниже рассположено поле UnitBox:' }");
 * // аналогично SUI.initWebLink() - также поддерживаются альтернативные формы вызова данного метода.
 * w.addUnitBox({ value:10, unittype:'pt' }); 
 * w.show();
 * 
 * 
 * @example Пример создания с помощью библиотечного метода:
 * var w = new Window("dialog");
 * w.add("statictext { text:'Ниже рассположено поле UnitBox:' }");
 * SUI.addUnitBox(w, { stepdelta:.25, maxvalue:5, minvalue:-5 });
 * w.show();
 */
var UnitBox = {
    // Ресурсная строка элемента:
    rcString:"group { isUnitBox:true, unittype:'cm', value:0, scroll:Scrollbar {preferredSize:[18, 21], maxvalue:0, minvalue:-100}, edit:EditText{ alignment:['fill','fill']}},",
    // Для использрвания в Window.add(UnitBox):
    toString:function() { return "G" + this.rcString.slice(1, -1); },
    // Некоторые константы по умолчанию
    defaultType:'cm',   // тип объекта UnitBox.value {UnitValue} по умолчанию
    defaultCharacters:8 // размер поля редактирования по умолчанию
};

/**
 * Инициализирует (модифицирует элемент управления Group) элемент UnitBox - Параметризированное поле редактирование, путём размещения в нём
 * и соответствующей настройки ScriptUI элементов Scrollbar и EditText (на которые указывают ссылки UnitBox.scroll и UnitBox.edit)
 *
 * @name initWebLink
 * @function
 * 
 * @param {object} target    ScriptUI-объект Group, представляющий элемент UnitBox
 * @param {string} [param]   параметризированный объект с полями для инициализации свойств объекта UnitBox:
 *                           { value:{number}, unittype:{string}, minvalue:{number}, maxvalue:{number}, stepdelta:{number}, 
 *                             jumpdelta:{number}, characters:{number} }
 *                           значения всех свойств представлены в описании {@link UnitBox Класса UnitBox}
 *
 * @return {ScriptUIObject}       возвращает собственный (проинициализированный) аргумент target;
 */
function initUnitBox(target, param) {

    if (target.children.length == 0) {
        // счётчик scroll как бы перевёрнутый
        target.scroll = target.add("scrollbar {preferredSize:[18, 21], minvalue:-100, maxvalue:0}");
        target.edit = target.add("edittext");
    };
    
    var edit = target.edit,
        scrl = target.scroll;
    // первичная инициализация свойств UnitBox по умолчанию:
    target.spacing = 0;
    // счётчик:
    if (!target.stepdelta) scrl.stepdelta = target.stepdelta = 1;
    if (!target.minvalue)  scrl.maxvalue  = target.minvalue = 0;
    if (!target.maxvalue)  scrl.minvalue  = -(target.maxvalue = 100);
    if (!target.jumpdelta) scrl.jumpdelta = target.jumpdelta = +((target.maxvalue - target.minvalue)*.2).toFixed(6); // 20%
    if (!target.characters) target.characters = UnitBox.defaultCharacters;
    edit.characters = target.characters;
    // UnitValue
    if (!target.unittype) target.unittype = UnitBox.defaultType;
    if (!target.value) edit.text = target.value = new UnitValue(target.minvalue, target.unittype);
    
    // функции смены цвета
    if (typeof toRGBA != 'function') {
        var toRGBA = function (color /* uint */, alpha /* float 0..1.0 */) {
            return [ (color>>>0x10)/255, ((color&0xFF00)/0x100)/255, (color&0xFF)/255, (alpha)||1];
        }
    };
    target.setNormal = function () { this.setTextColor([0, 0, 0, 1]); };
    target.setRed = function () { this.setTextColor([1, 0, 0, 1]); };
    target.setTextColor = function(rgba) {
        if (!rgba) return
        var gfx = this.edit.graphics,
            color = (typeof rgba == 'number' ? toRGBA(rgba) : (rgba.color /* ScriptUIPen */ ? rgba.color : rgba)); 
        gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, color, 1);        
    };
    // Функции установки размера:
    target.watch("characters", function(name, oldVal, newVal) {
        var edit = this.edit,
            egfx = edit.graphics;
        try {
        if (!newVal) newVal = UnitBox.defaultCharacters;
        newVal = +(this.edit.characters = newVal);
        
        var sz = edit.graphics.measureString((new Array(parseInt(newVal)+1)).join("X"));
        sz[0] += 14; sz[1] += 6;
        edit.size = sz;
        
        this.parent.layout.layout(true);
        this.parent.layout.resize(true);
        return newVal;
        } catch(e) { trace(e) }
    });

    // функции валидации
    target.isValid = function(val) {
        var val = arguments.length ? val : this.value;
        if (val instanceof UnitValue) val = val.value;
        return !isNaN(val) && (val >= this.minvalue && val <= this.maxvalue);
    };
    if (typeof target.onValid != 'function')   { target.onValid = function(){ this.setNormal(); } }; // переопределяемый
    if (typeof target.onInvalid != 'function') { target.onInvalid = function(){  this.setRed(); } }; // переопределяемый
    
    target.watch("stepdelta", function(name, oldVal, newVal) { return +(this.scroll[name] = newVal); });
    target.watch("jumpdelta", function(name, oldVal, newVal) { return +(this.scroll[name] = newVal); });
    target.watch("minvalue", function(name, oldVal, newVal) { 
        var val = -(this.scroll.maxvalue = -(+newVal));
        this.jumpdelta = (this.scroll.maxvalue - this.scroll.minvalue) * 0.2;
        return val;
    });
    target.watch("maxvalue", function(name, oldVal, newVal) { 
        var val = -(this.scroll.minvalue = -(+newVal));
        this.jumpdelta = (this.scroll.maxvalue - this.scroll.minvalue) * 0.2;
        return val;
    });
    target.watch("unittype", watch_unittype);
    target.watch("value", watch_value);
    
    function watch_unittype(name, oldVal, newVal) {
        this.unwatch("unittype");
        this.unwatch("value");
        delete this.scroll.onChanging;
        //delete this.edit.onChange;
        //delete this.edit.onChanging;
        
        this.edit.text = (this.value = new UnitValue(this.value.value, newVal));
        this.scroll.value = -this.value.value;
        if (this.isValid()) this.onValid(); else this.onInvalid();
        if (typeof this.onChange == 'function') this.onChange(name, oldVal, newVal);
        
        //this.edit.onChange = editOnChange;
        //this.edit.onChanging = editOnChanging;
        this.scroll.onChanging = scrollOnChanging;
        this.watch("unittype", watch_unittype);
        this.watch("value", watch_value);
        return this.value.type;
    };

    function watch_value(name, oldVal, newVal) {
        this.unwatch("unittype");
        this.unwatch("value");
        delete this.scroll.onChanging;
        //delete this.edit.onChange;
        //delete this.edit.onChanging;

        var val = new UnitValue(newVal, this.unittype);
        if (isNaN(val.value)) {
            this.value = NaN;
            this.edit.text = newVal;
        } else {        
            this.edit.text = (this.value = val).toString();
        };
        if (this.isValid(this.value)) this.onValid(); else this.onInvalid();
        if (typeof this.onChange == 'function') this.onChange(name, oldVal, newVal);

        //this.edit.onChange = editOnChange;
        //this.edit.onChanging = editOnChanging;
        this.scroll.onChanging = scrollOnChanging;
        this.watch("unittype", watch_unittype);
        this.watch("value", watch_value);
        return this.value;
    };

    // обработчики редактирования:
    scrl.onChanging = scrollOnChanging;
    edit.onChange = editOnChange;
    edit.onChanging = editOnChanging;
    
    target.addEventListener("keyup", function(kb) { 
        var parent = this;
        try {
            switch (kb.keyName) {
                case "Up"  : parent.value += (kb.ctrlKey) ? parent.jumpdelta : parent.stepdelta; break;
                case "Down": parent.value -= (kb.ctrlKey) ? parent.jumpdelta : parent.stepdelta; break;
            };
        } catch(e) { e.description }
        kb.stopPropagation();
    }, true);
    // обработчики отображения:
    if (!CC_FLAG) scrl.onDraw = customScrollDraw;
    
    // Метод инициализации
    target.init = function(param) {
        if (typeof param == 'undefined') param = { value:this.value }; else {
            if (typeof param.value == 'undefined') param.value = this.value;
        }
        var target = this,
            et = target.edit,
            scrl = target.scroll;
        if (typeof param.stepdelta != 'undefined') target.stepdelta = param.stepdelta;
        if (typeof param.jumpdelta != 'undefined') target.jumpdelta = param.jumpdelta;
        if (typeof param.characters != 'undefined') target.characters = param.characters;
        if (typeof param.minvalue != 'undefined') target.minvalue = param.minvalue;
        if (typeof param.maxvalue != 'undefined') target.minvalue = param.minvalue;

        if (typeof param.unittype != 'undefined') target.unittype = param.unittype;
        target.value = param.value;
    };
    target.init(param);
    
    return target;
    //
    function editOnChange() {
        var parent = this.parent;
        // Вычисления на лету
        var val, canBeCalculate,
            str = this.text.replace(/\D+$/,"");
        try {
            val = eval(str);
            if (typeof val == 'number') {
                val = new UnitValue(val, parent.unittype)
                val.value = +val.value.toFixed(6);
                canBeCalculate = true;
            } else canBeCalculate = false;
        } catch(e) { canBeCalculate = false; }
        if ( !((new UnitValue(str, parent.unittype)).toString().match(/NaN/) && canBeCalculate)) val = this.text;
     
        parent.value = val;
    };

    
    function editOnChanging() {
        var parent = this.parent;
        if (parent.isValid(new UnitValue(this.text, parent.unittype))) parent.onValid(); else parent.onInvalid();
    };

    function scrollOnChanging() {
        var parent = this.parent,
            val = new UnitValue(-this.value+" " + this.parent.unittype);
        val.value = +val.value.toFixed(6);
        parent.edit.text = val.toString();
        parent.value = val;
        if (parent.isValid()) parent.setNormal(); else parent.setRed();
    };
    
    function customScrollDraw() {
        try {
            var gfx = this.graphics,
                pen = gfx.newPen(0, [.62,.62,.62], 1);
            if (!this._alredyShow) { this.active = this._alredyShow = true; gfx.drawOSControl(); }
            gfx.newPath();
            gfx.moveTo(2, 0); gfx.lineTo(this.size[0]-3, 0);
            gfx.moveTo(2, this.size[1]-1); gfx.lineTo(this.size[0]-3, this.size[1]-1);
            gfx.strokePath(pen);
        } catch(e) { trace(e) }
    };
}; // initUnitBox

/**
 * Добавляет и инициализирует элемент WebLink (Гиперссылку) в заданный контэйнер
 *
 * @name addUnitBox
 * @function
 * 
 * @param {object} target          заданный контэйнер;
 * @param {object} [param]         параметризированный объект с параметрами инициализации для скрола и начального значения поля
 *                                   
 * @return {ScriptUIObject}     возвращает созданный объект addUnitBox
 */
function addUnitBox(target, param) {
    return initUnitBox(target.add(UnitBox.rcString), param);
};

/**
 * Расширение нативных ScriptUI объектов контэйнерного типа методом addUnitBox(param):
 *      Window.addUnitBox(param);
 *      Panel.addUnitBox(param);
 *      Group.addUnitBox(param);
 * Аналогично методу initUnitBox() метод addUnitBox() поддерживает сокращённую (без аргументов) форму вызова
 */
Window.prototype.addUnitBox = Panel.prototype.addUnitBox = Group.prototype.addUnitBox = function(param) {
    return addUnitBox(this, param);
};