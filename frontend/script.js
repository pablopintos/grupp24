const accessToken = window.localStorage.getItem('access_token');
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");


searchBtn.addEventListener("click", () => {
  let searchKey = searchInput.value;
  searchByName(searchKey);
  searchByTrack(searchKey);
});

searchInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    searchByName(searchInput.value);
  }
});

searchInput.addEventListener("keydown", event => {
  if (event.keyCode === 13) {
    const searchKey = searchInput.value;
    searchByName(searchKey);
  }
});

let response_type = '';

async function getToken(){
  // Funktionen hämtar spotifys token och sparar denna lokalt i webbläsaren.
  let params = (new URL(location.href.replace('#','?'))).searchParams;
  let token = params.get('access_token');
  window.localStorage.setItem('access_token',token)   
}  

function login(){
  let scope = 'user-follow-read';
  let clientID = '38d9e5c35e734857b7e0f633c1fafd99';
  let redirect_uir = 'http://127.0.0.1:5500/frontend/searched-content.html';
  response_type = 'token';
  getToken
  
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirect_uir}&response_type=${response_type}&scope=${scope}`;
}
document.querySelectorAll('.suggestion').forEach(item => {
  item.addEventListener('click', event => {
    //handle click
    console.log(event.target);
    searchInput.value = event.target.innerHTML.trim();
    searchBtn.click();
  })
})
$("#search-input").keypress(function(event) {
  if (event.which == 13) {
    $("#search-button").click();
    event.preventDefault();
  }
});

async function searchByName(searchKey){
  await fetch(`http://localhost:8080/search/${searchKey}`, {method: 'GET'})
  .then(res => res.json()).then(res => {
    const items = res.collection.items.slice(0, 10);
    console.log(items);
    jQuery("#imgTable").empty();
    items.forEach((item, index) => {
      const img = item.links[0].href;
      const title = item.data[0].title
      const desc = item.data[0].description;
      jQuery("#imgTable").append(`<tr>
      <td>${index+1}</td>
      <td>${title}</td>  
      <td><img src=${img}></td>  
      <td>${desc}</td>  
      </tr>"
    `);
    });  
  })

}

let tokenV = 'BQCSqfLanDBlOCiz3yg-qGdfYlAZXt569VxImTjR9zVYfVV3cWYZk76IJBpxPOZ5Xc96ttO46J0dlGtwVkJOpZGuHIShwBJJfl-GSowTPxvltXWXRNEYP9_TMVVSmrCeeh_XGzEU2Uaspw-7finf3lDdb4Tn90cEhK0zthwuWNUPN89b8cz74uowSWxeY0bdwQ4J';
const JS_headers = new Headers({
  'Accept': 'application/json',
  'Authorization': 'Bearer ' + accessToken
});

async function searchByTrack(searchKey){
  const settings = {
    method: 'GET',
    headers: JS_headers
  };

  const fetchResponse = await fetch(`http://localhost:8080/track/${searchKey}`, settings);
  const data = await fetchResponse.json();
  console.log("------------")
  console.log(data)
  console.log("------------")


}

