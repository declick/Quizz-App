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
  return parseInt(localStorage.getItem('lives')) || 3;
}
