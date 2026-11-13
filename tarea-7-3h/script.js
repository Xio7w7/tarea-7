let inventario = [
  { id: 1, nombre: 'Mouse inalámbrico', categoria: 'electronica', cantidad: 15, precio: 12.99, agotado: false },
  { id: 2, nombre: 'Audífonos con micrófono', categoria: 'electronica', cantidad: 0, precio: 24.50, agotado: true },
  { id: 3, nombre: 'Cable USB-C de 1 metro', categoria: 'electronica', cantidad: 30, precio: 5.75, agotado: false },
  { id: 4, nombre: 'Cuaderno universitario', categoria: 'papeleria', cantidad: 40, precio: 2.25, agotado: false },
  { id: 5, nombre: 'Caja de lapiceros azules', categoria: 'papeleria', cantidad: 12, precio: 3.80, agotado: false },
  { id: 6, nombre: 'Resaltadores de colores', categoria: 'papeleria', cantidad: 0, precio: 4.10, agotado: true },
  { id: 7, nombre: 'Detergente líquido', categoria: 'limpieza', cantidad: 18, precio: 6.40, agotado: false },
  { id: 8, nombre: 'Desinfectante multiusos', categoria: 'limpieza', cantidad: 9, precio: 3.95, agotado: false },
  { id: 9, nombre: 'Café molido 500 g', categoria: 'alimentos', cantidad: 20, precio: 7.25, agotado: false }
];

const formularioProducto = document.getElementById('formulario-producto');
const cuerpoInventario = document.querySelector('#cuerpo-inventario');
const filtroCategoria = document.getElementById('filtro-categoria');
const mensajeError = document.querySelector('.mensaje-error');
const mensajeVacio = document.getElementById('mensaje-vacio');
const indicadorProductos = document.getElementById('total-productos');
const indicadorUnidades = document.getElementById('total-unidades');
const indicadorValor = document.getElementById('valor-total');
const indicadorAgotados = document.getElementById('total-agotados');

function crearGeneradorId() {
  let contador = 99;
  return function () {
    contador = contador + 1;
    return contador;
  };
}

const generarId = crearGeneradorId();

function calcularValorTotal(items) {
  let valorTotal = 0;
  for (let i = 0; i < items.length; i++) {
    valorTotal = valorTotal + items[i].cantidad * items[i].precio;
  }
  return valorTotal;
}

function contarUnidades(items) {
  let unidades = 0;
  for (let i = 0; i < items.length; i++) {
    unidades = unidades + items[i].cantidad;
  }
  return unidades;
}

function contarAgotados(items) {
  let agotados = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      agotados = agotados + 1;
    }
  }
  return agotados;
}

function contarPorCategoria(items) {
  const conteo = {};
  for (let i = 0; i < items.length; i++) {
    const categoria = items[i].categoria;
    if (conteo[categoria] === undefined) {
      conteo[categoria] = 0;
    }
    conteo[categoria] = conteo[categoria] + 1;
  }
  return conteo;
}

function formatearPrecio(numero) {
  return '$' + numero.toFixed(2);
}

function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
}

function crearBoton(texto, clase, id) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.textContent = texto;
  boton.classList.add(clase);
  boton.setAttribute('data-id', id);
  return boton;
}

function crearFila(item) {
  const fila = document.createElement('tr');

  if (item.agotado) {
    fila.classList.add('fila-agotada');
  } else {
    fila.classList.add('fila-disponible');
  }

  fila.appendChild(crearCelda(item.nombre));
  fila.appendChild(crearCelda(item.categoria));
  fila.appendChild(crearCelda(item.cantidad));
  fila.appendChild(crearCelda(formatearPrecio(item.precio)));
  fila.appendChild(crearCelda(formatearPrecio(item.cantidad * item.precio)));
  fila.appendChild(crearCelda(item.agotado ? 'Agotado' : 'Disponible'));

  const celdaAcciones = document.createElement('td');
  const textoEstado = item.agotado ? 'Marcar disponible' : 'Marcar agotado';
  celdaAcciones.appendChild(crearBoton(textoEstado, 'btn-estado', item.id));
  celdaAcciones.appendChild(crearBoton('Eliminar', 'btn-eliminar', item.id));
  fila.appendChild(celdaAcciones);

  return fila;
}

function limpiarTabla() {
  while (cuerpoInventario.firstChild) {
    cuerpoInventario.removeChild(cuerpoInventario.firstChild);
  }
}

// Los indicadores muestran los datos de los productos visibles según el filtro
function actualizarIndicadores(items) {
  indicadorProductos.textContent = items.length;
  indicadorUnidades.textContent = contarUnidades(items);
  indicadorValor.textContent = formatearPrecio(calcularValorTotal(items));
  indicadorAgotados.textContent = contarAgotados(items);
}

function renderizar(items) {
  limpiarTabla();

  for (let i = 0; i < items.length; i++) {
    cuerpoInventario.appendChild(crearFila(items[i]));
  }

  actualizarIndicadores(items);

  if (items.length === 0) {
    mensajeVacio.classList.remove('oculto');
  } else {
    mensajeVacio.classList.add('oculto');
  }
}

