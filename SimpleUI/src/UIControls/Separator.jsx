// --------------------------------------------------------------
// @@@BUILDINFO@@@
// Separator Динамический сепаратор, с поддержкой перетаскивания мышкой
// --------------------------------------------------------------

/**
 * @class       Separator
 * @summary     ScriptUI элемент - Сепаратор. Реализована поддержка двух типов сепараторов: динамические -
 *  поддерживают механизм перетаскивания мышкой; статические - представляют простую разделительную линию.
 *  Тип сепаратора может быть задан на этапе инициализации путём указания свойства dragged (true для динамических).
 *  Дополнительно, путём указания числового свойства width поддерживается управление шириной линии, представляющей сепаратор
 *  (по умолчанию для статических сепараторов ширина составляет 2 пикс., для динамических 5 пикс.)
 *
 * @property {boolean} isSeparator  Статическое свойство (только для чтения), включаемое в ресурсную строку элемента, и определяющее тип 
 *                                  ScriptUI объекта как элемент Сепаратор (Используется библиотечным методом initWindow() для правильной
 *                                  идентификации и автоматической инициализации компонента в составе объекта Window, а также в составе
 *                                  любых ScriptUI объектов контейнерного типа)
 * @property {boolean} dragged Свойство, включаемое в ресурсную строку элемента, определяющее тип сепаратора (true - динамический,
 *                             поддерживающий перетаскивание мышкой, false - статический, простая разделительная линия)
 * @property {number} width    Свойство, включаемое в ресурсную строку элемента, определяет ширину линии в пикселях, представляющей
 *                             сам сепаратор (по умолчанию: 2 для статических, 5 для динамических сепараторов)
 *                             вызове Window.add(Separator.rcString);
 * @method   toString   
 * 
 * Qexample Пример включения сепаратора в ресурсную стору
 * //   также строку sp:"+SUI.Separator+" \
 * //   можно заменить на sp:Panel { isSeparator:true, dragged:false, width:2, margins:0, spacing:0, line:Panel  { margins:0, spacing:0, visible:false } }
 * //   (указав свои значения для dragged: и width:2) и затем использовать вызов SUI.initSeparator(w.sp) без дополнительных параметров.
 * var w = new Window("dialog { \
 *         txt:StaticText { text:'Ниже рассположен сепаратор:' }, \
 *         sp:"+SUI.Separator+" \
 *         txt:StaticText { text:'Выше рассположен сепаратор.' }  \
 *     }");
 * SUI.initSeparator(w.sp);
 * // Альтернативные формы вызовы метода (указанные параметры совпадают с параметрами по умолчанию)
 * SUI.initSeparator(w.sp, false);
 * SUI.initSeparator(w.sp, false, 2);
 * SUI.initSeparator(w.sp, { dragged:false } );
 * SUI.initSeparator(w.sp, { dragged:false, width:2 } );
 * w.show();
 * 
 * @example Пример вызова addSeparator() как метода ScriptUI-объекта - контейнера 
 * // (также метод поддерживается объектами Group и Panel):
 * var w = new Window("dialog");
 * w.add("statictext { text:'Ниже рассположен сепаратор:' }");
 * // аналогично SUI.initSeparator() - также поддерживаются альтернативные формы вызова данного метода.
 * w.addSeparator(); 
 * // можно и так: SUI.initSeparator(w.add(SUI.Separator));
 * w.add("statictext { text:'Выше рассположен сепаратор:' }");
 * w.show();
 * 
 * @example Пример вызова метода глобального метода:
 * var w = new Window("dialog");
 * w.add("statictext { text:'Ниже рассположен сепаратор:' }");
 * // будет создан перемещаемый сепаратор (также поддерживаются альтернативные формы вызова).
 * SUI.addSeparator(w, true);
 * w.add("statictext { text:'Выше рассположен сепаратор:' }");
 * w.show();
 */
var Separator = {
    // Включается в общую ресурсную строку диалога:
    rcString:"panel { isSeparator:true, dragged:false, width:2, margins:0, spacing:0, line:Panel  { margins:0, spacing:0, visible:false } },",
    // Для использрвания в Window.add(Separator):
    toString:function() { return "P" + this.rcString.slice(1, -1); }
};

