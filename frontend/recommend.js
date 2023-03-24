searchBtn.addEventListener("click", () => {
  let track = searchInput.value;
  searchByName(track);
});

searchInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    searchByName(searchInput.value);
  }
});
async function getToken(){
  // Funktionen hämtar spotifys token och sparar denna lokalt i webbläsaren.
  let params = (new URL(location.href.replace('#','?'))).searchParams;
  let token = params.get('access_token');
  window.localStorage.setItem('access_token',token)   
  location.href = "listArtists.html";
}


async function handleSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector('#search-input');
  const query = searchInput.value;
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`);
  const data = await response.json();
  console.log(data); // or do something else with the data
}
async function handleSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector('#search-input');
  const query = searchInput.value;
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`);
  const data = await response.json();
  
  const resultsDiv = document.createElement('div');
  data.tracks.items.forEach(item => {
    const trackDiv = document.createElement('div');
    const trackName = document.createElement('h3');
    trackName.textContent = item.name;
    trackDiv.appendChild(trackName);
    resultsDiv.appendChild(trackDiv);
  });
  
  document.body.appendChild(resultsDiv);
}



