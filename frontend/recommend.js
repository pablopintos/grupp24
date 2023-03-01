(function() {
    
  function login(callback) {
      var CLIENT_ID = '38d9e5c35e734857b7e0f633c1fafd99';
      var REDIRECT_URI = 'http://127.0.0.1:5500/frontend/searched-content.html';
      function getLoginURL(scopes) {
          return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
            '&scope=' + encodeURIComponent(scopes.join(' ')) +
            '&response_type=token';
      }
      
      var url = getLoginURL([
          'user-read-email'
      ]);
      
      var width = 450,
          height = 730,
          left = (screen.width / 2) - (width / 2),
          top = (screen.height / 2) - (height / 2);
  
      window.addEventListener("message", function(event) {
          var hash = JSON.parse(event.data);
          if (hash.type == 'access_token') {
              callback(hash.access_token);
          }
      }, false);
      
      var w = window.open(url,
                          'Spotify',
                          'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                         );
      
  }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }

    var templateSource = document.getElementById('result-template').innerHTML,
        template = Handlebars.compile(templateSource),
        resultsPlaceholder = document.getElementById('result'),
        loginButton = document.getElementById('btn-login');

    loginButton.addEventListener('click', function() {
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    loginButton.style.display = 'none';
                    resultsPlaceholder.innerHTML = template(response);
                });
            });
    });

})();