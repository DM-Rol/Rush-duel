// =============================================
// SCRIPT.JS - Yu-Gi-Oh! Rush Duel Rol
// =============================================
// Estructura:
//   1. Navegación (mostrar secciones / volver)
//   2. Panel de información de carta
//   3. Base de datos de cartas
//   4. Generación de la tienda
//   5. Mostrar carta en el panel (hover)
//   6. Filtros (categoría, rareza, buscador)
//   7. Inicialización
// =============================================


// =============================================
// 1. NAVEGACIÓN
// =============================================

// Oculta el menú y muestra la sección indicada.
// También cierra el panel por si quedó abierto.
function mostrar(seccion) {
    document.getElementById("menuPrincipal").style.display = "none";

    let secciones = document.querySelectorAll("section");
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove("activo");
    }

    document.getElementById(seccion).classList.add("activo");

    // Modo deck: oculta el banner y usa toda la pantalla
    if (seccion === "decks") {
        document.body.classList.add("modo-deck");
        generarListaDecks();
    } else {
        document.body.classList.remove("modo-deck");
    }

    ocultarCarta();
}

// Oculta todas las secciones y vuelve al menú principal.
// También cierra el panel por si quedó abierto.
function volverMenu() {
    let secciones = document.querySelectorAll("section");
    for (let i = 0; i < secciones.length; i++) {
        secciones[i].classList.remove("activo");
    }

    document.getElementById("menuPrincipal").style.display = "flex";
    document.body.classList.remove("modo-deck");
    ocultarCarta();
}


// =============================================
// 2. PANEL DE INFORMACIÓN DE CARTA
// =============================================

// Oculta el panel flotante de información.
function ocultarCarta() {
    document.getElementById("panelInfo").style.display = "none";
    panelCartaAbierto = -1;
}

// Índice de la carta abierta en móvil (-1 = ninguna)
let panelCartaAbierto = -1;

// Devuelve true si la pantalla es de móvil (≤768px)
function esMobil() {
    return window.innerWidth <= 768;
}


// =============================================
// 3. BASE DE DATOS DE CARTAS
// =============================================
// Array con todas las cartas de la tienda.
// Cada carta tiene:
//   nombre      - nombre de la carta
//   categoria   - MONSTER / SPELL / TRAP
//   tipo        - texto del tipo entre corchetes
//   atributo    - LIGHT / DARK / SPELL / TRAP...
//   nivel       - nivel o rango (0 para magias/trampas)
//   rareza      - UR / SR / R / GRATIS
//   atk / def   - estadísticas ("-" si no aplica)
//   descripcion - efecto o flavor text
//   precio      - coste en DP
//   imagen      - ruta a la imagen
//
// SUGERENCIA FUTURA: mover a cartas.json y
// cargar con fetch() cuando haya muchas cartas.
// =============================================

