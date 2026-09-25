import { PRODUCTOS_BASE } from './catalogo-data.js';

// Configuración Nequi y Negocio
let configTienda = {
  telefonoWhatsApp: "573007809417",
  numeroNequi: "3007809417",
  titularNequi: "Lumi Shop Oficial",
  qrPersonalizado: ""
};

// Estado Global
let catalogo = [];
let carrito = [];
let favoritos = [];
let activeFilter = 'all';
let searchQuery = '';
let currentSort = 'default';
let detalleProductoActual = null;
let detalleQty = 1;

// Cola para subida múltiple de bolsos
let batchBolsosQueue = [];

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
  cargarConfiguracion();
  cargarCatalogo();
  cargarFavoritos();
  cargarCarrito();
  cargarDatosCheckout();
  renderCatalogo();
  actualizarInterfazCarrito();
  actualizarContadorFavs();
  setupPasteListener();
});

function cargarConfiguracion() {
  const saved = localStorage.getItem('lumi_config');
  if (saved) {
    try {
      configTienda = { ...configTienda, ...JSON.parse(saved) };
    } catch(e) {}
  }
  // El aviso de pago por WhatsApp y el Nequi van al mismo número: 300 780 94 17
  if (!saved || !configTienda.numeroNequi || configTienda.numeroNequi === "3043956874") {
    configTienda.numeroNequi = "3007809417";
  }
  if (!saved || configTienda.telefonoWhatsApp === "573043956874") {
    configTienda.telefonoWhatsApp = "573007809417";
  }
  guardarConfiguracion();
}

function guardarConfiguracion() {
  localStorage.setItem('lumi_config', JSON.stringify(configTienda));
}

function cargarCatalogo() {
  const guardado = localStorage.getItem('lumi_catalogo_custom');
  if (guardado) {
    try {
      const parsed = JSON.parse(guardado);
      // Sincronizar las clasificaciones actualizadas de colores solicitadas
      catalogo = parsed.map(item => {
        const baseMatch = PRODUCTOS_BASE.find(b => b.ref === item.ref);
        if (baseMatch) {
          return {
            ...item,
            color: baseMatch.color,
            nombre: baseMatch.nombre,
            colorLabel: baseMatch.colorLabel || item.colorLabel,
            hex: baseMatch.hex || item.hex
          };
        }
        return item;
      });
      guardarCatalogoEnStorage();
    } catch(e) {
      catalogo = [...PRODUCTOS_BASE];
    }
  } else {
    catalogo = [...PRODUCTOS_BASE];
  }
}

function guardarCatalogoEnStorage() {
  localStorage.setItem('lumi_catalogo_custom', JSON.stringify(catalogo));
}

function cargarFavoritos() {
  const favs = localStorage.getItem('lumi_favoritos');
  favoritos = favs ? JSON.parse(favs) : [];
}

function guardarFavoritos() {
  localStorage.setItem('lumi_favoritos', JSON.stringify(favoritos));
  actualizarContadorFavs();
}

function actualizarContadorFavs() {
  const badge = document.getElementById('favsCount');
  if (badge) badge.innerText = favoritos.length;
}

function cargarCarrito() {
  const cart = localStorage.getItem('lumi_carrito');
  carrito = cart ? JSON.parse(cart) : [];
}

function guardarCarrito() {
  localStorage.setItem('lumi_carrito', JSON.stringify(carrito));
  actualizarInterfazCarrito();
}

function cargarDatosCheckout() {
  const data = localStorage.getItem('lumi_checkout_data');
  if (data) {
    try {
      const parsed = JSON.parse(data);
      if (parsed.nombre) document.getElementById('checkoutNombre').value = parsed.nombre;
      if (parsed.lugar) document.getElementById('checkoutLugar').value = parsed.lugar;
      if (parsed.fecha) document.getElementById('checkoutFecha').value = parsed.fecha;
      if (parsed.nota) document.getElementById('checkoutNota').value = parsed.nota;
    } catch(e) {}
  } else {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaInput = document.getElementById('checkoutFecha');
    if (fechaInput) {
      fechaInput.value = hoy;
      fechaInput.min = hoy;
    }
  }
}

function guardarDatosCheckout() {
  const checkout = {
    nombre: document.getElementById('checkoutNombre').value.trim(),
    lugar: document.getElementById('checkoutLugar').value.trim(),
    fecha: document.getElementById('checkoutFecha').value,
    nota: document.getElementById('checkoutNota').value.trim()
  };
  localStorage.setItem('lumi_checkout_data', JSON.stringify(checkout));
  return checkout;
}

