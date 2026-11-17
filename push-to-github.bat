@echo off
chcp 65001 >nul
setlocal EnableExtensions
title Prepo - GitHub-ზე ატვირთვა

rem ============================================================
rem  Prepo-ს საიტის ცვლილებების ატვირთვა GitHub-ზე.
rem  გამოყენება: ორჯერ დააწკაპუნე ამ ფაილზე.
rem  ფაილი უნდა იდოს დესკტოპზე, Prepo საქაღალდის გვერდით.
rem ============================================================

rem მუშაობს ორივე ადგილიდან: Prepo საქაღალდის შიგნით ან მის გვერდით (დესკტოპზე).
set "PROJECT=%~dp0Prepo"
if exist "%~dp0package.json" set "PROJECT=%~dp0."

if not exist "%PROJECT%\package.json" (
  echo [შეცდომა] პროექტი ვერ მოიძებნა: %PROJECT%
  goto :end
)
cd /d "%PROJECT%"

where git >nul 2>nul
if errorlevel 1 (
  echo [შეცდომა] Git დაყენებული არ არის: https://git-scm.com/download/win
  goto :end
)

rem --- პირველი გაშვება: რეპოზიტორიის შექმნა ---
if exist ".git" goto :check_remote
echo პირველი გაშვება: იქმნება Git რეპოზიტორია...
git init -b main
if errorlevel 1 goto :failed

:check_remote
git remote get-url origin >nul 2>nul
if not errorlevel 1 goto :commit

echo.
echo GitHub-ის რეპოზიტორია ჯერ მიბმული არ არის.
echo   1. გახსენი https://github.com/new
echo   2. შექმენი ცარიელი რეპოზიტორია (README-ს და .gitignore-ის გარეშე)
echo   3. დააკოპირე მისი მისამართი, მაგ. https://github.com/USERNAME/prepo.git
echo.
set "REPO_URL="
set /p "REPO_URL=ჩასვი რეპოზიტორიის მისამართი და დააჭირე Enter: "
if "%REPO_URL%"=="" (
  echo მისამართი ცარიელია. გაუქმდა.
  goto :end
)
git remote add origin "%REPO_URL%"
if errorlevel 1 goto :failed

:commit
echo.
echo --- ცვლილებები ---
git add -A
git status --short
git diff --cached --quiet
if not errorlevel 1 (
  echo ახალი ცვლილება არ არის.
  goto :push
)

echo.
set "MSG="
set /p "MSG=ცვლილების აღწერა (ან უბრალოდ Enter): "
if "%MSG%"=="" set "MSG=Update %DATE% %TIME:~0,5%"
git commit -m "%MSG%"
if errorlevel 1 goto :failed

:push
echo.
echo --- იტვირთება GitHub-ზე ---
git push -u origin main
if errorlevel 1 goto :failed

echo.
echo მზადაა. ცვლილებები GitHub-ზეა.
echo თუ პროექტი Vercel-ზეა მიბმული, საიტი 1-2 წუთში თავისით განახლდება.
goto :end

:failed
echo.
echo [შეცდომა] ბრძანება ვერ შესრულდა. წაიკითხე ზემოთ მოცემული შეტყობინება.
echo ხშირი მიზეზები: არასწორი მისამართი, GitHub-ზე შესვლა არ დასრულდა, ინტერნეტი.

:end
echo.
pause
endlocal
