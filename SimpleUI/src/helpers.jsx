// --------------------------------------------------------------
// @@@BUILDINFO@@@
// SUI methods
// --------------------------------------------------------------

/**
 * Корректная инициализация масштабирования для диалогов, имеющих установленное свойство <code>resizeable:true</code>.
 * 
 * @param  {Window}  target  ScriptUI-объект dialog, palette или window
 * @return {Window}          Возвращает свой аргумент - может использоваться в цепочках вызовов
 * 
 * @example
 * var w = new Window ("palette { properties:{resizeable:true} }");
 * WindowInit(w);
 */
function WindowInit(target) {
    target.onResizing = target.onResize = function() { target.layout.resize () };
    return terget;
};

/**
 * Определяет - имеет ли элемент управления контейнерный тип. В качестве аргумента принимает либо строку, 
 * либо ссылку на графический элемент управления. На основе анализа строки или типа элемента возвращает true, 
 * если обнаружиться соответствие с контейнерным типом (соответствует одному из "panel, group, tabbedpanel, 
 * tab, dialog, palette, window").
 * 
 * @param  {string|object}  arg Строка либо элемент управления. В элементах управления анализируется их 
 *                              свойство <code>.type</code>.
 * @return {Boolean}     		Возвращает true, если аргумент представляет контейнерный тип, 
 *                              в противном случае = false
 */
function isContainer(arg) {
    return "panel,group,tabbedpanel,tab,dialog,palette,window".indexOf( (typeof arg == 'string' ? arg.toLowerCase() : 
                                                                         arg.type.toLowerCase()) ) != -1;
};