// Renderizado de Catálogo
export function renderCatalogo() {
  const grid = document.getElementById('gridProductos');
  const counter = document.getElementById('resultsCounter');

  let filtrados = catalogo.filter(p => {
    if (activeFilter === 'favs') {
      if (!favoritos.includes(p.ref)) return false;
    } else if (activeFilter !== 'all') {
      if (p.color !== activeFilter) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return p.nombre.toLowerCase().includes(q) || 
             p.ref.toLowerCase().includes(q) || 
             (p.color && p.color.toLowerCase().includes(q));
    }
    return true;
  });

  if (currentSort === 'price-asc') filtrados.sort((a, b) => a.precio - b.precio);
  else if (currentSort === 'price-desc') filtrados.sort((a, b) => b.precio - a.precio);
  else if (currentSort === 'name-asc') filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

  counter.innerText = `Mostrando ${filtrados.length} ${filtrados.length === 1 ? 'bolso' : 'bolsos'}`;

  if (filtrados.length === 0) {
    grid.innerHTML = `
      <div class="empty-catalog">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h4 style="font-size: 1.1rem; margin-bottom: 6px; color: var(--text-main);">No encontramos bolsos en esta categoría</h4>
        <p style="font-size: 0.85rem; margin-bottom: 16px;">Prueba con otra búsqueda o selecciona "Todos los Bolsos"</p>
        <button class="pill-btn active" style="margin: 0 auto;" onclick="resetAllFilters()">Ver todos los bolsos</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtrados.map(p => {
    const enCarrito = carrito.find(item => item.ref === p.ref);
    const esFavorito = favoritos.includes(p.ref);
    const imagenSrc = p.img && p.img.trim() !== "" ? p.img : "imagenes/Ref002.jpeg";

    let variantesHtml = '';
    if (p.grupo) {
      const hermanos = catalogo.filter(h => h.grupo === p.grupo);
      if (hermanos.length > 1) {
        variantesHtml = `
          <div class="variants-container" title="Colores disponibles">
            ${hermanos.map(h => `
              <div class="color-dot ${h.ref === p.ref ? 'active' : ''}" 
                   style="background-color: ${h.hex || '#333'};" 
                   title="${h.colorLabel || h.ref}" 
                   onclick="abrirModalDetalle('${h.ref}', event)"></div>
            `).join('')}
            <span class="color-name-label">${p.colorLabel || ''}</span>
          </div>
        `;
      }
    }

    return `
      <div class="card">
        <div class="img-container" onclick="abrirModalDetalle('${p.ref}')">
          <img src="${imagenSrc}" alt="${p.nombre}" loading="lazy">
          <div class="zoom-badge">🔍 Ver foto</div>
        </div>
        <button class="btn-fav ${esFavorito ? 'active' : ''}" title="Guardar en favoritos" onclick="toggleFavorito('${p.ref}', event)">
          ${esFavorito ? '♥' : '♡'}
        </button>
        <div class="info">
          <span class="ref-tag">REF: ${p.ref}</span>
          <div class="titulo" onclick="abrirModalDetalle('${p.ref}')" title="${p.nombre}">${p.nombre}</div>
          ${variantesHtml}
          <div class="precio-row">
            <div class="precio">$${p.precio.toLocaleString('es-CO')}</div>
          </div>
          ${enCarrito ? `
            <div class="card-cart-controller">
              <button class="card-qty-btn" onclick="cambiarCantidad('${p.ref}', -1, event)" title="Restar o quitar">−</button>
              <span class="card-qty-val" onclick="abrirModalCarrito()">${enCarrito.qty} en pedido</span>
              <button class="card-qty-btn" onclick="cambiarCantidad('${p.ref}', 1, event)" title="Sumar uno">+</button>
            </div>
          ` : `
            <button class="btn-add" onclick="toggleProductoCarrito('${p.ref}', event)">
              + Agregar al Pedido
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

// Búsqueda y Filtros
window.handleSearch = function(val) {
  searchQuery = val;
  document.getElementById('clearSearchBtn').style.display = val.length > 0 ? 'block' : 'none';
  renderCatalogo();
};

window.clearSearch = function() {
  document.getElementById('searchInput').value = '';
  searchQuery = '';
  document.getElementById('clearSearchBtn').style.display = 'none';
  renderCatalogo();
};

window.setFilter = function(filter, btn) {
  activeFilter = filter;
  document.querySelectorAll('.filter-pills-wrapper .pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderCatalogo();
};

window.handleSort = function(val) {
  currentSort = val;
  renderCatalogo();
};

window.resetAllFilters = function() {
  window.clearSearch();
  activeFilter = 'all';
  document.querySelectorAll('.filter-pills-wrapper .pill-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
  });
  renderCatalogo();
};

// Favoritos
window.toggleFavorito = function(ref, event) {
  if (event) event.stopPropagation();
  const idx = favoritos.indexOf(ref);
  if (idx > -1) {
    favoritos.splice(idx, 1);
    mostrarToast('Eliminado de tus favoritos');
  } else {
    favoritos.push(ref);
    mostrarToast('❤️ Añadido a tus favoritos');
  }
  guardarFavoritos();
  renderCatalogo();
  if (detalleProductoActual && detalleProductoActual.ref === ref) {
    actualizarBotonFavDetalle();
  }
};

// Carrito
window.toggleProductoCarrito = function(ref, event) {
  if (event) event.stopPropagation();
  const prod = catalogo.find(p => p.ref === ref);
  if (!prod) return;

  const idx = carrito.findIndex(item => item.ref === ref);
  if (idx > -1) {
    carrito[idx].qty = (carrito[idx].qty || 1) + 1;
    mostrarToast(`Agregaste otra unidad de ${prod.ref}`);
  } else {
    carrito.push({
      ref: prod.ref,
      nombre: prod.nombre,
      precio: prod.precio,
      img: prod.img,
      qty: 1
    });
    mostrarToast(`Bolso ${prod.ref} anadido`);
  }
  guardarCarrito();
  renderCatalogo();
};

window.cambiarCantidad = function(ref, delta, event) {
  if (event) event.stopPropagation();
  const idx = carrito.findIndex(i => i.ref === ref);
  if (idx === -1) {
    if (delta > 0) window.toggleProductoCarrito(ref, event);
    return;
  }

  carrito[idx].qty += delta;
  if (carrito[idx].qty <= 0) {
    carrito.splice(idx, 1);
    mostrarToast('Bolso removido del pedido');
  }
  guardarCarrito();
  renderCarritoItems();
  renderCatalogo();
};

window.eliminarDelCarrito = function(ref) {
  carrito = carrito.filter(i => i.ref !== ref);
  mostrarToast('Producto eliminado');
  guardarCarrito();
  renderCarritoItems();
  renderCatalogo();
};

function actualizarInterfazCarrito() {
  const cartBar = document.getElementById("cartBar");
  const itemsCount = document.getElementById("itemsCount");
  const itemsTotal = document.getElementById("itemsTotal");
  const quickSummary = document.getElementById("cartQuickSummary");

  const totalItems = carrito.reduce((sum, item) => sum + (item.qty || 1), 0);
  const totalPesos = carrito.reduce((sum, item) => sum + (item.precio * (item.qty || 1)), 0);

  // Actualizar boton permanente en cabecera
  const navBadge = document.getElementById("headerCartCount");
  if (navBadge) navBadge.innerText = totalItems;
  const navTab = document.getElementById("navTabPedidos");
  if (navTab) {
    if (totalItems > 0) navTab.classList.add("has-items");
    else navTab.classList.remove("has-items");
  }

  if (totalItems > 0) {
    itemsCount.innerText = `${totalItems} ${totalItems === 1 ? 'bolso' : 'bolsos'} en tu pedido`;
    itemsTotal.innerText = `$${totalPesos.toLocaleString('es-CO')}`;
    cartBar.classList.add("show");
    if (quickSummary) quickSummary.innerText = `${totalItems} bolsos en pedido`;
  } else {
    cartBar.classList.remove("show");
    if (quickSummary) quickSummary.innerText = '';
  }
}

// Pasarela de Pago
window.abrirModalCarrito = function() {
  irAPasoCheckout(1);
  document.getElementById("cartModal").classList.add("open");
};

window.cerrarModalCarrito = function() {
  document.getElementById("cartModal").classList.remove("open");
};

window.irAPasoCheckout = function(paso) {
  const step1 = document.getElementById("checkoutStep1");
  const step2 = document.getElementById("checkoutStep2");
  const step3Nequi = document.getElementById("checkoutStepNequi");
  const stepIndicator = document.getElementById("checkoutStepIndicator");

  if (paso === 1) {
    renderCarritoItems();
    step1.style.display = "block";
    step2.style.display = "none";
    step3Nequi.style.display = "none";
    if (stepIndicator) stepIndicator.innerText = "Paso 1 de 3: Revisa tu pedido";
  } else if (paso === 2) {
    if (carrito.length === 0) {
      mostrarToast('Tu carrito está vacío');
      return;
    }
    step1.style.display = "none";
    step2.style.display = "block";
    step3Nequi.style.display = "none";
    if (stepIndicator) stepIndicator.innerText = "Paso 2 de 3: Datos de entrega";
  } else if (paso === 3) {
    const data = guardarDatosCheckout();
    if (!data.nombre) {
      mostrarToast('Por favor escribe tu nombre completo');
      document.getElementById('checkoutNombre').focus();
      return;
    }
    if (!data.lugar) {
      mostrarToast('Por favor indica la dirección o lugar de entrega');
      document.getElementById('checkoutLugar').focus();
      return;
    }

    prepararPantallaNequi(data);
    step1.style.display = "none";
    step2.style.display = "none";
    step3Nequi.style.display = "block";
    if (stepIndicator) stepIndicator.innerText = "Paso 3 de 3: Pago con Nequi & Confirmación";
  }
};

function renderCarritoItems() {
  const container = document.getElementById("cartItemsContainer");
  const summaryTotal = document.getElementById("step1Total");
  const btnNext = document.getElementById("btnGoToStep2");

  if (carrito.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 12px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 6px; font-weight: 600; color: var(--text-main);">Tu carrito está vacío</p>
        <p style="font-size: 0.85rem;">Explora los bolsos y toca "+ Agregar al Pedido"</p>
      </div>
    `;
    if (summaryTotal) summaryTotal.innerText = "$0";
    if (btnNext) btnNext.style.display = "none";
    return;
  }

  if (btnNext) btnNext.style.display = "flex";

  container.innerHTML = carrito.map(item => {
    return `
      <div class="cart-item-row">
        <img src="${item.img}" class="cart-item-thumb" alt="${item.nombre}">
        <div class="cart-item-details">
          <span class="cart-item-ref">REF: ${item.ref}</span>
          <div class="cart-item-title">${item.nombre}</div>
          <div class="cart-item-price">$${item.precio.toLocaleString('es-CO')} c/u</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="cambiarCantidad('${item.ref}', -1)">−</button>
          <span class="qty-number">${item.qty || 1}</span>
          <button class="qty-btn" onclick="cambiarCantidad('${item.ref}', 1)">+</button>
        </div>
        <button class="btn-item-delete" title="Eliminar" onclick="eliminarDelCarrito('${item.ref}')">🗑️</button>
      </div>
    `;
  }).join('');

  const totalPesos = carrito.reduce((sum, item) => sum + (item.precio * (item.qty || 1)), 0);
  if (summaryTotal) summaryTotal.innerText = `$${totalPesos.toLocaleString('es-CO')}`;
}

function prepararPantallaNequi(checkoutData) {
  const totalPesos = carrito.reduce((sum, item) => sum + (item.precio * (item.qty || 1)), 0);
  const totalFormateado = `$${totalPesos.toLocaleString('es-CO')}`;

  document.getElementById("nequiMontoPagar").innerText = totalFormateado;
  document.getElementById("nequiNumeroDisplay").innerText = configTienda.numeroNequi;
  document.getElementById("nequiTitularDisplay").innerText = configTienda.titularNequi;

  const qrImg = document.getElementById("nequiQrImage");
  if (configTienda.qrPersonalizado && configTienda.qrPersonalizado.trim() !== '') {
    qrImg.src = configTienda.qrPersonalizado;
  } else {
    const qrData = `nequi://transfer?phone=${configTienda.numeroNequi}&value=${totalPesos}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(qrData)}`;
  }
}

window.copiarNumeroNequi = function() {
  navigator.clipboard.writeText(configTienda.numeroNequi).then(() => {
    mostrarToast(`✓ Número Nequi copiado: ${configTienda.numeroNequi}`);
  }).catch(() => {
    mostrarToast(`Número Nequi: ${configTienda.numeroNequi}`);
  });
};

window.completarYEnviarWhatsApp = function() {
  if (carrito.length === 0) {
    mostrarToast('No hay bolsos en el pedido');
    return;
  }

  const checkoutData = guardarDatosCheckout();
  const totalPesos = carrito.reduce((sum, item) => sum + (item.precio * (item.qty || 1)), 0);
  const totalItems = carrito.reduce((sum, item) => sum + (item.qty || 1), 0);
  const orderId = `LUMI-${Math.floor(1000 + Math.random() * 9000)}`;
  const fechaPedido = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const nuevoPedidoRegistro = {
    id: orderId,
    fechaRegistro: fechaPedido,
    cliente: checkoutData.nombre || 'Cliente sin nombre',
    lugar: checkoutData.lugar || 'Por definir',
    fechaEntrega: checkoutData.fecha || 'Lo antes posible',
    nota: checkoutData.nota || 'Ninguna',
    total: totalPesos,
    items: [...carrito],
    estado: 'Pendiente de Comprobante'
  };

  guardarPedidoEnBandejaDueña(nuevoPedidoRegistro);

  let msg = `PEDIDO LUMI SHOP #${orderId}\n`;
  msg += `----------------------------------------\n`;
  msg += `Cliente: ${checkoutData.nombre}\n`;
  msg += `Lugar de Entrega: ${checkoutData.lugar}\n`;
  msg += `Fecha estimada entrega: ${checkoutData.fecha || 'Lo antes posible'}\n`;
  if (checkoutData.nota) msg += `Nota adicional: ${checkoutData.nota}\n`;
  msg += `Metodo de Pago: Nequi (${configTienda.numeroNequi}) - $${totalPesos.toLocaleString('es-CO')}\n`;
  msg += `----------------------------------------\n`;
  msg += `ARTICULOS SOLICITADOS (${totalItems}):\n\n`;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * (item.qty || 1);
    msg += `${index + 1}. ${item.nombre}\n`;
    msg += `   - Ref: ${item.ref}\n`;
    msg += `   - Cantidad: ${item.qty || 1} un. x $${item.precio.toLocaleString('es-CO')}\n`;
    msg += `   - Subtotal: $${subtotal.toLocaleString('es-CO')}\n\n`;
  });

  msg += `----------------------------------------\n`;
  msg += `TOTAL TRANSFERIDO POR NEQUI: $${totalPesos.toLocaleString('es-CO')}\n\n`;
  msg += `Adjunto la captura del comprobante de transferencia Nequi para confirmar el despacho.\n`;
  msg += `Muchas gracias.`;

  const url = `https://wa.me/${configTienda.telefonoWhatsApp}?text=${encodeURIComponent(msg)}`;

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  mostrarToast(`¡Pedido #${orderId} generado con éxito!`);
  
  carrito = [];
  guardarCarrito();
  cerrarModalCarrito();
};

