// Lumi Shop - Catálogo y Pasarela de Pago Nequi

export const PRODUCTOS_BASE = [
  // NEGROS
  { id: "Ref017", ref: "Ref017", nombre: "Bolso negro pequeño pines bordados y tiras intercambiables", precio: 105000, img: "imagenes/Ref017.jpeg", color: "negro", hex: "#1a1a1a" },
  { id: "Ref021", ref: "Ref021", nombre: "Bolso negro tipo Baúl con herrajes dorados dos modos de uso", precio: 100000, img: "imagenes/Ref021.jpeg", color: "negro", hex: "#1f1f1f" },
  { id: "Ref022", ref: "Ref022", nombre: "Bolso negro tipo sobre con gráficos y cadena dorada", precio: 110000, img: "imagenes/Ref022.jpeg", color: "negro", hex: "#222222" },
  { id: "Ref025", ref: "Ref025", nombre: "Mochila mediana detalles cuero sintético estampado negro", precio: 70000, img: "imagenes/Ref025.jpeg", color: "negro", hex: "#1e1e1e" },
  { id: "Ref033-negro", ref: "Ref033-Negro", nombre: "Bolso Amplio negro cierres plateados tira estampada", precio: 25000, img: "imagenes/Ref033-Negro.jpeg", color: "negro", grupo: "Ref033", colorLabel: "Negro", hex: "#222222" },
  { id: "Ref034", ref: "Ref034", nombre: "Bolso Amplio negro cierres plateados sencillos tira estampada", precio: 25000, img: "imagenes/Ref034.jpeg", color: "negro", hex: "#1a1a1a" },
  { id: "Ref035", ref: "Ref035", nombre: "Bolso Amplio negro con dos bolsillos funcionales", precio: 25000, img: "imagenes/Ref035.jpeg", color: "negro", hex: "#1a1a1a" },
  { id: "Ref036", ref: "Ref036", nombre: "Bolso negro con piedras plateadas tira estampada incluye monedero", precio: 30000, img: "imagenes/Ref036.jpeg", color: "negro", hex: "#1a1a1a" },
  { id: "Ref042-negro", ref: "Ref042-Negro", nombre: "Canguro mediano negro bolsillos funcionales cierres plateados", precio: 35000, img: "imagenes/Ref042-Negro.jpeg", color: "negro", grupo: "Ref042", colorLabel: "Negro", hex: "#1a1a1a" },
  { id: "Ref043-negro", ref: "Ref043-Negro", nombre: "Bolso MINI negro herrajes dorados funcional tira larga", precio: 50000, img: "imagenes/Ref043-Negro.jpeg", color: "negro", grupo: "Ref043", colorLabel: "Negro", hex: "#222222" },
  { id: "Ref046-negro", ref: "Ref046-Negro", nombre: "Bolso Negro ejecutivo interior amplio incluye monedero", precio: 120000, img: "imagenes/Ref046-Negro.jpeg", color: "negro", hex: "#1a1a1a" },
  { id: "Ref047-negro", ref: "Ref047-Negro", nombre: "Bolso manos libres negro herrajes plateados cierre y tira larga", precio: 75000, img: "imagenes/Ref047-Negro.jpeg", color: "negro", grupo: "Ref047", colorLabel: "Negro", hex: "#1a1a1a" },
  { id: "Ref049", ref: "Ref049", nombre: "Bolso manos libres negro brillante bolsillos incluye dos tiras", precio: 75000, img: "imagenes/Ref049.jpeg", color: "negro", hex: "#1a1a1a" },
  { id: "Ref051", ref: "Ref051", nombre: "Bolso alargado negro brillante dos modos de uso", precio: 75000, img: "imagenes/Ref051.jpeg", color: "negro", grupo: "Ref051", colorLabel: "Negro", hex: "#1a1a1a" },

  // VINOTINTO & ROJO
  { id: "Ref002", ref: "Ref002", nombre: "Bolso rojo infaltable versátil combinable incluye dos tiras", precio: 45000, img: "imagenes/Ref002.jpeg", color: "vinotinto", hex: "#b51b29" },
  { id: "Ref020", ref: "Ref020", nombre: "Bolso rojo elegante llamativo perfecto para dar personalidad", precio: 75000, img: "imagenes/Ref020.jpeg", color: "vinotinto", hex: "#b51b29" },
  { id: "Ref050-vino", ref: "Ref050-Vino-Tinto-Oscuro", nombre: "Bolso manos libres con Brillos vino tinto oscuro", precio: 90000, img: "imagenes/Ref050-Vino-Tinto-Oscuro.jpeg", color: "vinotinto", grupo: "Ref050", colorLabel: "Vino Tinto", hex: "#5a1727" },
  { id: "Ref051-cereza", ref: "Ref051-Cereza", nombre: "Bolso alargado color cereza vino tinto", precio: 75000, img: "imagenes/Ref051-Cereza.jpeg", color: "vinotinto", grupo: "Ref051", colorLabel: "Cereza/Vino", hex: "#7a1a2e" },
  { id: "Ref052-vino", ref: "Ref052-Vino-Tinto-Oscuro", nombre: "Bolso canguro tres bolsillos vino tinto oscuro", precio: 50000, img: "imagenes/Ref052-Vino-Tinto-Oscuro.jpeg", color: "vinotinto", grupo: "Ref052", colorLabel: "Vino Tinto", hex: "#5a1727" },
  { id: "Ref030", ref: "Ref030", nombre: "Billetera roja elegante práctica para tarjetas y billetes", precio: 48000, img: "imagenes/Ref030.jpeg", color: "vinotinto", hex: "#a81923" },

  // CAFÉ & BEIGE
  { id: "Ref008", ref: "Ref008", nombre: "Bolso beige clásico con textura y herrajes plateados", precio: 65000, img: "imagenes/Ref008.jpeg", color: "cafe", hex: "#d8c4b2" },
  { id: "Ref009", ref: "Ref009", nombre: "Bolso mini beige con textura y llavero de mano o manos libres", precio: 55000, img: "imagenes/Ref009.jpeg", color: "cafe", hex: "#cca78b" },
  { id: "Ref012", ref: "Ref012", nombre: "Bolso beige elegante herrajes plateados llavero de osito", precio: 68000, img: "imagenes/Ref012.jpeg", color: "cafe", hex: "#dfcdbd" },
  { id: "Ref019", ref: "Ref019", nombre: "Bolso tipo sobre mediano estampado café tira tejido", precio: 55000, img: "imagenes/Ref019.jpeg", color: "cafe", hex: "#6c4d34" },
  { id: "Ref032", ref: "Ref032", nombre: "Billetera café inspirada LV bolsillos y tarjetero", precio: 50000, img: "imagenes/Ref032.jpeg", color: "cafe", hex: "#6e4a30" },
  { id: "Ref033-cafe", ref: "Ref033-Café", nombre: "Bolso Amplio café cierres plateados tira estampada", precio: 25000, img: "imagenes/Ref033-Café.jpeg", color: "cafe", grupo: "Ref033", colorLabel: "Café", hex: "#7a4b32" },
  { id: "Ref038", ref: "Ref038", nombre: "Bolso beige con herrajes plateados texturizado con llavero", precio: 60000, img: "imagenes/Ref038.jpeg", color: "cafe", hex: "#dbcbbe" },
  { id: "Ref039", ref: "Ref039", nombre: "Bolso cuadrado cafecito detalles dorados con llavero perrito", precio: 75000, img: "imagenes/Ref039.jpeg", color: "cafe", hex: "#9a734f" },
  { id: "Ref042-beige", ref: "Ref042-Beige", nombre: "Canguro mediano beige bolsillos funcionales cierres plateados", precio: 35000, img: "imagenes/Ref042-Beige.jpeg", color: "cafe", grupo: "Ref042", colorLabel: "Beige", hex: "#e5d3c0" },
  { id: "Ref044", ref: "Ref044", nombre: "Bolso mini café detalles animal print herrajes dorados", precio: 55000, img: "imagenes/Ref044.jpeg", color: "cafe", hex: "#6e4b31" },
  { id: "Ref045", ref: "Ref045", nombre: "Bolso mini beige con café herrajes dorados dos modos de uso", precio: 55000, img: "imagenes/Ref045.jpeg", color: "cafe", hex: "#d5c1a8" },
  { id: "Ref046", ref: "Ref046", nombre: "Bolso mini beige con ribete negro herrajes dorados", precio: 55000, img: "imagenes/Ref046.jpeg", color: "cafe", hex: "#d6c1aa" },
  { id: "Ref048", ref: "Ref048", nombre: "Bolso manos libres café y beige inspiración Guess herrajes plateados", precio: 80000, img: "imagenes/Ref048.jpeg", color: "cafe", hex: "#b89f88" },
  { id: "Ref050-cafe", ref: "Ref050-Café", nombre: "Bolso manos libres con Brillos tono café bronce", precio: 90000, img: "imagenes/Ref050-Café.jpeg", color: "cafe", grupo: "Ref050", colorLabel: "Café Bronce", hex: "#7a543b" },
  { id: "Ref053", ref: "Ref053", nombre: "Morral mediano café oscuro dos bolsillos funcionales", precio: 65000, img: "imagenes/Ref053.jpeg", color: "cafe", grupo: "Ref053", colorLabel: "Café", hex: "#5b4031" },
  { id: "Ref053-cafe", ref: "Ref053-Café-Claro", nombre: "Morral mediano café claro dos bolsillos funcionales", precio: 65000, img: "imagenes/Ref053-Café-Claro.jpeg", color: "cafe", grupo: "Ref053", colorLabel: "Café Claro", hex: "#b58f70" },

  // ROSA & LILA
  { id: "Ref005", ref: "Ref005", nombre: "Bolso rosado con textura y llavero incluido práctico", precio: 70000, img: "imagenes/Ref005.jpeg", color: "rosado", hex: "#e093a3" },
  { id: "Ref010", ref: "Ref010", nombre: "Bolso blanco con lila herrajes dorados incluye dos tiras", precio: 63000, img: "imagenes/Ref010.jpeg", color: "rosado", hex: "#c7b8db" },
  { id: "Ref013", ref: "Ref013", nombre: "Bolso rosado claro llavero monedero oficina y salidas", precio: 75000, img: "imagenes/Ref013.jpeg", color: "rosado", hex: "#ebabb9" },
  { id: "Ref029", ref: "Ref029", nombre: "Monedero práctico rosado para tarjetas y monedas", precio: 22000, img: "imagenes/Ref029.jpeg", color: "rosado", hex: "#e5b6c0" },
  { id: "Ref042-lila", ref: "Ref042-Lila", nombre: "Canguro mediano lila bolsillos funcionales cierres plateados", precio: 35000, img: "imagenes/Ref042-Lila.jpeg", color: "rosado", grupo: "Ref042", colorLabel: "Lila", hex: "#c4a9d4" },
  { id: "Ref043-rosado", ref: "Ref043-Rosado", nombre: "Bolso MINI rosado herrajes dorados funcional con tira larga", precio: 50000, img: "imagenes/Ref043-Rosado.jpeg", color: "rosado", grupo: "Ref043", colorLabel: "Rosado", hex: "#e8a9b8" },

  // OTROS TONOS (GRIS, AZUL, AMARILLO, PLATEADO, OLIVO)
  { id: "Ref052", ref: "Ref052", nombre: "Bolso tipo canguro gris tres bolsillos herrajes plateados", precio: 50000, img: "imagenes/Ref052.jpeg", color: "otros", grupo: "Ref052", colorLabel: "Gris", hex: "#8e9399" },
  { id: "Ref040", ref: "Ref040", nombre: "Bolso cuadrado azul celeste detalles plateados con llavero", precio: 75000, img: "imagenes/Ref040.jpeg", color: "otros", hex: "#8db0cf" },
  { id: "Ref041", ref: "Ref041", nombre: "Bolso cuadrado amarillo semi mediano herrajes plateados", precio: 75000, img: "imagenes/Ref041.jpeg", color: "otros", hex: "#e5bf50" },
  { id: "Ref047", ref: "Ref047", nombre: "Bolso manos libres plateado metálico con cierre y tira larga", precio: 75000, img: "imagenes/Ref047.jpeg", color: "otros", grupo: "Ref047", colorLabel: "Plateado", hex: "#c0c0c0" },
  { id: "Ref047-verde", ref: "Ref047-Verde-Olivo", nombre: "Bolso manos libres verde olivo herrajes plateados tira larga", precio: 75000, img: "imagenes/Ref047-Verde-Olivo.jpeg", color: "otros", grupo: "Ref047", colorLabel: "Verde Olivo", hex: "#5a6b4a" },
  { id: "Ref050", ref: "Ref050", nombre: "Bolso manos libres fiesta con brillos plateados", precio: 90000, img: "imagenes/Ref050.jpeg", color: "otros", grupo: "Ref050", colorLabel: "Plata Brillo", hex: "#d0d0d8" }
];
