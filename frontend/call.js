const clientId = '38d9e5c35e734857b7e0f633c1fafd99';
const redirectUri = 'http://127.0.0.1:5500/frontend/searched-content.html';
const scope = 'playlist-modify-public';



// handle button click event
document.querySelector('#search-button').addEventListener('click', () => {
  // get the search input value
  const searchQuery = document.querySelector('#search-input').value;
  
  // authenticate with Spotify's API
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
  window.location = authUrl;
});

// handle authentication redirect
if (window.location.hash) {
  const hash = window.location.hash.substring(1);
  const token = new URLSearchParams(hash).get('access_token');
  
  // create a new playlist and add the first track from the search results
  createPlaylist(token, searchQuery);
}

function createPlaylist(token, searchQuery) {
  // search for tracks that match the query
  const searchUrl = `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=1`;
  fetch(searchUrl, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    // get the first track from the search results
    const trackUri = data.tracks.items[0].uri;
    
    // create a new playlist
    const playlistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
    fetch(playlistUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `${searchQuery} Playlist`,
        public: true
      })
    })
    .then(response => response.json())
    .then(playlistData => {
      // add the track to the new playlist
      const playlistId = playlistData.id;
      const addTrackUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUri}`;
      fetch(addTrackUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    });
  });
}

