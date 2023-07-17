window.addEventListener('load', () => {
  let loading = document.getElementById('loading');
  let menu = document.getElementById('menu');

  menu.style.display = 'none';

  let readyAudio = new Audio('./assets/sound/ready.mp3');
  readyAudio.play();

  setTimeout(() => {
    loading.style.display = 'none';
    menu.style.display = 'block';
    playBackgroundMusic();
  }, 1500);
});
