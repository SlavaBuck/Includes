/**
 * @@@BUILDINFO@@@ 
 * Тест интерфейса Collection (методы, которыми он должен обладать)
 * 
 */

#include "../../QTest.jsx"
#include "../../Collection.jsx"

var Collection = ESCollection.Collection;
var c = new Collection();

// Методы интерфейса Collection (без методов Array)
// TODO: прописать все тестовые методы
var facade = {
        "add":{ test:function() { c = new Collection(1, 2, 3); return c.add(4); }, value:[1, 2, 3, 4] },
        "append":{ test:function() { c = new Collection(1, 2, 3); return c.append([4, 5, 6]); }, value:[1, 2, 3, 4, 5, 6] },
        "compact":{ test:function() { c = new Collection(0, 1, false, 2, '', 3); return c.compact() }, value:[1, 2, 3] },
        "concat":{ test:function() { return c.contains(false) }, value:true },
        "contains":{ test:function() { return c.first() }, value:0 },
        "copy":{ test:function() { return c.last() }, value:3 },
        "every":{ test:function() { return c.max() }, value:3 },
        "filter":{ test:function() { c = new Collection({'name': 'Alfred'}, {'name': 'Zed'}); 
                    return c.max(function (obj) { return obj.name; }).toSource() }, value:'({name:"Zed"})' },
        "first":{ test:function() { c = new Collection(3, 1, 2); return c.first() }, value:3 },
        "flatten":{ test:function() { c = new Collection(1, 2, [[3, 4, 5], 6], [7, 8], 9); return c.flatten() }, 
                    value:[1,2,3,4,5,6,7,8,9] },
        "forEach":{ test:function() { c = new Collection(1, 2, 3, 4); c.forEach(function(num, i, col){ col[i] = num*10; }); return c; }, 
                    value:[10,20,30,40] },
        "getAll":{ test:function() { return c.getAll() }, value:[10,20,30,40] },
        "getByIndex":{ test:function() { return c.getByIndex(0); }, value:[10] },
        "getByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "getByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getByValues":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirst":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirstByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirstByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirstByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirstIndexByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirstIndexByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getFirstIndexByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getIndexByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "getIndexByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getIndexByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getIndexByValues":{ test:function() { c = new Collection(); return true }, value:true },
        "getLast":{ test:function() { c = new Collection(); return true }, value:true },
        "getLastByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "getLastByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getLastByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getLastIndexByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "getLastIndexByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "getLastIndexByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "indexAfter":{ test:function() { c = new Collection(); return true }, value:true },
        "indexOf":{ test:function() { c = new Collection(); return true }, value:true },
        "insert":{ test:function() { c = new Collection(); return true }, value:true },
        "isValidIndex":{ test:function() { c = new Collection(); return true }, value:true },
        "join":{ test:function() { c = new Collection(); return true }, value:true },
        "last":{ test:function() { c = new Collection(); return true }, value:true },
        "lastIndexOf":{ test:function() { c = new Collection(); return true }, value:true },
        "map":{ test:function() { c = new Collection(); return true }, value:true },
        "max":{ test:function() { c = new Collection(); return true }, value:true },
        "min":{ test:function() { c = new Collection(); return true }, value:true },
        "pluck":{ test:function() { c = new Collection(); return true }, value:true },
        "pop":{ test:function() { c = new Collection(); return true }, value:true },
        "push":{ test:function() { c = new Collection(); return true }, value:true },
        "reduce":{ test:function() { c = new Collection(); return true }, value:true },
        "reduceRight":{ test:function() { c = new Collection(); return true }, value:true },
        "reject":{ test:function() { c = new Collection(); return true }, value:true },
        "remove":{ test:function() { c = new Collection(); return true }, value:true },
        "removeAll":{ test:function() { c = new Collection(); return true }, value:true },
        "removeByIndex":{ test:function() { c = new Collection(); return true }, value:true },
        "removeByKey":{ test:function() { c = new Collection(); return true }, value:true },
        "removeByKeyValue":{ test:function() { c = new Collection(); return true }, value:true },
        "removeByValue":{ test:function() { c = new Collection(); return true }, value:true },
        "removeByValues":{ test:function() { c = new Collection(); return true }, value:true },
        "reverse":{ test:function() { c = new Collection(); return true }, value:true },
        "rezet":{ test:function() { c = new Collection(); return true }, value:true },
        "select":{ test:function() { c = new Collection(); return true }, value:true },
        "set":{ test:function() { c = new Collection(); return true }, value:true },
        "shift":{ test:function() { c = new Collection(); return true }, value:true },
        "slice":{ test:function() { c = new Collection(); return true }, value:true },
        "some":{ test:function() { c = new Collection(); return true }, value:true },
        "sort":{ test:function() { c = new Collection(); return true }, value:true },
        "splice":{ test:function() { c = new Collection(); return true }, value:true },
        "sum":{ test:function() { c = new Collection(); return true }, value:true },
        "swap":{ test:function() { c = new Collection(); return true }, value:true },
        "toArray":{ test:function() { c = new Collection(); return true }, value:true },
        "toLocaleString":{ test:function() { c = new Collection(); return true }, value:true },
        "toSource":{ test:function() { c = new Collection(); return true }, value:true },
        "toString":{ test:function() { c = new Collection(); return true }, value:true },
        "unshift":{ test:function() { c = new Collection(); return true }, value:true },
    };

test( "Тестирование Collection", function() {
	each(keys(facade), function(m) {
		deepEqual(facade[m].test(), facade[m].value, "test for Collection."+m+ "();");
	})
});