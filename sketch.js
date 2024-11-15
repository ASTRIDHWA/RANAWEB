let scale;
let balls = [];
let selectedBall = null;
let gravity = 0.2; // Fuerza de gravedad
let friction = 0.98; // Fricción para desacelerar las bolas
let playerScores = [0, 0]; // Puntuaciones de los jugadores
let currentPlayer = 0; // Jugador actual (0 para Jugador 1, 1 para Jugador 2)
let holes = []; // Agujeros con sus puntos
let gameFinished = false; // Estado del juego
let resetButton;
const aspectRatio = 9 / 19.5;
let canvasWidth, canvasHeight;
// Dimensiones base para calcular escalado
const baseWidth = 412;
const baseHeight = 917;

function adjustCanvasSize() {
  let windowAspect = windowWidth / windowHeight;
  if (windowAspect > aspectRatio) {
    canvasHeight = windowHeight;
    canvasWidth = canvasHeight * aspectRatio;
  } else {
    canvasWidth = windowWidth;
    canvasHeight = canvasWidth / aspectRatio;
  }
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;
  let scale = min(scaleX, scaleY); // Usar el menor factor de escala para uniformidad
}

function setup() {
  adjustCanvasSize();
  createCanvas(canvasWidth, canvasHeight);
  textFont("Jaro");
  initializeBalls();
}

// Define los agujeros y sus puntos (con sus posiciones originales)
holes = [
  { x: 65, y: 280, radius: 30, points: 100 }, // rana izquierda 100
  { x: 205, y: 270, radius: 40, points: 200 }, // rana 200
  { x: 343, y: 280, radius: 30, points: 100 }, // rana derecha 100
  { x: 130, y: 345, radius: 20, points: 30 }, // agujero 30 izquierda arriba
  { x: 275, y: 345, radius: 20, points: 30 }, // agujero 30 derecha arriba
  { x: 65, y: 407, radius: 20, points: 40 }, // agujero 40 izquierda
  { x: 343, y: 407, radius: 20, points: 40 }, // agujero 40 derecho
  { x: 205, y: 407, radius: 20, points: 150 }, // agujero 150
  { x: 130, y: 465, radius: 20, points: 50 }, // agujero 50 izquierdo
  { x: 275, y: 465, radius: 20, points: 50 }, // agujero 50 derecho
  { x: 65, y: 530, radius: 20, points: 30 }, // agujero 30 izquierdo
  { x: 343, y: 530, radius: 20, points: 30 }, // agujero 30 derecho
];

// Añadir el evento para prevenir el desplazamiento
document.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);

function initializeBalls() {
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;
  let scale = min(scaleX, scaleY); // Usar el menor factor de escala para uniformidad

  balls = []; //llama a la variable
  for (let i = 0; i < 6; i++) {
    balls.push({
      x: (50 + i * 60) * scale,
      y: (baseHeight - 50) * scale,
      radius: 20 * scale,
      vx: 0,
      vy: 0,
      launched: false,
    });
  } //i cuenta cuantas bola ha tirado asi se sabe si termina el turno o no
}

function draw() {
  background(80, 151, 104);

  if (gameFinished) {
    displayWinner();
  } else {
    drawInterface();
    updateBalls();
    drawBalls();
  } // si el jugador completa los puntos póner la pantalla de ganar sino cargar el layout
}

