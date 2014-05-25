/**
 * @overview Удаляются все директивы #include в .jsx файлах (ExtendScript)
 * 
 * @module plugins/removeInclude
 * @author Slava Boyko <slava.boyko@hotmail.com>
 */
'use strict';

exports.handlers = {
    beforeParse: function(e) {
        // Удаляются все директивы #include ... рассположенный в начале строки.
        // Чтобы удалить везде - задайте .replace(/#include.*$/mg,"")
        e.source = e.source.replace(/(\s|\t)+#include.*$/mg,"");
    }
};
