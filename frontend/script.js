const clientID = '38d9e5c35e734857b7e0f633c1fafd99';
const redirectURI = 'http://127.0.0.1:5500/frontend/searched-content.html';

function login() {
  let scope = 'user-read-private user-read-email streaming';
  let responseType = 'token';
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}&scope=${scope}`;
}

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = localStorage.getItem('accessToken');
  const player = new Spotify.Player({
    name: 'Spotifyspelare',
    getOAuthToken: cb => { cb(token); }
  });
  player.addListener('player_state_changed', state => { console.log(state); });
  player.addListener('ready', ({ device_id }) => {
    localStorage.setItem('deviceId', device_id);
  });
  player.connect();
};

window.onload = function() {
  const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
  window.location.hash = '';

  if (hash.access_token) {
    localStorage.setItem('accessToken', hash.access_token);
    populateProfile(hash.access_token);
    fetchAccessToken();
  }
};


/*Föreslagna planeter till sökfältet*/
document.querySelectorAll('.suggestion').forEach(item => {
  item.addEventListener('click', event => {
    console.log(event.target);
    searchInput.value = event.target.innerHTML.trim();
    searchBtn.click();
  });
});
/* Anrop till backend*/
async function searchByName(searchKey) {
  await fetch(`http://localhost:8080/search/${searchKey}`, { method: 'GET' })
    .then(res => res.json())
    .then(res => {
      const items = res.collection.items.slice(0, 10);
      console.log(items);
      jQuery("#imgTable").empty();
      items.forEach((item, index) => {
        const img = item.links[0].href;
        const title = item.data[0].title;
        const desc = item.data[0].description;
        jQuery("#imgTable").append(`
          <tr>
            <td>${index + 1}</td>
            <td>${title}</td>  
            <td><img src=${img}></td>  
            <td>${desc}</td>  
          </tr>
        `);
      });
    });
}

async function searchByTrack(searchKey) {
  const tokenSettings = {
    method: 'GET'
  };

  var token = await fetch(`http://localhost:8080/token`, tokenSettings)
    .then(res => res.json())
    .then(res => {
      let fetchedToken = res['access_token'];
      return fetchedToken;
    });

  console.log("ACCESS TOKEN, BABY: " + token);

  const JS_headers = new Headers({
    'Accept': 'application/json',
    'Authorization': token
  });

  const settings = {
    method: 'GET',
    headers: JS_headers
  };

  try {
    const fetchResponse = await fetch(`http://localhost:8080/track/${searchKey}`, settings);
    let data = await fetchResponse.json();
    console.log(data);

    const tracksTable = document.getElementById("imgTable2");
    const tracksBody = tracksTable.querySelector("tbody");
    tracksBody.innerHTML = "";
    const tracks = data.tracks.items;
    tracks.forEach((track, index) => {
      const img = track.album.images[0].url;
      const title = track.name;
      const desc = track.album.name;
      const uri = track.uri; 
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${title}</td>  
        <td><img src=${img}></td>  
        <td>${desc}</td>  
        <td>
          <button onclick="playSong('${uri}')">Play</button>
        </td>
      `;
      tracksBody.appendChild(row);
    });

  } catch (e) {
    return e;
  }
}



function playSong(uri) {
  const accessToken = localStorage.getItem('accessToken');
  const deviceId = localStorage.getItem('deviceId');

  const playPayload = {
    uris: [uri]
  };

  const playSettings = {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(playPayload)
  };

  const playUrl = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;

  fetch(playUrl, playSettings)
    .then(response => {
    })
}
