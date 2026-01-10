# VS Code Development Guide

## VS Code Configuration Added

Your project now includes VS Code configuration files to make Flask development easier.

## What Was Added

### 1. Launch Configuration ([.vscode/launch.json](.vscode/launch.json))

Two debug configurations are available:

**"Python: Flask"** (Recommended)
- Full Flask debugger support
- Auto-reload on file changes
- Automatically opens browser
- Jinja template debugging enabled

**"Python: Flask (No Auto-reload)"**
- Simple debug mode
- Better for setting breakpoints
- No automatic reloading

### 2. Editor Settings ([.vscode/settings.json](.vscode/settings.json))

Configured:
- Python language server (Pylance)
- Jinja HTML syntax highlighting
- Auto-formatting on save
- HTML files treated as Jinja templates
- Emmet support in Jinja templates

### 3. Recommended Extensions ([.vscode/extensions.json](.vscode/extensions.json))

When you open this project in VS Code, you'll be prompted to install:
- **Python** - Core Python support
- **Pylance** - Advanced Python language features
- **Black Formatter** - Code formatting
- **Python Debugger** - Debugging support
- **Jinja** - Template syntax highlighting
- **Django** - Additional template support
- **Prettier** - Code formatting for HTML/CSS/JS

## How to Use

### Starting the Flask App

1. **Press `F5`** or click the "Run and Debug" icon in the sidebar
2. Select **"Python: Flask"** from the dropdown
3. The app will start and your browser will open automatically

### Debugging Features

**Set Breakpoints:**
- Click in the left margin next to line numbers in [app.py](app.py)
- Execution will pause when the breakpoint is hit
- Inspect variables in the Debug sidebar

**Debug Console:**
- View detailed error messages
- Execute Python code while debugging
- Inspect variable values

**Auto-reload:**
- Edit any file and save
- Flask automatically restarts
- Refresh your browser to see changes

### Useful Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Start debugging | `F5` |
| Stop debugging | `Shift + F5` |
| Restart debugger | `Ctrl + Shift + F5` |
| Step over | `F10` |
| Step into | `F11` |
| Continue | `F5` |
| Toggle breakpoint | `F9` |
| Open terminal | `` Ctrl + ` `` |

## Project Structure in VS Code

```
ABC/
├── .vscode/                    # VS Code configuration
│   ├── launch.json            # Debug configurations
│   ├── settings.json          # Editor settings
│   └── extensions.json        # Recommended extensions
├── app.py                      # Main Flask app (set breakpoints here)
├── templates/                  # Jinja2 templates
│   ├── menu.html
│   ├── index.html
│   ├── listening-game.html
│   └── writing-game.html
└── static/                     # Static files (CSS/JS)
    ├── css/
    └── js/
```

## Tips for Development

### 1. Template Editing
- HTML files in `templates/` are recognized as Jinja templates
- Get syntax highlighting for `{{ }}` and `{% %}` tags
- Emmet shortcuts work in Jinja templates

### 2. Python Editing
- Auto-complete for Flask functions
- Type hints and documentation on hover
- Import suggestions
- Error highlighting

### 3. Terminal Integration
- Open integrated terminal: `` Ctrl + ` ``
- Run pip commands directly
- View Flask server output
- Multiple terminals supported

### 4. File Navigation
- `Ctrl + P` - Quick file open
- `Ctrl + Shift + F` - Search across all files
- `Ctrl + Click` on imports to jump to definition

## Troubleshooting

### Extension Not Working?

Make sure you've installed the recommended extensions:
1. Open Command Palette (`Ctrl + Shift + P`)
2. Type "Extensions: Show Recommended Extensions"
3. Install all recommended extensions

### Debugger Not Starting?

1. Check that Python is installed: `python --version`
2. Check that Flask is installed: `pip list | grep Flask`
3. Try the "Python: Flask (No Auto-reload)" configuration instead

### Jinja Syntax Not Highlighted?

Install the "Jinja" extension:
1. Open Extensions (`Ctrl + Shift + X`)
2. Search for "Jinja"
3. Install "Jinja" by wholroyd

## More Resources

- [VS Code Python Documentation](https://code.visualstudio.com/docs/python/python-tutorial)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Jinja Template Documentation](https://jinja.palletsprojects.com/)