function drawInterface() {
  // Calcular factores de escala
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;
  let scale = min(scaleX, scaleY); // Usar un solo factor de escala uniforme

  // Interfaz ajustada a la ventana

  textFont("jaro");
  noStroke();
  fill(43, 105, 176);
  rect(
    13 * scale,
    127 * scale,
    385 * scale,
    707 * scale,
    29 * scale,
    29 * scale,
    29 * scale,
    29 * scale
  ); // marco azul
  noStroke();
  fill(84, 182, 87);
  rect(
    25 * scale,
    240 * scale,
    358 * scale,
    563 * scale,
    29 * scale,
    29 * scale,
    29 * scale,
    29 * scale
  ); // marco verde

  // MARCO DE JUGADOR 1 //
  noStroke();
  fill(227, 240, 255);
  rect(
    13 * scale,
    14 * scale,
    185 * scale,
    103 * scale,
    16 * scale,
    16 * scale,
    16 * scale,
    16 * scale
  ); // marco blanco
  noStroke();
  fill(216, 193, 102);
  rect(
    13 * scale,
    14 * scale,
    185 * scale,
    36 * scale,
    16 * scale,
    16 * scale,
    0 * scale,
    0 * scale
  ); // borde caja amarillo

  // caja contador puntos jugador 1 y meta //
  noStroke();
  fill(217, 217, 217);
  rect(
    25 * scale,
    61 * scale,
    67 * scale,
    42 * scale,
    6 * scale,
    6 * scale,
    6 * scale,
    6 * scale
  ); // caja puntos jugador 1
  noStroke();
  fill(235, 193, 193);
  rect(
    119 * scale,
    61 * scale,
    67 * scale,
    42 * scale,
    6 * scale,
    6 * scale,
    6 * scale,
    6 * scale
  ); // caja puntos meta 1

  // MARCO DE JUGADOR 2 //
  noStroke();
  fill(227, 240, 255);
  rect(
    213 * scale,
    14 * scale,
    185 * scale,
    103 * scale,
    16 * scale,
    16 * scale,
    16 * scale,
    16 * scale
  ); // marco blanco
  noStroke();
  fill(216, 102, 103);
  rect(
    213 * scale,
    14 * scale,
    185 * scale,
    36 * scale,
    16 * scale,
    16 * scale,
    0 * scale,
    0 * scale
  ); // borde caja rojo

  // caja contador puntos jugador 2 y meta //
  noStroke();
  fill(217, 217, 217);
  rect(
    226 * scale,
    61 * scale,
    67 * scale,
    42 * scale,
    6 * scale,
    6 * scale,
    6 * scale,
    6 * scale
  ); // caja puntos jugador 2
  noStroke();
  fill(235, 193, 193);
  rect(
    321 * scale,
    61 * scale,
    67 * scale,
    42 * scale,
    6 * scale,
    6 * scale,
    6 * scale,
    6 * scale
  ); // caja puntos meta 1

  // RANA GRANDE //
  fill(85, 132, 87);
  stroke(35, 66, 36);
  strokeWeight(1 * scale);
  ellipse(205 * scale, 269 * scale, 68 * scale, 68 * scale);
  noStroke();
  fill(16, 28, 16);
  ellipse(205 * scale, 270 * scale, 40 * scale, 40 * scale); // cuerpo rana y boca
  // ojo izquierdo//
  noStroke();
  fill(42, 74, 43);
  ellipse(178 * scale, 243 * scale, 23 * scale, 23 * scale); //borde base ojo
  noStroke();
  fill(85, 132, 86);
  ellipse(179 * scale, 244 * scale, 22 * scale, 22 * scale); //base ojo
  noStroke();
  fill(215, 243, 216);
  ellipse(179 * scale, 244 * scale, 17 * scale, 17 * scale); //esclera
  noStroke();
  fill(16, 28, 16);
  ellipse(179 * scale, 244 * scale, 12 * scale, 12 * scale); //pupila
  noStroke();
  fill(215, 243, 216);
  ellipse(180 * scale, 241 * scale, 4 * scale, 4 * scale); //brillo pupila
  // ojo derecho//
  noStroke();
  fill(42, 74, 43);
  ellipse(229 * scale, 243 * scale, 23 * scale, 23 * scale); //borde base ojo
  noStroke();
  fill(85, 132, 86);
  ellipse(228 * scale, 244 * scale, 22 * scale, 22 * scale); //base ojo
  noStroke();
  fill(215, 243, 216);
  ellipse(228 * scale, 244 * scale, 17 * scale, 17 * scale); //esclera
  noStroke();
  fill(16, 28, 16);
  ellipse(228 * scale, 244 * scale, 12 * scale, 12 * scale); //pupila
  noStroke();
  fill(215, 243, 216);
  ellipse(228 * scale, 241 * scale, 4 * scale, 4 * scale); //brillo pupila

  // RANA IZQUIERDA //
  fill(85, 132, 87);
  stroke(35, 66, 36);
  strokeWeight(1 * scale);
  ellipse(65 * scale, 279 * scale, 51 * scale, 51 * scale);
  noStroke();
  fill(16, 28, 16);
  ellipse(65 * scale, 280 * scale, 30 * scale, 30 * scale); // cuerpo rana y boca
  // ojo izquierdo//
  noStroke();
  fill(42, 74, 43);
  ellipse(45 * scale, 255 * scale, 20 * scale, 20 * scale); //borde base ojo
  noStroke();
  fill(85, 132, 86);
  ellipse(46 * scale, 256 * scale, 18 * scale, 18 * scale); //base ojo
  noStroke();
  fill(215, 243, 216);
  ellipse(46 * scale, 256 * scale, 13 * scale, 13 * scale); //esclera
  noStroke();
  fill(16, 28, 16);
  ellipse(46 * scale, 256 * scale, 9 * scale, 9 * scale); //pupila

  // ojo derecho//
  noStroke();
  fill(42, 74, 43);
  ellipse(85 * scale, 255 * scale, 20 * scale, 20 * scale); //borde base ojo
  noStroke();
  fill(85, 132, 86);
  ellipse(84 * scale, 256 * scale, 18 * scale, 18 * scale); //base ojo
  noStroke();
  fill(215, 243, 216);
  ellipse(84 * scale, 256 * scale, 13 * scale, 13 * scale); //esclera
  noStroke();
  fill(16, 28, 16);
  ellipse(84 * scale, 256 * scale, 9 * scale, 9 * scale); //pupila

  // RANA DERECHA //
  fill(85, 132, 87);
  stroke(35, 66, 36);
  strokeWeight(1 * scale);
  ellipse(343 * scale, 279 * scale, 51 * scale, 51 * scale);
  noStroke();
  fill(16, 28, 16);
  ellipse(343 * scale, 280 * scale, 30 * scale, 30 * scale); // cuerpo rana y boca
  // ojo izquierdo//
  noStroke();
  fill(42, 74, 43);
  ellipse(325 * scale, 255 * scale, 20 * scale, 20 * scale); //borde base ojo
  noStroke();
  fill(85, 132, 86);
  ellipse(326 * scale, 257 * scale, 18 * scale, 18 * scale); //base ojo
  noStroke();
  fill(215, 243, 216);
  ellipse(326 * scale, 257 * scale, 13 * scale, 13 * scale); //esclera
  noStroke();
  fill(16, 28, 16);
  ellipse(326 * scale, 257 * scale, 9 * scale, 9 * scale); //pupila
  // ojo derecho//
  noStroke();
  fill(42, 74, 43);
  ellipse(360 * scale, 255 * scale, 20 * scale, 20 * scale); //borde base ojo
  noStroke();
  fill(85, 132, 86);
  ellipse(359 * scale, 256 * scale, 18 * scale, 18 * scale); //base ojo
  noStroke();
  fill(215, 243, 216);
  ellipse(359 * scale, 256 * scale, 13 * scale, 13 * scale); //esclera
  noStroke();
  fill(16, 28, 16);
  ellipse(359 * scale, 256 * scale, 9 * scale, 9 * scale); //pupila

  //AGUJEROS DE RANA//
  noStroke();
  fill(42, 74, 43);
  ellipse(130 * scale, 345 * scale, 40 * scale, 40 * scale); // Izquierda arriba 30
  noStroke();
  fill(42, 74, 43);
  ellipse(275 * scale, 345 * scale, 40 * scale, 40 * scale); //derecha arriba 30
  noStroke();
  fill(42, 74, 43);
  ellipse(65 * scale, 407 * scale, 40 * scale, 40 * scale); // Izquierda 40
  noStroke();
  fill(42, 74, 43);
  ellipse(343 * scale, 407 * scale, 40 * scale, 40 * scale); //derecha 40
  noStroke();
  fill(42, 74, 43);
  ellipse(205 * scale, 407 * scale, 40 * scale, 40 * scale); // centro 150
  noStroke();
  fill(42, 74, 43);
  ellipse(130 * scale, 465 * scale, 40 * scale, 40 * scale); // Izquierda 50
  noStroke();
  fill(42, 74, 43);
  ellipse(275 * scale, 465 * scale, 40 * scale, 40 * scale); //derecha 50
  noStroke();
  fill(42, 74, 43);
  ellipse(65 * scale, 530 * scale, 40 * scale, 40 * scale); // Izquierda bajo 30
  noStroke();
  fill(42, 74, 43);
  ellipse(343 * scale, 530 * scale, 40 * scale, 40 * scale); //derecha bajo 30

  // TEXTO PUNTUACIONES//
  fill(255, 255, 255);
  textSize(20 * scale); //color tamaño texto jugadores
  text("Jugador 1", 25 * scale, 40 * scale); // posicion texto
  text("Jugador 2", 230 * scale, 40 * scale); //posicion texto
  fill(0, 0, 0);
  textSize(24 * scale); //color tamaño de puntaje
  text(playerScores[0], 39 * scale, 90 * scale); // Puntos Jugador 1
  text(playerScores[1], 240 * scale, 90 * scale); // Puntos Jugador 2
  fill(200, 80, 81);
  textSize(24 * scale); //color de 500
  text("500", 130 * scale, 90 * scale); // izquierda
  text("500", 330 * scale, 90 * scale); // izquierda
  fill(255, 255, 255);
  textSize(48 * scale); //parametros texto RANAWEB
  text("RANAWEB", 110 * scale, 200 * scale); // izquierda
  fill(222, 252, 223);
  textSize(24 * scale); //parametros texto puntos agujeros
  text("100", 46 * scale, 335 * scale);
  text("100", 325 * scale, 335 * scale);
  text("200", 185 * scale, 325 * scale);
  text("30", 117 * scale, 390 * scale);
  text("30", 261 * scale, 390 * scale);
  text("40", 51 * scale, 452 * scale);
  text("40", 330 * scale, 452 * scale);
  text("150", 191 * scale, 458 * scale);
  text("50", 119 * scale, 510 * scale);
  text("50", 264 * scale, 510 * scale);
  text("30", 51 * scale, 575 * scale);
  text("30", 332 * scale, 575 * scale);
}

