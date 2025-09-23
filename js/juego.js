const residuos = [
  { nombre: 'Audifonos', imagen: '../img/juego/residuos/Audifonos_R.png', caneca: 'roja' },
  { nombre: 'Banano', imagen: '../img/juego/residuos/Banano_V.png', caneca: 'verde' },
  { nombre: 'Botella', imagen: '../img/juego/residuos/Botella_B.png', caneca: 'blanca' },
  { nombre: 'Caja', imagen: '../img/juego/residuos/Caja_B.png', caneca: 'blanca' },
  { nombre: 'Caja de Pizza', imagen: '../img/juego/residuos/CajaPizza_N.png', caneca: 'negra' },
  { nombre: 'Hojas', imagen: '../img/juego/residuos/Hojas_V.png', caneca: 'verde' },
  { nombre: 'Huevo', imagen: '../img/juego/residuos/Huevo_V.png', caneca: 'verde' },
  { nombre: 'Jeringa', imagen: '../img/juego/residuos/Jeringa_R.png', caneca: 'roja' },
  { nombre: 'Lata', imagen: '../img/juego/residuos/Lata_B.png', caneca: 'blanca' },
  { nombre: 'Manzana', imagen: '../img/juego/residuos/Manzana_V.png', caneca: 'verde' },
  { nombre: 'Medicamento', imagen: '../img/juego/residuos/Medicamento_R.png', caneca: 'roja' },
  {
    nombre: 'Papel Higiénico',
    imagen: '../img/juego/residuos/PapelHigienico_N.png',
    caneca: 'negra',
  },
  {
    nombre: 'Paquete de Papas',
    imagen: '../img/juego/residuos/PaquetePapas_N.png',
    caneca: 'negra',
  },
  { nombre: 'Papel', imagen: '../img/juego/residuos/Pepel_B.png', caneca: 'blanca' },
  { nombre: 'Pilas', imagen: '../img/juego/residuos/Pilas_R.png', caneca: 'roja' },
  { nombre: 'Servilletas', imagen: '../img/juego/residuos/Servilletas_N.png', caneca: 'negra' },
];

const canecas = [
  {
    nombre: 'Caneca Blanca',
    id: 'blanca',
    color: '#ffffff',
    imagen: '../img/juego/canecas/Bote blanco.png',
  },
  {
    nombre: 'Caneca Verde',
    id: 'verde',
    color: '#2E8B57',
    imagen: '../img/juego/canecas/Bote verde.png',
  },
  {
    nombre: 'Caneca Roja',
    id: 'roja',
    color: '#FF0000',
    imagen: '../img/juego/canecas/Bote rojo.png',
  },
  {
    nombre: 'Caneca Negra',
    id: 'negra',
    color: '#000000',
    imagen: '../img/juego/canecas/Bote negro.png',
  },
];

let correct = 0;
let total = 0;
const totalDraggableItems = 5;
const totalMatchingPairs = 5;

const scoreSection = document.querySelector('.score');
const correctSpan = scoreSection.querySelector('.correct');
const totalSpan = scoreSection.querySelector('.total');
const playAgainBtn = scoreSection.querySelector('#play-again-btn');

const draggableItems = document.querySelector('.draggable-items');
const matchingPairs = document.querySelector('.matching-pairs');

initiateGame();

function initiateGame() {
  const randomResiduos = generateRandomItemsArray(totalDraggableItems, residuos);

  for (let i = 0; i < randomResiduos.length; i++) {
    draggableItems.insertAdjacentHTML(
      'beforeend',
      `
      <div class="draggable-wrapper">
        <img 
          src="${randomResiduos[i].imagen}" 
          class="draggable" 
          id="residuo-${i}" 
          data-caneca="${randomResiduos[i].caneca}" 
          alt="${randomResiduos[i].nombre}"
        />
        <span class="draggable-name titulo-subtitulo">${randomResiduos[i].nombre}</span>
      </div>
    `
    );
  }

  for (let i = 0; i < canecas.length; i++) {
    matchingPairs.insertAdjacentHTML(
      'beforeend',
      `
      <div class="matching-pair">
        <img src="${canecas[i].imagen}" 
             class="droppable caneca" 
             data-caneca="${canecas[i].id}" 
             alt="${canecas[i].nombre}">
        <span class="label titulo-subtitulo">${canecas[i].nombre}</span>
      </div>
    `
    );
  }

  // Activar Interact.js
  activarDragDrop();
}

