import string
import random
from typing import Tuple, Dict
import requests
import flask
import spotify.sync as spotify
import spotify
from spotify import OAuth2

SPOTIFY_CLIENT = spotify.Client('38d9e5c35e734857b7e0f633c1fafd99', 'c3b46ed9a4f04ea2951bbdc0ed54b6f7')
'''oauth_url = OAuth2.url_only('38d9e5c35e734857b7e0f633c1fafd99', 'c3b46ed9a4f04ea2951bbdc0ed54b6f7', scope=['some-scope', 'another-scope'], state='cryptographically-random-state')
'''
print(SPOTIFY_CLIENT)
APP = flask.Flask(__name__)
APP.config.from_mapping({'spotify_client': SPOTIFY_CLIENT})

REDIRECT_URI: str = 'http://127.0.0.1:5500/frontend/searched-content.html'

OAUTH2_SCOPES: Tuple[str] = ('user-modify-playback-state', 'user-read-currently-playing', 'user-read-playback-state')
OAUTH2: spotify.OAuth2 = spotify.OAuth2(SPOTIFY_CLIENT.id, REDIRECT_URI, scopes=OAUTH2_SCOPES)
SPOTIFY_USERS: Dict[str, spotify.User] = {}


@APP.route('/spotify/callback')
def spotify_callback():
    try:
        code = flask.request.args['code']
    except KeyError:
        return flask.redirect('/spotify/failed')
    else:
        key = ''.join(random.choice(string.ascii_uppercase) for _ in range(16))
        SPOTIFY_USERS[key] = spotify.User.from_code(
            SPOTIFY_CLIENT,
            code,
            redirect_uri=REDIRECT_URI,
            refresh=True
        )

        flask.session['spotify_user_id'] = key

    return flask.redirect('/')

@APP.route('/spotify/failed')
def spotify_failed():
    flask.session.pop('spotify_user_id', None)
    return 'Failed to authenticate with Spotify.'


@APP.route('/create_playlist', methods=['POST'])
def create_playlist():
    search_input = requests.form['search_input']
    # Use the search input to get recommendations and create a playlist using the Spotify Web API
    # ...

    return redirect('/')

@APP.route('/')
@APP.route('/index')
def index():
    try:
        return repr(SPOTIFY_USERS[flask.session['spotify_user_id']])
    except KeyError:
        return flask.redirect(OAUTH2.url)

if __name__ == '__main__':
    APP.run('127.0.0.1', port=8800, debug=False) 


# Playlist Class
class Playlist():
    def __init__(self, token: str):
        self.token = token

    def get(self, PlaylistID: str):
        return requests.request(
            'GET',
            'https://api.spotify.com/v1/playlists/' + PlaylistID,
            headers={'Authorization': 'Bearer ' + self.token},
            params={
                'market': 'US'
            }
        ).json()

    def tracks(self, PlaylistID: str, limit: int = 1):
        if not 0 < limit < 50:
            raise LimitOutOfRangeError('limit must be under 50')
        
        return requests.request(
            'GET',
            'https://api.spotify.com/v1/playlists/' + PlaylistID + '/tracks',
            headers={'Authorization': 'Bearer ' + self.token},
            params={
                'market': 'US',
                'limit': limit
            }
        ).json()