/**
 * Инициализирует сепаратор, заданный ресурсной строкой Seperator
 *
 * @name initSeparator
 * @function
 * 
 * @param {object} target          ссылка на Сепаратор;
 * @param {string} [dragged=false] тип сепаратора, если true - сепаратор динамический (поддерживает перетаскивание
 *                                 мышкой). По умолчанию false - сепаратор статический (обычная разделительная линия).
 *                                 Альтернативная форма вызова: параметры dragged и width могут передаваться одним
 *                                 аргументом в виде параметризированного объекта с соответствующими полями, пример:
 *                                 { draggged:false, width:2 }, при этом - любое поле может отсутствовать, любое поле с
 *                                 непредусмотренным именем игнорируется.
 * @param {number} [width=2]       ширина сепаратора в точках (по умолчанию для статических сепараторов wdth = 2,
 *                                 для динамических сепараторов wdth = 5).
 * 
 * @return {ScriptUIObject}     возвращает проинициализированный объект-сепаратор target;
 *
 * @example Альтернативные формы инициализации активного сепаратора:
 * // w.sp - ссылается на ранее созданный сепаратор
 * // указанные параметры для всех примеров совпадают с параметрами по умолчанию для динамических сепараторов:
 * SUI.initSeparator(w.sp, true);
 * SUI.initSeparator(w.sp, true, 5);
 * SUI.initSeparator(w.sp, { dragged:true } );
 * SUI.initSeparator(w.sp, { dragged:true, width:5 } );
 */
