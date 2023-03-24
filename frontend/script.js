
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

const clientID = '38d9e5c35e734857b7e0f633c1fafd99';
const clientSecret = 'c3b46ed9a4f04ea2951bbdc0ed54b6f7';
const redirect_uri = 'http://127.0.0.1:5500/frontend/searched-content.html';


searchBtn.addEventListener("click", () => {
  let searchKey = searchInput.value;
  searchByName(searchKey);
  searchByTrack(searchKey);
});

searchInput.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    let searchKey = searchInput.value;
    searchByName(searchKey);
    searchByTrack(searchKey);
  }
});


searchInput.addEventListener("keydown", event => {
  if (event.keyCode === 13) {
    const searchKey = searchInput.value;
    searchByName(searchKey);
  }
});

function login(){
  console.log("LOGGING IN ...")
  let scope = 'user-follow-read';
  let clientID = '38d9e5c35e734857b7e0f633c1fafd99';
  let redirect_uri = 'http://127.0.0.1:5500/frontend/searched-content.html';
  let response_type = 'token';
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
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


async function searchByTrack(searchKey){  
  
  const tokenSettings = {
    method: 'GET'
  };
  
  var token = await fetch(`http://localhost:8080/token`, tokenSettings)
  .then(res => res.json()).then(res => {
    let fetchedToken = res['access_token'];
    return fetchedToken;
  })

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
  } catch (e) {
    return e;
}
}