//
function drawBalls() {
  noStroke();
  fill(232, 249, 233);
  for (let ball of balls) {
    if (!ball.launched || ball.y < height - ball.radius) {
      ellipse(ball.x, ball.y, ball.radius * 2);
    } // muestra las bolas, y si estas han sido lanzadas y tocado un hole ya no las muestra
  }
}

//INTERACTIVIDAD//
function touchStarted() {
  if (gameFinished) {
    checkResetButton(); // Verifica si el botón de reinicio fue presionado
    return;
  }

  if (gameFinished) return;
  for (let ball of balls) {
    let d = dist(mouseX, mouseY, ball.x, ball.y);
    if (d < ball.radius) {
      selectedBall = ball;
      return false;
    } // si el juego termina para un jugador inica el otro y asi en bucle
  }
}

function touchMoved() {
  if (selectedBall) {
    selectedBall.x = mouseX;
    selectedBall.y = mouseY;
  } //funciona para PC y para celular
}

function touchEnded() {
  if (selectedBall) {
    selectedBall.vx = (mouseX - pmouseX) * 0.3;
    selectedBall.vy = (mouseY - pmouseY) * 0.3;
    selectedBall.launched = true;
    selectedBall = null;
  }
}

function updateBalls() {
  for (let i = balls.length - 1; i >= 0; i--) {
    let ball = balls[i];
    ball.x += ball.vx;
    ball.y += ball.vy;
    ball.vy += gravity;
    ball.vx *= friction;

    if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius;
      ball.vy *= -0.6;
    }

    if (checkCollisionWithHoles(ball, i)) {
      balls.splice(i, 1);
    } else if (ball.launched && abs(ball.vx) < 0.1 && abs(ball.vy) < 0.1) {
      balls.splice(i, 1);
    }
  }

  if (balls.length === 0) {
    endTurn();
  }
}

