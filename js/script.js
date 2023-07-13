window.addEventListener('load', () => {
  let gameContainer = document.getElementById('game-container');
  let categories = document.getElementsByClassName('category');
  let wordContainer = document.getElementById('empty-box-container');
  let letterContainer = document.getElementById('letter-box-container');
  let checkButton = document.getElementById('check-button');
  let backButton = document.getElementById('back-button');
  let selectedWord = '';
  let categoryName = '';
  let attempts = 0; // Nombre de tentatives actuelles
  let maxAttempts = 3; // Nombre maximum de tentatives autorisées
  let isGameOver = false; // Indicateur de fin de partie

  let score = getScore(); // Récupérer le score sauvegardé
  let scoreElement = document.getElementById('score');
  scoreElement.textContent = score.toString();

  let lives = restoreLives(); // Restaurer le nombre de vies sauvegardé

  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    let playButton = category.getElementsByClassName('play-button')[0];
    let categoryText = category.getElementsByClassName('category-text')[0].textContent;
    playButton.addEventListener('click', function() {
      categoryName = this.parentNode.getElementsByClassName('category-text')[0].textContent;
      console.log('Catégorie ' + categoryName + ' - Jouer');
      startGame(categoryName);
      menu.style.display = 'none';
      gameContainer.style.display = 'block';
    });
  }

  const shuffleWord = (word) => {
    let shuffledWord = word.split('');

    for (let i = shuffledWord.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = shuffledWord[i];
      shuffledWord[i] = shuffledWord[j];
      shuffledWord[j] = temp;
    }

    return shuffledWord.join('');
  }

  let selectedCategory; // Déclarer selectedCategory en dehors de la fonction startGame()

  let wordsByCategory = {
    'Niveau 1 - Mots de 3 lettres': ['cha', 'lit', 'rat', 'pom', 'arc', 'kwa', 'kyu', 'wax', 'wok', 'yak'],
    'Niveau 2 - Mots de 4 lettres': ['casa', 'pied', 'lune', 'sole', 'fils', 'gars', 'gale', 'gags', 'gant', 'gala'],
    'Niveau 3 - Mots de 5 lettres': ['tapis', 'route', 'table', 'maison', 'avion', 'sable'],
    'Niveau 4 - Mots de 6 lettres': ['voyage', 'animal', 'espace', 'orange', 'école'],
    'Niveau 5 - Mots de 7 lettres': ['ordinateur', 'tortue', 'chambre', 'banane', 'bouteil', 'chapeau']
  };

  const startGame = (categoryName) => {
    console.log('Démarrage du jeu dans la catégorie ' + categoryName);
    selectedCategory = wordsByCategory[categoryName];

    if (!selectedCategory || selectedCategory.length === 0) {
      console.log('La catégorie ' + categoryName + ' est vide ou n\'existe pas.');
      return;
    }

    selectedWord = selectedCategory[getProgress(categoryName)];
    shuffledWord = shuffleWord(selectedWord);
    displayShuffledWord();

    menu.style.display = 'none';
    gameContainer.style.display = 'block';
    checkButton.disabled = false;
    isGameOver = false;
    attempts = 0;
  }

  function handleLetterClick() {
    if (isGameOver || lives === 0) {
      return;
    }

    let selectedLetter = this.textContent;
    let emptyBoxes = document.getElementsByClassName('empty-box');
    let filledLetters = document.getElementsByClassName('filled-letter'); // Ajouter cette ligne

    for (let i = 0; i < emptyBoxes.length; i++) {
      let emptyBox = emptyBoxes[i];

      if (emptyBox.textContent === '') {
        emptyBox.textContent = selectedLetter;
        emptyBox.classList.add('filled');
        this.style.visibility = 'hidden';
        this.classList.remove('letter-box-bottom');
        break;
      }
    }

    for (let i = 0; i < filledLetters.length; i++) { // Ajouter cette boucle
      let filledLetter = filledLetters[i];
      filledLetter.addEventListener('click', handleFilledLetterClick); // Ajouter un gestionnaire de clic pour les lettres remplies
    }
  }


  function handleCheckClick() {
    if (isGameOver || lives === 0) {
      return;
    }

    let emptyBoxes = document.getElementsByClassName('empty-box');
    let userWord = '';

    for (let i = 0; i < emptyBoxes.length; i++) {
      let emptyBox = emptyBoxes[i];
      userWord += emptyBox.textContent;
    }

    if (userWord === selectedWord) {
      console.log('Bravo ! Tu as reconstitué le mot ' + selectedWord + ' !');
      resetLetters();

      // Mettre à jour la progression
      let progress = getProgress(categoryName) + 1;
      saveProgress(categoryName, progress);
      updateCategoryProgress();

      // Augmenter le score
      score++;
      scoreElement.textContent = score.toString();
      saveScore(score); // Sauvegarder le score

      if (progress === selectedCategory.length) {
        console.log('Félicitations ! Tu as terminé la catégorie ' + categoryName + ' !');
        resetGame();
        return;
      }

      selectedWord = selectedCategory[progress];
      shuffledWord = shuffleWord(selectedWord);
      displayShuffledWord();
    } else {
      console.log('Dommage ! Ce n\'est pas le bon mot.');
      attempts++;

      if (lives > 0) {
        lives--;
        saveLives(lives); // Sauvegarder le nombre de vies
      }

      updateLivesIndicator();

      if (lives === 0) {
        console.log('Nombre maximal de vies atteint. La partie est terminée.');
        isGameOver = true;
        resetGame();
      } else {
        resetLetters();
        displayShuffledWord();
      }
    }
  }

  const updateLivesIndicator = () => {
    let livesCountElement = document.getElementById('lives-count');
    let livesCountElementGame = document.getElementById('lives-count-game');

    livesCountElementGame.textContent = lives.toString();
    livesCountElement.textContent = lives.toString();
  }

  const displayShuffledWord = () => {
    let emptyBoxes = selectedWord.split('');

    while (wordContainer.firstChild) {
      wordContainer.removeChild(wordContainer.firstChild);
    }

    // Récupérer les indicateurs de progression pour la catégorie en cours
    let categoryProgress = getProgress(categoryName);
    let totalWords = selectedCategory.length;
    let progressText = (categoryProgress + 0) + '/' + totalWords;

    // Créer un élément d'indicateur de progression
    let progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');
    progressIndicator.textContent = 'Niveaux:' + progressText;

    // Ajouter l'indicateur de progression à la zone de lettres
    letterContainer.appendChild(progressIndicator);

    for (let i = 0; i < emptyBoxes.length; i++) {
      let emptyBox = document.createElement('div');
      emptyBox.classList.add('empty-box');
      wordContainer.appendChild(emptyBox);
    }

    let letters = shuffledWord.split('');
    for (let i = 0; i < letters.length; i++) {
      let letterBox = document.createElement('div');
      letterBox.classList.add('letter');
      letterBox.textContent = letters[i];
      letterBox.addEventListener('click', handleLetterClick);
      letterContainer.appendChild(letterBox);
    }

    updateCategoryProgress(); // Mettre à jour les indicateurs de progression en jeu
  }

  const resetLetters = () => {
    let emptyBoxes = document.getElementsByClassName('empty-box');
    let letterBoxes = document.getElementsByClassName('letter');

    for (let i = 0; i < emptyBoxes.length; i++) {
      emptyBoxes[i].textContent = '';
      emptyBoxes[i].classList.remove('filled');
    }

    while (letterContainer.firstChild) {
      letterContainer.removeChild(letterContainer.firstChild);
    }
  }

  const resetGame = () => {
    selectedCategory = [];
    selectedWord = '';
    shuffledWord = '';
    categoryName = '';
    resetLetters();
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    updateCategoryProgress();
    updateLivesIndicator();
  }

  function resetProgress() {
    updateCategoryProgress();
  }

  const updateCategoryProgress = () => {
    let categories = document.getElementsByClassName('category');
    for (let i = 0; i < categories.length; i++) {
      let category = categories[i];
      let categoryName = category.getElementsByClassName('category-text')[0].textContent;
      let categoryIndicators = document.querySelectorAll('.category-indicator[data-category="' + categoryName + '"]');
      for (let j = 0; j < categoryIndicators.length; j++) {
        let categoryIndicator = categoryIndicators[j];
        let progress = getProgress(categoryName);
        let totalWords = wordsByCategory[categoryName].length;
        let progressText = 'Niveaux: ' + (progress + 0) + '/' + totalWords;
        categoryIndicator.textContent = progressText;
      }
    }
  }

  // Mettre à jour les indicateurs de catégorie lors du chargement initial
  updateCategoryProgress();
  updateLivesIndicator(); // Mettre à jour l'indicateur de vies

  checkButton.addEventListener('click', handleCheckClick);
  backButton.addEventListener('click', function() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    resetGame();

  });
});