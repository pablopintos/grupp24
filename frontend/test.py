import spotipy
from spotipy.oauth2 import SpotifyOAuth

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id="38d9e5c35e734857b7e0f633c1fafd99",
                                               client_secret="c3b46ed9a4f04ea2951bbdc0ed54b6f7",
                                               redirect_uri="http://127.0.0.1:5500/frontend/searched-content.html",
                                               scope="user-library-read"))

results = sp.current_user_saved_tracks()
for idx, item in enumerate(results['items']):
    track = item['track']
    print(idx, track['artists'][0]['name'], " – ", track['name'])

