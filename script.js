/*
 * script.js
 *
 * This file drives the interactive microscope book.  It defines a sequence
 * of "pages" and handles navigation between them.  Some pages include
 * simple drawing canvases where Isabella can sketch her observations.  There
 * are also basic interactive games and mini‑quizzes.  The narrative and
 * structure mirror the PDF version of the book.
 */

// Define the sequence of pages.  Each entry contains an HTML string.  The
// navigation system will insert one page at a time into the main content
// area.  Drawing canvases and buttons will be set up dynamically after
// insertion.
const pages = [];

// --- Title page ---
pages.push({
  title: 'Portada',
  html: `
    <div class="page-content" style="text-align:center;">
      <h2>Isabella y el Mundo en Miniatura</h2>
      <p style="font-size:1.2rem;">Un libro de aventuras microscópicas</p>
      <img src="assets/isabella.png" alt="Isabella" class="cover-img" style="max-width:60%;margin-top:1rem;">
      <p style="margin-top:1rem;font-size:1rem;color:#546E7A;">¡Feliz cumpleaños, Isa!</p>
    </div>
  `
});

// --- Introduction pages ---
pages.push({
  title: 'Bienvenida',
  html: `
    <div class="page-content">
      <h2>¡Bienvenida al Mundo en Miniatura!</h2>
      <div style="display:flex;align-items:flex-start;">
        <img src="assets/profelupa.png" alt="Profe Lupa" style="width:120px;height:120px;margin-right:1rem;">
        <p style="font-size:1.1rem;">Hola Isabella, soy el <strong>Profe Lupa</strong> 🐹🔍 y te acompañaré en esta aventura. Un microscopio es como una lupa poderosa que nos permite ver cosas muy pequeñitas que nuestros ojos no pueden. ¡Con él descubriremos un mundo secreto lleno de sorpresas!</p>
      </div>
      <p style="background:#C5CAE9;color:#303F9F;padding:1rem;border-radius:8px;margin-top:1rem;">¿Estás lista para ser una pequeña científica? ¡Vamos a aprender cómo usar tu microscopio!</p>
    </div>
  `
});

pages.push({
  title: 'Partes del Microscopio',
  html: `
    <div class="page-content">
      <h2>Partes del Microscopio</h2>
      <div style="display:flex;align-items:flex-start;">
        <img src="assets/microscope.png" alt="Microscopio" style="width:200px;margin-right:1rem;">
        <ul style="font-size:1.1rem;line-height:1.4;">
          <li><strong>Ocular</strong>: el lente por donde miras.</li>
          <li><strong>Objetivos</strong>: lentes de diferentes aumentos que acercan lo que ves.</li>
          <li><strong>Tornillo de enfoque</strong>: lo giras para ver nítido.</li>
          <li><strong>Platina</strong>: la mesita donde colocas la muestra.</li>
          <li><strong>Fuente de luz</strong>: ilumina lo que observas.</li>
        </ul>
      </div>
    </div>
  `
});

pages.push({
  title: 'Uso Seguro',
  html: `
    <div class="page-content">
      <h2>Uso Seguro del Microscopio</h2>
      <ol style="font-size:1.1rem;line-height:1.5;">
        <li>Coloca el microscopio en una mesa estable.</li>
        <li>Usa ambas manos para transportarlo y nunca toques las lentes con los dedos.</li>
        <li>No mires nunca al sol a través del microscopio y apaga la luz cuando no lo uses.</li>
        <li>Lava tus manos después de manipular muestras y descarta los materiales con cuidado.</li>
        <li>Siempre pide ayuda a un adulto para preparar las muestras y manejar objetos.</li>
      </ol>
      <p style="background:#FFE0B2;color:#E65100;padding:0.8rem;border-radius:8px;">Recuerda: cuidar tu microscopio lo mantiene listo para nuevas aventuras.</p>
    </div>
  `
});

