// import personajes from './data/personajes.json' assert { type: 'json' };
// import ratings from './data/ratings.json' assert { type: 'json' };

const personajesJSON = {
  Lucian: 0,
  Lira: 0,
  Lucas: 0,
  Naira: 0,
};

const ratingsJSON = [];

const formIngreso = document.querySelector('.form-ingreso');
const formDatosPersonales = document.getElementById('form-datos-personales');
const nombreInput = document.getElementById('nombre');
const numeroPregunta = document.getElementById('numero-pregunta');
const textoBienvenida = document.querySelector('.texto-bienvenida');
const formCantainerBackground = document.getElementById('form-container');
const formContainer = document.getElementById('form-preguntas');
const preguntas = document.querySelectorAll('.pregunta-contenedor');
const imagenLucian = document.querySelector('.imagen-lucian');
const btnAnterior = document.getElementById('anterior-btn');
const btnSiguiente = document.getElementById('siguiente-btn');
const opcionesPreguntas = document.querySelectorAll('.opcion-pregunta');
const numeroUsuarios = document.getElementById('numero-usuarios');
const barraAvance = document.querySelector('.barra-avance');
const contenedorResultados = document.getElementById('resultados-container');

const audioControlBtn = document.getElementById('audio-control-btn');
const audioText = document.getElementById('audio-text');
const audio = new Audio('../audio/nature.mp3');
audio.loop = true;

audioControlBtn.addEventListener('click', () => {
  audio.muted = !audio.muted;
  actualizarIconoAudio();
});

function actualizarIconoAudio() {
  if (!audio.muted) {
    audioControlBtn.classList.remove('fa-volume-xmark');
    audioControlBtn.classList.add('fa-volume-high');
    audioText.textContent = 'Desactivar sonido';
  } else {
    audioControlBtn.classList.remove('fa-volume-high');
    audioControlBtn.classList.add('fa-volume-xmark');
    audioText.textContent = 'Activar sonido';
  }
}

let preguntasTotales = preguntas.length;
let indiceActual = 0;
let usuariosConectados = 0;
let avance = 0;
let totalAns;

const backgroundImgs = {
  1: 'url("../img/fondos/preguntas/Fondo_P1.png")',
  2: 'url("../img/fondos/preguntas/Fondo_P2.png")',
  3: 'url("../img/fondos/preguntas/Fondo_P3-P9.png")',
  4: 'url("../img/fondos/preguntas/Fondo_P4.png")',
  5: 'url("../img/fondos/preguntas/Fondo_P5.png")',
  6: 'url("../img/fondos/preguntas/Fondo_P6.png")',
  7: 'url("../img/fondos/preguntas/Fondo_P7.png")',
  8: 'url("../img/fondos/preguntas/Fondo_P8.png")',
  9: 'url("../img/fondos/preguntas/Fondo_P3-P9.png")',
  10: 'url("../img/fondos/preguntas/Fondo_P10.png")',
  11: 'url("../img/fondos/preguntas/Fondo_P11.png")',
  12: 'url("../img/fondos/preguntas/Fondo_P12.png")',
};
const backgroundImgPersonajes = {
  Lucian: 'url("../img/fondos/personajes/FF_Lucas.png")',
  Naira: 'url("../img/fondos/personajes/FF_Naira.png")',
  Lucas: 'url("../img/fondos/personajes/FF_Lucas.png")',
  Lira: 'url("../img/fondos/personajes/FF_Lira.png")',
};

// Funcion para obtener total de respuestas del test
async function obtenerTotalAnswers() {
  let count = 0;
  let counts = Object.values(personajesJSON);
  counts.forEach((num) => {
    count += num;
  });
  return count;
}

// Evento para el formulario de ingreso
formDatosPersonales.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = nombreInput.value.trim();

  if (nombre) {
    localStorage.setItem('usuarioNombreQREM', nombre);

    // Ocultar el formulario de ingreso
    formIngreso.classList.add('oculto');

    // Iniciar el test
    iniciarTest();
  }
});

opcionesPreguntas.forEach((op) => {
  op.addEventListener('click', () => {
    // Obtener el contenedor de opciones (ul) de la pregunta actual
    const contenedorOpciones = op.closest('.opciones-contenedor');

    contenedorOpciones.querySelectorAll('.opcion-pregunta').forEach((opcion) => {
      opcion.classList.remove('opcion-seleccionada');
    });

    op.classList.add('opcion-seleccionada');
  });
});

