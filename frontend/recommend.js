async function getToken(){
  // Funktionen hämtar spotifys token och sparar denna lokalt i webbläsaren.
  let params = (new URL(location.href.replace('#','?'))).searchParams;
  let token = params.get('access_token');
  window.localStorage.setItem('access_token',token)   
  location.href = "listArtists.html";
}
  
function login(){
  // Funktionen hanterar inloggningen på spotifys konto. 
  let scope = 'user-follow-read';
  let clientID = '38d9e5c35e734857b7e0f633c1fafd99';
  let redirect_uir = 'http://127.0.0.1:5500/frontend/searched-content.html';
  let response_type = 'token';
  
  window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirect_uir}&response_type=${response_type}&scope=${scope}`;
}