let cartas = [

    {
        nombre: "Dark Magician",
        categoria: "MONSTER",
        tipo: "[ Lanzador de Conjuros / Normal ]",
        atributo: "OSCURIDAD",
        nivel: 7,
        rareza: "UR",
        atk: 2500,
        def: 2100,
        descripcion: "El más grande de los magos en cuanto al ataque y la defensa.",
        precio: "2000 DP",
        imagen: "img/cartas/darkmagician.jpg"
    },

    {
        nombre: "Red-Eyes Black Dragon",
        categoria: "MONSTER",
        tipo: "[ Dragón / Normal ]",
        atributo: "OSCURIDAD",
        nivel: 7,
        rareza: "UR",
        atk: 2400,
        def: 2000,
        descripcion: "Un dragón feroz con un ataque mortal.",
        precio: "1500 DP",
        imagen: "img/cartas/redeyes.jpg"
    },

    {
        nombre: "Gaia The Fierce Knight",
        categoria: "MONSTER",
        tipo: "[ Guerrero / Normal ]",
        atributo: "TIERRA",
        nivel: 7,
        rareza: "UR",
        atk: 2300,
        def: 2100,
        descripcion: "Un caballero cuyo caballo galopa más rápido que el viento. Su carga en la batalla es una fuerza a considerar.",
        precio: "1500 DP",
        imagen: "img/cartas/gaiathe.jpg"
    },

    {
        nombre: "Ultimate Flag Mech Tough Striker",
        categoria: "MONSTER",
        tipo: "[ Máquina / Normal ]",
        atributo: "LUZ",
        nivel: 7,
        rareza: "UR",
        atk: 2500,
        def: 1600,
        descripcion: "Posee un puño invencible capaz de partir una montaña y la bandera de combate llameante arde en su interior. La derrota no existe para su gente.",
        precio: "1500 DP",
        imagen: "img/cartas/ultimateflag.jpg"
    },

    {
        nombre: "Sevens Road Magician",
        categoria: "MONSTER",
        tipo: "[ Lanzador de Conjuros / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 7,
        rareza: "UR",
        atk: 2100,
        def: 1500,
        descripcion: `[Requisito]
Manda al Cementerio la carta de la parte superior de tu Deck.

[Efecto]
Esta carta gana ATK igual [al número de Atributos diferentes en tu Cementerio] x 300 hasta el final de este turno.`,
        precio: "1500 DP",
        imagen: "img/cartas/sevens.jpg"
    },

    {
        nombre: "Multistrike Dragon Dragias",
        categoria: "MONSTER",
        tipo: "[ Dragón / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 7,
        rareza: "UR",
        atk: 2500,
        def: 1500,
        descripcion: `[Requisito]
Manda al Cementerio la carta de la parte superior de tu Deck.

[Efecto]
Si esta carta destruyó un monstruo en batalla este turno, puede hacer un segundo ataque durante esa Battle Phase.`,
        precio: "1500 DP",
        imagen: "img/cartas/dragias.jpg"
    },

    {
        nombre: "Yamiruler the Dark Delayer",
        categoria: "MONSTER",
        tipo: "[ Guerrero / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 8,
        rareza: "UR",
        atk: 2500,
        def: 2500,
        descripcion: `[Requisito]
Durante el turno en que Invocaste esta carta de Modo Normal, cambia su posición de batalla (la Posición de Ataque se convierte en la Posición de Defensa boca arriba, y la Posición de Defensa se convierte en la Posición de Ataque boca arriba).

[Efecto]
Hasta el final del próximo turno del adversario, mientras esta carta esté boca arriba, ningún jugador puede Invocar por Sacrificio monstruos de Nivel 7 o mayor.`,
        precio: "1500 DP",
        imagen: "img/cartas/ruler.jpg"
    },

    {
        nombre: "Steel Mech Lord Mirror Innovator",
        categoria: "MONSTER",
        tipo: "[ Máquina / Efecto ]",
        atributo: "LUZ",
        nivel: 7,
        rareza: "UR",
        atk: 2400,
        def: 1800,
        descripcion: `[Requisito]
Ninguno.

[Efecto]
Elige hasta 3 monstruos en tu Cementerio con el mismo Tipo que esta carta. Esta carta gana ATK igual a [los Niveles totales de esos monstruos] x 100 hasta el final de este turno. A continuación, baraja esos monstruos al Deck. Si has barajado exactamente 1 monstruo por este efecto, esta carta inflige daño de batalla de penetración, si ataca a un monstruo en Posición de Defensa este turno.`,
        precio: "1500 DP",
        imagen: "img/cartas/steelmech.jpg"
    },

    {
        nombre: "Royal Rebel's Heavy Metal",
        categoria: "MONSTER",
        tipo: "[ Demonio / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 8,
        rareza: "UR",
        atk: 2500,
        def: 0,
        descripcion: `[Requisito]
Durante el turno en el que has Invocado de Modo Normal esta carta Sacrificando un monstruo de Nivel 5 o mayor.

[Efecto]
Elige 1 monstruo boca arriba de Nivel 8 o menor con el Nivel más bajo en el Campo de tu adversario, y esta carta gana ATK igual [al ATK de ese monstruo] hasta el final de este turno. Destruye ese monstruo.`,
        precio: "1500 DP",
        imagen: "img/cartas/heavy.jpg"
    },

    {
        nombre: "Kuribot",
        categoria: "MONSTER",
        tipo: "[ Demonio / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 1,
        rareza: "GRATIS",
        atk: 300,
        def: 200,
        descripcion: `[Requisito]
Si no tienes otros monstruos en tu Campo, paga 500 LP.

[Efecto]
Añade a tu mano 1 "Kuribot" en tu Cementerio.`,
        precio: "500 DP",
        imagen: "img/cartas/kuriboh.jpg"
    },

    {
        nombre: "Mystic Dealer",
        categoria: "MONSTER",
        tipo: "[ Lanzador de Conjuros / Efecto ]",
        atributo: "AGUA",
        nivel: 3,
        rareza: "GRATIS",
        atk: 1000,
        def: 0,
        descripcion: `[Requisito]
Manda al Cementerio 1 monstruo de Tipo Lanzador de Conjuros en tu mano.

[Efecto]
CRoba 1 carta.`,
        precio: "500 DP",
        imagen: "img/cartas/mystic.jpg"
    },

    {
        nombre: "Cobalt Cobolt",
        categoria: "MONSTER",
        tipo: "[ Demonio / Efecto ]",
        atributo: "FUEGO",
        nivel: 3,
        rareza: "GRATIS",
        atk: 1000,
        def: 0,
        descripcion: `[Requisito]
Manda al Cementerio 1 monstruo de Tipo Demonio en tu mano.

[Efecto]
Roba 1 carta.`,
        precio: "500 DP",
        imagen: "img/cartas/cobaltcobolt.jpg"
    },

    {
        nombre: "Magical Stream",
        categoria: "SPELL",
        tipo: "[ Magia Normal ]",
        atributo: "SPELL",
        nivel: 0,
        rareza: "GRATIS",
        atk: "-",
        def: "-",
        descripcion: `[Requisito]
Tienes un monstruo de Tipo Lanzador de Conjuros boca arriba en tu Campo.

[Efecto]
Destruye 1 Carta Mágica/de Trampa del Campo de tu adversario.`,
        precio: "500 DP",
        imagen: "img/cartas/magicalstream.jpg"
    },

    {
        nombre: "Dragon's Inferno",
        categoria: "SPELL",
        tipo: "[ Magia Normal ]",
        atributo: "SPELL",
        nivel: 0,
        rareza: "GRATIS",
        atk: "-",
        def: "-",
        descripcion: `[Requisito]
Tienes un monstruo de Tipo Dragón boca arriba en tu Campo.

[Efecto]
Destruye 1 Carta Mágica/de Trampa del Campo de tu adversario.`,
        precio: "500 DP",
        imagen: "img/cartas/dragonsinferno.jpg"
    },

    {
        nombre: "Shadow Buyer",
        categoria: "MONSTER",
        tipo: "[ Demonio / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 4,
        rareza: "SR",
        atk: 1200,
        def: 0,
        descripcion: `[Requisito]
Baraja 1 monstruo desde tu Cementerio al Deck.

[Efecto]
Aumenta el Nivel de esta carta en [la cantidad de monstruos boca arriba en el Campo de tu adversario] hasta el final de este turno. Solo puedes atacar con monstruos de Tipo Demonio este turno.`,
        precio: "800 DP",
        imagen: "img/cartas/shadowbuyer.jpg"
    },

    {
        nombre: "Royal Rebel's Progrock",
        categoria: "MONSTER",
        tipo: "[ Demonio / Efecto ]",
        atributo: "LUZ",
        nivel: 8,
        rareza: "SR",
        atk: 2500,
        def: 0,
        descripcion: `[Requisito]
Durante el turno en el que Invocaste de Modo Normal esta carta Sacrificando un monstruo de Nivel 5 o mayor.

[Efecto]
Destruye 1 Carta Mágica/de Trampa en el Campo de tu adversario. Después, puedes destruir 1 carta boca abajo en el Campo de tu adversario. Durante este turno, solo puedes atacar con monstruos de Tipo Demonio.`,
        precio: "800 DP",
        imagen: "img/cartas/progrock.jpg"
    },

    {
        nombre: "Sevens Road Witch",
        categoria: "MONSTER",
        tipo: "[ Lanzador de Conjuros / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 6,
        rareza: "SR",
        atk: 1600,
        def: 1000,
        descripcion: `[Requisito]
Manda al Cementerio 1 carta en tu mano.

[Efecto]
Invoca de Modo Especial, desde tu mano, 1 monstruo de Tipo Lanzador de Conjuros de Nivel 7 o mayor con el Atributo OSCURIDAD boca arriba en tu Campo. Si Invocaste de Modo Especial "Mago del Camino Sevens" con este efecto, esta carta gana 400 ATK hasta el final de este turno.`,
        precio: "800 DP",
        imagen: "img/cartas/sevenswitch.jpg"
    },

    {
        nombre: "Gravity Press Dragon",
        categoria: "MONSTER",
        tipo: "[ Dragón / Efecto ]",
        atributo: "TIERRA",
        nivel: 6,
        rareza: "SR",
        atk: 1500,
        def: 1000,
        descripcion: `[Requisito]
Manda al Cementerio 1 carta en tu mano.

[Efecto]
1 monstruo boca arriba en el Campo de tu adversario pierde 700 ATK/DEF hasta el final de este turno.`,
        precio: "800 DP",
        imagen: "img/cartas/gravitypress.jpg"
    },

    {
        nombre: "Excutie Leya",
        categoria: "MONSTER",
        tipo: "[ Guerrero / Efecto ]",
        atributo: "VIENTO",
        nivel: 6,
        rareza: "SR",
        atk: 1800,
        def: 500,
        descripcion: `[Condición]
Puedes Invocar de Modo Especial esta carta desde tu mano boca arriba a tu Campo si tienes un monstruo boca arriba de Nivel 6 con 500 DEF en tu Campo.

[Requisito]
Ninguno.

[Efecto]
Todos los monstruos boca arriba de Nivel 7 o mayor en el Campo pierden 300 ATK y DEF.`,
        precio: "800 DP",
        imagen: "img/cartas/excutieleya.jpg"
    },

    {
        nombre: "Yamiluna the Dark Devotee",
        categoria: "MONSTER",
        tipo: "[ Guerrero / Efecto ]",
        atributo: "OSCURIDAD",
        nivel: 8,
        rareza: "SR",
        atk: 2500,
        def: 2500,
        descripcion: `[Condición]
Si tienes a "Yamiruler el Retrasador Oscuro" boca arriba en tu Campo, puedes Invocar de Modo Especial esta carta desde tu mano boca arriba a tu Campo.

[Requisito]
Cambia la posición de batalla de 1 monstruo boca arriba en tu Campo.

[Efecto]
Mientras esté boca arriba, 1 "Yamiruler the Dark Delayer" en tu Campo gana 500 ATK y, si ataca a un monstruo en Posición de Defensa, inflige daño de batalla de penetración.`,
        precio: "800 DP",
        imagen: "img/cartas/yamiluna.jpg"
    },

    {
        nombre: "Talismanic Seal Array",
        categoria: "SPELL",
        tipo: "[ Magia Normal ]",
        atributo: "SPELL",
        nivel: 0,
        rareza: "SR",
        atk: "-",
        def: "-",
        descripcion: `[Requisito]
Baraja 4 monstruos de tu Cementerio al Deck.

[Efecto]
1 monstruo boca arriba en el Campo del adversario pierde ATK igual a [su Nivel] x 200 hasta el final de este turno.`,
        precio: "800 DP",
        imagen: "img/cartas/talismanic.jpg"
    },

    {
        nombre: "Nobody Phantom Thief",
        categoria: "TRAP",
        tipo: "[ Trampa Normal ]",
        atributo: "TRAP",
        nivel: 0,
        rareza: "SR",
        atk: "-",
        def: "-",
        descripcion: `[Requisito]
Cuando un monstruo de tu Campo es destruido por un ataque de un adversario o el efecto de una carta de tu adversario.

[Efecto]
Roba 3 cartas. Después, manda 1 o más cartas de tu mano al Cementerio. Si no tienes monstruos en tu Campo, tampoco recibes daño de batalla de los ataques de los monstruos de Nivel 8 o menor de tu adversario durante este turno.`,
        precio: "800 DP",
        imagen: "img/cartas/phantomthief.jpg"
    },

    {
        nombre: "Secret Order",
        categoria: "SPELL",
        tipo: "[ Magia Normal ]",
        atributo: "SPELL",
        nivel: 0,
        rareza: "UR",
        atk: "-",
        def: "-",
        descripcion:
            `[Requisito]
Ninguno.

[Efecto]
Invoca de Modo Especial, desde tu mano o Cementerio, 1 Monstruo Normal de Nivel 7 boca arriba a tu Campo. Este turno, el monstruo Invocado de Modo Especial con este efecto gana 700 ATK y no puede ser destruido por los efectos de Cartas Trampa de tu adversario.`,
        precio: "1000 DP",
        imagen: "img/cartas/secretorder.jpg"
    },

    {
        nombre: "Painful Choice",
        categoria: "SPELL",
        tipo: "[ Magia Normal ]",
        atributo: "SPELL",
        nivel: 0,
        rareza: "UR",
        atk: "-",
        def: "-",
        descripcion:
            `[Requisito]
Ninguno.

[Efecto]
Excava las 5 primeras cartas de tu Deck y muéstralas. Tu oponente elige una de ellas y la añades a tu mano. Envía las cartas restantes al Cementerio.`,
        precio: "1000 DP",
        imagen: "img/cartas/painful.jpg"
    },

    {
        nombre: "Negate Attack",
        categoria: "TRAP",
        tipo: "[ Trampa Normal ]",
        atributo: "TRAP",
        nivel: 0,
        rareza: "UR",
        atk: "-",
        def: "-",
        descripcion:
            `[Requisito]
Cuando un monstruo del oponente declare un ataque.

[Efecto]
Niega el ataque y termina la Fase de Batalla.`,
        precio: "1200 DP",
        imagen: "img/cartas/negarataque.jpg"
    },

    {
        nombre: "The Block",
        categoria: "TRAP",
        tipo: "[ Trampa Normal ]",
        atributo: "TRAP",
        nivel: 0,
        rareza: "UR",
        atk: "-",
        def: "-",
        descripcion:
            `[Requisito]
Cuando tu adversario Invoca de Modo Normal o Especial un monstruo en Posición de Ataque boca arriba y tiene 2 o más monstruos en su Campo.

[Efecto]
Cambia hasta 2 monstruos de Posición de Ataque de Nivel 8 o inferior en el Campo de tu adversario a Posición de Defensa boca arriba.`,
        precio: "1200 DP",
        imagen: "img/cartas/block.jpg"
    },


    // ---------------------------------------------
    // CARTAS DEL DECK BASE
    // enTienda:false = no aparecen en la tienda.
    // Rareza GRATIS. Se obtienen con el botón "Deck base"
    // del constructor de deck.
    // ---------------------------------------------

    {
        nombre: "Star Replete",
        categoria: "MONSTER",
        tipo: "[ Dragón / Normal ]",
        atributo: "LUZ",
        nivel: 5,
        rareza: "GRATIS",
        atk: 2100,
        def: 2100,
        descripcion: "El pequeño dragón estelar ha crecido y adoptado una nueva forma. Impulsado por sus lazos con las personas y el poder de las estrellas, contiene un poder misterioso en su cuerpo. Cuando llegue la hora señalada, su nombre quedará grabado en el santuario de estrellas.",
        precio: "No está a la venta",
        imagen: "img/cartas/starreplete.jpg",
        enTienda: false
    },

    {
        nombre: "Gazelle the King of Mythical Beasts",
        categoria: "MONSTER",
        tipo: "[ Bestia / Normal ]",
        atributo: "TIERRA",
        nivel: 4,
        rareza: "GRATIS",
        atk: 1500,
        def: 1200,
        descripcion: "Este monstruo se mueve tan rápido que a los ojos de los mortales parece una ilusión.",
        precio: "No está a la venta",
        imagen: "img/cartas/gazelle.jpg",
        enTienda: false
    },

    {
        nombre: "Niwatori",
        categoria: "MONSTER",
        tipo: "[ Bestia Alada / Normal ]",
        atributo: "TIERRA",
        nivel: 3,
        rareza: "GRATIS",
        atk: 900,
        def: 800,
        descripcion: "Devora a sus enemigos enteros y usa su esencia como energía.",
        precio: "No está a la venta",
        imagen: "img/cartas/niwatori.jpg",
        enTienda: false
    },

    {
        nombre: "Dragorite",
        categoria: "MONSTER",
        tipo: "[ Dragón / Normal ]",
        atributo: "TIERRA",
        nivel: 4,
        rareza: "GRATIS",
        atk: 1500,
        def: 0,
        descripcion: "Un dragón que nació de un filón subterráneo. Utiliza la energía de un mineral desconocido como fuente de poder en combate. Los contundentes golpes que propina son increíblemente efectivos.",
        precio: "No está a la venta",
        imagen: "img/cartas/dragorite.jpg",
        enTienda: false
    },

    {
        nombre: "The Barrier",
        categoria: "TRAP",
        tipo: "[ Trampa Normal ]",
        atributo: "TRAP",
        nivel: 0,
        rareza: "GRATIS",
        atk: "-",
        def: "-",
        descripcion: `[Requisito]
Cuando un monstruo del adversario declara un ataque, baraja 1 monstruo desde tu Cementerio al Deck.

[Efecto]
El monstruo atacante pierde 400 de ATK hasta el final de este turno.`,
        precio: "No está a la venta",
        imagen: "img/cartas/barrier.jpg",
        enTienda: false
    },

    {
        nombre: "Obnoxious Celtic Guard",
        categoria: "MONSTER",
        tipo: "[ Guerrero / Efecto ]",
        atributo: "TIERRA",
        nivel: 4,
        rareza: "GRATIS",
        atk: 1400,
        def: 1200,
        descripcion: `[Requisito]
Ninguno.

[Efecto]
Esta carta no puede ser destruida en batalla contra un monstruo que tenga 1900 o más de ATK.`,
        precio: "No está a la venta",
        imagen: "img/cartas/celticguard.jpg",
        enTienda: false
    },

    {
        nombre: "Babysitter Goat",
        categoria: "MONSTER",
        tipo: "[ Demonio / Normal ]",
        atributo: "OSCURIDAD",
        nivel: 1,
        rareza: "GRATIS",
        atk: 0,
        def: 1400,
        descripcion: "Compañero de juegos para los niños del Mundo Demonio. Tiene una personalidad seria, pero se come cualquier papel que ve. A medida que su protegido crece hasta la edad adulta, su propio poder mágico aumenta.",
        precio: "No está a la venta",
        imagen: "img/cartas/babysittergoat.jpg",
        enTienda: false
    },

    {
        nombre: "Water Magician",
        categoria: "MONSTER",
        tipo: "[ Acuático / Normal ]",
        atributo: "AGUA",
        nivel: 4,
        rareza: "GRATIS",
        atk: 1400,
        def: 1000,
        descripcion: "Este monstruo inunda a su oponente con un suministro casi interminable de agua.",
        precio: "No está a la venta",
        imagen: "img/cartas/watermagician.jpg",
        enTienda: false
    },

    {
        nombre: "Magical Beast Wolfang",
        categoria: "MONSTER",
        tipo: "[ Lanzador de Conjuros / Normal ]",
        atributo: "FUEGO",
        nivel: 3,
        rareza: "GRATIS",
        atk: 1100,
        def: 100,
        descripcion: "El antiguo familiar de un mago famoso. En algún momento su poder mágico superó al de su maestro, y ahora juega con sus enemigos manipulando las llamas a su antojo.",
        precio: "No está a la venta",
        imagen: "img/cartas/wolfang.jpg",
        enTienda: false
    }

];


