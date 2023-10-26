window.addEventListener('load', () => {
  let loading = document.getElementById('loading');
  let menu = document.getElementById('menu');
  let playButton = document.getElementById('play-button');
  let readyAudio = new Audio('./assets/sound/ready.mp3');

  menu.style.display = 'none';

  readyAudio.play();

  // Ajouter un gestionnaire d'événements au bouton "Play"
  playButton.addEventListener('click', () => {
    // Masquer l'écran de chargement
    loading.style.display = 'none';

    // Afficher le menu
    menu.style.display = 'block';

    // Jouer le son de prêt
    readyAudio.play();

    // Lancer la musique de fond du jeu
    playBackgroundMusic();
  });
});
