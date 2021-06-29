@echo off

:: install local for development purpose

echo Install to C:\
echo.

cd /d C:\
set "package=%~dp0intell-node"


call npm install "%package%"

pause