function checkCollisionWithHoles(ball, ballIndex) {
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;
  let scale = min(scaleX, scaleY); // Usar el menor factor de escala para uniformidad

  for (let hole of holes) {
    const d = dist(ball.x, ball.y, hole.x * scale, hole.y * scale);

    if (d < ball.radius + hole.radius) {
      playerScores[currentPlayer] += hole.points;
      return true;
    }
  }
  return false;
}

function endTurn() {
  if (playerScores[currentPlayer] >= 500) {
    gameFinished = true;
    return;
  } //termina el juego

  currentPlayer = (currentPlayer + 1) % 2;
  initializeBalls();
}

function displayWinner() {
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;
  let scale = min(scaleX, scaleY); // Usar el menor factor de escala para uniformidad

  fill(255, 255, 255);
  textSize(36 * scale);
  textAlign(CENTER, CENTER);
  let winnerText = `¡Jugador ${currentPlayer + 1} ha ganado!`;
  text(winnerText, width / 2, height / 2);
  drawResetButton();
  console.log((width / 9) * scale, (height / 2) * scale);
} //muestra pantalla de ganador

function drawResetButton() {
  // Calcular el factor de escala
  let scaleX = windowWidth / baseWidth;
  let scaleY = windowHeight / baseHeight;
  let scale = min(scaleX, scaleY); // Usar el menor factor de escala para uniformidad

  // Establecer el centro del botón en el centro del lienzo
  let buttonX = width / 2;
  let buttonY = height / 2 + 150 * scale; // Ajustar la posición verticalmente
  let buttonWidth = 120 * scale;
  let buttonHeight = 60 * scale;

  // Dibujar el rectángulo del botón
  fill(43, 105, 176);
  rectMode(CENTER);
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 30 * scale);

  // Dibujar el texto del botón
  fill(255);
  textSize(20 * scale);
  textAlign(CENTER, CENTER);
  text("Reiniciar", buttonX, buttonY);

  // Definir los límites del botón para la detección de clics
  resetButton = { x: buttonX, y: buttonY, w: buttonWidth, h: buttonHeight };
}

function checkResetButton() {
  if (resetButton) {
    if (
      mouseX > resetButton.x - resetButton.w / 2 &&
      mouseX < resetButton.x + resetButton.w / 2 &&
      mouseY > resetButton.y - resetButton.h / 2 &&
      mouseY < resetButton.y + resetButton.h / 2
    ) {
      resetGame();
    }
  }
}

function resetGame() {
  location.reload();
}