function guardarPedidoEnBandejaDueña(orden) {
  let pedidos = [];
  try {
    const saved = localStorage.getItem('lumi_pedidos_registrados');
    if (saved) pedidos = JSON.parse(saved);
  } catch(e) {}

  pedidos.unshift(orden);
  localStorage.setItem('lumi_pedidos_registrados', JSON.stringify(pedidos));
}

// Modal Zoom / Detalle de Producto
window.abrirModalDetalle = function(ref, event) {
  if (event) event.stopPropagation();
  const prod = catalogo.find(p => p.ref === ref);
  if (!prod) return;

  detalleProductoActual = prod;
  detalleQty = 1;

  document.getElementById("detailRef").innerText = `REF: ${prod.ref}`;
  document.getElementById("detailTitle").innerText = prod.nombre;
  document.getElementById("detailPrice").innerText = `$${prod.precio.toLocaleString('es-CO')}`;
  document.getElementById("detailImg").src = prod.img;
  document.getElementById("detailQty").innerText = detalleQty;

  actualizarBotonFavDetalle();

  const variantsSection = document.getElementById("detailVariantsSection");
  const variantsContainer = document.getElementById("detailVariants");
  if (prod.grupo) {
    const hermanos = catalogo.filter(h => h.grupo === prod.grupo);
    if (hermanos.length > 1) {
      variantsSection.style.display = "block";
      variantsContainer.innerHTML = hermanos.map(h => `
        <div class="color-dot ${h.ref === prod.ref ? 'active' : ''}" 
             style="background-color: ${h.hex || '#333'}; width: 22px; height: 22px;" 
             title="${h.colorLabel || h.ref}" 
             onclick="abrirModalDetalle('${h.ref}')"></div>
      `).join('');
    } else {
      variantsSection.style.display = "none";
    }
  } else {
    variantsSection.style.display = "none";
  }

  document.getElementById("productDetailModal").classList.add("open");
};