function mostrarPregunta(nueva) {
  const preguntaActual = preguntas[indiceActual];
  preguntaActual.classList.remove('active');
  preguntaActual.classList.add(nueva > indiceActual ? 'exit-up' : 'exit-down');

  indiceActual = nueva;

  const siguiente = preguntas[indiceActual];
  siguiente.classList.remove('exit-up', 'exit-down');
  siguiente.classList.add('active');

  btnAnterior.disabled = indiceActual === 0;
  if (indiceActual === 0) {
    btnAnterior.classList.add('btn-desactivado');
  } else {
    btnAnterior.classList.remove('btn-desactivado');
  }

  if (indiceActual === preguntas.length - 1) {
    btnSiguiente.textContent = 'Finalizar';
    btnSiguiente.style.background = 'var(--color-azul)';
  } else {
    btnSiguiente.textContent = 'Siguiente';
    btnSiguiente.style.background = '';
  }

  avance = (indiceActual * 100) / preguntasTotales;
  barraAvance.style.width = `${avance}%`;
}

function obtenerPersonaje(opcionesSeleccionadas) {
  const respuestas = {
    preguntas: [
      {
        id: 1,
        texto: 'En tu grupo de amigos, tú eres más…',
        opciones: [
          { texto: 'Quien da consejos prácticos y tranquilos.', personaje: 'Lucian' },
          { texto: 'Quien siempre inventa algo nuevo con lo que hay.', personaje: 'Lucas' },
          { texto: 'Quien que todos hagan las cosas bien y ordenadas.', personaje: 'Naira' },
          { texto: 'Quien asume los riesgos y protege al grupo.', personaje: 'Lira' },
        ],
      },
      {
        id: 2,
        texto: 'Encuentras una botella plástica vacía en la calle: ¿qué haces?',
        opciones: [
          {
            texto: 'Si está sucia, la limpio y la dispongo adecuadamente en la bolsa reciclaje.',
            personaje: 'Naira',
          },
          { texto: 'La guardo por si puedo transformarla en algo útil.', personaje: 'Lucas' },
          {
            texto:
              'Pienso que, si no se gestiona, terminará dañando el suelo, prefiero depositarla en el contenedor correcto.',
            personaje: 'Lucian',
          },
          {
            texto:
              'Me preocupa que algunos envases contengan algo peligroso, verifico si requiere manejo especial.',
            personaje: 'Lira',
          },
          { texto: 'No hacer ninguna acción y seguir por delante', personaje: null },
        ],
      },
      {
        id: 3,
        texto: 'En relación al agua en casa (uso en limpieza, ducha, riego), tú normalmente:',
        opciones: [
          {
            texto:
              'Reutilizas aguas de la ducha o lavadora para riego y fomentas el ahorro del agua.',
            personaje: 'Lucian',
          },
          {
            texto:
              'Evitas verter aceites de cocina usado al fregadero y reciclas el agua cuando es posible.',
            personaje: 'Naira',
          },
          {
            texto: 'Buscas soluciones caseras para captar agua y reutilizarla.',
            personaje: 'Lucas',
          },
          {
            texto:
              'Cuidas que productos químicos domésticos no entren al sistema de agua para evitar que se contamine.',
            personaje: 'Lira',
          },
        ],
      },
      {
        id: 4,
        texto: 'Cuando ves restos de frutas o verduras después de cocinar, piensas que…',
        opciones: [
          { texto: 'Son alimento para la tierra, deberían volver al suelo.', personaje: 'Lucian' },
          {
            texto: 'Tal vez podrían usarse para hacer otra cosa creativa, no todo es basura.',
            personaje: 'Lucas',
          },
          {
            texto: 'Si no se separan bien terminan contaminando el agua y eso me preocupa.',
            personaje: 'Naira',
          },
          {
            texto:
              'Algunos restos pueden atraer plagas o enfermedades, hay que manejarlos con cuidado.',
            personaje: 'Lira',
          },
          { texto: 'Disponer el residuo en cualquier basura.', personaje: null },
        ],
      },
      {
        id: 5,
        texto: '¿Qué haces cuando terminas un jugo en caja (Tetrapak)?',
        opciones: [
          {
            texto:
              'Me aseguro de vaciar el resto de contenido en orgánicos y luego si se dispone en la bolsa blanca.',
            personaje: 'Naira',
          },
          { texto: 'Pienso en usarlo como artesanías o manualidades.', personaje: 'Lucas' },
          {
            texto: 'Reflexiono en cómo esos empaques duran tanto y afectan a la tierra.',
            personaje: 'Lucian',
          },
          {
            texto:
              'Me preocupa si queda con residuos líquidos que puedan contaminar o atraer bichos.',
            personaje: 'Lira',
          },
        ],
      },
      {
        id: 6,
        texto: '¿Qué haces con las cosas que ya no sirven en casa?',
        opciones: [
          {
            texto: 'Trato de repararlas o darles otro uso para extender su vida útil.',
            personaje: 'Lucas',
          },
          { texto: 'Reviso si pueden reciclarse y van a la bolsa correcta.', personaje: 'Naira' },
          {
            texto: 'Pienso si son orgánicas y podrían regresar al ciclo natural.',
            personaje: 'Lucian',
          },
          {
            texto: 'Me fijo si son peligrosas (pilas, químicos) y las separo con cuidado.',
            personaje: 'Lira',
          },
          { texto: 'Tirarlo en la basura porque no funciona.', personaje: null },
        ],
      },
      {
        id: 7,
        texto: '¿Qué haces con las pilas usadas en tu casa?',
        opciones: [
          { texto: 'Busco un punto de recolección segura.', personaje: 'Lira' },
          {
            texto: 'Emplear pilas recargables que permitan extender uso y vida útil.',
            personaje: 'Lucas',
          },
          { texto: 'Las separo de los demás residuos para que no contaminen.', personaje: 'Naira' },
          {
            texto: 'Pienso en cómo afectan al suelo si no se gestionan bien.',
            personaje: 'Lucian',
          },
          { texto: 'Desecharlas en la primera basura que encuentro.', personaje: null },
        ],
      },
      {
        id: 8,
        texto:
          'Si tu comunidad crea un reto para mejorar la gestión de residuos, ¿qué rol tomarías?',
        opciones: [
          {
            texto:
              'Enseñar cómo compostar y explicar por qué importa devolver materia a la tierra.',
            personaje: 'Lucian',
          },
          {
            texto: 'Coordinar la separación y buscar alianzas con recicladores locales.',
            personaje: 'Naira',
          },
          {
            texto: 'Idear proyectos creativos con materiales que ya no sirven.',
            personaje: 'Lucas',
          },
          {
            texto: 'Asegurar protocolos para residuos que representen un riesgo (pilas, químicos).',
            personaje: 'Lira',
          },
        ],
      },
      {
        id: 9,
        texto: 'Ves basura flotando en un canal cercano: tu primer pensamiento es…',
        opciones: [
          {
            texto: '¿Cómo podemos devolver el equilibrio al ecosistema con soluciones naturales?',
            personaje: 'Lucian',
          },
          {
            texto:
              '¿Cómo evitar que esto afecte la vida del agua y qué materiales se pudieron separar?',
            personaje: 'Naira',
          },
          {
            texto: '¿Cómo podemos evitar la contaminación al transformar en algo?',
            personaje: 'Lucas',
          },
          {
            texto: '¿Hay sustancias peligrosas allí que requieran reporte y manejo especializado?',
            personaje: 'Lira',
          },
        ],
      },
      {
        id: 10,
        texto: 'Piensas en el futuro de tu barrio: ¿qué imagen te gustaría ver?',
        opciones: [
          {
            texto: 'Huertas y suelos fértiles donde vuelva lo que se consume.',
            personaje: 'Lucian',
          },
          {
            texto: 'Sistemas de reciclaje que impulsen emprendimientos locales.',
            personaje: 'Naira',
          },
          {
            texto: 'Comunidades creativas que transformen lo desechado en recursos.',
            personaje: 'Lucas',
          },
          {
            texto: 'Zonas seguras donde los residuos peligrosos se gestionen correctamente.',
            personaje: 'Lira',
          },
        ],
      },
      {
        id: 11,
        texto: 'En relación con vegetación y corredores verdes en tu entorno, tú prefieres:',
        opciones: [
          {
            texto: 'Cultivar y proteger especies que nutran el suelo y atraigan biodiversidad.',
            personaje: 'Lucian',
          },
          {
            texto: 'Promover zonas limpias y señalizadas que eviten contaminación del hábitat.',
            personaje: 'Naira',
          },
          {
            texto:
              'Diseñar pequeños proyectos participativos (jardines con materiales reciclados).',
            personaje: 'Lucas',
          },
          {
            texto: 'Asegurar que no se ingresen materiales peligrosos a estos espacios.',
            personaje: 'Lira',
          },
        ],
      },
      {
        id: 12,
        texto: 'Si tuvieras que dar un consejo rápido sobre residuos, dirías:',
        opciones: [
          { texto: '“Devuelve a la tierra lo que le pertenece.”', personaje: 'Lucian' },
          { texto: '“Separa lo limpio y dalo al que puede aprovecharlo.”', personaje: 'Naira' },
          { texto: '“Si no sirve ni se transforma, al negro debe.”', personaje: 'Lucas' },
          {
            texto: '“Lo peligroso no se mezcla: Entrégalo de forma segura en el lugar correcto.”',
            personaje: 'Lira',
          },
        ],
      },
    ],
  };
  const puntajes = {};

  opcionesSeleccionadas.forEach((respuestaTexto, preguntaIndex) => {
    respuestaTexto = respuestaTexto.trim();
    const pregunta = respuestas.preguntas[preguntaIndex];
    if (!pregunta) return;

    const opcionElegida = pregunta.opciones.find((op) => op.texto === respuestaTexto);

    if (opcionElegida && opcionElegida.personaje) {
      puntajes[opcionElegida.personaje] = (puntajes[opcionElegida.personaje] || 0) + 1;
    }
  });

  let personajeGanador = null;
  let maxPuntos = -1;

  for (const [personaje, puntos] of Object.entries(puntajes)) {
    if (puntos > maxPuntos) {
      personajeGanador = personaje;
      maxPuntos = puntos;
    }
  }
  return personajeGanador;
}

