// Créer une variable globale pour stocker l'objet audio
let audio;
// Créer une fonction pour jouer la musique de fond
function playBackgroundMusic() {
  audio = new Audio('./assets/sound/Journey to the East Rocks.ogg');
   audio.loop = true; // Activer la boucle
  audio.play();
}

// Sélectionner l'image pour la mettre en pause ou couper la musique
const speakerMuteImg = document.querySelector('.popup-menu .logo-menu[src="./assets/img/SpeakerMute.png"]');
// Ajouter un gestionnaire d'événements pour le clic sur l'image
speakerMuteImg.addEventListener('click', function() {
  if (audio) {
    // Mettre en pause ou couper la musique ici
    audio.pause(); // Mettre en pause la musique
    // ou
    audio.muted = true; // Couper la musique
  }
});


// Sélectionner l'image pour relancer la musique
const speakerOnImg = document.querySelector('.popup-menu .logo-menu[src="./assets/img/SpeakerOn.png"]');
// Ajouter un gestionnaire d'événements pour le clic sur l'image
speakerOnImg.addEventListener('click', function() {
  if (audio) {
    // Réactiver la musique ici
    audio.play();
    audio.muted = false; // Assurez-vous que le son n'est pas coupé
  }
});
