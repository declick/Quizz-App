const saveProgress = (categoryName, progress) => {
  localStorage.setItem(categoryName, progress);
};

const getProgress = (categoryName) => {
  return parseInt(localStorage.getItem(categoryName)) || 0;
};

const clearProgress = () => {
  localStorage.clear();
};

const saveLives = (lives) => {
  localStorage.setItem('lives', lives.toString());
};

const restoreLives = () => {
  let storedLives = localStorage.getItem('lives');

  if (storedLives !== null) {
    return parseInt(storedLives);
  }

  return 3;
};

const saveScore = (score) => {
  localStorage.setItem('score', score.toString());
};

const getScore = () => {
  let storedScore = localStorage.getItem('score');
  return storedScore ? parseInt(storedScore) : 0;
};
function saveBonusCount(bonusCount) {
  localStorage.setItem('bonusCount', bonusCount);
}

