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
 * @method init         Инициазация элемента управлени. В качестве аргумента получает параметризированный объект с полями, представляющими соответствующие свойства
 * @method isValid      Возвращает true если объект UnitBox.value содержит корректное значение в пределах допустимого диапазона значений minvalue <= value <= maxvalue
 * @method setValue     Устанавливает значение UnitBox.value (одновременно переустанавливает значение счётчика)
 * @method getValue     Возвращает значение UnitBox.value как Number
 * @method getUnitValue Возвращает значение UnitBox.value как UnitValue
 * @method setminValue  Устанавливает нижнюю границу для значений UnitBox.value (производится корректировка счётчика)
 * @method setmaxValue  Устанавливает верхнюю границу для значений UnitBox.value (производится корректировка счётчика)
 * @method setNormal    Устанавливает чёрный(нормальный) цвет текста в поле редактирования (характеризует корректное значение UnitBox.value)
 * @method setRed       Устанавливает красный(выделенный) цвет текста в поле редактирования (характеризует некорректное значение UnitBox.value)
 * @method setCharacters Устанавливает размер поля редактирования
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
 * SUI.addUnitBox(w, { stepdelta:.25 });
 * w.show();
 */
var UnitBox = {
    // Ресурсная строка элемента:
    rcString:"group { isUnitBox:true, unittype:'cm', value:0, spacing:0, scroll:Scrollbar {preferredSize:[18, 21], maxvalue:0, minvalue:-100}, edit:EditText{}},",
    // Для использрвания в Window.add(UnitBox):
    toString:function() { return "G" + this.rcString.slice(1, -1); },
    // Некоторые константы по умолчанию
    defaultUnitValue:'cm' // тип объекта UnitBox.value {UnitValue} по умолчанию
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
        scrl = target.scroll,
        scrl_props = ['stepdelta', 'jumpdelta', 'minvalue', 'maxvalue'];
    // первичная инициализация свойств UnitBox по умолчанию:
    // счётчик:
    if (!target.stepdelta) scrl.stepdelta = target.stepdelta = 1;
    if (!target.minvalue)  scrl.maxvalue  = target.minvalue = 0;
    if (!target.maxvalue)  scrl.minvalue  = -(target.maxvalue = 100);
    if (!target.jumpdelta) scrl.jumpdelta = target.jumpdelta = 20;
    if (!target.characters) edit.characters = target.characters = 8;
    // UnitValue
    if (!target.unittype) target.unittype = UnitBox.defaultUnitValue;
    if (!target.value) edit.text = target.value = new UnitValue(target.minvalue, target.unittype);
    
    target.init = function(param) {
        if (typeof param != 'object') return this;
        var target = this,
            et = target.edit,
            scrl = target.scroll;
        if (typeof param.stepdelta != 'undefined') scrl.stepdelta = target.stepdelta = param.stepdelta;
        if (typeof param.jumpdelta != 'undefined') scrl.jumpdelta = target.jumpdelta = param.jumpdelta;
        if (typeof param.characters != 'undefined') edit.characters = target.characters = param.characters;
        if (typeof param.minvalue != 'undefined') target.setminValue(param.minvalue);
        if (typeof param.maxvalue != 'undefined') target.setmaxValue(param.maxvalue);
    
        target.unittype = (typeof param.unittype != 'undefined') ? param.unittype : UnitBox.defaultUnitValue;
        if (typeof param.value != 'undefined') target.setValue(param.value);
    };

    // Обработчики верхнего уровня
    target.setminValue = function (val) { this.scroll.maxvalue = -(this.minvalue = val); };
    target.setmaxValue = function (val) { this.scroll.minvalue = -(this.maxvalue = val); };
    target.setValue = function (val) {
        var target = this;
        if (val !== NaN) {
            target.value = (typeof val == 'string') ? 
                           ((val.indexOf(" ") != -1) ? new UnitValue(val) : new UnitValue(val + " " + target.unittype)) :
                           (val instanceof UnitValue) ? val : new UnitValue(val, target.unittype);
        } else target.value = NaN;
        if (target.isValid()) {
            target.edit.text = target.value.toString();
            target.setNormal();
            target.setScroll(-target.value.value);
        } else {
            target.edit.text = isNaN(target.value) ? val : target.value;
            target.setRed();
        }
        return target;
    };
    target.getValue = function () { return this.value.value; }
    target.getUnitValue = function () { return this.value; }
    // проверка корректного значения (предположительно target.value синхронизировано с target.edit.text )
    target.isValid = function() {
        var val = this.value;
        return !isNaN(val) && (val.value >= this.minvalue && val.value <= this.maxvalue);
    };

    target.setScroll = function(val) {
        this.scroll.value = val;
    };
    target.setCharacters = function(val) {
        this.edit.characters = val;
    };
    // функции смены цвета
    target.setNormal = function () {
        var gfx = target.edit.graphics;
        gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, [0, 0, 0, 1], 1);
    };
    target.setRed = function () {
        var gfx = target.edit.graphics;
        gfx.foregroundColor = gfx.newPen(gfx.PenType.SOLID_COLOR, [1, 0, 0, 1], 1);
    };
    // обработчики редактирования:
    scrl.onChanging = scrollOnChanging;
    edit.onChange = editOnChange;
    edit.onChanging = editOnChanging;
    // обработчики отображения:
    if (!CC_FLAG) scrl.onDraw = customScrollDraw;
    
    target.init(param);
    
    return target;
    //
    function editOnChange() {
        var parent = this.parent,
            val = parent.value;
        parent.value.value = val.value = +val.value.toFixed(6);
        this.text = val.toString();
        parent.scroll.value = -(val.value);
    };

    function editOnChanging() {
        var parent = this.parent,
            txt = this.text.indexOf(".") == -1 ? parseInt(this.text) : parseFloat(this.text);
        parent.value = isNaN(txt) ? NaN : new UnitValue(txt + " " + parent.unittype);
        if (parent.isValid()) parent.setNormal(); else parent.setRed();
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