// =============================================
// 4. GENERACIÓN DE LA TIENDA
// =============================================

// Genera el HTML de cada carta agrupada por rareza
// e inyecta el resultado en #listaCartas.
//
// Los eventos mouseenter y mouseleave van en el
// .contenedor-carta (el div padre), NO en la <img>.
// Así el panel no desaparece al mover el cursor
// de la imagen al badge de rareza o al borde de la carta.
//
// data-indice guarda el índice real del array
// para que los filtros y el panel funcionen bien.
function generarTienda() {

    let contenedor = document.getElementById("listaCartas");
    contenedor.innerHTML = "";

    // Acumuladores HTML por bloque de rareza
    let ur     = "";
    let sr     = "";
    let gratis = "";

    for (let i = 0; i < cartas.length; i++) {

        // Las cartas con enTienda:false no se venden (ej: deck base)
        if (cartas[i].enTienda === false) continue;

        let htmlCarta = `
<div class="contenedor-carta"
     data-indice="${i}"
     onmouseenter="if(!esMobil()) mostrarCarta(${i}, event)"
     onmouseleave="if(!esMobil()) ocultarCarta()"
     onclick="if(esMobil()) abrirCartaMobil(${i}, event)">

    <img
        src="${cartas[i].imagen}"
        class="carta-mini"
        alt="${cartas[i].nombre}">

    ${cartas[i].rareza === "UR"
        ? '<img src="img/rarezas/ur.png" class="rareza" alt="Ultra Rare">'
        : cartas[i].rareza === "SR"
        ? '<img src="img/rarezas/sr.png" class="rareza" alt="Super Rare">'
        : ""}

</div>`;

        if (cartas[i].rareza === "UR") {
            ur += htmlCarta;
        } else if (cartas[i].rareza === "SR") {
            sr += htmlCarta;
        } else {
            gratis += htmlCarta;
        }
    }

    contenedor.innerHTML =
        '<h2 class="titulo-seccion">ULTRA RARE</h2>'    +
        '<div class="lista-cartas">' + ur     + '</div>' +

        '<h2 class="titulo-seccion">SUPER RARE</h2>'    +
        '<div class="lista-cartas">' + sr     + '</div>' +

        '<h2 class="titulo-seccion">CARTAS GRATIS</h2>' +
        '<div class="lista-cartas">' + gratis + '</div>';
}