window.cerrarModalDetalle = function() {
  document.getElementById("productDetailModal").classList.remove("open");
  detalleProductoActual = null;
};

window.cambiarDetalleQty = function(delta) {
  detalleQty = Math.max(1, detalleQty + delta);
  document.getElementById("detailQty").innerText = detalleQty;
};

window.agregarDesdeDetalle = function() {
  if (!detalleProductoActual) return;
  const ref = detalleProductoActual.ref;

  const idx = carrito.findIndex(item => item.ref === ref);
  if (idx > -1) {
    carrito[idx].qty = (carrito[idx].qty || 1) + detalleQty;
  } else {
    carrito.push({
      ref: detalleProductoActual.ref,
      nombre: detalleProductoActual.nombre,
      precio: detalleProductoActual.precio,
      img: detalleProductoActual.img,
      qty: detalleQty
    });
  }

  mostrarToast(`Añadido ${detalleQty}x al pedido`);
  guardarCarrito();
  renderCatalogo();
  cerrarModalDetalle();
};

function actualizarBotonFavDetalle() {
  const btn = document.getElementById("detailBtnFav");
  if (!btn || !detalleProductoActual) return;
  const esFav = favoritos.includes(detalleProductoActual.ref);
  btn.classList.toggle("active", esFav);
  btn.innerText = esFav ? "♥" : "♡";
}

