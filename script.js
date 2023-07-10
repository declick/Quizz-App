
window.addEventListener('load', function() {
  var loading = document.getElementById('loading');
  var menu = document.getElementById('menu');
  var gameContainer = document.getElementById('game-container');
  var categories = document.getElementsByClassName('category');
  var wordContainer = document.getElementById('empty-box-container');
  var letterContainer = document.getElementById('letter-box-container');
  var checkButton = document.getElementById('check-button');
  var backButton = document.getElementById('back-button');
  var selectedWord = getCurrentWord(); // Récupérer le mot en cours depuis le stockage local
  var selectedWord = '';
  var shuffledWord = '';
  var categoryName = '';
  var attempts = 0; // Nombre de tentatives actuelles
  var maxAttempts = 3; // Nombre maximum de tentatives autorisées
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

  var selectedCategory; // Déclarer selectedCategory en dehors de la fonction startGame()

  function startGame(categoryName) {
    console.log('Démarrage du jeu dans la catégorie ' + categoryName);

    var wordsByCategory = {
      'Niveau 1 - Mots de 3 lettres': ['chat', 'lit', 'rat', 'pom', 'arc'],
      'Niveau 2 - Mots de 4 lettres': ['casa', 'pied', 'lune', 'sole', 'fils', 'gars'],
      'Niveau 3 - Mots de 5 lettres': ['tapis', 'route', 'table', 'maison', 'avion', 'sable'],
      'Niveau 4 - Mots de 6 lettres': ['voyage', 'animal', 'espace', 'orange', 'école'],
      'Niveau 5 - Mots de 7 lettres': ['ordinateur', 'tortue', 'chambre', 'banane', 'bouteil', 'chapeau']
    };

    selectedCategory = wordsByCategory[categoryName];

    if (!selectedCategory || selectedCategory.length === 0) {
      console.log('La catégorie ' + categoryName + ' est vide ou n\'existe pas.');
      return;
    }

    selectedWord = selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
    selectedCategory = selectedCategory.filter(word => word !== selectedWord);
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

      if (selectedCategory.length === 0) {
        console.log('Félicitations ! Tu as terminé la catégorie ' + categoryName + ' !');
        resetGame();
        return;
      }

      selectedWord = selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
      selectedCategory = selectedCategory.filter(word => word !== selectedWord);
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
        resetLetters();
        displayShuffledWord();
      }
    }
  }

  function displayShuffledWord() {
    var emptyBoxes = selectedWord.split('');

    while (wordContainer.firstChild) {
      wordContainer.removeChild(wordContainer.firstChild);
    }

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

  function handleBackClick() {
    gameContainer.style.display = 'none';
    menu.style.display = 'block';
    resetGame();
  }

 function displayNextWord() {
    // Sélectionner un mot aléatoire dans la catégorie
    selectedWord = selectedCategory[Math.floor(Math.random() * selectedCategory.length)];
    shuffledWord = shuffleWord(selectedWord);
    displayShuffledWord();
    setupLetterClickHandlers();
    attempts = 0; // Réinitialiser le nombre de tentatives
    isGameOver = false; // Réinitialiser l'indicateur de fin de partie

    // Sauvegarder le mot en cours dans le stockage local
    saveCurrentWord(selectedWord);
  }

  function resetGame() {
    // Effacer le mot en cours du stockage local
    clearCurrentWord();
    selectedCategory = [];
    selectedWord = '';
    shuffledWord = '';
    categoryName = '';
    attempts = 0;
    isGameOver = false;
    resetLetters();
  }

  checkButton.addEventListener('click', handleCheckClick);
  backButton.addEventListener('click', handleBackClick);
});
