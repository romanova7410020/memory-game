'use strict';

const CARD_SYMBOLS = [
  {
    id: 'sleep',
    src: 'assets/sleep.png',
    alt: 'Здоровый сон',
  },
  {
    id: 'water',
    src: 'assets/water.png',
    alt: 'Вода',
  },
  {
    id: 'walking',
    src: 'assets/walk.png',
    alt: 'Ходьба',
  },
  {
    id: 'gym',
    src: 'assets/gym.png',
    alt: 'Тренировка',
  },
  {
    id: 'vegetables',
    src: 'assets/veg.png',
    alt: 'Овощи',
  },
  {
    id: 'protein',
    src: 'assets/eat.png',
    alt: 'Белковые продукты',
  },
  {
    id: 'relaxation',
    src: 'assets/relax.png',
    alt: 'Отдых',
  },
  {
    id: 'calendar',
    src: 'assets/calendar.png',
    alt: 'Профилактический осмотр',
  },
];

const CLOSE_DELAY = 1000;

let firstCard = null;
let secondCard = null;
let isChecking = false;
let closeTimer = null;

function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function shuffle(array) {
  const shuffledArray = [...array];

  for (
    let currentIndex = shuffledArray.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(
      Math.random() * (currentIndex + 1),
    );

    [
      shuffledArray[currentIndex],
      shuffledArray[randomIndex],
    ] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ];
  }

  return shuffledArray;
}

function createCard(cardData, index) {
  const card = createElement('button', 'card');
  const cardInner = createElement('span', 'card__inner');
  const cardFront = createElement('span', 'card__front', '?');
  const cardBack = createElement('span', 'card__back');
  const image = document.createElement('img');

  card.type = 'button';
  card.dataset.cardId = cardData.id;
  card.dataset.index = String(index);
  card.setAttribute('aria-label', 'Закрытая карточка');

  image.className = 'card__image';
  image.src = cardData.src;
  image.alt = cardData.alt;
  image.draggable = false;

  cardBack.append(image);
  cardInner.append(cardFront, cardBack);
  card.append(cardInner);

  card.addEventListener('click', handleCardClick);

  return card;
}

function createBoard() {
  const board = createElement('main', 'board');
  const deck = shuffle([...CARD_SYMBOLS, ...CARD_SYMBOLS]);

  board.setAttribute('aria-label', 'Игровое поле');

  deck.forEach((cardData, index) => {
    const card = createCard(cardData, index);

    board.append(card);
  });

  document.body.append(board);
}

function openCard(card) {
  card.classList.add('card--opened');
  card.setAttribute('aria-label', `Открытая карточка: ${card.dataset.cardId}`);
}

function closeCard(card) {
  card.classList.remove('card--opened');
  card.setAttribute('aria-label', 'Закрытая карточка');
}

function markAsMatched() {
  firstCard.classList.add('card--matched');
  secondCard.classList.add('card--matched');

  firstCard.disabled = true;
  secondCard.disabled = true;
}

function clearSelectedCards() {
  firstCard = null;
  secondCard = null;
  isChecking = false;
}

function checkCards() {
  const isMatch =
    firstCard.dataset.cardId === secondCard.dataset.cardId;

  if (isMatch) {
    markAsMatched();
    clearSelectedCards();

    return;
  }

  closeTimer = setTimeout(() => {
    closeCard(firstCard);
    closeCard(secondCard);

    closeTimer = null;
    clearSelectedCards();
  }, CLOSE_DELAY);
}

function handleCardClick(event) {
  const clickedCard = event.currentTarget;

  if (
    isChecking ||
    clickedCard.disabled ||
    clickedCard === firstCard ||
    clickedCard.classList.contains('card--opened') ||
    clickedCard.classList.contains('card--matched')
  ) {
    return;
  }

  openCard(clickedCard);

  if (firstCard === null) {
    firstCard = clickedCard;

    return;
  }

  secondCard = clickedCard;
  isChecking = true;

  checkCards();
}

createBoard();