function activarDragDrop() {
  interact('.draggable').draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      start(event) {
        let target = event.target;

        // Guardar posición inicial solo la primera vez
        if (!target.hasAttribute('data-init-x')) {
          target.setAttribute('data-init-x', target.getAttribute('data-x') || 0);
          target.setAttribute('data-init-y', target.getAttribute('data-y') || 0);
        }
      },
      move(event) {
        let target = event.target;
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
    },
  });

  interact('.droppable').dropzone({
    accept: '.draggable',
    overlap: 0.5,
    ondragenter(event) {
      event.target.classList.add('droppable-hover');
    },
    ondragleave(event) {
      event.target.classList.remove('droppable-hover');
    },
    ondrop(event) {
      event.target.classList.remove('droppable-hover');
      const residuo = event.relatedTarget;
      const canecaCorrecta = residuo.getAttribute('data-caneca');
      const canecaSeleccionada = event.target.getAttribute('data-caneca');

      total++;
      if (canecaCorrecta === canecaSeleccionada) {
        residuo.classList.add('dragged');
        residuo.removeAttribute('data-x');
        residuo.removeAttribute('data-y');
        residuo.style.transform = 'none';
        residuo.style.pointerEvents = 'none';
        correct++;
      } else {
        let initX = parseFloat(residuo.getAttribute('data-init-x')) || 0;
        let initY = parseFloat(residuo.getAttribute('data-init-y')) || 0;
        residuo.setAttribute('data-x', initX);
        residuo.setAttribute('data-y', initY);
        residuo.style.transform = `translate(${initX}px, ${initY}px)`;
      }

      correctSpan.textContent = correct;
      totalSpan.textContent = total;

      if (correct === totalMatchingPairs) {
        playAgainBtn.style.display = 'block';
        setTimeout(() => {
          playAgainBtn.classList.add('play-again-btn-entrance');
        }, 200);
      }
    },
  });
}

export function playAgain() {
  playAgainBtn.classList.remove('play-again-btn-entrance');
  correct = 0;
  total = 0;
  draggableItems.style.opacity = 0;
  matchingPairs.style.opacity = 0;
  setTimeout(() => {
    scoreSection.style.opacity = 0;
  }, 100);
  setTimeout(() => {
    playAgainBtn.style.display = 'none';
    while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
    while (matchingPairs.firstChild) matchingPairs.removeChild(matchingPairs.firstChild);
    initiateGame();
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    draggableItems.style.opacity = 1;
    matchingPairs.style.opacity = 1;
    scoreSection.style.opacity = 1;
  }, 500);
}

function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let clonedArray = [...originalArray];
  if (n > clonedArray.length) n = clonedArray.length;
  for (let i = 1; i <= n; i++) {
    const randomIndex = Math.floor(Math.random() * clonedArray.length);
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return res;
}

export function getPuntajeTotal() {
  return correct * 2 - (total - correct);
}

export function empezarJuego() {
  const tiempoJuego = document.getElementById('time-juego');
  let tiempoRestante = 47;
  tiempoJuego.textContent = tiempoRestante;

  const intervalo = setInterval(() => {
    tiempoRestante--;
    tiempoJuego.textContent = tiempoRestante;

    if (tiempoRestante === 0 || correct === totalMatchingPairs) {
      clearInterval(intervalo);

      const residuos = document.querySelectorAll('.draggable');
      residuos.forEach((residuo) => {
        residuo.classList.add('dragged');
        residuo.style.pointerEvents = 'none';
      });

      playAgainBtn.style.display = 'block';
      setTimeout(() => {
        playAgainBtn.classList.add('play-again-btn-entrance');
      }, 200);
    }
  }, 1000);
}

let isDragging = false;

// cuando empieza a arrastrar un draggable
document.querySelectorAll('.draggable').forEach((el) => {
  el.addEventListener('touchstart', (e) => {
    isDragging = true;
  });

  el.addEventListener('touchend', (e) => {
    isDragging = false;
  });
});

// para prevenir scroll en moviles al arrastrar un residuo
document.addEventListener(
  'touchmove',
  (e) => {
    if (isDragging) {
      e.preventDefault(); // bloquea scroll
    }
  },
  { passive: false }
);
