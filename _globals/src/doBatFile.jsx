/**
 * Выполняет комманды DOS/Windows bat-файлов
 *
 * @global
 * @param  {string}  command              Текст коммандного файла DOS/Windows
 * @param  {bollean} [waitforbatch=false] Ожидать или нет окончания выполнения файла (если true - функция
 *                                не вернёт управления пока не выполнится весь bat файл.)
 * @return {bollean}              falseб если возникли проблемы с bat-файлом.
 */
function doBatFile(command, waitforbatch) {
                
  if (!command) return false;

  if(!waitforbatch) {
    if(waitforbatch != false) {
      waitforbatch = true;
    }
  }
  
  var path = Folder.appData.fsName + '/';

  var batFileName = 'ExtendScriptBatchFile';
  var batFileExtension = '.bat';
  var batFile = new File(path+batFileName+batFileExtension);
  if(batFile.exists) {
    var i  = 0;
    while(batFile.exists) {
      i++;
      batFile = new File(path+batFileName+i+batFileExtension);
    }
  }

  command+= "\ndel /F /Q \"" + batFile.fsName + "\"";

  try {
    batFile.open("w");
    batFile.write(command);
    batFile.close();

    batFile.execute();
  } catch(e) {
    if (batFile.exists) batFile.remove();
    return false;
  }

  /*Wait on batch file execution if needed*/
  if(waitforbatch) {
    while(batFile.exists) {
      msg(".");
      $.sleep(100);
    }
  }
  return true;
};

/**
 * Открывает URL в браузере по умолчанию
 * 
 * @param  {string} url Web-ссылка, например: "http://ya.ru/" или "www.ya.ru"
 */
function openURL(url) {
  doBatFile("start "+url+"  \n", false);
}