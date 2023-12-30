var objetos = obtenerObjetosDesdeJSON(); 
const inputElement = document.getElementById("inputBuscador");
const botonBusqueda = document.getElementById("bBuscador");
const inputBusqueda = document.getElementById("inputBuscador");
const storedInputValue = localStorage.getItem("inputValue");

const listaCotizacion = [];
const productosAgrupados = [];
document.addEventListener("DOMContentLoaded", function() {
  cerrarFormulario();
  if (storedInputValue) {
    inputElement.value = storedInputValue;
  }
  cargarProducto();   
  inputElement.addEventListener("input", function() {
    localStorage.setItem("inputValue", inputElement.value);
  });
});

botonBusqueda.addEventListener("click", function() {
  cargarProducto();
});

inputBusqueda.addEventListener("input", function() {
  if (inputBusqueda.value === "") {
    cargarProducto();
  }
});

const zoomableImages = document.querySelectorAll('.zoomable-image');
zoomableImages.forEach((image) => {
    image.addEventListener('mouseout', () => {
        image.style.transform = 'scale(1)';
    });
});

function obtenerObjetosDesdeJSON() {
  var objetos = [];
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "datos.json", false);
  xhr.send(null);

  if (xhr.status === 200) {
    objetos = JSON.parse(xhr.responseText);
    if (!Array.isArray(objetos)) {
      console.error("El archivo JSON no contiene un array de objetos válidos.");
      objetos = [];
    }
  } else {
    console.error("Error al cargar el archivo JSON.");
  }

  return objetos;
}

document.addEventListener("DOMContentLoaded", function() {
  const inputElement = document.getElementById("inputBuscador");
  const storedInputValue = localStorage.getItem("inputValue");

  if (storedInputValue) {
    inputElement.value = storedInputValue;
  }

  cargarProducto();

  inputElement.addEventListener("input", function() {
    localStorage.setItem("inputValue", inputElement.value);
  });
});

function cargarProducto() {
  const divElement = document.querySelector("#padre");
  divElement.innerHTML = '';
  const inputElement = document.getElementById("inputBuscador");
  const inputValor = inputElement.value.trim().toLowerCase();

  const productosFiltrados = inputValor
    ? objetos.filter(producto => {
        const nombreEnMinusculas = producto.Nombre.toLowerCase();
        const rubroEnMinusculas = (producto.Rubro || "").toLowerCase();
        return nombreEnMinusculas.includes(inputValor) || rubroEnMinusculas.includes(inputValor);
      })
    : objetos;

  const productosFiltradosSinEspacios = productosFiltrados.map(producto => {
    if (producto.Rubro) {
      producto.Rubro = producto.Rubro.trim();
    }
    return producto;
  });

  productosFiltradosSinEspacios.forEach((producto, index) => {
    if (index % 4 === 0) {
      const newRow = document.createElement('div');
      newRow.className = 'row';
      divElement.appendChild(newRow);
    }

    const nuevoElemento = document.createElement('div');
    nuevoElemento.className = 'col-md-3';

    nuevoElemento.innerHTML = `
    <div class="card mb-4 box-shadow">
        <img class="card-img top zoomable-image" src="${producto.Imagen}" alt="Card image cap" style="max-width: 500px; max-height: 500px;">
        <div class="card-body producto">
            <h3>${producto.Nombre}</h3>
            <p>ID: ${producto.ID || 0}</p>
            <p>Rubro: ${producto.Rubro || "Sin especificar"}</p>
            <p>Precio: $${(typeof producto.Precio === 'number' ? producto.Precio : 0).toFixed(2)}</p>
            <button type="button" class="btn btn-primary" id="agregarBtn-${producto.ID}" onclick="agregarALista(${producto.ID}, '${producto.Nombre}', ${producto.Precio})">Agregar a Cotización</button>
        </div>
    </div>`;

    divElement.lastChild.appendChild(nuevoElemento);
  });

  const oficinaButton = document.getElementById("oficinaButton");
  const embalajeButton = document.getElementById("embalajeButton");
  const comercialButton = document.getElementById("comercialButton");

  oficinaButton.addEventListener("click", function () {
    inputElement.value = "Oficina";
    cargarProducto();
  });

  embalajeButton.addEventListener("click", function () {
    inputElement.value = "Embalaje";
    cargarProducto();
  });

  comercialButton.addEventListener("click", function () {
    inputElement.value = "Comercial";
    cargarProducto();
  });
  escolarButton.addEventListener("click", function () {
    inputElement.value = "Oficina"
    inputElement.value = "Escolar"
    ;
    cargarProducto();
  });
}