window.toggleFavDetalle = function() {
  if (!detalleProductoActual) return;
  window.toggleFavorito(detalleProductoActual.ref);
  actualizarBotonFavDetalle();
};

// Panel Administrador de la Dueña
window.abrirModalOwner = function() {
  mostrarTabOwner('orders');
  document.getElementById("ownerModal").classList.add("open");
};

window.cerrarModalOwner = function() {
  document.getElementById("ownerModal").classList.remove("open");
};

window.mostrarTabOwner = function(tab) {
  document.querySelectorAll('.owner-tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.owner-nav-btn').forEach(btn => btn.classList.remove('active'));

  const activeContent = document.getElementById(`ownerTab_${tab}`);
  const activeBtn = document.getElementById(`ownerBtn_${tab}`);
  if (activeContent) activeContent.style.display = 'block';
  if (activeBtn) activeBtn.classList.add('active');

  if (tab === 'orders') renderBandejaPedidos();
  if (tab === 'manage') renderGestionBolsos();
  if (tab === 'settings') renderConfiguracionDueña();
  if (tab === 'export') actualizarJsonExport();
};

// Bandeja de Pedidos para la Dueña
function renderBandejaPedidos() {
  const container = document.getElementById("ownerOrdersList");
  let pedidos = [];
  try {
    const saved = localStorage.getItem('lumi_pedidos_registrados');
    if (saved) pedidos = JSON.parse(saved);
  } catch(e) {}

  if (pedidos.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p style="font-size: 1rem; font-weight: 600;">No hay pedidos registrados todavía</p>
        <p style="font-size: 0.8rem; margin-top: 4px;">Cuando un cliente complete un pedido saldrá aquí con todos los detalles.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = pedidos.map((p, idx) => `
    <div style="border: 1px solid var(--border-color); border-radius: 12px; padding: 12px; margin-bottom: 10px; background: #faf8f8;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
        <div>
          <strong style="color: var(--accent-gold); font-size: 0.95rem;">${p.id}</strong>
          <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px;">${p.fechaRegistro}</span>
        </div>
        <span style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">$${p.total.toLocaleString('es-CO')}</span>
      </div>
      <div style="font-size: 0.82rem; line-height: 1.4; color: var(--text-main);">
        <strong>Cliente:</strong> ${p.cliente}<br>
        <strong>Entrega:</strong> ${p.lugar} (${p.fechaEntrega})<br>
        ${p.nota && p.nota !== 'Ninguna' ? `<strong>Nota:</strong> ${p.nota}<br>` : ''}
        <strong>Bolsos (${p.items.length}):</strong> ${p.items.map(i => `${i.ref} (x${i.qty})`).join(', ')}
      </div>
      <div style="margin-top: 8px; display: flex; gap: 8px;">
        <button class="pill-btn" style="padding: 4px 10px; font-size: 0.75rem;" onclick="eliminarPedidoHistorial(${idx})">Archivar</button>
      </div>
    </div>
  `).join('');
}

window.eliminarPedidoHistorial = function(idx) {
  let pedidos = JSON.parse(localStorage.getItem('lumi_pedidos_registrados') || '[]');
  pedidos.splice(idx, 1);
  localStorage.setItem('lumi_pedidos_registrados', JSON.stringify(pedidos));
  renderBandejaPedidos();
  mostrarToast('Pedido archivado');
};

// ==========================================
// BORRAR BOLSOS DEL CATÁLOGO
// ==========================================
function renderGestionBolsos() {
  const container = document.getElementById("ownerBolsosList");
  const searchVal = (document.getElementById("searchManageBolsos") ? document.getElementById("searchManageBolsos").value.toLowerCase().trim() : "");

  let list = catalogo;
  if (searchVal) {
    list = catalogo.filter(b => b.ref.toLowerCase().includes(searchVal) || b.nombre.toLowerCase().includes(searchVal));
  }

  const countBadge = document.getElementById("manageBolsosCount");
  if (countBadge) countBadge.innerText = `${catalogo.length} bolsos activos`;

  if (list.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--text-muted);">No se encontraron bolsos con ese filtro</div>`;
    return;
  }

  container.innerHTML = list.map(b => `
    <div style="display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 10px; margin-bottom: 8px; background: #ffffff;">
      <img src="${b.img}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 6px; flex-shrink: 0;" alt="${b.ref}">
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.75rem; font-weight: 700; color: var(--accent-color);">${b.ref}</div>
        <div style="font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text-main);">${b.nombre}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">$${b.precio.toLocaleString('es-CO')} • Color: ${b.color}</div>
      </div>
      <button class="pill-btn" style="background: #ffebeb; border-color: #ffd0d0; color: #d9534f; padding: 6px 10px; font-size: 0.75rem; font-weight: 700;" onclick="borrarBolsoDeCatalogo('${b.ref}')">
        🗑️ Borrar
      </button>
    </div>
  `).join('');
}

