import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from flask import Flask, render_template, jsonify, redirect, session, request, url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth

from py_tools import *

app = Flask(__name__)
app.secret_key = env_to_var('FLASK_SECRET_KEY')


client_id = env_to_var('CLIENT_ID')
client_secret = env_to_var('CLIENT_SECRET')
redirect_uri = os.getenv('REDIRECT_URI')

scope = 'user-modify-playback-state user-read-playback-state'
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=client_id,
                                               client_secret=client_secret,
                                               redirect_uri=redirect_uri,
                                               scope=scope))

@app.route('/')
def index():
    if not is_authenticated():
        auth_url = sp.auth_manager.get_authorize_url()
        return redirect(auth_url)
    
    return render_template('index.html')

@app.route('/callback')
def callback():
    token_info = sp.auth_manager.get_access_token(request.args['code'])
    session['token_info'] = token_info  
    return redirect(url_for('index'))  

@app.route('/current-track')
def current_track():
    
    
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401

    current_playback = sp.current_playback()
    if current_playback is None:
        return jsonify({'error': 'No track is currently playing.'}), 204
    
    track = current_playback['item']
    progress_ms = current_playback['progress_ms']
    duration_ms = track['duration_ms']

    colors = get_top_colors(track['album']['images'][0]['url'])

    return jsonify({
        'track_id': track['id'],
        'track_name': track['name'],
        'artist_name': ', '.join(artist['name'] for artist in track['artists']),
        'album_name': track['album']['name'],
        'cover_url': track['album']['images'][0]['url'],
        'progress_ms': progress_ms,
        'duration_ms': duration_ms,
        'colors': colors,
        'average_color': dominant_color(colors),
        'playback': current_playback['is_playing']
    })

@app.route('/skip-track')
def skip_track():
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401
    try:
        sp.next_track() 
        return redirect(url_for("index"))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/previous-track')
def previous_track():
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401
    try:
        sp.previous_track()
        return redirect(url_for("index"))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pause-playback')
def pause_playback():
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401
    try:
        sp.pause_playback()
        return redirect(url_for("index"))
    except Exception as e:
        return redirect(url_for("resume_playback"))

@app.route('/resume-playback')
def resume_playback():
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401
    try:
        sp.start_playback()
        return redirect(url_for("index"))
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/is-paused')
def is_paused():
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401

    current_playback = sp.current_playback()
    if current_playback is None:
        return jsonify({'error': 'No track is currently playing.'}), 204

    is_paused = current_playback['is_playing'] == False
    return jsonify({'is_paused': is_paused})

@app.route('/seek-track', methods=['POST'])
def seek_track():
    if not is_authenticated():
        return jsonify({'error': 'User not authenticated.'}), 401
    
    position_ms = request.args.get('position', type=int)
    
    try:
        sp.seek_track(position_ms)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def is_authenticated():
    token_info = session.get('token_info')
    if token_info:
        return not sp.auth_manager.is_token_expired(token_info)
    return False

if __name__ == '__main__':
    app.run(port=5001, debug=True)