// Helper to create a challenge page object
function makeChallenge(chapterNumber, challengeNumber, instruction) {
  return {
    title: `Desafío ${challengeNumber}`,
    html: `
      <div class="challenge">
        <div class="challenge-title">Desafío ${challengeNumber}</div>
        <div class="challenge-instruction">${instruction}</div>
        <div class="draw-area">
          <div class="canvas-wrapper">
            <canvas></canvas>
          </div>
        </div>
        <button class="clear-btn">Limpiar dibujo</button>
        <p style="margin-top:0.5rem;color:#004D40;">¡Buen trabajo! Anota tus sorpresas y curiosidades.</p>
      </div>
    `
  };
}

// Helper to create a chapter header page
function makeChapterHeader(number, title, description, image) {
  return {
    title: `Capítulo ${number}`,
    html: `
      <div class="chapter-header">
        <h2>Capítulo ${number}: ${title}</h2>
        <p style="font-size:1.1rem;">${description}</p>
        <img src="assets/isabella.png" alt="Isabella" style="width:180px;display:block;margin-top:1rem;">
      </div>
    `
  };
}

// Helper to create a games/quiz page
function makeGameQuizPage(chapterNumber, objects, quiz) {
  // Build lists for games
  const objsList = objects.map(obj => `<li>${obj}</li>`).join('');
  const colourList = objects.map(obj => `<li>${obj}: <input type="text" placeholder="Color" style="width:6rem;"></li>`).join('');
  // Build quiz questions
  const quizHtml = quiz.map((q, idx) => {
    const opts = q.options.map(opt => `<label style="display:block;"><input type="radio" name="q${chapterNumber}_${idx}"> ${opt}</label>`).join('');
    return `<div class="question"><p>${q.question}</p>${opts}</div>`;
  }).join('');
  return {
    title: `Juegos y Quiz ${chapterNumber}`,
    html: `
      <div class="game">
        <h3>Encuentra la muestra correcta</h3>
        <p>Marca o busca estos objetos en tu entorno:</p>
        <ul>${objsList}</ul>
      </div>
      <div class="game">
        <h3>Adivina el color</h3>
        <p>¿De qué color ves estas muestras bajo el microscopio?</p>
        <ul>${colourList}</ul>
      </div>
      <div class="quiz">
        <h3>Mini Quiz</h3>
        ${quizHtml}
      </div>
    `
  };
}

// Helper to create a blank drawing page
function makeBlankPage() {
  return {
    title: 'Dibujo libre',
    html: `
      <div class="challenge">
        <div class="challenge-title">Página de dibujo</div>
        <div class="challenge-instruction">Aquí puedes dibujar tus propias observaciones. ¡Deja volar tu imaginación!</div>
        <div class="draw-area">
          <div class="canvas-wrapper"><canvas></canvas></div>
        </div>
        <button class="clear-btn">Limpiar dibujo</button>
      </div>
    `
  };
}

// Helper to create the diploma page
function makeDiplomaPage() {
  return {
    title: 'Diploma',
    html: `
      <div class="diploma">
        <h2>Diploma de Ciencia</h2>
        <p style="font-size:1.2rem;">Otorgado a Isabella</p>
        <p style="margin:1rem 0;">Por sus estudios excelentes en el mundo de las cosas chiquitas.<br>
        Completaste todos los desafíos, desde la arena de plaza hasta la savita de árbol.<br>
        ¡Eres una científica de primera!</p>
        <div style="display:flex;justify-content:space-around;align-items:center;margin:1rem 0;">
          <img src="assets/profelupa.png" alt="Profe Lupa">
          <img src="assets/microscope.png" alt="Microscopio" style="max-width:25%;">
        </div>
        <p style="font-style:italic;">Firmado: Profe Lupa y el Microscopio Mágico</p>
      </div>
    `
  };
}

