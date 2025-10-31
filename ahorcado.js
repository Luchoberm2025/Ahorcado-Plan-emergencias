let nombre = "";
let puntaje = 0;
let participantes = JSON.parse(localStorage.getItem("participantes")) || [];

const palabras = [
  { clave: "Plan de Respuesta ante Emergencias", pista: "Documento que define y formaliza las acciones a desarrollar en la atención a situaciones que pudieran llegar a presentarse en las instalaciones de la Universidad. (5 palabras)" },
  { clave: "Amenaza", pista: "Es un evento potencial que puede causar daño a las personas, bienes, procesos o al entorno. (1 palabra)" },
  { clave: "Vulnerabilidad", pista: "Es la susceptibilidad que tiene una persona, infraestructura o sistema de ser afectado por una amenaza. (1 palabra)" },
  { clave: "Peligro", pista: "Es una condición o situación que puede convertirse en una amenaza si no se controla. (1 palabra)" },
  { clave: "Riesgo", pista: "Es la probabilidad de que una amenaza afecte a una población vulnerable, generando consecuencias negativas. (1 palabra)" },
  { clave: "Emergencia", pista: "Es una situación inesperada que requiere una respuesta inmediata para proteger la vida, la salud o el entorno. (1 palabra)" },
  { clave: "Brigada", pista: "Grupo de personas capacitadas para actuar en caso de emergencia, según roles específicos. (1 palabra)" },
  { clave: "Alerta", pista: "Es el aviso o señal que indica que una amenaza está próxima o en curso. (1 palabra)" },
  { clave: "Plan Escolar de Emergencia", pista: "Es un documento técnico y pedagógico que organiza las acciones de prevención, preparación, respuesta y recuperación ante eventos que puedan afectar la integridad física, emocional o estructural de la comunidad educativa. (4 palabras)" },
  { clave: "Ruta de Evacuación", pista: "Es el trayecto previamente definido y señalizado que deben seguir las personas para salir de manera segura de una edificación o espacio ante una emergencia. (3 palabras)" },
  { clave: "Punto de Encuentro", pista: "Es el lugar seguro, abierto y previamente definido donde se reúnen las personas después de evacuar, para facilitar el conteo, atención y coordinación. (3 palabras)" }
];

let indice = 0;
let errores = 0;
let aciertos = 0;
let intentosRestantes = 4;

function iniciarJuego() {
  const input = document.getElementById("nombreJugador");
  nombre = input.value.trim();
  if (nombre === "") {
    alert("Por favor ingresa tu nombre.");
    return;
  }
  document.getElementById("pantalla-inicio").style.display = "none";
  document.getElementById("juego").style.display = "block";
  document.getElementById("btnSiguiente").style.display = "none";
  document.getElementById("nombreVisible").innerText = `👤 Participante: ${nombre}`;
  mostrarPalabra();
}

function mostrarPalabra() {
  const palabra = palabras[indice].clave.toUpperCase();
  const pista = palabras[indice].pista;
  intentosRestantes = 4;
  document.getElementById("pista").innerText = `Pista: ${pista}`;

  const palabraMostrada = palabra.split("").map(caracter => {
    return caracter === " " ? " " : "_";
  });

  document.getElementById("palabra").innerText = palabraMostrada.join("");
  document.getElementById("intentos").innerText = `Intentos restantes: ${intentosRestantes}`;
  document.getElementById("resultado").innerText = "";
  document.getElementById("btnSiguiente").style.display = "none";
  document.getElementById("imagenAhorcado").src = "ahorcado0.png";
  generarTeclado(palabra);
}