// =============================================
// 5. MOSTRAR CARTA EN EL PANEL (HOVER)
// =============================================

// Rellena el panel flotante con los datos de
// cartas[indice] y lo posiciona al lado de la carta.
//
// FIX posición vertical: el panel tiene position:fixed,
// sus coordenadas son relativas al VIEWPORT (lo visible
// en pantalla ahora mismo), NO al documento completo.
// Por eso NO se suma window.scrollY — antes eso lo
// empujaba muy abajo al hacer scroll.
//
// FIX panel desaparecía: los eventos mouseenter/leave
// van en el .contenedor-carta, así el panel permanece
// visible aunque el cursor pase de la imagen al badge
// de rareza u otro hijo del contenedor.
function mostrarCarta(indice, evento) {

    let carta = cartas[indice];
    let panel = document.getElementById("panelInfo");

    // Mostrar el panel (flex = imagen izq + datos der)
    panel.style.display = "flex";

    // --- Imagen grande ---
    document.getElementById("imagenGrande").src = carta.imagen;
    document.getElementById("imagenGrande").alt = carta.nombre;

    // --- Badge de rareza ---
    document.getElementById("panelRareza").innerText = carta.rareza;

    // --- Nombre ---
    document.getElementById("nombreCarta").innerText = carta.nombre;

    // --- Atributo y nivel (nivel solo si es monstruo) ---
    let atributoNivel = document.getElementById("panelAtributoNivel");
    if (carta.categoria === "MONSTER") {
        atributoNivel.innerHTML =
            carta.atributo +
            ' <span class="nivel-icono">★</span>' +
            carta.nivel;
    } else {
        atributoNivel.innerHTML = carta.atributo;
    }

    // --- Tipo: [ Dragon / Normal ] ---
    document.getElementById("tipoCarta").innerText = carta.tipo;

    // --- Descripción ---
    // Colorea [Requirement] y [Effect] con clases CSS
    // y convierte \n en <br> para los saltos de línea
    let desc = formatearDescripcion(carta.descripcion);

    document.getElementById("descripcionCarta").innerHTML = desc;

    // --- Stats ATK / DEF (solo monstruos) ---
    let stats = document.getElementById("statsCarta");
    if (carta.categoria !== "MONSTER") {
        stats.innerHTML = "";
    } else {
        stats.innerHTML =
            "ATK/ <strong>" + carta.atk + "</strong>" +
            " &nbsp; " +
            "DEF/ <strong>" + carta.def + "</strong>";
    }

    // --- Precio ---
    document.getElementById("precioCarta").innerText = "Precio: " + carta.precio;

    // --- Posición del panel al lado de la carta ---
    // currentTarget es el .contenedor-carta que tiene el onmouseenter.
    // getBoundingClientRect() da coordenadas de viewport,
    // que es lo que necesita position:fixed. Sin window.scrollY.
    let rect           = evento.currentTarget.getBoundingClientRect();
    let anchoPantalla  = window.innerWidth;
    let alturaPantalla = window.innerHeight;
    let anchoPanel     = 520;
    let alturaPanel    = 320;

    // Panel a la izquierda si la carta está en la mitad derecha,
    // a la derecha si la carta está en la mitad izquierda.
    if (rect.left > anchoPantalla / 2) {
        panel.style.left = (rect.left - anchoPanel - 16) + "px";
    } else {
        panel.style.left = (rect.right + 16) + "px";
    }

    // Centrar verticalmente el panel respecto a la carta,
    // ajustando para que no se salga por arriba ni por abajo.
    let topIdeal  = rect.top + (rect.height / 2) - (alturaPanel / 2);
    let topMinimo = 10;
    let topMaximo = alturaPantalla - alturaPanel - 10;

    panel.style.top = Math.min(Math.max(topIdeal, topMinimo), topMaximo) + "px";
}




