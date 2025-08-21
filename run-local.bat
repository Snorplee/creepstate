@echo off
REM Trump-Epstein Timeline - Local Development Server (Windows)
REM Run this script to start a secure local server for private investigation

setlocal EnableDelayedExpansion

REM Configuration
set PORT=%1
if "%PORT%"=="" set PORT=8847
set HOST=127.0.0.1

echo.
echo ================================================================
echo             Trump-Epstein Timeline Investigation
echo                   Local Development Server
echo ================================================================
echo  Server URL: http://%HOST%:%PORT%
echo  Security: Localhost only (127.0.0.1)
echo  Directory: %CD%
echo ================================================================
echo.
echo  Pages Available:
echo    * Timeline:        http://%HOST%:%PORT%/
echo    * Visualizations:  http://%HOST%:%PORT%/enhanced-visualizations.html
echo    * Statistics:      http://%HOST%:%PORT%/stats.html
echo    * Names ^& Shame:   http://%HOST%:%PORT%/names-and-shame.html
echo    * Resources:       http://%HOST%:%PORT%/resources.html
echo    * Slideshow:       http://%HOST%:%PORT%/slideshow-timeline.html
echo ================================================================
echo.

REM Check if we're in the right directory
if not exist "index.html" (
    echo ERROR: index.html not found in current directory
    echo Please run this script from the trumpstein-timeline directory
    echo Usage: cd \path\to\trumpstein-timeline ^&^& run-local.bat [port]
    pause
    exit /b 1
)

REM Check if port is available
netstat -an | findstr ":%PORT% " >nul
if %errorlevel%==0 (
    echo ERROR: Port %PORT% is already in use
    echo Try a different port: run-local.bat 8080
    pause
    exit /b 1
)

echo Starting server on port %PORT%...
echo Press Ctrl+C to stop the server
echo.

REM Try different server methods in order of preference
python --version >nul 2>&1
if %errorlevel%==0 (
    echo Using Python HTTP server
    python -m http.server %PORT% --bind %HOST%
    goto :end
)

python3 --version >nul 2>&1
if %errorlevel%==0 (
    echo Using Python 3 HTTP server
    python3 -m http.server %PORT% --bind %HOST%
    goto :end
)

php --version >nul 2>&1
if %errorlevel%==0 (
    echo Using PHP built-in server
    php -S %HOST%:%PORT%
    goto :end
)

node --version >nul 2>&1
if %errorlevel%==0 (
    echo Using Node.js HTTP server
    node -e "const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');http.createServer((req,res)=>{let filePath='.'+url.parse(req.url).pathname;if(filePath==='./'){filePath='./index.html';}const extname=String(path.extname(filePath)).toLowerCase();const mimeTypes={'.html':'text/html','.js':'text/javascript','.css':'text/css','.xml':'application/xml','.jpg':'image/jpeg','.png':'image/png','.gif':'image/gif'};const contentType=mimeTypes[extname]||'application/octet-stream';fs.readFile(filePath,(error,content)=>{if(error){if(error.code=='ENOENT'){res.writeHead(404);res.end('File not found');}else{res.writeHead(500);res.end('Server error: '+error.code);}}else{res.writeHead(200,{'Content-Type':contentType});res.end(content,'utf-8');}});}).listen(%PORT%,'%HOST%',()=>console.log('Server running at http://%HOST%:%PORT%/'));"
    goto :end
)

REM If no server found
echo ERROR: No suitable server found!
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - PHP: https://www.php.net/downloads.php
echo   - Node.js: https://nodejs.org/
echo.
pause
exit /b 1

:end
echo.
echo Server stopped.
pause