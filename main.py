import os
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

from flask import Flask, render_template, jsonify, redirect, session, request
import spotipy
from spotipy.oauth2 import SpotifyOAuth

from py_tools import env_to_var

app = Flask(__name__)
app.secret_key = env_to_var('FLASK_SECRET_KEY')


client_id = env_to_var('CLIENT_ID')
client_secret = env_to_var('CLIENT_SECRET')
redirect_uri = 'http://127.0.0.1:5001/callback'  # Ensure this matches your dashboard

scope = 'user-read-playback-state'
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
    session['token_info'] = token_info  # Store the token info in the session
    return redirect('/')  # Redirect to the home page after authentication

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

    return jsonify({
        'track_name': track['name'],
        'artist_name': ', '.join(artist['name'] for artist in track['artists']),
        'album_name': track['album']['name'],
        'cover_url': track['album']['images'][0]['url'],
        'progress_ms': progress_ms,
        'duration_ms': duration_ms
    })

def is_authenticated():
    token_info = session.get('token_info')
    if token_info:
        return not sp.auth_manager.is_token_expired(token_info)
    return False

if __name__ == '__main__':
    app.run(port=5001, debug=True)
