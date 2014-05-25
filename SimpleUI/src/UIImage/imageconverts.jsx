﻿// --------------------------------------------------------------
// @@@BUILDINFO@@@
// image converts functions
// --------------------------------------------------------------

/**
 * Преобразует объект изображение (объект ScriptUIImage) в ресурсную
 * строку. Строка может быть сохранена в текстовой переменной, или
 * вновь использована в качестве аргумента вызова ScriptUI.newImage(...)
 * для получения нового объекта ScriptUIImage.
 * <p><i><b>ПРИМЕЧАНИЕ:</b> Успешное преобразование возможно только для изображений,
 * загруженных из графических файлов. Для изображений, полученных путём указания ESTK 
 * константы (#class, #enumeration, и т.д.) возвращается имя этой константы (или пустая
 * строка, если константа представляет изображение с мультисостоянием - ICON.RUN и т.п.).
 * </i></p>
 * 
 * @param  {ScriptUIImage} img 
 * @return {string}             Очень длинная строка типа "\u0089PNG\r\n\x1A\ . . . `\u0082"
 */
function imagetoString(img) {
    if (!(img instanceof ScriptUIImage)) throw Error ("Argument not valid ScriptUIImage");

    var file = (img.pathname ? File(img.pathname) : null),
        str = "";
    // Нельзя преобразовать img если у неё нет ассоциированного с ней файла!
    if (!(file && file.exists)) return img.toString();
    file.open("r"); 
    file.encoding = "BINARY";    
    // Убиваем в выходной строке начальное (newString(" , и завершающие ")) :
    str = (file.read().toSource().toString()).slice(13, -3);
    file.close();

    return str;
};


/**
 * Преобразует ресурсную строку изображения, полученную с помощью {@link imagetoString imagetoString()},
 * в объект ScriptUIImage. 
 * 
 * @param  {ScriptUIImage} img 
 * @return {string}        Очень длинная строка типа "\u0089PNG\r\n\x1A\ . . . `\u0082"
 */
function imagefromString(resString) {
    var retimage = eval('try { ScriptUI.newImage("' + resString + '"); } catch(e) { null }');
    if (!retimage) throw Error ("Invalid resource string format.");
    return retimage;
};
