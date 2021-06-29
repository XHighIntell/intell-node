:: local install @types/intell-node to Typescript

@echo off


FOR %%i IN (4.4,4.3,4.2,4.1,4.0,3.9,3.8,3.7,3.6) DO (
    IF EXIST "%LOCALAPPDATA%\Microsoft\TypeScript\%%i" (  
        set Typescript=%LOCALAPPDATA%\Microsoft\TypeScript\%%i
        goto install
    )
)

echo Can't find any version of Typescript
pause
exit

:install
    echo Install to %Typescript%
    echo.
    cd /d "%Typescript%"

    :: get package location
    ::for %%i in ("%~dp0.") do set "package=%%~fi"
    set "package=%~dp0@types"
    

    :: npm install
    call npm install "%package%"

    pause