window.handleSearchManageBolsos = function() {
  renderGestionBolsos();
};

window.borrarBolsoDeCatalogo = function(ref) {
  if (confirm(`¿Estás segura de borrar el bolso ${ref} del catálogo? Ya no saldrá en la tienda.`)) {
    catalogo = catalogo.filter(b => b.ref !== ref);
    // También borrar de favoritos y de carrito si estaba
    favoritos = favoritos.filter(r => r !== ref);
    carrito = carrito.filter(r => r.ref !== ref);
    
    guardarCatalogoEnStorage();
    guardarFavoritos();
    guardarCarrito();

    renderGestionBolsos();
    renderCatalogo();
    actualizarJsonExport();
    mostrarToast(`✓ Bolso ${ref} eliminado del catálogo`);
  }
};

// ==========================================
// AÑADIR VARIOS BOLSOS EN UNA SOLA VEZ
// ==========================================
function setupPasteListener() {
  const dropZone = document.getElementById("imageDropZoneBatch");
  if (!dropZone) return;

  window.addEventListener('paste', (e) => {
    const ownerModal = document.getElementById("ownerModal");
    if (!ownerModal.classList.contains("open")) return;
    const addTab = document.getElementById("ownerTab_add");
    if (addTab && addTab.style.display !== "none") {
      const items = (e.clipboardData || e.originalEvent.clipboardData).items;
      for (let index in items) {
        const item = items[index];
        if (item.kind === 'file' && item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          agregarImagenABatch(blob);
          e.preventDefault();
        }
      }
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        agregarImagenABatch(e.dataTransfer.files[i]);
      }
    }
  });
}

