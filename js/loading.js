window.addEventListener('load', () => {
    let loading = document.getElementById('loading');
    let menu = document.getElementById('menu');
  
    menu.style.display = 'none'; // Masquer le menu au chargement de la page
  
    setTimeout(() => {
      loading.style.display = 'none';
      menu.style.display = 'block';
    }, 1500);
  });
  