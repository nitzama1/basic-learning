# Setup Guide for Hebrew Alphabet Learning App

## Prerequisites

You need to install Python before running this Flask application.

### Installing Python on Windows

1. **Download Python**
   - Go to [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - Download the latest Python 3.x version (3.7 or higher)

2. **Install Python**
   - Run the downloaded installer
   - **IMPORTANT**: Check the box "Add Python to PATH" during installation
   - Click "Install Now"

3. **Verify Installation**
   - Open Command Prompt (cmd)
   - Type: `python --version`
   - You should see something like "Python 3.x.x"

## Quick Start

### Option 1: Using VS Code (Recommended for Development)

If you're using Visual Studio Code:

1. **Install Recommended Extensions**
   - Open the project in VS Code
   - You'll see a prompt to install recommended extensions - click "Install All"
   - Or manually install: Python, Pylance, Jinja extensions

2. **Run with Debugger**
   - Press `F5` or click "Run and Debug" in the sidebar
   - **IMPORTANT**: Select **"ABC: Flask App"** from the dropdown (NOT "Python: Flask")
   - The app will start with debugging enabled
   - Browser will open automatically to `http://localhost:5000`

   **Multi-root Workspace Note**: If you have multiple projects in your workspace, make sure to select the configuration that starts with "ABC:" to run this specific project.

3. **Benefits**
   - Set breakpoints in your Python code
   - Auto-reload on file changes
   - Better error messages in the Debug Console
   - Integrated terminal

### Option 2: Using the Batch File (Windows)

1. Double-click `run.bat`
2. The Flask server will start automatically
3. Open your browser to `http://localhost:5000`

### Option 3: Manual Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**
   ```bash
   python app.py
   ```

3. **Access the App**
   - Open your web browser
   - Navigate to `http://localhost:5000`
   - You should see the main menu with game options

## Troubleshooting

### "Python is not recognized" Error

If you get this error, Python is not in your PATH:
1. Reinstall Python and make sure to check "Add Python to PATH"
2. Or manually add Python to your system PATH

### "No module named 'flask'" Error

Install Flask using:
```bash
pip install -r requirements.txt
```

### Port Already in Use

If port 5000 is already in use, you can:
1. Edit `app.py` and change the port number in the last line
2. Change `port=5000` to `port=5001` (or any other available port)

### Browser Doesn't Open Automatically

Manually open your browser and go to:
- `http://localhost:5000` (or whatever port you configured)

## Stopping the Server

- Press `Ctrl + C` in the terminal/command prompt where the server is running

## Development Mode

The app runs in debug mode by default, which means:
- Automatic reloading when you change files
- Better error messages
- NOT suitable for production use

To disable debug mode, edit [app.py](app.py:26) and change `debug=True` to `debug=False`
