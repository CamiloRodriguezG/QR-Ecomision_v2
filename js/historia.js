import { getPuntajeTotal, playAgain, empezarJuego } from './juego.js';

let puntajeHistoria = 0;
let opcionesCorrectas = {
  3: 'B',
  5: 'A',
  7: 'A',
  '7b': 'A',
};
const paginas = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '7b',
  9: '8b',
  10: '8m',
};

function mostrarRetroalimentacion(correcto, mensaje, imagen, imagenAlt, nextPage) {
  if (correcto) {
    Swal.fire({
      title: '¡Correcto!',
      text: mensaje,
      imageUrl: imagen,
      imageAlt: imagenAlt,
      customClass: {
        image: 'modal-image',
        popup: 'modal-historia',
        confirmButton: 'modal-btn-correcto',
      },
      confirmButtonText: 'Continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        if ($('#flipbook').turn('page') == 5) {
          empezarJuego();
        }
        if (nextPage) {
          $('#flipbook').turn('page', nextPage);
        } else {
          $('#flipbook').turn('next');
        }
      }
    });
  } else {
    Swal.fire({
      title: 'Incorrecto...',
      text: mensaje,
      imageUrl: imagen,
      imageAlt: imagenAlt,
      customClass: {
        image: 'modal-image',
        popup: 'modal-historia',
        confirmButton: 'modal-btn-incorrecto',
      },
      confirmButtonText: 'Continuar',
    }).then((result) => {
      if (result.isConfirmed) {
        if ($('#flipbook').turn('page') == 5) {
          empezarJuego();
        }
        if (nextPage) {
          $('#flipbook').turn('page', nextPage);
        } else {
          $('#flipbook').turn('next');
        }
      }
    });
  }
}

function pasarPagina(pagina, seleccion) {
  const flipbook = $('#flipbook');
  let correcto, mensaje, imagen, imagenAlt;
  switch (pagina) {
    case 1:
      flipbook.turn('next');
      break;
    case 2:
      flipbook.turn('next');
      break;
    case 3:
      if (seleccion === opcionesCorrectas[3]) {
        puntajeHistoria += 2;
        correcto = true;
        mensaje =
          'Exacto. Cuando los orgánicos se compostan, devuelven nutrientes al suelo, reducen la erosión y evitan que materia orgánica contamine el agua del humedal.';
        imagen = '../img/lucian/Lucian_N5.png';
        imagenAlt = 'Lucian feliz';
      } else {
        puntajeHistoria -= 1;
        if (puntajeHistoria < 0) puntajeHistoria = 0;
        correcto = false;
        mensaje =
          'Casi, los malos olores pueden disminuir, pero lo más valioso es que los orgánicos bien manejados se convierten en abono y protegen el agua.';
        imagen = '../img/lucian/Lucian_N4.png';
        imagenAlt = 'Lucian confundido';
      }
      mostrarRetroalimentacion(correcto, mensaje, imagen, imagenAlt);
      break;
    case 4:
      flipbook.turn('next');
      break;
    case 5:
      if (seleccion === opcionesCorrectas[5]) {
        puntajeHistoria += 2;
        correcto = true;
        mensaje =
          'Muy bien. Separar los aprovechables permite reciclarlos, reduce la carga en Doña Juana y evita que botellas y plásticos tapen canales y dañen el humedal.';
        imagen = '../img/naira/Naira_2.png';
        imagenAlt = 'Naira feliz';
      } else {
        puntajeHistoria -= 1;
        if (puntajeHistoria < 0) puntajeHistoria = 0;
        correcto = false;
        mensaje =
          'Buena observación, pero además de olores, la clave es que estos materiales pueden reciclarse y así disminuir lo que llega al relleno sanitario.';
        imagen = '../img/naira/Naira_3.png';
        imagenAlt = 'Naira confundido';
      }
      mostrarRetroalimentacion(correcto, mensaje, imagen, imagenAlt);
      break;
    case 6:
      flipbook.turn('next');
      break;
    case 7:
      if (seleccion === opcionesCorrectas[7]) {
        puntajeHistoria += 2;
        correcto = true;
        mensaje =
          'Exacto. Un envase sucio o un papel grasiento contamina la carga y puede hacer que todo el lote deje de ser reciclable.';
        imagen = '../img/lucas/Lucas_3.png';
        imagenAlt = 'Lucas feliz';
      } else {
        puntajeHistoria -= 1;
        if (puntajeHistoria < 0) puntajeHistoria = 0;
        correcto = false;
        mensaje =
          'No exactamente, aunque parezca algo indiferente, la contaminación de materiales reciclables reduce la recuperación y aumenta lo que termina en el relleno, incrementando su sobreocupación.';
        imagen = '../img/lucas/Lucas_2.png';
        imagenAlt = 'Lucas confundido';
      }
      mostrarRetroalimentacion(correcto, mensaje, imagen, imagenAlt);
      break;
    case 8:
      let nextPage;
      if (seleccion === opcionesCorrectas[7]) {
        puntajeHistoria += 2;
        correcto = true;
        mensaje =
          'Correcto. Pilas, medicamentos y químicos pueden filtrarse al agua y acumularse en la cadena alimentaria, dañando animales y personas.';
        imagen = '../img/lira/Lira_2.png';
        imagenAlt = 'Lira feliz';
      } else {
        puntajeHistoria -= 1;
        if (puntajeHistoria < 0) puntajeHistoria = 0;
        correcto = false;
        mensaje =
          'No, muchos residuos peligrosos no se degradan y liberan sustancias tóxicas que contaminan el agua y el suelo.';
        imagen = '../img/lira/Lira_3.png';
        imagenAlt = 'Lira confundida';
      }
      puntajeHistoria += getPuntajeTotal();
      if (puntajeHistoria < 0) puntajeHistoria = 0;
      if (puntajeHistoria >= 9) {
        nextPage = 9;
      } else {
        nextPage = 10;
      }
      mostrarRetroalimentacion(correcto, mensaje, imagen, imagenAlt, nextPage);
      break;
  }
}

