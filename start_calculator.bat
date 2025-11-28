@echo off
REM Start Python server in server folder
start "" "http://localhost:8000/index.html"

REM Start the HTTP server
python -m http.server 8000 --bind 127.0.0.1

pause
