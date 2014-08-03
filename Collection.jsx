/**
 * @@@BUILDINFO@@@ Collection.jsx 1.10 Tue Jan 21 2014 13:34:54 GMT+0200
 * 
 * @module  Collection
 * @summary Класс Collection.
 * @desc    Включает набор методов для работы с массивами и коллекциями
 * 
 * @version 0.2.1
 * @author 	Slava Boyko <slava.boyko@hotmail.com>
 * @copyright © Вячеслав aka SlavaBuck, 2014. 
 */

// Имя модуля:
/* @alias Collection */
var MODULE = "ESCollection";

// В связи с конфликтом глобального Collection, непригодного для использования,
// в скрипте перед использованием  Collection для надёжности требуется предварительное
// var Collection = ESCollection.Collection;

($.global.hasOwnProperty(MODULE) && MODULE.Collection && 
                                                            MODULE.Collection === Collection)||(function(GLOBAL, MODULE) {
    // Регистрация модуля
    GLOBAL[MODULE] = MODULE;
    
    // Модуль:
    MODULE["version"] = "0.2.1";
    MODULE["name"] = "ES Collection Library";


    // --------------------------------------------------------------
    // Реализация...
    //#include "Collection/src/coll_functions.jsx"
    #include "Collection/src/Collection.jsx"
    // для старого кода...
    Collection.libversion = MODULE["version"];    
    Collection.libname = MODULE["name"];
    
    // --------------------------------------------------------------
    // Экспорт в глобал:
    // --------------------------------------------------------------
    GLOBAL["Collection"] = MODULE["Collection"] = Collection;
    
    return MODULE;
    // --------------------------------------------------------------
})( $.global, { toString:function(){return MODULE;} } );