function initSeparator(target, dragged, width) {
    // Определяем ориентацию родительского контейнера, и благодаря ей, настраиваемся под вертикальный или горизонтальный сепаратор
    if (typeof dragged == 'object') return initSeparator (target, dragged.dragged, dragged.width);
    target._dimension = (target.parent.orientation == 'row' ) ? 0: 1;
    target.alignment = (target._dimension == 0) ? ['left','fill'] : ['fill','top'];
    if (arguments.length > 1) { 
        target.width = (target.dragged = dragged) ? 5 : 2;
    } else if (!target.hasOwnProperty("dragged")) {
        target.dragged = false; target.width = 2;
    }
    target.width = (typeof width == 'number') ? width : parseInt(target.width);
    if (isNaN(target.width)) target.width = target.dragged ? 5 : 2;
    if (!target.hasOwnProperty("isSeparator")) target.isSeparator = true;
    // Устанавливаем обработчики специальных свойств:
    target.watch("isSeparator", function() { return true; }); // только для чтения (Что-то не пашет...)
//~     target.watch("width", watch_width);
//~     target.watch("dragged", watch_dragged);
    if (!target.dragged) {
        // Обычная статическая линия
        target.maximumSize[target._dimension] = target.minimumSize[target._dimension] = target.width;
        return target;
    }
    // Настраиваем внутренние переменные
    target.pos = {x:0, y:0 };
    target._step = (target._step) || 2; // Коофициент перемещения сепаратора при движении мышки:
    target._moving = (target._moving === undefined)? false:target._moving;
    target._index = null; 
    target._leftctr = null; 
    target._rightct = null;
    target.__hwnd__ = null;
    // Фиксируем размеры
    target.maximumSize[target._dimension] = target.minimumSize[target._dimension] = target.width;
    target.line.maximumSize[target._dimension] = target.line.minimumSize[target._dimension] = ((target.width - 3) > 0) ? target.width - 3: 1;
    target.line.alignment = (target._dimension == 0) ? ['centre','fill'] : ['fill','centre'];
    // Обработчики ScriptUI событий для динамического сепаратора:
    target._onMouseDown = separator_onMouseDown;
    target._onMouseUp = separator_onMouseUp;
    target._onMouseMove = separator_onMouseMove;
    target._onMouseOut = separator_onMouseOut;
    target.addEventListener ('mousedown', separator_onMouseDown);
    target.addEventListener ('mouseup', separator_onMouseUp);
    target.addEventListener ('mousemove', separator_onMouseMove);
    target.addEventListener ('mouseout', separator_onMouseOut);
    return target;
    // Вспомогательные методы:
    // TODO: Идея сделать свойства активными (в момент переинициализации наблюдатель отключается...)
    function watch_dragged(name, oldValue, newValue) {
        var newValue = !!newValue;
        target.unwatch("dragged")
        SUI.initSeparator(target, target.dragged, newValue);
        target.parent.layout.layout(true);
        target.watch("dragged", watch_dragged);
        return newValue;
    };
    function watch_width(name, oldValue, newValue) {
        target.unwatch("width")
        SUI.initSeparator(target, target.dragged, newValue);
        target.parent.layout.layout(true);
        target.watch("width", watch_width);
        return newValue;
    };
    // target.enable = separator_enable;
    // target.disable = separator_disable;
    // ---------------------------------------------------------------------------------------------------
    // Обработчики:
    // ---------------------------------------------------------------------------------------------------
    function separator_onMouseMove(e) { 
        this.line.visible = true;
        // Если мы не двигаемся, если мы единственные в контейнере или нет одного из соседей - на выход!
        if ( (!this._moving) || (this._index == 0) || (this._rightctr === null ) || (this._leftctr === null) ) return; 
        // Определяем смещение мыши относительно прежних кординат мыши
        var step = (this._dimension == 0) ? e.screenX - this.pos.x : e.screenY - this.pos.y;
        // сохраняем новые координаты мыши (в следующий раз смещение определяется уже относительно этих координат)
        //if (this._rightctr === null ) step = step + e.clientY;                
        this.pos.x = e.screenX;
        this.pos.y = e.screenY;
        // Получаем соседей, размеры которых будем менять
        var leftchild = (this._leftctr === null) ? null : this.parent.children[this._leftctr];        
        var rightchild = (this._rightctr === null) ? null : this.parent.children[this._rightctr];
        // меняем размеры соседей с проверкой выхода их границ за допустимые пределы minimumSize - maximumSize
        var left_size_old = leftchild.size[this._dimension];
        var left_size = left_size_old + step;
        var left_min = (leftchild.minimumSize[this._dimension]) ||0;
        var left_max = (leftchild.maximumSize[this._dimension]) || (this._dimension==0) ?  $.screens[0].right : $.screens[0].bottom; // пока как то так...
        if ( (left_size >= left_min) && (left_size <= left_max) ) {
            // Если левый сосед в пределах minimumSize - maximumSize, есть смысл продолжать рассчитывать размеры правого соседа
            var right_size_old = rightchild.size[this._dimension];
            var right_size = right_size_old - step;                    
            var right_min = (rightchild.minimumSize[this._dimension])||0;
            var right_max = (rightchild.maximumSize[this._dimension])|| (this._dimension==0) ?  $.screens[0].right : $.screens[0].bottom; // пока как то так...
            if ( (right_size >= right_min) && (right_size <= right_max) ) {
                // Если правый сосед в пределах minimumSize - maximumSize, пробуем менять размеры соседей, начиная с левого:
                leftchild.size[this._dimension] = left_size;
                if (leftchild.layout !== undefined) { 
                    leftchild.layout.resize(); // Если сосед контэйнер - перерисуем его содержимое
                    if (leftchild.size[this._dimension] == left_size_old) { 
                        // Если размеры не изменились, значит слева контейнер и он упёрся в ограничения размеров своих потомков, соответственно -
                        this._onMouseUp(e);
                        return; // - ничего делать не нужно - молча на выход!
                    }
                } 
                // Левый сосед успешно поменял размеры, теперь пробуем изменить размеры правого соседа:
                rightchild.size[this._dimension] = right_size;
                if (rightchild.layout !== undefined) { 
                    rightchild.layout.resize()               // Если сосед контэйнер - перерисуем его содержимое,
                    if (rightchild.size[this._dimension] == right_size_old) {  // ..но если размеры не изменились
                        if (leftchild.layout !== undefined) {                            // ..и левый сосед был контэйнером - 
                            leftchild.size[this._dimension] = left_size_old;         // ..вернём ему прежние размеры
                            leftchild.layout.resize();                                          // ..после чего незабудем перерисовать его и 
                        }                                                                               // ..и на выход..
                        this._onMouseUp(e);                                                 // ..имитируя отпускание кнопки мыши.
                    }
                }
                // Прошло изменение размеров для обоих контэйнеров, значит - перерисовываем родительский контэйнер и можно уходить!
                this.parent.layout.layout(true);
                return;                      
            } // Не прошли по размерам для right_size
        } // Не прошли по размерам для left_size
        // Если мы тут, значит мышка ушла в мёртвую зону или соседи не могут меняться, поэтому делаем вид, что мы отпустили кнопку на мышки ()
        this._onMouseUp(e);
    };
    // --------------------------------------------------------------------------------------------------------------------------------------------------   
    function separator_onMouseDown (e) {
        this._index = null;  // Наш индекс в коллекции children родительского контейнера:
        this._leftctr = null; // Левый сосед (если он есть), размер которого может изменяться 
        this._rightct = null; // Правый сосед (если он есть), размер которого может изменяться 
        this.__hwnd__ = null; // Ссылка на главное окно диалога (или palette), в рамках которого был инициирован сепаратор
        var i = 0,
              children = this.parent.children, 
              max = children.length;  
        // Определяем себя в коллекции children родительского контейнера:
        for (i=0; i < max; i +=1) {
          if (children[i] === this) { this._index = i; break }
        }
        // Определяем ближайшего левого соседа (если он есть), размер которого может изменяться
        if (this._index > 0) { // if false - I am first controls!
            this._leftctr = this._index - 1;
            for (i = this._index - 1; i >= 0; i -=1) {
                if (children[i].alignment !== undefined ) {
                    if (children[i].alignment[this._dimension] !== undefined) {
                        if (children[i].alignment[this._dimension] == 'fill' ) { this._leftctr = i; break; }
                    }
                }
            }
            // Если соседей с установленным свойством .alignment не найдено - принудительно выбираем ближайшего слева
            if (this._leftctr === null) { this._leftctr = this._index - 1; }
        } else {  this._leftctr = null; } // this._index == 0  - Такого быть не должно!
        
        // Определяем по тому же принципу ближайшего правого соседа (если он есть)
        if (this._index < max) { // if false - I am first controls!
            this._rightctr = this._index + 1;
            for (i = this._index + 1; i <= max; i +=1) {
                if (children[i] === undefined) { this._rightctr = null;  break; }
                if (children[i].alignment !== undefined ) {
                    if (children[i].alignment[this._dimension] !== undefined) {
                        if (children[i].alignment[this._dimension] == 'fill' ) { this._rightctr = i;  break; }
                    }
                }
            }
            if (this._rightctr === null) { this._rightctr = this._index + 1; }
        } else {  this._rightctr = null; }
        // Сохраняем текущие коор. мыши (по ним в _onMouseMove будем смотреть куда двигаемся!)
        this.pos.x =e.screenX;
        this.pos.y =e.screenY;
        // Устанавливаем обработчик отслеживание мыши в главном родительском окне
        this.__hwnd__ = this.parent;
        // Для начала найдём главное родительское окно (у него свойства parent всегда = null
        while ( this.__hwnd__.parent !== null) { this.__hwnd__ =  this.__hwnd__.parent };
        // Теперь создаим ему свойство __separator__ (или обновим его значение) и присвоим ему ссылку на себя.
        // Это позволяет разным сепараторам одного и того же окна каждый раз переустанавливать это свойство на себя
        // и родительское окно будет правильно переадрисовывать события нужным сепараторам
        this.__hwnd__.__separator__ = this;
        this.__hwnd__.addEventListener ('mousemove', separator_onMouseMove_redirect );
        this.__hwnd__.addEventListener ('mouseup', separator_onMouseUp_redirect);
        //this.__hwnd__.addEventListener ('mouseout', separator_onMouseUp_redirect);
        this._moving = true; // Флаг состояния - используется в _onMouseMove
                        //  ---- идея ----
                        // переписать так, чтобы обработчики регестрировать не в родительском контэйнере, а в основном окне диалога!
    };
    // --------------------------------------------------------------------------------------------------------------------------------------------------   
    function separator_onMouseUp (e) { 
       this._moving = false;
       this.line.visible = false;
       this.__hwnd__.removeEventListener ('mousemove', separator_onMouseMove_redirect);
       this.__hwnd__.removeEventListener ('mouseup', separator_onMouseUp_redirect);
       //this.__hwnd__.removeEventListener ('mouseout', separator_onMouseUp_redirect);
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------- 
    function separator_onMouseOut (e) { 
        if (!this._moving) { this.line.visible = false; } 
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------- 
    function separator_onMouseMove_redirect (e) {
        this.__separator__._onMouseMove.call(this.__separator__, e);
        //this.__separator__.notify ('mousemove');
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------- 
    function separator_onMouseUp_redirect (e) {
        this.__separator__._onMouseUp.call(this.__separator__, e);
        //this.__separator__.notify ('mouseup');
    };
}; // SeparatorInit

/**
 * Добавляет и инициализирует сепаратор в заданный контэйнер
 *
 * @name addSeparator
 * @function
 * 
 * @param {object} target          заданный контэйнер;
 * @param {string} [dragged=false] тип сепаратора, если true - сепаратор динамический (поддерживает перестаскивание
 *                                 мышкой). По умолчанию false - сепаратор статический (обычная разделительная линия).
 *                                 Альтернативная форма вызова: параметры dragged и width могут передаваться одним
 *                                 аргументом в виде параметризированного объекта с соответствующими полями, пример:
 *                                 { dragged:false, width:2 }, при этом - любое поле может отсутствовать, любое поле с
 *                                 непредусмотреным полем игнорируется.
 * @param {number} [width=2]       ширина сепаратора в точках (по умолчанию для статических сепараторов wdth = 2,
 *                                 для динамических сепараторов wdth = 5).
 *                                   
 * @return {ScriptUIObject}     возвращает созданный объект-сепаратор;
 */
function addSeparator(target, dragged /* boolean || object { dragged:bool=false, width:Number=2 } */, width /* int=dragged ? 5 : 2; */) {
    return initSeparator(target.add(Separator.rcString), dragged, width);
};

/**
 * Расширение нативных ScriptUI объектов контэйнерного типа методом addSeparator(dragged, width):
 *      Window.addSeparator(dragged, width);
 *      Panel.addSeparator(dragged, width);
 *      Group.addSeparator(dragged, width);
 * Аналогично методу initSeparator() метод addSeparator() поддерживает сокращённую (без аргументов) и альтернативную 
 * формы вызова (аргументы dragged и width могут передаваться в составе параметризированного объекта)
 */
Window.prototype.addSeparator = Panel.prototype.addSeparator = Group.prototype.addSeparator = function(dragged, width) {
    return addSeparator(this, dragged, width);
};