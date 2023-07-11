
window.addEventListener('load', function() {
  var loading = document.getElementById('loading');
  var menu = document.getElementById('menu');
  var gameContainer = document.getElementById('game-container');
  var categories = document.getElementsByClassName('category');
  var wordContainer = document.getElementById('empty-box-container');
  var letterContainer = document.getElementById('letter-box-container');
  var checkButton = document.getElementById('check-button');
  var backButton = document.getElementById('back-button');
  var selectedWord = '';
  var categoryName = '';
  var attempts = 0; // Nombre de tentatives actuelles
  var maxAttempts = 3; // Nombre maximum de tentatives autorisées
  var lives = 3;
  var isGameOver = false; // Indicateur de fin de partie

  menu.style.display = 'none'; // Masquer le menu au chargement de la page

  setTimeout(function() {
    loading.style.display = 'none';
    menu.style.display = 'block';
  }, 1500);

  for (var i = 0; i < categories.length; i++) {
    var category = categories[i];
    var playButton = category.getElementsByClassName('play-button')[0];
    var categoryText = category.getElementsByClassName('category-text')[0].textContent;
    playButton.addEventListener('click', function() {
      categoryName = this.parentNode.getElementsByClassName('category-text')[0].textContent;
      console.log('Catégorie ' + categoryName + ' - Jouer');
      startGame(categoryName);
      menu.style.display = 'none';
      gameContainer.style.display = 'block';
    });
  }

  function shuffleWord(word) {
    var shuffledWord = word.split('');

    for (var i = shuffledWord.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffledWord[i];
      shuffledWord[i] = shuffledWord[j];
      shuffledWord[j] = temp;
    }

    return shuffledWord.join('');
  }

  var selectedCategory; // Déclarer selectedCategory en dehors de la fonction startGame()

  var wordsByCategory = {
    'Niveau 1 - Mots de 3 lettres': ['cha', 'lit', 'rat', 'pom', 'arc', 'kwa', 'kyu', 'wax', 'wok', 'yak'],
    'Niveau 2 - Mots de 4 lettres': ['casa', 'pied', 'lune', 'sole', 'fils', 'gars', 'gale', 'gags', 'gant', 'gala'],
    'Niveau 3 - Mots de 5 lettres': ['tapis', 'route', 'table', 'maison', 'avion', 'sable'],
    'Niveau 4 - Mots de 6 lettres': ['voyage', 'animal', 'espace', 'orange', 'école'],
    'Niveau 5 - Mots de 7 lettres': ['ordinateur', 'tortue', 'chambre', 'banane', 'bouteil', 'chapeau']
  };
  function startGame(categoryName) {
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
  }

  function handleLetterClick() {
    var selectedLetter = this.textContent;
    var emptyBoxes = document.getElementsByClassName('empty-box');

    for (var i = 0; i < emptyBoxes.length; i++) {
      var emptyBox = emptyBoxes[i];

      if (emptyBox.textContent === '') {
        emptyBox.textContent = selectedLetter;
        emptyBox.classList.add('filled');
        this.style.visibility = 'hidden';
        break;
      }
    }
  }

  function handleCheckClick() {
    var emptyBoxes = document.getElementsByClassName('empty-box');
    var userWord = '';

    for (var i = 0; i < emptyBoxes.length; i++) {
      var emptyBox = emptyBoxes[i];
      userWord += emptyBox.textContent;
    }

    if (userWord === selectedWord) {
      console.log('Bravo ! Tu as reconstitué le mot ' + selectedWord + ' !');
      resetLetters();

      // Mettre à jour la progression
      var progress = getProgress(categoryName) + 1;
      saveProgress(categoryName, progress);
      updateCategoryProgress(); // Mettre à jour l'indicateur de progression


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

      if (attempts === maxAttempts) {
        console.log('Nombre maximal de tentatives atteint. La partie est terminée.');
        isGameOver = true;
        resetGame();
      } else {
        // Décrémentez le nombre de vies
        lives--;
        updateLivesIndicator(); // Mettez à jour l'indicateur de vies

        resetLetters();
        displayShuffledWord();
      }
    }
  }
  function updateLivesIndicator() {
    var livesCountElement = document.getElementById('lives-count');
    livesCountElement.textContent = lives.toString();
  }

  function displayShuffledWord() {
    var emptyBoxes = selectedWord.split('');

    while (wordContainer.firstChild) {
      wordContainer.removeChild(wordContainer.firstChild);
    }
    // Récupérer les indicateurs de progression pour la catégorie en cours
    var categoryProgress = getProgress(categoryName);
    var totalWords = selectedCategory.length;
    var progressText = (categoryProgress + 0) + '/' + totalWords;

    // Créer un élément d'indicateur de progression
    var progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');
    progressIndicator.textContent = progressText;

    // Ajouter l'indicateur de progression à la zone de jeu
    gameContainer.insertBefore(progressIndicator, wordContainer);

    for (var i = 0; i < emptyBoxes.length; i++) {
      var emptyBox = document.createElement('div');
      emptyBox.classList.add('empty-box');
      wordContainer.appendChild(emptyBox);
    }

    var letters = shuffledWord.split('');
    for (var i = 0; i < letters.length; i++) {
      var letterBox = document.createElement('div');
      letterBox.classList.add('letter');
      letterBox.textContent = letters[i];
      letterBox.addEventListener('click', handleLetterClick);
      letterContainer.appendChild(letterBox);
    }
  }

  function resetLetters() {
    var emptyBoxes = document.getElementsByClassName('empty-box');
    var letterBoxes = document.getElementsByClassName('letter');

    for (var i = 0; i < emptyBoxes.length; i++) {
      emptyBoxes[i].textContent = '';
      emptyBoxes[i].classList.remove('filled');
    }

    while (letterContainer.firstChild) {
      letterContainer.removeChild(letterContainer.firstChild);
    }
  }

  function resetGame() {
    clearProgress();
    selectedCategory = [];
    selectedWord = '';
    shuffledWord = '';
    categoryName = '';
    attempts = 0;
    isGameOver = false;
    resetLetters();
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    updateCategoryProgress();
  }

  function updateCategoryProgress() {
    var categories = document.getElementsByClassName('category');
    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];
      var categoryName = category.getElementsByClassName('category-text')[0].textContent;
      var categoryIndicators = document.querySelectorAll('.category-indicator[data-category="' + categoryName + '"]');
      for (var j = 0; j < categoryIndicators.length; j++) {
        var categoryIndicator = categoryIndicators[j];
        var progress = getProgress(categoryName);
        var totalWords = wordsByCategory[categoryName].length;
        var progressText = (progress + 0) + '/' + totalWords;
        categoryIndicator.textContent = progressText;
      }
    }
  }

  function displayShuffledWord() {
    var emptyBoxes = selectedWord.split('');

    while (wordContainer.firstChild) {
      wordContainer.removeChild(wordContainer.firstChild);
    }
    // Récupérer les indicateurs de progression pour la catégorie en cours
    var categoryProgress = getProgress(categoryName);
    var totalWords = selectedCategory.length;
    var progressText = (categoryProgress + 0) + '/' + totalWords;

    // Créer un élément d'indicateur de progression
    var progressIndicator = document.createElement('div');
    progressIndicator.classList.add('progress-indicator');
    progressIndicator.textContent = progressText;

    // Ajouter l'indicateur de progression à la zone de lettres
    letterContainer.appendChild(progressIndicator);

    for (var i = 0; i < emptyBoxes.length; i++) {
      var emptyBox = document.createElement('div');
      emptyBox.classList.add('empty-box');
      wordContainer.appendChild(emptyBox);
    }

    var letters = shuffledWord.split('');
    for (var i = 0; i < letters.length; i++) {
      var letterBox = document.createElement('div');
      letterBox.classList.add('letter');
      letterBox.textContent = letters[i];
      letterBox.addEventListener('click', handleLetterClick);
      letterContainer.appendChild(letterBox);
    }

    updateCategoryProgress(); // Mettre à jour les indicateurs de progression en jeu
  }

  // Mettre à jour les indicateurs de catégorie lors du chargement initial
  updateCategoryProgress();
  updateLivesIndicator();

  checkButton.addEventListener('click', handleCheckClick);
  backButton.addEventListener('click', function() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    resetGame();
  });
});