// abrirCartaMobil(indice, evento)
// En móvil: tap en una carta abre el panel centrado en pantalla.
// El panel se cierra haciendo tap sobre él mismo (onclick en el panel).
function abrirCartaMobil(indice, evento) {
    evento.stopPropagation();

    // Rellena el panel con los datos de la carta
    mostrarCarta(indice, evento);

    // Sobreescribir la posición que calcula mostrarCarta
    // para que quede centrado en pantalla (el CSS hace el resto con translateY)
    let panel = document.getElementById("panelInfo");
    panel.style.top  = "50%";
    panel.style.left = "4vw";
}
// =============================================
// 6. FILTROS
// =============================================

// Filtros activos. Cadena vacía = sin filtro.
let filtroCategoria = "";  // MONSTER / SPELL / TRAP
let filtroRareza    = "";  // UR / SR / R / GRATIS


// Despliega o colapsa el panel de filtros avanzados.
function toggleFiltros() {
    let panel = document.getElementById("panelFiltros");
    let boton = document.getElementById("botonFiltros");

    if (panel.style.display === "block") {
        panel.style.display = "none";
        boton.innerHTML = "▼ Búsqueda Avanzada ▼";
    } else {
        panel.style.display = "block";
        boton.innerHTML = "▲ Búsqueda Avanzada ▲";
    }
}