async function cargarResultados(usuario, opcionesSeleccionadas) {
  const personajesInfo = {
    Lucian: {
      nombre: 'Lucian',
      texto: `
      <div class="vista vista-descripcion active">
        <h3 class="titulo-subtitulo bold texto-verde">Lucian</h3>
        <p class="texto-alt">
          Soy Lucian, tranquilo y paciente como la naturaleza. Mi misión es enseñarte a cuidar la tierra separando los residuos orgánicos en la 
          <span class="texto-verde">bolsa verde</span>, como cáscaras de frutas, restos de comida o plantas secas, que pueden transformarse en abono para dar nueva vida a los suelos. 
          Al hacerlo, reducimos la cantidad de basura y devolvemos a la naturaleza lo que ella misma nos dio.
        </p>
        <div class="texto-alt">
          <h5 class="titulo-subtitulo texto-verde">Recuerda residuos como...</h5>
          <p>Cáscaras de plátano</p>
          <p>Restos de pan</p>
          <p>Hojas y ramas secas</p>
        </div>
      </div>

      <div class="vista vista-preguntas texto-alt">
        <h4 class="titulo-subtitulo texto-verde">Preguntas Frecuentes</h4>
        <p>
          <strong class="texto-verde">¿Las servilletas usadas van en la bolsa verde?</strong><br />
          No, van en la bolsa negra, porque están contaminadas.
        </p>
        <p>
          <strong class="texto-verde">¿Qué pasa si mezclo huesos con los orgánicos?</strong><br />
          No se compostan fácilmente, van a la bolsa negra.
        </p>
        <p>
          <strong class="texto-verde">¿Los residuos de poda o césped van en la verde?</strong><br />
          Sí, siempre que no tengan químicos.
        </p>
        <p>
          <strong class="texto-verde">¿Se pueden poner cáscaras de cítricos en el compostaje?</strong><br />
          Sí, pero en poca cantidad.
        </p>
      </div>

      <button class="btn-toggle titulo-subtitulo btn-t-verde">Preguntas frecuentes</button>
      `,
      imagen: '../img/lucian/Lucian_N8.png',
      imagenPodio: '../img/lucian/Lucian_N6.png',
      color: 'verde',
    },
    Naira: {
      nombre: 'Naira',
      texto: `
      <div class="vista vista-descripcion active">
        <h3 class="titulo-subtitulo bold texto-azul">Naira</h3>
        <p class="texto-alt">
          Soy Naira, protectora de los ríos y del aire limpio.
          Me encargo de enseñarte a separar los residuos aprovechables, como botellas plásticas, vidrio, cartón limpio y metales en la 
          <span class="texto-azul">bolsa blanca</span>, que pueden reciclarse y convertirse en nuevos productos. 
          Separarlos correctamente evita que terminen contaminando el agua y la tierra, y ayuda a reducir la explotación de recursos naturales.
        </p>
        <div class="texto-alt">
          <h5 class="titulo-subtitulo texto-azul">Recuerda residuos como...</h5>
          <p>Botellas plásticas</p>
          <p>Latas de gaseosa</p>
          <p>Cartón y papel</p>
        </div>
      </div>

      <div class="vista vista-preguntas texto-alt">
        <h4 class="titulo-subtitulo texto-azul">Preguntas Frecuentes</h4>
        <p>
          <strong class="texto-azul">¿El cartón de pizza va en la bolsa blanca?</strong><br />
          No, si tiene grasa o restos de comida va en la negra.
        </p>
        <p>
          <strong class="texto-azul">¿Los vasos plásticos desechables son reciclables?</strong><br />
          Sí, si están limpios.
        </p>
        <p>
          <strong class="texto-azul">¿El papel higiénico usado va en la blanca?</strong><br />
          No, siempre en la negra.
        </p>
        <p>
          <strong class="texto-azul">¿El vidrio roto es reciclable?</strong><br />
          Sí, siempre que no sea vidrio de bombillas o espejos y la bolsa tenga visible la información que hay vidrios rotos.
        </p>
      </div>

      <button class="btn-toggle titulo-subtitulo btn-t-azul">Preguntas frecuentes</button>
      `,
      imagen: '../img/naira/Naira_4.png',
      imagenPodio: '../img/naira/Naira_3.png',
      color: 'blanco',
    },
    Lucas: {
      nombre: 'Lucas',
      texto: `
      <div class="vista vista-descripcion active">
        <h3 class="titulo-subtitulo bold texto-negro">Lucas</h3>
        <p class="texto-alt">
          Soy Lucas, curioso y creativo, siempre buscando ideas nuevas para reutilizar lo que parece no tener uso. 
          Mi papel es mostrarte cómo identificar los residuos no aprovechables, como servilletas sucias, papeles contaminados o empaques metalizados, 
          que deben ir en la <span class="texto-negro bold">bolsa negra</span>. 
          Aunque muchos no se reciclan, algunos pueden inspirar a crear algo nuevo y así darles una segunda vida.
        </p>
        <div class="texto-alt">
          <h5 class="titulo-subtitulo texto-negro">Recuerda residuos como...</h5>
          <p>Servilletas sucias</p>
          <p>Papeles contaminados</p>
          <p>Empaques metalizados</p>
        </div>
      </div>

      <div class="vista vista-preguntas texto-alt">
        <h4 class="titulo-subtitulo texto-negro">Preguntas Frecuentes</h4>
        <p>
          <strong class="texto-negro">¿Dónde van los tampones y toallas higiénicas?</strong><br />
          Bolsa negra.
        </p>
        <p>
          <strong class="texto-negro">¿Dónde van los condones?</strong><br />
          Bolsa negra o roja.
        </p>
        <p>
          <strong class="texto-negro">¿Dónde van las servilletas sucias?</strong><br />
          Bolsa negra.
        </p>
        <p>
          <strong class="texto-negro">¿Dónde van las colillas de cigarrillo?</strong><br />
          Bolsa negra.
        </p>
      </div>

      <button class="btn-toggle titulo-subtitulo btn-t-negro">Preguntas frecuentes</button>
      `,
      imagen: '../img/lucas/Lucas_4.png',
      imagenPodio: '../img/lucas/Lucas_5.png',
      color: 'negro',
    },
    Lira: {
      nombre: 'Lira',
      texto: `
      <div class="vista vista-descripcion active">
        <h3 class="titulo-subtitulo bold texto-rojo">Lira</h3>
        <p class="texto-alt">
          Soy Lira, un colibrí pequeño que ama las flores. 
          Cuido los residuos peligrosos que van en la <span class="texto-rojo bold">bolsa roja</span>, como pilas, baterías o medicamentos vencidos. 
          Si los botamos mal contaminan el agua y la tierra; yo te enseño a darles el lugar correcto para proteger la vida de todos.
        </p>
        <div class="texto-alt">
          <h5 class="titulo-subtitulo texto-rojo">Recuerda residuos como...</h5>
          <p>Medicamentos vencidos</p>
          <p>Restos hospitalarios</p>
          <p>Productos químicos</p>
        </div>
      </div>

      <div class="vista vista-preguntas texto-alt">
        <h4 class="titulo-subtitulo texto-rojo">Preguntas Frecuentes</h4>
        <p>
          <strong class="texto-rojo">¿Dónde van los medicamentos vencidos?</strong><br />
          Bolsa roja, en puntos especializados de entrega.
        </p>
        <p>
          <strong class="texto-rojo">¿Las pilas se pueden botar a la basura común?</strong><br />
          No, siempre en puntos de acopio.
        </p>
        <p>
          <strong class="texto-rojo">¿Dónde se deben llevar las jeringas?</strong><br />
          Bolsa roja, protegidas en un recipiente rígido.
        </p>
        <p>
          <strong class="texto-rojo">¿Qué hacer con aerosoles vacíos?</strong><br />
          También en la bolsa roja, en contenedores especiales.
        </p>
      </div>

      <button class="btn-toggle titulo-subtitulo btn-t-rojo">Preguntas frecuentes</button>
      `,
      imagen: '../img/lira/Lira_4.png',
      imagenPodio: '../img/lira/Lira_2.png',
      color: 'rojo',
    },
  };

  let personajes = Object.values(personajesInfo);
  const personajeSeleccionado = personajesInfo[obtenerPersonaje(opcionesSeleccionadas)];
  personajes = personajes.filter((p) => p.nombre !== personajeSeleccionado.nombre);

  /* ACTUALIZACION DE OBJETO PERSONAJES */
  personajesJSON[personajeSeleccionado.nombre] += 1;

  /* INSERCION HTML DE RESULTADOS */

  contenedorResultados.innerHTML = `
      <div class="resultado-principal">
        <h2 class="titulo-subtitulo">Querid@ ${usuario} ¡Tenemos tus resultados!</h2>
        <div class="personaje-seleccionado-card bg-${
          personajeSeleccionado.color
        }" style='background-image: ${backgroundImgPersonajes[personajeSeleccionado.nombre]}'>
          <div class="imagen-personaje-seleccionado">
            <img src="${personajeSeleccionado.imagen}" alt="${personajeSeleccionado.nombre}" />
          </div>
          <div class="descripcion-personaje-seleccionado">
            ${personajeSeleccionado.texto}
          </div>
        </div>
        <a class="button-abs titulo-subtitulo" href="#opc">Descubre a los demas</a>
      </div>
      <div id="opc" class="otros-personajes-contenedor">
        <h2 class="titulo-subtitulo oculto">Descubre como podrias mejorar lo que ya tienes:</h2>
        <div class="otros-personajes">
        </div>
        <a class="button-abs titulo-subtitulo" href="#tp">Descubre el podio</a>
      </div>
  `;
  let otrosPersonajesContenedor = document.querySelector('.otros-personajes');
  personajes.forEach((personajeTmp) => {
    otrosPersonajesContenedor.innerHTML += `
        <div class="otro-personaje-card bg-${personajeTmp.color}" style='background-image: ${
      backgroundImgPersonajes[personajeTmp.nombre]
    }'>
          <div class="imagen-personaje-alt">
            <img src="${personajeTmp.imagen}" alt="${personajeTmp.nombre}" />
          </div>
          <div class="descripcion-personaje-alt">
            ${personajeTmp.texto}
          </div>
        </div>
        
    `;
  });

  /* INSERCION HTML DEL RANKING, POR AHORA SOLO TOP 3*/
  const podio = Object.entries(personajesJSON)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  contenedorResultados.innerHTML += `
      <section id="tp" class="top-personajes">
        <h2 class="titulo-subtitulo">🏅 Top 3 personajes más frecuentes en los resultados</h2>
        <div class="top-cards">
        </div>
        <a class="button-abs titulo-subtitulo" href="#rating-section">Calificanos</a>
      </section>
  `;
  let contenedorTarjetasTop = document.querySelector('.top-cards');

  let [personaje, count] = podio[1];
  let { imagenPodio } = personajesInfo[personaje];

  contenedorTarjetasTop.innerHTML += `
    <div class="card plata">
      <span class="medalla"><i class="fas fa-medal"></i></span>
      <img src="${imagenPodio}" alt="${personaje}" />
      <div>
        <h3 class="titulo-subtitulo bold">${personaje}</h3>
        <p class="texto-alt card-count">${count}</p>
      </div>
    </div>
  `;

  [personaje, count] = podio[0];
  ({ imagenPodio } = personajesInfo[personaje]);
  contenedorTarjetasTop.innerHTML += `
    <div class="card oro">
      <span class="medalla"><i class="fas fa-trophy"></i></span>
      <img src="${imagenPodio}" alt="${personaje}" />
      <div>
        <h3 class="titulo-subtitulo">${personaje}</h3>
        <p class="texto-alt card-count">${count}</p>
      </div>
    </div>
  `;

  [personaje, count] = podio[2];
  ({ imagenPodio } = personajesInfo[personaje]);
  contenedorTarjetasTop.innerHTML += `
    <div class="card bronce">
      <span class="medalla"><i class="fas fa-medal"></i></span>
      <img src="${imagenPodio}" alt="${personaje}" />
      <div>
        <h3 class="titulo-subtitulo">${personaje}</h3>
        <p class="texto-alt card-count">${count}</p>
      </div>
    </div>
  `;
  const ratingContainer = document.getElementById('rating-section');
  ratingContainer.style.display = 'flex';
  ratingContainer.innerHTML = `
  <h2 class="titulo-subtitulo">Ayudanos calificandonos</h2>
      <form id="encuesta-form">
        <fieldset class="rating texto-alt">
          <legend>¿Qué tan claro te quedó cómo separar los residuos después de usar la página?</legend>
          
          <input type="radio" id="q1-star5" name="rating1" value="5" />
          <label class="full" for="q1-star5" title="Muy claro - 5 estrellas"></label>

          <input type="radio" id="q1-star4" name="rating1" value="4" />
          <label class="full" for="q1-star4" title="Claro - 4 estrellas"></label>

          <input type="radio" id="q1-star3" name="rating1" value="3" />
          <label class="full" for="q1-star3" title="Medianamente claro - 3 estrellas"></label>

          <input type="radio" id="q1-star2" name="rating1" value="2" />
          <label class="full" for="q1-star2" title="Poco claro - 2 estrellas"></label>

          <input type="radio" id="q1-star1" name="rating1" value="1" />
          <label class="full" for="q1-star1" title="Muy poco claro - 1 estrella"></label>
        </fieldset>

        <fieldset class="rating texto-alt">
          <legend>¿Qué tan útil consideras que fue la página para resolver dudas sobre la clasificación por colores de los residuos?</legend>
          
          <input type="radio" id="q2-star5" name="rating2" value="5" />
          <label class="full" for="q2-star5" title="Muy útil - 5 estrellas"></label>

          <input type="radio" id="q2-star4" name="rating2" value="4" />
          <label class="full" for="q2-star4" title="Útil - 4 estrellas"></label>

          <input type="radio" id="q2-star3" name="rating2" value="3" />
          <label class="full" for="q2-star3" title="Medianamente útil - 3 estrellas"></label>

          <input type="radio" id="q2-star2" name="rating2" value="2" />
          <label class="full" for="q2-star2" title="Poco útil - 2 estrellas"></label>

          <input type="radio" id="q2-star1" name="rating2" value="1" />
          <label class="full" for="q2-star1" title="Nada útil - 1 estrella"></label>
        </fieldset>

        <fieldset class="rating texto-alt">
          <legend>¿Qué tanto te motivó la experiencia para aplicar la separación de residuos en tu casa, colegio o comunidad?</legend>
          
          <input type="radio" id="q3-star5" name="rating3" value="5" />
          <label class="full" for="q3-star5" title="Muy motivado - 5 estrellas"></label>

          <input type="radio" id="q3-star4" name="rating3" value="4" />
          <label class="full" for="q3-star4" title="Motivado - 4 estrellas"></label>

          <input type="radio" id="q3-star3" name="rating3" value="3" />
          <label class="full" for="q3-star3" title="Medianamente motivado - 3 estrellas"></label>

          <input type="radio" id="q3-star2" name="rating3" value="2" />
          <label class="full" for="q3-star2" title="Poco motivado - 2 estrellas"></label>

          <input type="radio" id="q3-star1" name="rating3" value="1" />
          <label class="full" for="q3-star1" title="Nada motivado - 1 estrella"></label>
        </fieldset>
        <button type="submit" class="titulo-subtitulo" id="btn-enviar-calificacion">Enviar</button>
      </form>
  `;
  document.getElementById('encuesta-form').addEventListener('submit', enviarCalificacion);
}

