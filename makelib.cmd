@echo off
REM Быстрое создание структуры папок для модуля:

IF "%1" EQU "" goto syntax
IF EXIST .\%1.jsx goto exists
copy .\__assets\module_template.jsx .\%1.jsx
IF NOT EXIST .\%1 md .\%1
IF NOT EXIST .\%1\src md .\%1\src
IF NOT EXIST .\%1\test md .\%1\test
IF NOT EXIST .\%1\snippets md .\%1\snippets
IF NOT EXIST .\%1\doc md .\%1\doc
IF NOT EXIST .\%1\doc\readme.md copy .\__assets\readme_template.md .\%1\doc\readme.md
IF NOT EXIST .\%1\src\%1.jsx copy .\__assets\source_template.jsx .\%1\src\%1.jsx
goto end

:exists
echo.The file %1.jsx alredy exists.
goto end
:syntax
echo.Syntax: %~n0 Name
:end
echo.
ENDLOCAL