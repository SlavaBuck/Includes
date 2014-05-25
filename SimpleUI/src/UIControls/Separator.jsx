// --------------------------------------------------------------
// @@@BUILDINFO@@@
// Separator Динамический сепаратор, с поддержкой перетаскивания мышкой
// --------------------------------------------------------------

/**
 * @class       Separator
 * @summary     Динамический сепаратор с поддржкой перетаскивания машкой.
 * @description Представляет простой объект, инкапсулирующий ресурсную строку элемента 
 *  <code>ScriptUI Panel</code>, адаптированый для использования в качестве элемента 
 *  ресурсной ScriptUI-строки окна.
 * 
 * @property {string} rcString Формат ресурсной строки для использования в качестве одиночного аргумента при
 *                             вызове Window.add(Separator.rcString);
 * @method   toString   
 * 
 * @example
 * var w = Window("dialog { \
 *         txt:StaticText { text:'Ниже рассположен сепаратор:' }, \
 *         sp:"+Separator+" \
 *         txt:StaticText { text:'Выше рассположен сепаратор.' }  \
 *     }");
 * SUI.SeparatorInit(w.sp);
 *
 * @example
 * var w = Window("dialog");
 * w.add("statictext { text:'Ниже рассположен сепаратор:' }");
 * w.add(Separator.rcString);
 * w.add("statictext { text:'Выше рассположен сепаратор:' }");
 * SUI.SeparatorInit(w.sp);
 */
var Separator = {
    // Включается в общую ресурсную строку диалога:
    rcString:"panel { isSeparator:true, margins:0, spacing:0, line:Panel  { margins:0, spacing:0, visible:false } },",
    // Для использрвания в Window.add(Separator):
    toString:function() { return "P" + this.rcString.slice(1, -1); }
};

/**
 * Инициализирует сепаратор, заданный ресурсной строкой Seperator
 *
 * 
 * @param {object} target        ссылка на Сепаратор;
 * @param {string} [type='none'] тип сепаратора, любое значение, отличное от 'line' оставляет сепаратор
 *                               динамическим (поддержка перестаскивание мышкой). Значение 'line' делает
 *                               сепаратор статическим (обычная разделительная линия);
 *                                   
 * @param {number} [wdth=5]      ширина сепаратора в точках (для статических сепараторов по умолчанию wdth = 2).
 */
function SeparatorInit(target, type, wdth) {
    // Определяем ориентацию родительского контейнера, и благодаря ей, настраиваемся под вертикальный или горизонтальный сепаратор
    target._dimension = (target.parent.orientation == 'row' ) ? 0: 1;
    target.alignment = (target._dimension == 0) ? ['left','fill'] : ['fill','top'];
    var type = (type)||'none';
    if (type == 'line') {
        // Обычная статическая линия
        target.maximumSize[target._dimension] = target.minimumSize[target._dimension] = (wdth)||2;
        return;
    }
    // Настраиваем внутренние переменные
    target.pos = {x:0, y:0 };
    target.width = (target.width) || 5;
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
    // Устанавливаем обработчики
    target._onMouseDown = separator_onMouseDown;
    target._onMouseUp = separator_onMouseUp;
    target._onMouseMove = separator_onMouseMove;
    target._onMouseOut = separator_onMouseOut;
    target.addEventListener ('mousedown', separator_onMouseDown);
    target.addEventListener ('mouseup', separator_onMouseUp);
    target.addEventListener ('mousemove', separator_onMouseMove);
    target.addEventListener ('mouseout', separator_onMouseOut);
    // Вспомогательные методы:
    // target.enable = separator_enable;
    // target.disable = separator_disable;
    // onShow
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
} // SeparatorInit