// Activa el filtro de categoría (toggle: pulsar el mismo lo apaga).
function filtrarCategoria(categoria) {
    filtroCategoria = (filtroCategoria === categoria) ? "" : categoria;
    actualizarFiltros();
}


// Activa el filtro de rareza (toggle: pulsar el mismo lo apaga).
function filtrarRareza(rareza) {
    filtroRareza = (filtroRareza === rareza) ? "" : rareza;
    actualizarFiltros();
}


// Limpia todos los filtros y el buscador. Muestra todas las cartas.
function limpiarFiltros() {
    filtroCategoria = "";
    filtroRareza    = "";
    document.getElementById("busqueda").value = "";
    actualizarFiltros();
}


// Recorre los .contenedor-carta y muestra u oculta cada uno
// según si coincide con el texto, categoría y rareza activos.
// Lee data-indice para obtener el objeto carta correcto del array.
function actualizarFiltros() {

    let texto        = document.getElementById("busqueda").value.toLowerCase();
    let contenedores = document.querySelectorAll(".contenedor-carta");

    for (let i = 0; i < contenedores.length; i++) {

        let indice = parseInt(contenedores[i].getAttribute("data-indice"));
        let carta  = cartas[indice];

        let coincideNombre    = carta.nombre.toLowerCase().includes(texto);
        let coincideCategoria = filtroCategoria === "" || carta.categoria === filtroCategoria;
        let coincideRareza    = filtroRareza    === "" || carta.rareza    === filtroRareza;

        if (coincideNombre && coincideCategoria && coincideRareza) {
            contenedores[i].style.display = "block";
        } else {
            contenedores[i].style.display = "none";
        }
    }
}


// =============================================
// 7. INICIALIZACIÓN
// =============================================
// Genera las cartas al cargar la página.
generarTienda();


// =============================================
// 8. CONSTRUCTOR DE DECK
// =============================================
// deck: objeto donde la clave es el índice de
// carta en el array cartas[] y el valor es la
// cantidad de copias añadidas al deck.
// Máximo 3 copias por carta, 40 cartas en total.
// =============================================

let deck = {};  // { indice: cantidad }


// Variables de filtro del constructor de deck
let deckFiltroCategoria = "";  // MONSTER / SPELL / TRAP / "" = todas

// generarListaDecks()
// Rellena el panel derecho con las cartas que coincidan
// con el texto buscado y la categoría activa.
// Click en cualquier parte de la fila agrega la carta al deck.
// Se llama al entrar a la sección y cada vez que cambia el filtro.
function generarListaDecks() {

    let lista = document.getElementById("deckLista");
    if (!lista) return;

    let texto = (document.getElementById("deckBusqueda")?.value || "").toLowerCase();

    lista.innerHTML = "";

    for (let i = 0; i < cartas.length; i++) {
        let c = cartas[i];

        // Aplicar filtros de texto y categoría
        let coincideNombre    = c.nombre.toLowerCase().includes(texto);
        let coincideCategoria = deckFiltroCategoria === "" || c.categoria === deckFiltroCategoria;
        if (!coincideNombre || !coincideCategoria) continue;

        lista.innerHTML += `
<div class="deck-fila-carta"
     onclick="clickFilaDeck(${i})"
     onmouseenter="if(!esMobil()) mostrarCarta(${i}, event)"
     onmouseleave="if(!esMobil()) ocultarCarta()">
    <img src="${c.imagen}" alt="${c.nombre}">
    <div class="deck-fila-info">
        <div class="deck-nombre">${c.nombre}</div>
        <div class="deck-tipo-rareza">${c.categoria} · ${c.rareza}</div>
    </div>
</div>`;
    }
}

