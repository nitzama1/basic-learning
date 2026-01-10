from flask import Flask, render_template, jsonify, send_file
import random
import string
from gtts import gTTS
import os
import tempfile

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-letter')
def generate_letter():
    hebrew_letters = 'אבגדהוזחטיכלמנסעפצקרשת'
    letter = random.choice(hebrew_letters)
    return jsonify({'letter': letter})

@app.route('/speak/<text>/<lang>')
def speak(text, lang):
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
    app.run(debug=True)
