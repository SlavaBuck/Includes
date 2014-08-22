// --------------------------------------------------------------
// @@@BUILDINFO@@@
// SUI methods
// --------------------------------------------------------------

/**
 * Осуществляется обход содержимого диалога и производится инициализация для всех пользовательских элементов из 
 * библиотеки SimpleUI (модуль UIControls), также производится корректная инициализация масштабирования для 
 * диалогов, имеющих установленное свойство <code>resizeable:true</code>.
 * 
 * @name initWindow
 * @function
 * 
 * @param  {Window}  target  ScriptUI-объект dialog, palette или window
 * @return {Window}          Возвращает свой аргумент - может использоваться в цепочках вызовов
 * 
 * @example 
 * var w = new Window ("palette { properties:{resizeable:true} }");
 * SUI.initWindow(w);
 */
function initWindow(target) {
    var children = target.children;
    // Инициализация для пользовательских элементов из библиотеки SimpleUI (модуль UIControls):
    for (var i=0, max=children.length; i<max; i++) {
        if (children[i].isSeparator) { SUI.initSeparator(children[i]); continue; }
        if (children[i].isWebLink)   { SUI.initWebLink(children[i]);   continue; }
        if (children[i].isUnitBox)   { SUI.initUnitBox(children[i]);   continue; }
        if (isContainer(children[i])) initWindow(children[i]);
    }
    // Инициализация для resizable окон:
    if (!target.parent && target.properties && target.properties.resizeable) target.onResizing = target.onResize = function() { this.layout.resize () };
    return target;
};

/**
 * Определяет - имеет ли элемент управления контейнерный тип. В качестве аргумента принимает либо строку, 
 * либо ссылку на графический элемент управления. На основе анализа строки или типа элемента возвращает true, 
 * если обнаружиться соответствие с контейнерным типом (соответствует одному из "panel, group, tabbedpanel, 
 * tab, dialog, palette, window").
 * 
 * @name isContainer
 * @function
 * 
 * @param  {string|object}  arg Строка либо элемент управления. В элементах управления анализируется их 
 *                              свойство <code>.type</code>.
 * @return {Boolean}            Возвращает true, если аргумент представляет контейнерный тип,
 *                              в противном случае = false
 */
function isContainer(arg) {
    return "panel,group,tabbedpanel,tab,dialog,palette,window".indexOf( (typeof arg == 'string' ? arg.toLowerCase() : 
                                                                         arg.type.toLowerCase()) ) != -1;
};