// filtrarListaDecks()
// Se llama desde onkeyup del buscador del constructor.
function filtrarListaDecks() {
    generarListaDecks();
}

// filtrarDeckCategoria(cat)
// Activa el filtro de categoría en el constructor y resalta el botón activo.
function filtrarDeckCategoria(cat) {
    deckFiltroCategoria = cat;

    // Resaltar el botón activo
    let botones = document.querySelectorAll(".deck-filtros-botones button");
    for (let b of botones) {
        b.classList.remove("activo-deck");
    }
    // El botón "Todas" no tiene categoría; los demás sí
    let labels = { "MONSTER": "Monstruos", "SPELL": "Magias", "TRAP": "Trampas", "": "Todas" };
    for (let b of botones) {
        if (b.innerText === labels[cat]) b.classList.add("activo-deck");
    }

    generarListaDecks();
}


// agregarAlDeck(indice)
// Añade una copia de la carta al deck.
// Límites: máximo 3 copias por carta, 40 total.
function agregarAlDeck(indice) {

    let total = Object.values(deck).reduce((sum, n) => sum + n, 0);

    if (total >= 40) {
        alert("El deck ya tiene 40 cartas.");
        return;
    }

    let actual = deck[indice] || 0;
    if (actual >= 3) {
        alert("Máximo 3 copias de la misma carta.");
        return;
    }

    deck[indice] = actual + 1;
    renderDeck();
}


// quitarDelDeck(indice)
// Quita una copia de la carta del deck.
// Si llega a 0 copias, la elimina del objeto.
function quitarDelDeck(indice) {
    if (!deck[indice]) return;
    deck[indice]--;
    if (deck[indice] === 0) delete deck[indice];
    renderDeck();
}


// vaciarDeck()
// Elimina todas las cartas del deck.
function vaciarDeck() {
    deck = {};
    renderDeck();
}


// Cartas del deck base. Se cargan con 3 copias cada una.
const DECK_BASE = [
    "Star Replete",
    "Gazelle the King of Mythical Beasts",
    "Niwatori",
    "Dragorite",
    "The Barrier",
    "Obnoxious Celtic Guard",
    "Babysitter Goat",
    "Water Magician",
    "Magical Beast Wolfang"
];

// cargarDeckBase()
// Reemplaza el deck actual por el deck base
// (3 copias de cada carta de DECK_BASE).
// Busca las cartas por nombre, así no se rompe
// si cambias el orden del array cartas[].
function cargarDeckBase() {
    deck = {};

    for (let i = 0; i < cartas.length; i++) {
        if (DECK_BASE.includes(cartas[i].nombre)) {
            deck[i] = 3;
        }
    }

    renderDeck();
}


// renderDeck()
// Redibuja la zona del deck con las cartas actuales.
// Cada copia de carta se muestra como una imagen separada.
// Click en una imagen quita esa copia del deck.
// También actualiza el contador de cartas y el costo total en DP.
function renderDeck() {

    let zona     = document.getElementById("deckCartas");
    let contador = document.getElementById("deckContador");
    let costo    = document.getElementById("deckCosto");
    if (!zona || !contador) return;

    zona.innerHTML = "";

    let totalCartas = 0;
    let totalDP     = 0;

    // Orden de las cartas en el deck: primero Monstruos, luego Magias
    // y al final las Trampas. Dentro de cada tipo, por orden del array.
    let ordenTipo = { MONSTER: 0, SPELL: 1, TRAP: 2 };
    let indicesOrdenados = Object.keys(deck).map(Number).sort(function (a, b) {
        let dif = ordenTipo[cartas[a].categoria] - ordenTipo[cartas[b].categoria];
        return dif !== 0 ? dif : a - b;
    });

    for (let indice of indicesOrdenados) {
        let cantidad = deck[indice];
        let carta    = cartas[parseInt(indice)];
        totalCartas += cantidad;

        // Extraer el número del precio "1200 DP" → 1200
        let precioNum = parseInt(carta.precio.replace(/\D/g, "")) || 0;
        totalDP += precioNum * cantidad;

        // Una imagen por copia (sin badge de cantidad)
        for (let c = 0; c < cantidad; c++) {
            zona.innerHTML += `
<div class="deck-carta-item"
     onclick="clickCartaDeck(${indice})"
     title="Click para quitar una copia">
    <img src="${carta.imagen}" alt="${carta.nombre}">
</div>`;
        }
    }

    // Deck vacío: mensaje de ayuda
    if (totalCartas === 0) {
        zona.innerHTML = '<div class="deck-vacio">Tu deck está vacío. ' +
            (esMobil()
                ? 'Ve a la pestaña <b>Buscar</b> para añadir cartas o carga el <b>Deck base</b>.'
                : 'Haz click en una carta de la lista para añadirla o carga el <b>Deck base</b>.') +
            '</div>';
    }

    contador.innerText = totalCartas + " / 40 cartas";

    // Contador en la pestaña "Deck" (móvil)
    let tabCantidad = document.getElementById("tabDeckCantidad");
    if (tabCantidad) tabCantidad.innerText = "(" + totalCartas + ")";

    // Refrescar los botones y contadores de la pestaña Carta
    actualizarPanelCartaDeck();

    if (costo) {
        costo.innerText = "Costo: " + totalDP.toLocaleString() + " DP";
    }
}