// Data for chapters (matching the PDF)
const chaptersData = [
  {
    number: 1,
    title: 'Mis Primeros Pasos',
    description: 'En este capítulo conocerás objetos muy comunes como la sal, el azúcar y hojas. Aprenderás a ajustar tu microscopio y a dibujar lo que ves.',
    challenges: [
      'Observa un grano de sal. ¿Es cuadrada, redonda? Dibuja lo que ves.',
      'Compara sal y azúcar. ¿Son iguales? ¿Qué color tienen bajo la lupa?',
      'Pide a un adulto que te ayude a separar una capa fina de cebolla. Colócala en el microscopio. ¿Ves líneas o celdas? Dibuja su forma.',
      'Usa un hisopo para recoger polvo de un mueble. ¿Qué formas ves? ¿Parecen estrellas, rayas o puntos?',
      'Toma un trozo de hoja seca. ¿Tiene venas? ¿De qué color son?'
    ],
    objects: ['Sal', 'Azúcar', 'Cebolla', 'Polvo', 'Hoja seca'],
    quiz: [
      { question: '¿Qué parte usas para enfocar el microscopio?', options: ['a) Tornillo de la derecha', 'b) Luz'] },
      { question: '¿Qué debes hacer después de usar el microscopio?', options: ['a) Lavarte las manos', 'b) Comer chocolate'] }
    ]
  },
  {
    number: 2,
    title: 'Explorando el Jardín',
    description: 'Explora pétalos, plumas y granos de arena. ¡El jardín esconde muchas texturas y colores sorprendentes!',
    challenges: [
      'Recoge un pétalo de rosa roja. ¿Es liso o con textura? ¿De qué color es bajo el microscopio?',
      'Busca una pluma de paloma o gorrión. ¿Tiene pelitos? ¿De qué color es?',
      'Recoge un poco de arena de la plaza del barrio. ¿Son todas las partículas del mismo tamaño? ¿Qué colores ves?',
      'Abre una semilla de girasol. ¿Qué hay dentro? ¿Parecen trocitos de madera o algo más?',
      'Coloca una gota de agua de un charco en un portaobjetos. ¿Ves cositas moviéndose?'
    ],
    objects: ['Pétalo', 'Pluma', 'Arena', 'Semilla', 'Agua'],
    quiz: [
      { question: '¿Qué debes usar para recoger una gota de agua?', options: ['a) Una cuchara', 'b) Un gotero'] },
      { question: '¿La arena de la plaza es toda del mismo color?', options: ['a) Sí', 'b) No'] }
    ]
  },
  {
    number: 3,
    title: 'En la Cocina y el Baño',
    description: 'Ahora vamos al interior de casa: leche, pasta de dientes y lana son nuestros protagonistas. ¡Descubre sus secretos!',
    challenges: [
      'Pon una gota de leche en el portaobjetos. ¿Es transparente? ¿Ves gotitas pequeñas?',
      'Usa un palillo para poner un poco de pasta de dientes. ¿Es espesa? ¿De qué color y forma?',
      'Observa un hilo de lana. ¿Es liso o con pelitos? ¿Cómo se ve?',
      'Lava y seca un trozo de cáscara de huevo. ¿Es suave o rugosa? ¿De qué color y textura?',
      'Con un hisopo limpio, toca tu lengua y coloca la muestra en el portaobjetos. ¿Ves algo?'
    ],
    objects: ['Leche', 'Pasta', 'Lana', 'Huevo', 'Saliva'],
    quiz: [
      { question: '¿De dónde proviene la lana?', options: ['a) De una oveja', 'b) De una planta'] },
      { question: '¿Qué debes usar para tomar saliva?', options: ['a) Un hisopo limpio', 'b) Tus dedos'] }
    ]
  },
  {
    number: 4,
    title: 'El Bosque y el Parque',
    description: 'En este capítulo observaremos hormigas, musgos y gotas de lluvia. ¡Prepara tu lupa para explorar la naturaleza!',
    challenges: [
      'Con una lupa, captura una hormiga en un frasco transparente (sin dañarla) y obsérvala. ¿Cuántas patas tiene? ¿Cómo son sus antenas?',
      'Recoge un trozo de musgo. ¿Es suave? ¿Ves pequeñas hojas o tallos?',
      'Toma un pelo de tu mascota. ¿Es liso o rizado? ¿De qué color bajo el microscopio?',
      'Observa una gota de agua de lluvia. ¿Ves cositas flotando? Son polvo o polen de plantas.',
      'Con un hisopo, raspa un poco de savita de un árbol. ¿Es pegajosa? ¿De qué color?'
    ],
    objects: ['Hormiga', 'Musgo', 'Pelo', 'Lluvia', 'Savita'],
    quiz: [
      { question: '¿Cuántas patas tiene una hormiga?', options: ['a) 2', 'b) 6'] },
      { question: '¿Qué puedes ver en la savita de un árbol?', options: ['a) Es pegajosa', 'b) Es seca'] }
    ]
  },
  {
    number: 5,
    title: '¡Desafíos de Ciencia!',
    description: 'El capítulo final te propone comparar, experimentar y crear tu propio experimento. ¡Tu curiosidad no tiene límites!',
    challenges: [
      'Observa sal y azúcar en el microscopio. ¿En qué se parecen? ¿En qué son diferentes? Dibuja ambos y escribe 3 diferencias.',
      'Observa una hoja de planta y un pelo de mascota. ¿Cómo son sus celdas? La hoja tiene celdas como ladrillos, el pelo es liso y largo.',
      'Coloca un poco de tierra de maceta en un portaobjetos, riega con una gota de agua y cubre. Observa cada 2 días: ¿Crecen cositas verdes?',
      'Prueba con sal, azúcar y tierra. Coloca un poco en agua, agita y observa una gota bajo el microscopio. ¿Qué se disolvió? ¿Qué no?',
      'Elige una muestra que te guste (una flor, una piedra, un insecto). Observa, dibuja y escribe un informe de 3 frases: ¿Qué viste? ¿Te sorprendió algo? ¿Qué quieres saber ahora?'
    ],
    objects: ['Sal vs Azúcar', 'Hoja vs Pelo', 'Micro-jardín', 'Disoluciones', 'Mi muestra'],
    quiz: [
      { question: '¿Qué necesitas para hacer un micro-jardín?', options: ['a) Agua y tierra', 'b) Azúcar y papel'] },
      { question: '¿Qué se disuelve en agua?', options: ['a) Tierra', 'b) Sal'] }
    ]
  }
];