function flipToFirstPage(flipbook, i) {
  if (i != 1) {
    const elementoOcultar = document.querySelector(`#pagina${paginas[i]} div`);
    elementoOcultar.classList.add('hide');
  }

  if (i > 1 && i != 9) {
    setTimeout(() => {
      flipbook.turn('page', i, { duration: 100 });
      flipToFirstPage(flipbook, i - 1);
    }, 1000);
  } else if (i == 9) {
    setTimeout(() => {
      flipbook.turn('page', i - 1, { duration: 100 });
      flipToFirstPage(flipbook, i - 2);
    }, 1000);
  } else if (i == 1) {
    const divPagina1 = document.getElementById('pagina1');
    const buttonPagina1 = document.querySelector('#pagina1 .historia-button');
    buttonPagina1.style.display = 'block';
    divPagina1.style.backgroundImage = "url('./img/fondos/historia/Historia_1.1.png')";
    setTimeout(() => {
      flipbook.turn('page', i, { duration: 100 });
    }, 1000);
  }
}

function reiniciarHistoria() {
  const flipbook = $('#flipbook');
  puntajeHistoria = 0;
  let currentPage = flipbook.turn('page');
  const elementoOcultar = document.querySelector(`#pagina${paginas[currentPage]} div`);
  elementoOcultar.classList.add('hide');
  flipToFirstPage(flipbook, currentPage - 1);
  playAgain();
}

$(document).ready(function () {
  $('#flipbook').turn({
    width: $('#flipbook').width(),
    height: $('#flipbook').height(),
    autoCenter: true,
    display: 'single', // Esto muestra solo una página a la vez,
    duration: 2000,
  });

  $('#flipbook').turn('disable', true);

  // Usar event delegation en el contenedor principal del flipbook
  $('#flipbook').on('click', '.historia-button', function () {
    const flipbook = $('#flipbook');
    const currentPage = flipbook.turn('page');
    const totalPages = flipbook.turn('pages') - 1;
    const seleccion = $(this).text().trim();
    if (currentPage < totalPages) {
      pasarPagina(currentPage, seleccion);
    } else {
      reiniciarHistoria();
    }
  });
});

$('#flipbook').bind('turned', function (event, page, view) {
  const elementoOculto = document.querySelector(`#pagina${paginas[page]} .hide`);

  if (elementoOculto && page != 1) {
    elementoOculto.classList.remove('hide');
  }
  if (page == 6) {
    const pagina = document.querySelector(`[page="${page}"]`);
    pagina.firstElementChild.style.overflow = 'visible';
  }
});

$('#flipbook').bind('turning', function (event, page, view) {
  if (page == 7) {
    const pagina = document.querySelector(`[page="6"]`);
    pagina.firstElementChild.style.overflow = 'hidden';
  }
});

const flipbook = document.getElementById('flipbook');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const residuosPag1 = document.getElementById('residuos-pag1');
        const seleccion = document.querySelector('#pagina1 .contenedor-selecciones');
        setTimeout(() => {
          residuosPag1.classList.add('imagen-visible');
          seleccion.classList.remove('hide');
        }, 3500);
      }
    });
  },
  { threshold: 0.5 }
);

observer.observe(flipbook);
