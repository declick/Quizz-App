function saveProgress(categoryName, progress) {
  localStorage.setItem(categoryName, progress);
}

function getProgress(categoryName) {
  return parseInt(localStorage.getItem(categoryName)) || 0;
}

function clearProgress() {
  localStorage.clear();
}

function saveLives(lives) {
  localStorage.setItem('lives', lives.toString());
}

function restoreLives() {
  let storedLives = localStorage.getItem('lives');

  if (storedLives !== null) {
    return parseInt(storedLives);
  }

  return 3;
}
