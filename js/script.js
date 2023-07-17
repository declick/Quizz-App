window.addEventListener('DOMContentLoaded', () => {
  let gameContainer = document.getElementById('game-container');
  let categories = document.getElementsByClassName('category');
  let wordContainer = document.getElementById('empty-box-container');
  let letterContainer = document.getElementById('letter-box-container');
  let checkButton = document.getElementById('check-button');
  let backButton = document.getElementById('back-button');
  let resetButton = document.getElementById('reset-button'); // Ajout du bouton de réinitialisation
  let selectedWord = '';
  let categoryName = '';
  let attempts = 0; // Nombre de tentatives actuelles
  let maxAttempts = 3; // Nombre maximum de tentatives autorisées
  let isGameOver = false; // Indicateur de fin de partie
  let menuIcon = document.getElementById('menu-icon');
  let popupMenu = document.getElementById('popup-menu');
  let closePopup = document.getElementById('close-popup');
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
    menuIcon.addEventListener('click', function() {
      popupMenu.style.display = 'block';
    });
    closePopup.addEventListener('click', function() {
      popupMenu.style.display = 'none';
    });
  }
  let trophyImage = document.querySelector('.logo-menu[src="./assets/img/Trophy.png"]');
  let scoreContainer = document.getElementById('score-container');

  trophyImage.addEventListener('click', function() {
    if (scoreContainer.style.display === 'none') {
      scoreContainer.style.display = 'block';
    } else {
      scoreContainer.style.display = 'none';
    }
  });

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
    'Niveau 1 - Mots de 3 lettres': ['rat', 'pom', 'arc', 'kwa', 'kyu', 'wax', 'wok', 'yak'],
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
    let filledLetters = document.getElementsByClassName('filled-letter');

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

    for (let i = 0; i < filledLetters.length; i++) {
      let filledLetter = filledLetters[i];
      filledLetter.addEventListener('click', handleFilledLetterClick);
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
      Swal.fire({
        title: 'Bravo !',
        text: 'Vous avez reconstitué le mot ' + selectedWord + ' !',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        resetLetters();

        let progress = getProgress(categoryName) + 1;
        saveProgress(categoryName, progress);
        updateCategoryProgress();

        score++;
        scoreElement.textContent = score.toString();
        saveScore(score);

        if (progress === selectedCategory.length) {
          Swal.fire({
            title: 'Félicitations !',
            text: 'Vous avez terminé la catégorie ' + categoryName + ' !',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            resetGame();
          });
          return;
        }

        selectedWord = selectedCategory[progress];
        shuffledWord = shuffleWord(selectedWord);
        displayShuffledWord();
      });
    } else {
      Swal.fire({
        title: 'Dommage !',
        text: 'Ce n\'est pas le bon mot.',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        attempts++;

        if (lives > 0) {
          lives--;
          saveLives(lives);
        }

        updateLivesIndicator();

        if (lives === 0) {
          Swal.fire({
            title: 'Partie terminée',
            text: 'Nombre maximal de vies atteint. La partie est terminée.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            isGameOver = true;
            resetGame();
          });
        } else {
          resetLetters();
          displayShuffledWord();
        }
      });
    }
  }



  function handleResetClick() {
    if (isGameOver || lives === 0) {
      return;
    }

    resetLetters();
    displayShuffledWord();
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

    let categoryProgress = getProgress(categoryName);
    let totalWords = selectedCategory.length;
    let progressText = categoryProgress + '/' + totalWords;

    let progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');

    // Ajouter la classe pour l'indicateur de progression en jeu
    progressIndicator.classList.add('progress-indicator-game');

    progressIndicator.textContent = 'Niveaux: ' + progressText;

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

    updateCategoryProgress();
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
      let categoryIndicators = category.getElementsByClassName('progress-indicator'); // Modification de la méthode pour récupérer les indicateurs de progression

      for (let j = 0; j < categoryIndicators.length; j++) {
        let categoryIndicator = categoryIndicators[j];
        let progress = getProgress(categoryName);
        let totalWords = wordsByCategory[categoryName].length;
        let progressText = 'Niveaux: ' + progress + '/' + totalWords; // Modification de l'indicateur de progression
        categoryIndicator.textContent = progressText;
      }
    }
  }

  updateCategoryProgress();
  updateLivesIndicator();

  checkButton.addEventListener('click', handleCheckClick);
  backButton.addEventListener('click', function() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    resetGame();
  });

  resetButton.addEventListener('click', handleResetClick); // Ajout de l'événement de clic pour le bouton de réinitialisation
});
