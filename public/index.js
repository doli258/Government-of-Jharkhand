  
    function toggleMenu() {
      const menu = document.querySelector('.menu');
      const hamburgerIcon = document.querySelector('.hamburger i');

      menu.classList.toggle('active');

      // ✅ Toggle icon
      if (menu.classList.contains('active')) {
        hamburgerIcon.classList.remove('fa-bars');
        hamburgerIcon.classList.add('fa-times');
      } else {
        hamburgerIcon.classList.remove('fa-times');
        hamburgerIcon.classList.add('fa-bars');
      }
    }
  