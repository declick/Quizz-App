// Fonction pour sauvegarder le mot en cours dans le stockage local
function saveCurrentWord(selectedWord) {
  localStorage.setItem('currentWord', selectedWord);
}

// Fonction pour récupérer le mot en cours depuis le stockage local
function getCurrentWord() {
  return localStorage.getItem('currentWord') || '';
}

// Fonction pour effacer le mot en cours du stockage local
function clearCurrentWord() {
  localStorage.removeItem('currentWord');
}