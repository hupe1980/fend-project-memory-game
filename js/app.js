/* Create a list that holds all of your cards */
const cards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
const moves = document.querySelector('.moves');
const restartBtns = document.querySelectorAll('.restart');
const starsList = document.querySelectorAll('.stars li i');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');
const currentTime = document.querySelector('.currentTime');

const HITS_TO_WIN = cards.length / 2;

let counter, revealedCards, hits, timer, interval, numStars;

function startGame() {
  //reset
  hits = 0;
  counter = 0;
  timer = 0;
  moves.innerHTML = counter;
  currentTime.innerHTML = timer;
  deck.innerHTML = '';
  revealedCards = [];
  numStars = starsList.length;
  clearInterval(interval);
  modal.style.display = 'none';

  //reset stars
  starsList.forEach(function(star) {
    star.classList.add('fa-star');
  });

  /* Display the cards on the page
  - shuffle the list of cards using the provided "shuffle" method below
  - loop through each card and create its HTML
  - add each card's HTML to the page */
  const shuffledCards = shuffle([...cards]);

  const fragment = document.createDocumentFragment();
  shuffledCards.forEach(function(card) {
    card.classList.remove('show', 'open', 'match');
    fragment.appendChild(card);
  });

  deck.appendChild(fragment);
}

function startTimer() {
  interval = setInterval(function() {
    timer++;
    currentTime.innerHTML = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(interval);
}

function showModal() {
  const totalTime = document.querySelector('.totalTime');
  const finalMoves = document.querySelector('.final-moves');
  const finalStars = document.querySelector('.final-stars');

  totalTime.innerHTML = timer;
  finalMoves.innerHTML = counter;
  finalStars.innerHTML = numStars;

  modal.style.display = 'block';
}

function match() {
  hits++;
  revealedCards.forEach(function(card) {
    card.classList.add('match');
  });
  revealedCards = [];

  if (hits === HITS_TO_WIN) {
    stopTimer();
    showModal();
  }
}

function unmatch() {
  revealedCards[0].classList.add('unmatch');
  revealedCards[1].classList.add('unmatch');
  setTimeout(function() {
    revealedCards[0].classList.remove('show', 'open', 'unmatch');
    revealedCards[1].classList.remove('show', 'open', 'unmatch');
    revealedCards = [];
  }, 1000);
}

function addCard(card) {
  revealedCards.push(card);

  if (revealedCards.length === 2) {
    updateMoves();

    revealedCards[0].dataset.type === revealedCards[1].dataset.type
      ? match()
      : unmatch();
  }
}

// reduce star rating
function reduceStar() {
  numStars--;
  const stars = document.querySelectorAll('.fa-star');
  stars[stars.length - 1].classList.remove('fa-star');
}

function updateMoves() {
  counter++;
  if (counter === 1) {
    startTimer();
  }
  moves.innerHTML = counter;
  if (counter === 14 || counter === 20) {
    reduceStar();
  }
}

function displayCard(card) {
  card.classList.toggle('open');
  card.classList.toggle('show');
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* set up the event listener for a card. If a card is clicked:
- display the card's symbol (put this functionality in another function that you call from this one)
- add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
- if the list already has another card, check to see if the two cards match
+ if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
+ if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
+ increment the move counter and display it on the page (put this functionality in another function that you call from this one)
+ if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)*/
deck.addEventListener('click', function(event) {
  if (event.target.nodeName !== 'LI') return;
  if (event.target.classList.contains('open', 'show', 'match')) return;
  if (revealedCards.length === 2) return;

  const card = event.target;
  displayCard(card);
  addCard(card);
});

restartBtns.forEach(function(restart) {
  restart.addEventListener('click', startGame);
});

// When the user clicks on <span> (x), close the modal
close.onclick = function() {
  modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', startGame);