btnSiguiente.addEventListener('click', () => {
  const preguntaActual = preguntas[indiceActual];

  // Verificar si hay alguna opción seleccionada en la pregunta actual
  const opcionSeleccionada = preguntaActual.querySelector('.opcion-seleccionada');

  if (!opcionSeleccionada) {
    // Obtener el contenedor de opciones y activar la animación de terremoto
    const contenedorOpciones = preguntaActual.querySelector('.opciones-contenedor');
    contenedorOpciones.classList.add('terremoto');

    // Remover la clase después de que termine la animación
    setTimeout(() => {
      contenedorOpciones.classList.remove('terremoto');
    }, 1000);

    return;
  }

  if (indiceActual < preguntas.length - 1) {
    mostrarPregunta(indiceActual + 1);
    numeroPregunta.textContent = `Pregunta No. ${indiceActual + 1}`;
    formCantainerBackground.style.backgroundImage = backgroundImgs[indiceActual + 1];
  } else {
    let opcionesSeleccionadas = [];
    opcionesPreguntas.forEach((op) => {
      if (op.classList.contains('opcion-seleccionada')) {
        opcionesSeleccionadas.push(op.textContent);
      }
    });
    const usuario = localStorage.getItem('usuarioNombreQREM');
    cargarResultados(usuario, opcionesSeleccionadas);

    setTimeout(() => {
      formContainer.classList.add('deshabilitado');
      document.getElementById('form-container').style.backgroundImage = 'none';
      barraAvance.style.width = '100%';
      document.getElementById('resultados-container').scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 500);
  }
});

btnAnterior.addEventListener('click', () => {
  if (indiceActual > 0) {
    mostrarPregunta(indiceActual - 1);
    numeroPregunta.textContent = `Pregunta No. ${indiceActual + 1}`;
    formCantainerBackground.style.backgroundImage = backgroundImgs[indiceActual + 1];
  }
});

// Función para iniciar el test
async function iniciarTest() {
  audio.play().catch(() => {
    console.log('El navegador bloqueó el autoplay hasta que el usuario interactúe');
  });
  const nombre = localStorage.getItem('usuarioNombreQREM');
  totalAns = await obtenerTotalAnswers();
  textoBienvenida.innerHTML = `<h1>¡Bienvenid@ <span class="nombre-bienvenida">${nombre}</span>!<br>descubramos que guardián verde eres, serás el número ${
    totalAns + 1
  } en hacerlo.</h1>`;
  // Mostrar la primera pregunta
  preguntas[0].classList.add('active');
  formCantainerBackground.style.backgroundImage = backgroundImgs[1];
  numeroPregunta.textContent = 'Pregunta No. 1';
  // cargarResultados(nombre, [
  //   '\n                Quien que todos hagan las cosas bien y ordenadas.\n              ',
  //   '\n                \n                  Me preocupa que algunos envases contengan algo peligroso, verifico si requiere\n                  manejo especial.\n                \n              ',
  //   '\n                Buscas soluciones caseras para captar agua y reutilizarla.\n              ',
  //   '\n                \n                  Algunos restos pueden atraer plagas o enfermedades, hay que manejarlos con\n                  cuidado.\n                \n              ',
  //   '\n                \n                  Me preocupa si queda con residuos líquidos que puedan contaminar o atraer bichos.\n                \n              ',
  //   '\n                Me fijo si son peligrosas (pilas, químicos) y las separo con cuidado.\n              ',
  //   '\n                Pienso en cómo afectan al suelo si no se gestionan bien.\n              ',
  //   '\n                \n                  Asegurar protocolos para residuos que representen un riesgo (pilas, químicos).\n                \n              ',
  //   '\n                ¿Hay sustancias peligrosas allí que requieran reporte y manejo especializado?\n              ',
  //   '\n                Zonas seguras donde los residuos peligrosos se gestionen correctamente.\n              ',
  //   '\n                Asegurar que no se ingresen materiales peligrosos a estos espacios.\n              ',
  //   '\n                “Lo peligroso no se mezcla: Entrégalo de forma segura en el lugar correcto.”\n              ',
  // ]);
}

// Función para verificar si ya existen datos del usuario
function verificarDatosUsuario() {
  const nombre = localStorage.getItem('usuarioNombreQREM');

  if (nombre) {
    // Si ya existen los datos, ocultar el formulario e iniciar el test
    formIngreso.classList.add('oculto');
    iniciarTest();
  }
}

// Envio de calificaciones
async function enviarCalificacion(e) {
  e.preventDefault();
  const btnEnviar = document.getElementById('btn-enviar-calificacion');
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  // Captura los valores seleccionados
  const data = {
    rating1: document.querySelector('input[name="rating1"]:checked')?.value,
    rating2: document.querySelector('input[name="rating2"]:checked')?.value,
    rating3: document.querySelector('input[name="rating3"]:checked')?.value,
  };

  if (!data.rating1 || !data.rating2 || !data.rating3) {
    alert('Por favor, responde todas las preguntas antes de enviar.');
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar';
    return;
  }

  // Actualizar JSON ratings
  ratingsJSON.push(data);

  alert('Calificación guardada');
  const ratingContainer = document.getElementById('rating-section');
  ratingContainer.innerHTML = '<h3 class="titulo-subtitulo">¡Gracias por tu calificación!</h3>';
}

// Verificar datos al cargar la página
document.addEventListener('DOMContentLoaded', verificarDatosUsuario);

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-toggle')) {
    const btn = e.target;

    const contenedor = btn.closest(
      '.descripcion-personaje-seleccionado, .descripcion-personaje-alt'
    );
    if (!contenedor) return;

    const vistas = contenedor.querySelectorAll('.vista');
    vistas.forEach((v) => v.classList.toggle('active'));

    btn.textContent =
      btn.textContent === 'Preguntas frecuentes' ? 'Ver Descripción' : 'Preguntas frecuentes';
  }
});