function generarTeclado(palabra) {
  const teclado = document.getElementById("teclado");
  teclado.innerHTML = "";

  const letras = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  const numeros = "0123456789";

  const filaLetras = document.createElement("div");
  filaLetras.className = "fila-teclado";

  letras.split("").forEach(letra => {
    const btn = document.createElement("button");
    btn.innerText = letra;
    btn.classList.add("tecla");
    btn.onclick = () => verificarLetra(letra, palabra, btn);
    filaLetras.appendChild(btn);
  });

  const filaNumeros = document.createElement("div");
  filaNumeros.className = "fila-teclado";

  numeros.split("").forEach(letra => {
    const btn = document.createElement("button");
    btn.innerText = letra;
    btn.classList.add("tecla");
    btn.onclick = () => verificarLetra(letra, palabra, btn);
    filaNumeros.appendChild(btn);
  });

  teclado.appendChild(filaLetras);
  teclado.appendChild(filaNumeros);
}

function desactivarTeclado() {
  const botones = document.querySelectorAll("#teclado button.tecla");
  botones.forEach(btn => btn.disabled = true);
}

function verificarLetra(letra, palabra, boton) {
  const palabraActual = palabras[indice].clave.toUpperCase();
  let palabraMostrada = document.getElementById("palabra").innerText.split("");
  let acierto = false;

  palabraActual.split("").forEach((l, i) => {
    if (l === letra) {
      palabraMostrada[i] = letra;
      acierto = true;
    }
  });

  document.getElementById("palabra").innerText = palabraMostrada.join("");

  if (boton.classList.contains("tecla")) {
    boton.disabled = true;
    boton.classList.add(acierto ? "letra-correcta" : "letra-errada");
  }

  if (!acierto && intentosRestantes > 0) {
    intentosRestantes--;
    document.getElementById("intentos").innerText = `Intentos restantes: ${intentosRestantes}`;
    actualizarFiguraAhorcado();
  }

  if (palabraMostrada.join("") === palabraActual) {
    aciertos++;
    puntaje += 10;
    document.getElementById("resultado").innerText = "¡Correcto!";
    desactivarTeclado();
    document.getElementById("btnSiguiente").style.display = "block";
  } else if (intentosRestantes === 0) {
    errores++;
    const letrasAdivinadas = palabraMostrada.filter(l => l !== "_").length;
    if (letrasAdivinadas > 0) {
      puntaje += 5;
    }
    document.getElementById("resultado").innerText = `Fallaste. La palabra era: ${palabraActual}`;
    desactivarTeclado();
    document.getElementById("btnSiguiente").style.display = "block";
    actualizarFiguraAhorcado();
  }
}

function siguientePalabra() {
  indice++;
  if (indice < palabras.length) {
    mostrarPalabra();
  } else {
    participantes.push({ nombre, puntaje });
    localStorage.setItem("participantes", JSON.stringify(participantes));

    const ranking = participantes.sort((a, b) => b.puntaje - a.puntaje);

    let tabla = "<h3>🏆 Récord de participantes</h3><table border='1' style='margin:auto'><tr><th>Posición</th><th>Nombre</th><th>Puntaje</th></tr>";
    ranking.forEach((p, i) => {
      tabla += `<tr><td>${i + 1}</td><td>${p.nombre}</td><td>${p.puntaje}</td></tr>`;
    });
    tabla += "</table>";

    document.getElementById("pista").innerText = "";
    document.getElementById("palabra").innerText = "";
    document.getElementById("teclado").innerHTML = "";
    document.getElementById("intentos").innerText = "";
    document.getElementById("resultado").innerHTML = `
      <h2>✅ Juego terminado</h2>
      <p><strong>Participante:</strong> ${nombre}</p>
      <p><strong>Aciertos:</strong> ${aciertos} de ${palabras.length}</p>
      <p><strong>Puntaje total:</strong> ${puntaje} puntos</p>
      <p>📘 <em>Recuerda que el conocimiento normativo fortalece la cultura de la prevención en tu entorno laboral.</em></p>
      <p>🛡️ Sigue explorando el SG-SST y su marco legal para tomar decisiones informadas y seguras.</p>
      ${tabla}
    `;

    document.getElementById("btnSiguiente").style.display = "none";
  }
}

function actualizarFiguraAhorcado() {
  const imagen = document.getElementById("imagenAhorcado");
  const nivel = 4 - intentosRestantes
  imagen.src = `ahorcado${nivel}.png`;
  }
