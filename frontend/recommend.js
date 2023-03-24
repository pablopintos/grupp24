const searchInput2 = document.getElementById("search-song");
const searchBtn2 = document.getElementById("search-button-song");
const accessToken = window.localStorage.getItem('access_token');

searchBtn2.addEventListener("click", () => {
    let searchKey2 = searchInput2.value;
    searchByName(searchKey2);
  });

  searchInput2.addEventListener("keydown", event => {
    if (event.keyCode === 13) {
      const searchKey2 = searchInput2.value;
      searchByName(searchKey2);
    }
  }); 

async function getToken(){
    // Funktionen hämtar spotifys token och sparar denna lokalt i webbläsaren.
    let params = (new URL(location.href.replace('#','?'))).searchParams;
    let token = params.get('access_token');
    window.localStorage.setItem('access_token',token)   
    location.href = "searched-content.html";
  }
  async function searchByName(searchKey2){
    fetch(`http://localhost:8080/track/${searchKey2}`, {
      headers: {
        'Authorization': `Bearer ${access_token}`}
    })
    .then(response => response.json())
    .then(data => {
      // extract information from the response JSON
      const trackName = data.name;
      const artistName = data.artists.name;
      const albumName = data.album.name;
      const albumCover = data.album.images.url;
    
      // update HTML elements to display the track information
      document.getElementById('track-name').textContent = trackName;
      document.getElementById('artist-name').textContent = artistName;
      document.getElementById('album-name').textContent = albumName;
      document.getElementById('album-cover').src = albumCover;
    })
    .catch(error => {
      console.error('Error retrieving track information:', error);
    })};

    async function searchByName(searchKey2){
        await fetch(`http://localhost:8080/track/${searchKey2}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`}
          })
        .then(res => res.json()).then(res => {
          const items = res.tracks.albums.artists.slice(0, 10);
          console.log(items);
          jQuery("#imgTable2").empty();
          items.forEach((item, index) => {
            const img = item.links[0].album;
            const title = item.data[0].title
            const desc = item.data[0].description;
            jQuery("#imgTable2").append(`<tr>
            <td>${index+1}</td>
            <td>${title}</td>  
            <td><img src=${img}></td>  
            <td>${desc}</td>  
            </tr>"
          `);
          });  
        })
      }

