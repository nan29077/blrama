@echo off
chcp 65001 >nul
setlocal
title Bellama Commit and Push
cd /d "%~dp0"

where git >nul 2>nul
if errorlevel 1 ( echo [ERROR] Git not found. Install Git for Windows. & pause & exit /b 1 )

for /f "delims=" %%U in ('git remote get-url origin') do set "ORIGIN=%%U"
echo [INFO] Remote: %ORIGIN%
echo %ORIGIN% | findstr /I "nan29077/blrama" >nul
if errorlevel 1 ( echo [ERROR] origin is not nan29077/blrama. Stopped. & pause & exit /b 1 )

if exist ".git\index.lock" (
  echo [WARN] Removing stale .git\index.lock
  del /q ".git\index.lock"
)

echo.
echo [1/4] Staging all changes (Claude + Codex)...
git add -A
if errorlevel 1 ( echo [ERROR] git add failed & pause & exit /b 1 )

set "MSG=%~1"
if "%MSG%"=="" set "MSG=chore: sync B엘라마 work %DATE% %TIME:~0,5%"
git diff --cached --quiet
if errorlevel 1 (
  echo [2/4] Committing...
  git commit -m "%MSG%"
  if errorlevel 1 ( echo [ERROR] commit failed & pause & exit /b 1 )
) else (
  echo [2/4] Nothing new to commit.
)

echo [3/4] Pulling latest from origin/main (rebase)...
git pull --rebase origin main
if errorlevel 1 (
  echo [ERROR] Rebase conflict. Resolve files, then: git add -A ^&^& git rebase --continue
  pause & exit /b 1
)

echo [4/4] Pushing to origin/main...
git push origin HEAD:main
if errorlevel 1 ( echo [ERROR] push failed. Check GitHub login. & pause & exit /b 1 )

echo.
git status -sb
git log --oneline -5
echo.
echo [OK] All B엘라마 work is committed and pushed to %ORIGIN%
pause
exit /b 0
