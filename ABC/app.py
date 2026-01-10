from flask import Flask, render_template, jsonify, send_file
import random
import tempfile
from gtts import gTTS

app = Flask(__name__)

@app.route('/')
def menu():
    """Main menu page"""
    return render_template('menu.html')

@app.route('/abc')
def abc_learning():
    """Hebrew ABC learning game"""
    return render_template('index.html')

@app.route('/listening')
def listening_game():
    """Listening game"""
    return render_template('listening-game.html')

@app.route('/writing')
def writing_game():
    """Writing game"""
    return render_template('writing-game.html')

@app.route('/generate-letter')
def generate_letter():
    """Generate a random Hebrew letter"""
    hebrew_letters = 'אבגדהוזחטיכלמנסעפצקרשת'
    letter = random.choice(hebrew_letters)
    return jsonify({'letter': letter})

@app.route('/speak/<text>/<lang>')
def speak(text, lang):
    """Convert text to speech using gTTS"""
    # Create a temporary file for the audio
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
    temp_file.close()

    # Map language codes - gTTS uses 'iw' for Hebrew instead of 'he'
    lang_map = {'he': 'iw', 'en': 'en'}
    gtts_lang = lang_map.get(lang, lang)

    # Generate speech
    tts = gTTS(text=text, lang=gtts_lang, slow=False)
    tts.save(temp_file.name)

    return send_file(temp_file.name, mimetype='audio/mpeg')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