function filtrarPorCategoria(categoria) {
  const productosFiltrados = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].categoria === categoria) {
      productosFiltrados[productosFiltrados.length] = inventario[i];
    }
  }
  return productosFiltrados;
}

function obtenerProductosVisibles() {
  if (filtroCategoria.value === 'todas') {
    return inventario;
  }
  return filtrarPorCategoria(filtroCategoria.value);
}

function obtenerCategorias(items) {
  const categorias = [];
  for (let i = 0; i < items.length; i++) {
    let yaExiste = false;
    for (let j = 0; j < categorias.length; j++) {
      if (categorias[j] === items[i].categoria) {
        yaExiste = true;
      }
    }
    if (!yaExiste) {
      categorias[categorias.length] = items[i].categoria;
    }
  }
  return categorias;
}

function llenarSelectorCategorias() {
  const categoriaElegida = filtroCategoria.value;
  const opcionesActuales = filtroCategoria.querySelectorAll('option');

  for (let i = 1; i < opcionesActuales.length; i++) {
    filtroCategoria.removeChild(opcionesActuales[i]);
  }

  const categorias = obtenerCategorias(inventario);
  let sigueDisponible = false;

  for (let i = 0; i < categorias.length; i++) {
    const opcion = document.createElement('option');
    opcion.value = categorias[i];
    opcion.textContent = categorias[i];
    filtroCategoria.appendChild(opcion);
    if (categorias[i] === categoriaElegida) {
      sigueDisponible = true;
    }
  }

  filtroCategoria.value = sigueDisponible ? categoriaElegida : 'todas';
}

function validarProducto(datos) {
  if (datos.nombre === '') {
    throw new Error('El nombre del producto no puede estar vacío.');
  }
  if (datos.categoria === '') {
    throw new Error('La categoría no puede estar vacía.');
  }
  if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error('La cantidad debe ser un número entero mayor que cero.');
  }
  if (typeof datos.precio !== 'number' || Number.isNaN(datos.precio) || datos.precio < 0) {
    throw new Error('El precio debe ser un número mayor o igual que cero.');
  }
}

function leerNumero(campo) {
  if (campo.value.trim() === '') {
    return NaN;
  }
  return Number(campo.value);
}

function leerFormulario() {
  return {
    nombre: formularioProducto.elements['nombre'].value.trim(),
    categoria: formularioProducto.elements['categoria'].value.trim().toLowerCase(),
    cantidad: leerNumero(formularioProducto.elements['cantidad']),
    precio: leerNumero(formularioProducto.elements['precio'])
  };
}

function agregarProducto(event) {
  event.preventDefault();

  try {
    const datos = leerFormulario();
    validarProducto(datos);

    const nuevoProducto = {
      id: generarId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: datos.cantidad,
      precio: datos.precio,
      agotado: false
    };

    inventario[inventario.length] = nuevoProducto;
    console.log('Alta de producto: "' + nuevoProducto.nombre + '" con id ' + nuevoProducto.id);
    console.table(inventario);

    mensajeError.textContent = '';
    llenarSelectorCategorias();
    renderizar(obtenerProductosVisibles());
    formularioProducto.reset();
  } catch (error) {
    mensajeError.textContent = error.message;
    console.error('No se pudo agregar el producto: ' + error.message);
  }
}

function buscarNombrePorId(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      return inventario[i].nombre;
    }
  }
  return 'desconocido';
}

function eliminarProducto(id) {
  const inventarioActualizado = [];
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== id) {
      inventarioActualizado[inventarioActualizado.length] = inventario[i];
    }
  }
  return inventarioActualizado;
}

function cambiarEstado(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i].agotado = !inventario[i].agotado;
      const nuevoEstado = inventario[i].agotado ? 'agotado' : 'disponible';
      console.log('Cambio de estado: "' + inventario[i].nombre + '" ahora está ' + nuevoEstado);
    }
  }
}

function manejarClicTabla(event) {
  const botonPulsado = event.target;
  if (botonPulsado.tagName !== 'BUTTON') {
    return;
  }

  const id = Number(botonPulsado.getAttribute('data-id'));

  if (botonPulsado.classList.contains('btn-estado')) {
    cambiarEstado(id);
  } else if (botonPulsado.classList.contains('btn-eliminar')) {
    const nombreEliminado = buscarNombrePorId(id);
    inventario = eliminarProducto(id);
    console.log('Baja de producto: "' + nombreEliminado + '" con id ' + id);
  }

  renderizar(obtenerProductosVisibles());
}

function manejarCambioFiltro() {
  const productosVisibles = obtenerProductosVisibles();
  console.log('Filtro aplicado: ' + filtroCategoria.value + ' (' + productosVisibles.length + ' productos)');
  renderizar(productosVisibles);
}

renderizar(inventario);
llenarSelectorCategorias();

formularioProducto.addEventListener('submit', agregarProducto);
cuerpoInventario.addEventListener('click', manejarClicTabla);
filtroCategoria.addEventListener('change', manejarCambioFiltro);

console.log('Inventario inicial:');
console.table(inventario);
console.log('Cantidad de productos por categoría:');
console.table(contarPorCategoria(inventario));