// =============================================
// 9. CONSTRUCTOR DE DECK EN MÓVIL (PESTAÑAS)
// =============================================
// En móvil el constructor se divide en 3 pestañas,
// igual que en Dueling Nexus:
//   Carta  - imagen grande, descripción y botones
//            para añadir o quitar la carta del deck
//   Deck   - solo las cartas que llevas en el deck
//   Buscar - buscador, filtros y lista de cartas
// En PC se siguen viendo Deck y Buscar a la vez
// y las pestañas están ocultas por CSS.
// =============================================

// Índice de la carta que se ve en la pestaña Carta (-1 = ninguna)
let deckCartaSel = -1;


// formatearDescripcion(texto)
// Colorea [Condición], [Requisito] y [Efecto] y convierte
// los saltos de línea en <br>. La usan el panel flotante
// de la tienda (mostrarCarta) y la pestaña Carta.
function formatearDescripcion(texto) {
    return texto
        .replace("[Condición]", '<span class="condition">[CONDICIÓN]</span>')
        .replace("[Requisito]", '<span class="requirement">[REQUISITO]</span>')
        .replace("[Efecto]",    '<span class="effect">[EFECTO]</span>')
        .replaceAll("\n", "<br>");
}


// totalCartasDeck()
// Devuelve cuántas cartas hay en el deck en total.
function totalCartasDeck() {
    return Object.values(deck).reduce((sum, n) => sum + n, 0);
}


// cambiarPestanaDeck(nombre)
// nombre: "carta" | "deck" | "buscar"
// Cambia la pestaña visible (el CSS muestra/oculta según data-tab)
// y marca el botón de la pestaña activa.
function cambiarPestanaDeck(nombre) {

    let contenedor = document.querySelector(".deck-constructor");
    if (!contenedor) return;

    contenedor.setAttribute("data-tab", nombre);

    let pestanas = { carta: "tabCarta", deck: "tabDeck", buscar: "tabBuscar" };
    for (let clave in pestanas) {
        document.getElementById(pestanas[clave])
            .classList.toggle("activa", clave === nombre);
    }

    // Al cambiar de pestaña empezamos arriba del todo
    if (esMobil()) window.scrollTo(0, 0);
}


// seleccionarCartaDeck(indice)
// Muestra la carta en la pestaña Carta y salta a ella.
function seleccionarCartaDeck(indice) {
    deckCartaSel = indice;
    actualizarPanelCartaDeck();
    cambiarPestanaDeck("carta");
}


// clickFilaDeck(indice)
// Click en una carta de la lista de búsqueda:
//   móvil → abre la pestaña Carta
//   PC    → la añade directamente al deck
function clickFilaDeck(indice) {
    if (esMobil()) {
        seleccionarCartaDeck(indice);
    } else {
        agregarAlDeck(indice);
    }
}


// clickCartaDeck(indice)
// Click en una carta dentro del deck:
//   móvil → abre la pestaña Carta
//   PC    → quita una copia del deck
function clickCartaDeck(indice) {
    if (esMobil()) {
        seleccionarCartaDeck(indice);
    } else {
        quitarDelDeck(indice);
    }
}


// Botones de la pestaña Carta
function agregarCartaSeleccionada() {
    if (deckCartaSel >= 0) agregarAlDeck(deckCartaSel);
}

function quitarCartaSeleccionada() {
    if (deckCartaSel >= 0) quitarDelDeck(deckCartaSel);
}


// actualizarPanelCartaDeck()
// Rellena la pestaña Carta con la carta seleccionada:
// nombre, imagen, tipo, descripción, ATK/DEF, copias en el deck
// y activa o desactiva los botones según los límites
// (3 copias por carta, 40 cartas en total).
// Se llama al seleccionar una carta y cada vez que cambia el deck.
function actualizarPanelCartaDeck() {

    let vacio     = document.getElementById("deckCartaVacio");
    let contenido = document.getElementById("deckCartaContenido");
    if (!vacio || !contenido) return;

    // Sin carta seleccionada: mensaje de ayuda
    if (deckCartaSel < 0) {
        vacio.style.display     = "block";
        contenido.style.display = "none";
        return;
    }

    let carta = cartas[deckCartaSel];

    vacio.style.display     = "none";
    contenido.style.display = "block";

    // Nombre e imagen
    document.getElementById("dcNombre").innerText = carta.nombre;
    let img = document.getElementById("dcImagen");
    img.src = carta.imagen;
    img.alt = carta.nombre;

    // Atributo / nivel / tipo (el nivel solo en monstruos)
    let meta = carta.tipo;
    if (carta.categoria === "MONSTER") {
        meta = carta.atributo + " ★" + carta.nivel + "  ·  " + carta.tipo;
    }
    document.getElementById("dcMeta").innerText = meta;

    // Descripción con [Condición] / [Requisito] / [Efecto] coloreados
    document.getElementById("dcDescripcion").innerHTML =
        formatearDescripcion(carta.descripcion);

    // ATK / DEF (solo monstruos)
    document.getElementById("dcStats").innerHTML =
        (carta.categoria === "MONSTER")
            ? "ATK/ <strong>" + carta.atk + "</strong> &nbsp; DEF/ <strong>" + carta.def + "</strong>"
            : "";

    // Rareza y precio
    document.getElementById("dcExtra").innerText =
        "Rareza: " + carta.rareza + "  ·  Precio: " + carta.precio;

    // Copias en el deck y estado de los botones
    let copias = deck[deckCartaSel] || 0;
    let total  = totalCartasDeck();

    document.getElementById("dcCopias").innerText =
        "En tu deck: " + copias + " / 3" +
        (total >= 40 ? "  ·  Deck completo (40)" : "");

    document.getElementById("dcBtnAgregar").disabled = (copias >= 3 || total >= 40);
    document.getElementById("dcBtnQuitar").disabled  = (copias === 0);
}


// Estado inicial del constructor (mensaje de deck vacío, contadores)
renderDeck();
