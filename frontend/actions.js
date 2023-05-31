const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

searchBtn.addEventListener("click", () => {
    let searchKey = searchInput.value;
    searchByName(searchKey);
    searchByTrack(searchKey);
  });
  
  searchInput.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) { 
      event.preventDefault();
      let searchKey = searchInput.value;
      searchByName(searchKey);
      searchByTrack(searchKey);
    } else { 
      if (searchInput.value.length > 2) { 
        let searchKey = searchInput.value;
        searchByName(searchKey);
        searchByTrack(searchKey);
      }
    }
  });

  document.addEventListener('loginStatusChange', function(event) {
    let content = document.getElementById('content');
  
    if (event.detail.isLoggedIn) {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
  

  function populateUI(profile) {
  document.getElementById("displayName").innerText = profile.display_name || profile.id || 'Anonymous';
  if (profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    document.getElementById("avatar").appendChild(profileImage);
  }
  document.getElementById("id").innerText = profile.id;
  document.getElementById("email").innerText = profile.email;
  document.getElementById("uri").innerText = profile.uri;
  document.getElementById("uri").setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url").innerText = profile.href;
  document.getElementById("url").setAttribute("href", profile.href);
}

async function populateProfile(accessToken) { // The access token from the URL hash is passed as a parameter
  const headers = new Headers({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + accessToken
  });

  const settings = {
      method: 'GET',
      headers: headers
  };
  
  const profileResponse = await fetch('https://api.spotify.com/v1/me', settings);
  const profileData = await profileResponse.json();
  
  populateUI(profileData);
}

function logout() {
    // Raderar från localstorage
    localStorage.removeItem("accessToken");
  
    // Raderar all info om användaren
    document.getElementById("displayName").innerText = "";
    document.getElementById("avatar").innerHTML = "";
    document.getElementById("id").innerText = "";
    document.getElementById("email").innerText = "";
    document.getElementById("uri").innerText = "";
    document.getElementById("uri").setAttribute("href", "#");
    document.getElementById("url").innerText = "";
    document.getElementById("url").setAttribute("href", "");
  
//Visar confirmation meddelande att man är utloggad
    const confirmationMessage = document.getElementById("confirmation-message");
    confirmationMessage.innerText = "Du är nu utloggad och din information är borttagen!";
    confirmationMessage.style.display = "block";
  
    // Meddelandet försvinner efter 3s
    setTimeout(() => {
      confirmationMessage.style.display = "none";
    }, 3000);
    }
  