window.handleMultipleFilesSelect = function(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;
  for (let i = 0; i < files.length; i++) {
    agregarImagenABatch(files[i]);
  }
  event.target.value = '';
};

function agregarImagenABatch(file) {
  if (!file.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    comprimirImagen(e.target.result, 800, 0.82, (base64) => {
      // Proponer referencia automática (ej. Ref054, Ref055...)
      const numBase = 53 + catalogo.length - PRODUCTOS_BASE.length + batchBolsosQueue.length + 1;
      const refSugerida = `Ref0${numBase > 99 ? numBase : (numBase > 9 ? numBase : '0' + numBase)}`;

      const precioDefecto = document.getElementById("batchGlobalPrice") ? (parseInt(document.getElementById("batchGlobalPrice").value) || 75000) : 75000;

      batchBolsosQueue.push({
        id: `batch-${Date.now()}-${Math.random()}`,
        img: base64,
        ref: refSugerida,
        nombre: `Bolso elegante ${refSugerida}`,
        precio: precioDefecto,
        color: "negro"
      });

      renderBatchQueue();
      mostrarToast(`✓ Imagen añadida a la cola (${batchBolsosQueue.length} bolsos pendientes)`);
    });
  };
  reader.readAsDataURL(file);
}

function renderBatchQueue() {
  const container = document.getElementById("batchQueueContainer");
  const saveBtn = document.getElementById("btnGuardarTodosBolsos");
  const queueMeta = document.getElementById("batchQueueMeta");

  if (batchBolsosQueue.length === 0) {
    container.innerHTML = ``;
    if (saveBtn) saveBtn.style.display = "none";
    if (queueMeta) queueMeta.innerText = "No hay fotos seleccionadas aún.";
    return;
  }

  if (saveBtn) {
    saveBtn.style.display = "flex";
    saveBtn.innerText = `💾 Guardar ${batchBolsosQueue.length} ${batchBolsosQueue.length === 1 ? 'bolso' : 'bolsos'} en el catálogo`;
  }
  if (queueMeta) queueMeta.innerText = `${batchBolsosQueue.length} ${batchBolsosQueue.length === 1 ? 'bolso listo para guardar' : 'bolsos listos para guardar'}:`;

  container.innerHTML = batchBolsosQueue.map((item, idx) => `
    <div style="display: flex; gap: 10px; align-items: flex-start; padding: 10px; border: 1px solid var(--border-color); border-radius: 12px; background: #ffffff; margin-bottom: 8px;">
      <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" alt="Foto">
      <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
        <div style="display: flex; gap: 8px;">
          <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.8rem; width: 100px; font-weight: 700;" placeholder="Ref" value="${item.ref}" onchange="updateBatchItem(${idx}, 'ref', this.value)">
          <input type="number" class="form-input" style="padding: 6px 8px; font-size: 0.8rem; width: 110px;" placeholder="Precio" value="${item.precio}" onchange="updateBatchItem(${idx}, 'precio', this.value)">
          <select class="form-select" style="padding: 6px 8px; font-size: 0.78rem; flex: 1;" onchange="updateBatchItem(${idx}, 'color', this.value)">
            <option value="negro" ${item.color === 'negro' ? 'selected' : ''}>Negro</option>
            <option value="vinotinto" ${item.color === 'vinotinto' ? 'selected' : ''}>Vino / Rojo</option>
            <option value="cafe" ${item.color === 'cafe' ? 'selected' : ''}>Café / Beige</option>
            <option value="rosado" ${item.color === 'rosado' ? 'selected' : ''}>Rosa / Lila</option>
            <option value="otros" ${item.color === 'otros' ? 'selected' : ''}>Otro</option>
          </select>
        </div>
        <input type="text" class="form-input" style="padding: 6px 8px; font-size: 0.8rem;" placeholder="Nombre / Descripción" value="${item.nombre}" onchange="updateBatchItem(${idx}, 'nombre', this.value)">
      </div>
      <button class="pill-btn" style="background: #ffebeb; border-color: #ffd0d0; color: #d9534f; padding: 6px; font-size: 0.75rem;" onclick="quitarDeBatch(${idx})" title="Quitar">✕</button>
    </div>
  `).join('');
}

