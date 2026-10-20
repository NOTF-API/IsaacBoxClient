@echo off
setlocal
cd /d "%~dp0"

where cl.exe >nul 2>nul
if errorlevel 1 (
  echo Run this script from a Visual Studio Developer Command Prompt.
  exit /b 1
)
where rc.exe >nul 2>nul
if errorlevel 1 (
  echo rc.exe was not found. Install the Windows SDK.
  exit /b 1
)

rc /nologo /fo IsaacBoxUtility.res IsaacBoxUtility.rc
if errorlevel 1 exit /b 1

cl /nologo /O2 /Oi /GS /sdl /guard:cf /GR- /Brepro /utf-8 /DUNICODE /D_UNICODE /D_WIN32_WINNT=0x0601 /MT /W4 /Fo:IsaacBoxUtility.obj /Fe:..\dependencies\IsaacBoxUtility.exe IsaacBoxUtility.cpp IsaacBoxUtility.res /link /SUBSYSTEM:CONSOLE /MANIFEST:NO /DYNAMICBASE /NXCOMPAT /HIGHENTROPYVA /INCREMENTAL:NO /OPT:REF /OPT:ICF
if errorlevel 1 exit /b 1

echo Built ..\dependencies\IsaacBoxUtility.exe
