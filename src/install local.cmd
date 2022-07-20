@echo off

:: install local for development purpose

echo Install to C:\node
echo.

cd /d C:\node
set "package=%~dp0intell-node"


call npm install "%package%"

pause