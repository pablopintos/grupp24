const clientID = '38d9e5c35e734857b7e0f633c1fafd99';
const clientSecret = 'c3b46ed9a4f04ea2951bbdc0ed54b6f7';
const redirect_uri = 'http://127.0.0.1:5500/frontend/searched-content.html';

function login() {
  let scope = 'user-follow-read user-modify-playback-state';
  let clientID = '38d9e5c35e734857b7e0f633c1fafd99';
  let redirect_uri = 'http://127.0.0.1:5500/frontend/searched-content.html';
  let response_type = 'token';
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
}

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
    localStorage.setItem('accessToken', hash.access_token); // Store the access token in localStorage
    populateProfile(hash.access_token);
  }
}


/*Föreslagna planeter till sökfältet*/
document.querySelectorAll('.suggestion').forEach(item => {
  item.addEventListener('click', event => {
    console.log(event.target);
    searchInput.value = event.target.innerHTML.trim();
    searchBtn.click();
  })
})

async function searchByName(searchKey) {
  
  await fetch(`http://localhost:8080/search/${searchKey}`, { method: 'GET' })
    .then(res => res.json()).then(res => {
      const items = res.collection.items.slice(0, 10);
      console.log(items);
      jQuery("#imgTable").empty();
      items.forEach((item, index) => {
        const img = item.links[0].href;
        const title = item.data[0].title
        const desc = item.data[0].description;
        jQuery("#imgTable").append(`<tr>
      <td>${index + 1}</td>
      <td>${title}</td>  
      <td><img src=${img}></td>  
      <td>${desc}</td>  
      </tr>"
    `);
      });
    })

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
  }

  try {
    const fetchResponse = await fetch(`http://localhost:8080/track/${searchKey}`, settings);
    let data = await fetchResponse.json();
    console.log(data);

    const tracksTable = document.getElementById("imgTable2");
    tracksTable.innerHTML = "";
    const tracks = data.tracks.items;
    tracks.forEach((track, index) => {
      const img = track.album.images[0].url;
      const title = track.name;
      const desc = track.album.name;
      tracksTable.insertRow().innerHTML = `
        <td>${index + 1}</td>
        <td>${title}</td>  
        <td><img src=${img}></td>  
        <td>${desc}</td>  
      `;
    });

  } catch (e) {
    return e;
  }
}


