
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");


searchBtn.addEventListener("click", () => {
  const searchKey = searchInput.value;
  searchByName(searchKey);
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
    const items = res.collection.items;
    console.log(items);
    items.forEach((item, index) => {
      const img = item.links[0].href;
      const title = item.data[0].title
      const desc = item.data[0].description;
      jQuery("#imgTable tr:last").after(`<tr>
      <td>${index+1}</td>
      <td>${title}</td>  
      <td><img src=${img}></td>  
      <td>${desc}</td>  
      </tr>"
    `);
    });  
  })
}

 searchBtn = document.getElementById("nav-item-search-astro");
 searchBtn.addEventListener("click", function() {
  window.location = "second-page.html";
});