window.updateBatchItem = function(idx, field, value) {
  if (!batchBolsosQueue[idx]) return;
  if (field === 'precio') batchBolsosQueue[idx][field] = parseInt(value) || 0;
  else batchBolsosQueue[idx][field] = value.trim();
};

window.quitarDeBatch = function(idx) {
  batchBolsosQueue.splice(idx, 1);
  renderBatchQueue();
};

window.aplicarPrecioGlobal = function() {
  const input = document.getElementById("batchGlobalPrice");
  const p = parseInt(input.value);
  if (!p || p <= 0) {
    mostrarToast('Ingresa un precio válido');
    return;
  }
  batchBolsosQueue.forEach(item => { item.precio = p; });
  renderBatchQueue();
  mostrarToast(`✓ Precio de $${p.toLocaleString('es-CO')} aplicado a todos los bolsos`);
};

window.guardarTodosLosBolsosBatch = function() {
  if (batchBolsosQueue.length === 0) {
    mostrarToast('No hay bolsos en la lista para guardar');
    return;
  }

  // Validar y transformar a nuevos bolsos
  const nuevos = batchBolsosQueue.map(item => ({
    id: item.ref.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    ref: item.ref,
    nombre: item.nombre || `Bolso elegante ${item.ref}`,
    precio: parseInt(item.precio) || 75000,
    color: item.color || "negro",
    img: item.img,
    hex: item.color === 'negro' ? '#1a1a1a' : (item.color === 'cafe' ? '#7a543b' : (item.color === 'vinotinto' ? '#8a1d30' : '#d48896'))
  }));

  catalogo = [...nuevos, ...catalogo];
  guardarCatalogoEnStorage();
  
  const count = batchBolsosQueue.length;
  batchBolsosQueue = [];
  renderBatchQueue();
  renderCatalogo();
  actualizarJsonExport();

  mostrarToast(`🎉 ¡${count} nuevos bolsos añadidos al catálogo con éxito!`);
  window.mostrarTabOwner('manage');
};

function comprimirImagen(srcBase64, maxDim, calidad, callback) {
  const img = new Image();
  img.src = srcBase64;
  img.onload = function() {
    let w = img.width;
    let h = img.height;
    if (w > maxDim || h > maxDim) {
      if (w > h) {
        h = Math.round((h * maxDim) / w);
        w = maxDim;
      } else {
        w = Math.round((w * maxDim) / h);
        h = maxDim;
      }
    }
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL('image/jpeg', calidad));
  };
}

// Configuración Nequi & WhatsApp
function renderConfiguracionDueña() {
  document.getElementById("cfgWhatsapp").value = configTienda.telefonoWhatsApp;
  document.getElementById("cfgNequiNum").value = configTienda.numeroNequi;
  document.getElementById("cfgNequiTitular").value = configTienda.titularNequi;
}

window.guardarAjustesDueña = function() {
  configTienda.telefonoWhatsApp = document.getElementById("cfgWhatsapp").value.trim() || "573043956874";
  configTienda.numeroNequi = document.getElementById("cfgNequiNum").value.trim() || "3007809417";
  configTienda.titularNequi = document.getElementById("cfgNequiTitular").value.trim() || "Lumi Shop Oficial";
  guardarConfiguracion();
  mostrarToast('✓ Configuración de Nequi y WhatsApp guardada');
};

function actualizarJsonExport() {
  const area = document.getElementById("exportJsonArea");
  if (area) area.value = JSON.stringify(catalogo, null, 2);
}

window.copiarJsonExport = function() {
  const area = document.getElementById("exportJsonArea");
  area.select();
  navigator.clipboard.writeText(area.value).then(() => {
    mostrarToast('JSON copiado al portapapeles');
  });
};

window.restaurarCatalogoOriginal = function() {
  if (confirm('¿Deseas restaurar el catálogo a los bolsos oficiales?')) {
    localStorage.removeItem('lumi_catalogo_custom');
    catalogo = [...PRODUCTOS_BASE];
    renderCatalogo();
    actualizarJsonExport();
    mostrarToast('Catálogo oficial restaurado');
  }
};

window.cerrarModalSiClickFondo = function(e, modalId) {
  if (e.target.id === modalId) {
    document.getElementById(modalId).classList.remove("open");
  }
};

function mostrarToast(mensaje) {
  const toast = document.getElementById("toastNotify");
  toast.innerText = mensaje;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}
