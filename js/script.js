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

 // Fonction bouton given
let givenImage = document.querySelector('#given');
givenImage.addEventListener('click', useGiven);

function useGiven() {
  // Vérifiez si vous avez des étoiles bonus disponibles
  let bonusCount = parseInt(document.getElementById('bonus-count-game').textContent);

  if (bonusCount >= 5) {
    // Utilisez l'image "given" pour placer toutes les lettres dans le bon ordre
    if (!useGivenToPlaceLetters()) {
      // Affichez un message si aucune lettre valide n'a été placée
      Swal.fire({
        title: 'Oops !',
        text: 'Il n\'y a pas de lettre valide à placer.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } else {
      // Décrémentez le nombre d'étoiles bonus de 5
      bonusCount -= 5;
      
      // Mettez à jour l'affichage du nombre d'étoiles bonus
      document.getElementById('bonus-count-game').textContent = bonusCount.toString();
      document.getElementById('bonus-count').textContent = bonusCount.toString();
      
      // Sauvegardez le nombre d'étoiles bonus restantes
      saveBonusCount(bonusCount);
    }
  } else {
    // Affichez un message si vous n'avez pas suffisamment d'étoiles bonus disponibles
    Swal.fire({
      title: 'Oops !',
      text: 'Vous n\'avez pas assez d\'étoiles bonus disponibles. Vous avez besoin de 5 étoiles bonus pour cette action.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}

function useGivenToPlaceLetters() {
  // Obtenez le mot cible actuellement affiché
  let targetWord = selectedWord;

  // Obtenez les cases vides
  let emptyBoxes = document.getElementsByClassName('empty-box');

  // Obtenez toutes les lettres disponibles dans la lettre-container
  let availableLetters = getAvailableLetters();

  // Assurez-vous que le nombre de cases vides correspond au nombre de lettres dans le mot cible
  if (emptyBoxes.length === targetWord.length) {
    // Parcourez les cases vides
    for (let i = 0; i < emptyBoxes.length; i++) {
      let emptyBox = emptyBoxes[i];

      // Obtenez l'index de la lettre actuellement manquante dans le mot cible
      let missingLetterIndex = getMissingLetterIndex(targetWord);

      // Vérifiez si l'index est valide
      if (missingLetterIndex >= 0 && missingLetterIndex < targetWord.length) {
        // Obtenez la lettre manquante du mot cible
        let missingLetter = targetWord[missingLetterIndex];

        // Vérifiez si cette lettre est disponible dans la liste des lettres disponibles
        if (availableLetters.includes(missingLetter)) {
          // Placez la lettre dans la case vide
          emptyBox.textContent = missingLetter;
          emptyBox.classList.add('filled');

          // Supprimez la lettre de la liste des lettres disponibles pour éviter la répétition
          availableLetters = availableLetters.filter(letter => letter !== missingLetter);
        }
      }
    }

    return true; // Renvoyer true si toutes les lettres ont été placées avec succès
  } else {
    return false; // Renvoyer false si le nombre de cases vides ne correspond pas au nombre de lettres dans le mot cible
  }
}




  // Fonction bouton baguette magique
  let baguetteImage = document.querySelector('#baguette');
  baguetteImage.addEventListener('click', useMagicWand);
  
  function useMagicWand() {
    // Vérifiez si vous avez des étoiles bonus disponibles
    let bonusCount = parseInt(document.getElementById('bonus-count-game').textContent);
    bonusCount = parseInt(document.getElementById('bonus-count').textContent);
    if (bonusCount > 0) {
      // Utilisez la baguette magique pour placer une lettre correcte
      if (!useMagicWandToPlaceLetter()) {
        // Affichez un message si aucune lettre valide n'a été placée
        Swal.fire({
          title: 'Oops !',
          text: 'Il n\'y a pas de lettre valide à placer.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } else {
        // Décrémentez le nombre d'étoiles bonus uniquement si une lettre valide a été placée
        bonusCount--;
        // Mettez à jour l'affichage du nombre d'étoiles bonus
        document.getElementById('bonus-count-game').textContent = bonusCount.toString();
        document.getElementById('bonus-count').textContent = bonusCount.toString();
        // Sauvegardez le nombre d'étoiles bonus restantes
        saveBonusCount(bonusCount);
      }} else {
        // Affichez un message si vous n'avez pas suffisamment d'étoiles bonus disponibles
        Swal.fire({
          title: 'Oops !',
          text: 'Vous n\'avez pas assez d\'étoiles bonus disponibles. Vous avez besoin de 1 étoiles bonus pour cette action.',
          icon: 'error',
          confirmButtonText: 'OK'
        })
    
    }
  }

  
  function restoreBonusCount() {
    let bonusCount = localStorage.getItem('bonusCount');
    if (bonusCount === null) {
      bonusCount = 10; // Nombre d'étoiles bonus initial si aucune valeur n'est sauvegardée
    } else {
      bonusCount = parseInt(bonusCount);
    }
    return bonusCount;
  }
  
  let bonusCount = restoreBonusCount();
document.getElementById('bonus-count-game').textContent = bonusCount.toString();
document.getElementById('bonus-count').textContent = bonusCount.toString();
  
function useMagicWandToPlaceLetter() {
  let emptyBoxes = document.getElementsByClassName('empty-box');
  let availableLetters = getAvailableLetters();
  let letterPlaced = false; // Variable pour vérifier si une lettre valide a été placée

  // Obtenez le mot cible actuellement affiché
  let targetWord = selectedWord;

  // Parcourez les cases vides
  for (let i = 0; i < emptyBoxes.length; i++) {
    let emptyBox = emptyBoxes[i];

    // Vérifiez si cette case vide a déjà une lettre correcte placée
    if (!emptyBox.classList.contains('filled')) {
      // Obtenez l'index de la lettre actuellement manquante dans le mot cible
      let missingLetterIndex = getMissingLetterIndex(targetWord);

      // Vérifiez si l'index est valide
      if (missingLetterIndex >= 0 && missingLetterIndex < targetWord.length) {
        // Obtenez la lettre manquante du mot cible
        let missingLetter = targetWord[missingLetterIndex];

        // Vérifiez si cette lettre est disponible dans la liste des lettres disponibles
        if (availableLetters.includes(missingLetter)) {
          // Placez la lettre dans la case vide
          emptyBox.textContent = missingLetter;
          emptyBox.classList.add('filled');

          // Supprimez la lettre de la liste des lettres disponibles pour éviter la répétition
          availableLetters = availableLetters.filter(letter => letter !== missingLetter);

          // Si la lettre placée est dans la liste des lettres disponibles en bas, supprimez-la également
          let letterBoxes = document.getElementsByClassName('letter');
          for (let j = 0; j < letterBoxes.length; j++) {
            let letterBox = letterBoxes[j];
            if (letterBox.textContent === missingLetter) {
              letterBox.style.visibility = 'hidden';
              break;
            }
          }

          letterPlaced = true; // Définir la variable sur true si une lettre a été placée
          break; // Sortez de la boucle car nous avons trouvé et placé une lettre valide
        }
      }
    }
  }

  return letterPlaced; // Renvoyer true si une lettre valide a été placée, sinon false
}
  
  
  function getMissingLetterIndex(word) {
    // Obtenez les cases vides
    let emptyBoxes = document.getElementsByClassName('empty-box');
    
    // Parcourez les cases vides
    for (let i = 0; i < emptyBoxes.length; i++) {
      let emptyBox = emptyBoxes[i];
      
      // Vérifiez si cette case vide a déjà une lettre correcte placée
      if (!emptyBox.classList.contains('filled')) {
        // Obtenez l'index de cette case vide dans le mot cible
        let boxIndex = Array.from(emptyBoxes).indexOf(emptyBox);
        
        // Vérifiez si l'index est valide
        if (boxIndex >= 0 && boxIndex < word.length) {
          // Renvoie l'index de la lettre manquante
          return boxIndex;
        }
      }
    }
    
    // Si aucune case vide n'a été trouvée, renvoie -1
    return -1;
  }
  
  function getAvailableLetters() {
    // Obtenez toutes les lettres disponibles dans la lettre-container
    let letterBoxes = document.getElementsByClassName('letter');
    let availableLetters = [];
    for (let i = 0; i < letterBoxes.length; i++) {
      let letterBox = letterBoxes[i];
      availableLetters.push(letterBox.textContent);
    }
    return availableLetters;
  }
  
  function getValidLetterForEmptyBox(existingLetter, availableLetters, filledLetters) {
    // Obtenez une lettre valide qui n'est pas déjà présente dans la case vide et les lettres déjà placées
    let validLetter = null;
    for (let i = 0; i < availableLetters.length; i++) {
      let letter = availableLetters[i];
      if (letter !== existingLetter && !filledLetters.includes(letter)) {
        validLetter = letter;
        break;
      }
    }
    return validLetter;
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