@echo off
title AI Mentor TH - Offline Portable Server
echo ===================================================
echo   AI Mentor TH (Offline Portable Edition)
echo ===================================================
echo Starting Node.js Server on http://localhost:3000 ...
echo Press Ctrl+C to stop the server.
echo.

node dist/server.cjs
pause
