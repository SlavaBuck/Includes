@echo off
REM � ᮦ������, � ��� ���� ࠧ������ � jsdoc � ��⮬� - 
REM ���㬥���� �� ��室� ��室�� �����쭮 ����筠� (((
REM --------
REM �⮡� jsdoc �� �㣠��� �� ��४⨢� #include � .jsx 
REM 䠩��� - � �� 㡨��� � ������� ���⮣� �������-㡨��: 
REM removeInclude.js (��室���� � ����� ������⥪� __assets)
REM --------



SETLOCAL

REM --------- ��������� ---------
REM ����ன�� ��⥩ �������� �⭮�⥫쭮 ���� ����᪠ makedoc

REM ��᮫��� ���� � 䠩�� jsdoc.cmd
SET _JSDOC=c:\nodejs\node_modules\.bin

REM ��� ����� � ������⥪�� (���� ��� ��� ��襩):
SET _LIB=Include

REM ���� � ����� � 䠩��� ������⥪� (��� ����� �����):
SET lib_folder="/Program Files (x86)/Adobe/Adobe InDesign CS6/Scripts/Scripts Panel/%_LIB%"
REM -----------------------------

REM ������ �� �����: ���� ����஥� jsdoc �� 㬮�砭��:
SET conffile=%lib_folder%/__assets/jsdoc/conf_def.json

IF "%2" EQU "jag" SET conffile=%lib_folder%/__assets/jsdoc/conf_jaguar.json
IF "%2" EQU "strap" SET conffile=%lib_folder%/__assets/jsdoc/conf_docstrap.json

@echo.Template: %conffile%

IF "%1" EQU "" ( 
    rem goto syntax
    goto all
) ELSE (
	IF "%1" EQU "all" goto all
	IF "%1" EQU "_globals" goto globals
	IF "%1" EQU "collection" goto Collection
	IF "%1" EQU "mvc" goto MVC
	IF "%1" EQU "png" goto PNG
	IF "%1" EQU "sui" goto SUI
	IF "%1" EQU "qtest" goto QTEST
	echo.Invalid parameter: '%1'
	goto syntax
)

:all
@echo.Rebuild: All
@echo.--------------------
:globals
@echo.Build doc for _globals:
IF EXIST "%lib_folder%/_globals/doc/html" call rd /S/Q "%lib_folder%/_globals/doc/html"
call %_JSDOC%\jsdoc %lib_folder%/_debug.jsx %lib_folder%/_util.jsx %lib_folder%/_globals/src/ -c %conffile% -d %lib_folder%/_globals/doc/html
IF "%1" EQU "_globals" goto end

:Collection
@echo.Build doc for Collection:
IF EXIST "%lib_folder%/Collection/doc/html" call rd /S/Q "%lib_folder%/Collection/doc/html"
call %_JSDOC%\jsdoc %lib_folder%/Collection.jsx %lib_folder%/Collection/src/ -c %conffile% -d %lib_folder%/Collection/doc/html
IF "%1" EQU "collection" goto end

:PNG
@echo.Build doc for PNGLib:
IF EXIST "%lib_folder%/PNGLib/doc/html" call rd /S/Q "%lib_folder%/PNGLib/doc/html"
call %_JSDOC%\jsdoc %lib_folder%/PNGLib.jsx %lib_folder%/PNGLib/src/ -c %conffile% -d %lib_folder%/PNGLib/doc/html
IF "%1" EQU "png" goto end

:SUI
@echo.Build doc for SimpleUI:
IF EXIST "%lib_folder%/SimpleUI/doc/html" call rd /S/Q "%lib_folder%/Simple/doc/html"
call %_JSDOC%\jsdoc %lib_folder%/SimpleUI.jsx %lib_folder%/SimpleUI/ %lib_folder%/SimpleUI/src/ -c %conffile% -d %lib_folder%/SimpleUI/doc/html

:QTEST
@echo.Build doc for QTest:
IF EXIST "%lib_folder%/QTest/doc/html" call rd /S/Q "%lib_folder%/QTest/doc/html"
call %_JSDOC%\jsdoc %lib_folder%/QTest.jsx %lib_folder%/QTest/src/ -c %conffile% -d %lib_folder%/QTest/doc/html
IF "%1" EQU "qtest" goto end


:MVC
@echo.Build doc for MVC:
IF EXIST "%lib_folder%/MVC/doc/html" call rd /S/Q "%lib_folder%/MVC/doc/html"
call %_JSDOC%\jsdoc %lib_folder%/MVC.jsx %lib_folder%/MVC/src/ -c %conffile% -d %lib_folder%/MVC/doc/html

@echo.Build doc for MVC.DOM:
IF EXIST "%lib_folder%/MVC/doc/DOM/html" call rd /S/Q "%lib_folder%/MVC/doc/DOM/html"
call %_JSDOC%\jsdoc %lib_folder%/MVC.DOM.jsx %lib_folder%/MVC/src/DOM/ -c %conffile% -d %lib_folder%/MVC/doc/DOM/html
IF "%1" EQU "mvc" goto end

@echo.Generate summary in %lib_folder%/__assets/allDocuments/html:
IF EXIST "%lib_folder%/__assets/allDocuments/html" call rd /S/Q "%lib_folder%/__assets/allDocuments/html"
call %_JSDOC%\jsdoc %lib_folder%/ -c %conffile% -d %lib_folder%/__assets/allDocuments/html -r
IF %ERRORLEVEL% NEQ 0 (
    @echo.ops...
) ELSE (
    @echo.��⮢�!
)
goto end

:syntax
	echo.    Syntax: %~n0 what [template]
	echo.    where 'what' is one of:
	echo.        all        - rebuild All;
	echo.        _globals   - only for _globals;
	echo.        collection - only for Collection;
	echo.        mvc        - MVC (and all MVC modules).
	echo.    and 'template' is empty (by default) or one of:
	echo.        jag        - use jaguar tamplate;
	echo.        strap      - DocStrap template.
	echo.finish.
:end
echo.
ENDLOCAL