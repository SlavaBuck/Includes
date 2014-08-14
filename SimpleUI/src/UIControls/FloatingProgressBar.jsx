// --------------------------------------------------------------
// @@@BUILDINFO@@@
// ProgressBar
// --------------------------------------------------------------

/**
 * @class FloatingProgressBar 
 * @desc  Доработанный ScriptUI элемент управления ProgressBar. Пример взят 
 * {@link http://kasyan.ho.com.ua/snippets/script_ui.html отсюда}.
 * <p><i><b>ПРИМЕЧАНИЕ:</b> Немного доработал `hit()`, добавил `set()` и 
 * проверку на использование <b>new</b></i></p>
 * 
 * 
 * @param {string} [title = ""] Тест заголовока прогрессбара
 *
 * @example Создание и использование плавающей панели - прогрессбара:
 * var pBar = new SUI.FloatingProgressBar("Заголовок прогрессбара");
 * 
 * // Длинная операция #1
 * // методу hit() - передаётся строка, которая меняется на каждой итерации цикла 
 * // и выводится под линией прогрессбара:
 * var title = "Выполняется этап #1.";
 * pBar.reset(title, 100); // Прогрессбар рассчитывается на сто итераций
 * for(var i=0 ; i < 100; ++i, pBar.hit(title + " Операция: " + i) ) {
 *   $.sleep(10);
 * }
 * 
 * // Операция #2
 * var i;
 * title = "Выполняетсяe этап #2.";
 * pBar.reset(title, 10); // Прогрессбар переустанавливается на десять итераций
 * for( i=0 ; i < 10; ++i ) {
 *     // hit() без параметров еквивалентно pBar.step(i) - c каждым вызовом hit() внутренний 
 *     // счётчк прогрессбара увеличивается на +1
 *   pBar.hit();
 *   $.sleep(300);
 * }
 */
function FloatingProgressBar /** @constructs ProgressBar */ (title) {
     if ( !(this instanceof FloatingProgressBar)) return new FloatingProgressBar(title);

     var title = (title)||"";
          w = new Window('palette', ' '+ title, {x:0, y:0, width:500, height:60}),
          pb = w.add('progressbar', {x:20, y:12, width:460, height:12}, 0, 100),
          st = w.add('statictext', {x:20, y:36, width:460, height:20}, '');
     //st.justify = 'center';
     w.center();

     // Сброс в начальное состояние - по новому задаётся заголовок и кол-во итераций
     this.reset = function(msg, maxValue) {
          st.text = (msg)||"";
          pb.value = 0;
          pb.maxvalue = maxValue||0;
          pb.visible = !!maxValue;
          w.show();
     };

     // Выполнение одной итерации прогрессбара (возможно обновление текста подписи) 
     this.hit = function(/*str*/msg) { // Приращиваем внутренний счётчик на 1
         if (pb.value < pb.maxvalue) {++pb.value; }
         if (msg) { st.text = msg; } // Если заказывали - меняем подпись под прогрессбаром
     };

     // Прямая установка значения для внутреннего счётчика програссбара (в пределах общего кол-ва итераций)
     this.set = function(step) {
         // Новое значение не может быть больше pb.maxvalue
         if (step) { pb.value = (step<pb.maxvalue) ? step : pb.maxvalue } 
     };

     // Показать окно прогрессбара 
     this.hide = function() {w.hide();};

     /// Спрятать окно прогрессбара
     this.close = function() {w.close();};
};
