@echo off
echo ===================================================
echo     SMART STUDY PLANNER - STARTUP SCRIPT
echo ===================================================
echo.
echo PREREQUISITES:
echo   [*] PostgreSQL must be running on port 5432
echo   [*] Database 'smart_study_planner' must exist
echo   [*] Node.js and Java 17+ must be installed
echo.
echo Press any key to launch the servers, or CTRL+C to cancel...
pause > nul

echo.
echo [1/2] Starting Spring Boot Backend API (Port 8081)...
start "Smart Study Planner Backend" cmd /k "cd /d "%~dp0backend" && title Backend - Spring Boot && .\mvnw spring-boot:run"

timeout /t 8 /nobreak > nul

echo [2/2] Starting Vite React Frontend (Port 5173)...
start "Smart Study Planner Frontend" cmd /k "cd /d "%~dp0frontend" && title Frontend - Vite React && npm run dev"

echo.
echo ===================================================
echo  Both servers are launching in separate windows!
echo  Wait ~15 seconds for the backend to fully start.
echo.
echo  App URL:     http://localhost:5173/
echo  Backend API: http://localhost:8081/api
echo ===================================================
echo.
pause
