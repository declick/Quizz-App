// Fonction pour sauvegarder la progression dans le stockage local
function saveProgress(categoryName, progress) {
  var gameProgress = JSON.parse(localStorage.getItem('gameProgress')) || {};
  gameProgress[categoryName] = progress;
  localStorage.setItem('gameProgress', JSON.stringify(gameProgress));
}

// Fonction pour récupérer la progression depuis le stockage local
function getProgress(categoryName) {
  var gameProgress = JSON.parse(localStorage.getItem('gameProgress')) || {};
  return gameProgress[categoryName] || 0;
}

// Fonction pour effacer la progression du stockage local
function clearProgress() {
  localStorage.removeItem('gameProgress');
}