function resetearPagina() {
  const inputElement = document.getElementById("inputBuscador");
  inputElement.value = '';
  localStorage.removeItem("inputValue");
  location.reload();
}

function imprimirArray(array) {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}

function actualizarCarrito() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = '';
  const productosAgrupados = agruparPorId(listaCotizacion);
  let totalPrecio = 0;

  productosAgrupados.forEach(({ id, nombre, cantidad, precio }) => {
    const listItem = document.createElement('li');
    listItem.className = 'cart-item';

    const precioProducto = parseFloat(precio);
    const subtotal = precioProducto * cantidad;

    listItem.innerHTML = `
      <span>${nombre} (Cantidad: ${cantidad}, Precio: $${subtotal.toFixed(2)})</span>
      <button class="remove-btn" onclick="eliminarDeLista(${id})">Eliminar</button>
    `;

    cartList.appendChild(listItem);
    totalPrecio += subtotal;
  });

  const cotizacionContainer = document.getElementById("cotizacion");
  cotizacionContainer.style.display = listaCotizacion.length > 0 ? 'block' : 'none';

  if (productosAgrupados.length > 0) {
    const totalElement = document.createElement('li');
    totalElement.innerHTML = `<strong>Total: $${totalPrecio.toFixed(2)}</strong>`;
    cartList.appendChild(totalElement);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  actualizarCarrito();
});

function cancelarCotizacion() {
  listaCotizacion.length = 0;
  actualizarCarrito();
  console.log("Cotización cancelada");
}

function reiniciarProductosAgrupados() {
  productosAgrupados.length = 0;
}

function agruparPorId(productos) {
  reiniciarProductosAgrupados();

  productos.forEach(producto => {
    const index = productosAgrupados.findIndex(p => p.id === producto.id);

    if (index === -1) {
      productosAgrupados.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    } else {
      productosAgrupados[index].cantidad++;
    }
  });

  return productosAgrupados;
}

function agregarALista(id, nombre, precio) {
  listaCotizacion.push({ id, nombre, precio });
  actualizarCarrito();
  console.log(`Producto agregado a la cotización: ${nombre} (ID: ${id})`);
  imprimirArray(listaCotizacion);
}

function eliminarDeLista(id) {
  const index = listaCotizacion.findIndex(producto => producto.id === id);

  if (index !== -1) {
    const productoEliminado = listaCotizacion.splice(index, 1)[0];
    console.log(`Producto eliminado de la cotización: ${productoEliminado.nombre} (ID: ${id})`);
    actualizarCarrito();
  }
}

function cancelarCotizacion() {
  listaCotizacion.length = 0;
  actualizarCarrito();
  console.log("Cotización cancelada");
}

function resetearPagina() {
  const inputElement = document.getElementById("inputBuscador");
  inputElement.value = '';
  localStorage.removeItem("inputValue");
  location.reload();
}

function cerrarFormulario() {
  document.getElementById("formulario-overlay").style.display = "none";
}

function mostrarFormulario() {
  const formularioOverlay = document.getElementById("formulario-overlay");
  if (!formularioOverlay) {
    console.error("Elemento 'formulario-overlay' no encontrado.");
    return;
  }
  formularioOverlay.style.display = "flex";
  const cartListForm = document.getElementById("cart-list-form");
  if (!cartListForm) {
    console.error("Elemento 'cart-list-form' no encontrado.");
    return;
  }
  cartListForm.innerHTML = '';
  productosAgrupados.forEach(({ id, nombre, cantidad, precio }) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <label for="${id}">
        ${nombre} (Cantidad: ${cantidad}, Precio: $${precio.toFixed(2)})
      </label>
      <input type="text" id="producto_${id}" name="nombre_${id}" value="${nombre}" style="display:none;">`;
    cartListForm.appendChild(listItem);
  });
}
