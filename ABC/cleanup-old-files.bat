@echo off
echo ========================================
echo Clean Up Old Files
echo ========================================
echo.
echo This script will DELETE the old HTML, CSS, and JS files
echo that have been moved to templates/ and static/ directories.
echo.
echo The following files will be DELETED:
echo   - index.html
echo   - menu.html
echo   - listening-game.html
echo   - writing-game.html
echo   - styles.css
echo   - menu-styles.css
echo   - listening-game.css
echo   - writing-game.css
echo   - script.js
echo   - listening-game.js
echo   - writing-game.js
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Deleting old HTML files...
del index.html 2>nul
del menu.html 2>nul
del listening-game.html 2>nul
del writing-game.html 2>nul

echo Deleting old CSS files...
del styles.css 2>nul
del menu-styles.css 2>nul
del listening-game.css 2>nul
del writing-game.css 2>nul

echo Deleting old JS files...
del script.js 2>nul
del listening-game.js 2>nul
del writing-game.js 2>nul

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo All old files have been removed.
echo Your Flask app files in templates/ and static/ are safe.
echo.
pause
