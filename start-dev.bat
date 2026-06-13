@echo off
echo ==========================================
echo Starting ChronoLink AI Development Servers
echo ==========================================

:: Start Backend
echo Starting Express API Backend...
start cmd /k "cd backend && npm start"

:: Start Frontend
echo Starting Vite React Frontend...
start cmd /k "cd frontend && npm run dev"

echo ==========================================
echo Servers are boot-launching in new terminals!
echo ==========================================