// Populate pages array with chapter pages
chaptersData.forEach(chap => {
  // Chapter header
  pages.push(makeChapterHeader(chap.number, chap.title, chap.description));
  // Challenges
  chap.challenges.forEach((instr, idx) => {
    pages.push(makeChallenge(chap.number, idx + 1, instr));
  });
  // Games/Quiz page
  pages.push(makeGameQuizPage(chap.number, chap.objects, chap.quiz));
});

// Add blank pages (5)
for (let i = 0; i < 5; i++) {
  pages.push(makeBlankPage());
}

// Diploma page
pages.push(makeDiplomaPage());

let currentPage = 0;

function renderPage() {
  const main = document.getElementById('content');
  main.innerHTML = '';
  const data = pages[currentPage];
  const pageDiv = document.createElement('div');
  pageDiv.className = 'page active';
  pageDiv.innerHTML = data.html;
  main.appendChild(pageDiv);
  // Update header title for context (optional)
  const headerTitle = document.getElementById('headerTitle');
  if (data.title) {
    headerTitle.textContent = data.title;
  }
  // Update page indicator and button states
  const indicator = document.getElementById('pageIndicator');
  indicator.textContent = `${currentPage + 1} / ${pages.length}`;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
  // Setup drawing canvas if present
  const canvas = pageDiv.querySelector('canvas');
  if (canvas) {
    setupCanvas(canvas);
    // Handle clear button
    const clearBtn = pageDiv.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      });
    }
  }
}

function setupCanvas(canvas) {
  // Set canvas size to its displayed size
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#3E2723';
  let drawing = false;
  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener('mousedown', e => {
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });
  window.addEventListener('mouseup', () => {
    drawing = false;
  });
}

// Navigation handlers
document.addEventListener('DOMContentLoaded', () => {
  renderPage();
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    }
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPage < pages.length - 1) {
      currentPage++;
      renderPage();
    }
  });
});