const navbar = document.getElementById('navbar');
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', e => {
    // handle clicks on menu items
  });
});

window.addEventListener('resize', e => {
  // toggle the visibility of the navigation bar on small screens
});
console.log('hejfasdf')