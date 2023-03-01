
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");


searchBtn.addEventListener("click", () => {
  const searchKey = searchInput.value;
  searchByName(searchKey);
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
  

document.querySelectorAll('.suggestion').forEach(item => {
  item.addEventListener('click', event => {
    //handle click
    console.log(event.target);
    searchInput.value = event.target.innerHTML.trim();
  })
})


async function searchByName(searchKey){
  await fetch(`http://localhost:8080/nasa/search/${searchKey}`, {method: 'GET'})
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

//This comand hides the search-table
//$('#tableContainer').hide();

$(document).ready(function(){
    $("#tableContainer").hide();
   
    $('#search-button').click(function(){
        $("#tableContainer").toggle();
    });
});
 

