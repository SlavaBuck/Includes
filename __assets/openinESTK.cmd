@echo off
REM ��⭨� ��� SublimeText
REM Usage: openinESTK c:\work\myfile.jsx

SETLOCAL

REM --------- ��������� ---------
REM ������ ��� �ᯮ��塞��� 䠩�� ExtendScript Toolkit.exe (ESTK)
SET estkexe="C:\Program Files (x86)\Adobe\Adobe Utilities - CS6\ExtendScript Toolkit CS6\ExtendScript Toolkit.exe"
rem SET estkexe="C:\Program Files (x86)\Adobe\Adobe ExtendScript Toolkit CC\ExtendScript Toolkit.exe"
REM --------- ��������� ---------

START "" %estkexe% -run %1

ENDLOCAL