@echo off
REM батник для SublimeText
REM Usage: openinESTK c:\work\myfile.jsx

SETLOCAL

REM --------- НАСТРОЙКА ---------
REM Полное имя исполняемого файла ExtendScript Toolkit.exe (ESTK)
SET estkexe="C:\Program Files (x86)\Adobe\Adobe Utilities - CS6\ExtendScript Toolkit CS6\ExtendScript Toolkit.exe"
rem SET estkexe="C:\Program Files (x86)\Adobe\Adobe ExtendScript Toolkit CC\ExtendScript Toolkit.exe"
REM --------- НАСТРОЙКА ---------

START "" %estkexe% -run %1

ENDLOCAL