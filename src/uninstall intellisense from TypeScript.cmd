:: local install @types/intell-node to Typescript

@echo off


:: Search from 9.9 to 4.1
FOR /L %%A IN (9,-1,4) DO (
    FOR /L %%B IN (9,-1,1) DO (
        IF EXIST "%LOCALAPPDATA%\Microsoft\TypeScript\%%A.%%B" (
            set Typescript=%LOCALAPPDATA%\Microsoft\TypeScript\%%A.%%B
            goto install
        )
    )
)

echo Can't find any version of Typescript
pause
exit

:install
    echo Uninstall '@types\intell-node' on %Typescript%
    echo.


    :: npm install
    call npm uninstall --prefix "%Typescript%" "@types/intell-node"

    pause