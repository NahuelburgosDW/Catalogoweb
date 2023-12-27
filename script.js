// Asignar el resultado de la función a la variable global
var objetos = obtenerObjetosDesdeJSON(); 
const inputElement = document.getElementById("inputBuscador");
// Obtén el botón de búsqueda y el campo de búsqueda
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



//funcion que llama el json y regresa una array con objetos iterables 
function obtenerObjetosDesdeJSON() {
  var objetos = []; // Array para almacenar objetos

  // Realizar una solicitud HTTP para cargar el archivo JSON
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "datos.json", false); // Cambia "datos.json" al nombre de tu archivo JSON
  xhr.send(null);

  if (xhr.status === 200) {
    // Analizar el JSON
    objetos = JSON.parse(xhr.responseText);

    // Verificar si es un array de objetos
    if (!Array.isArray(objetos)) {
      console.error("El archivo JSON no contiene un array de objetos válidos.");
      objetos = [];
    }
  } else {
    console.error("Error al cargar el archivo JSON.");
  }

  return objetos;
}
//Revisa el input de buscador
document.addEventListener("DOMContentLoaded", function() {
  // Obtener el valor del input almacenado en el almacenamiento local
  const inputElement = document.getElementById("inputBuscador");
  const storedInputValue = localStorage.getItem("inputValue");

  // Restablecer el valor del input si se encuentra almacenado
  if (storedInputValue) {
    inputElement.value = storedInputValue;
  }

  cargarProducto(); // Llama a tu función cuando la página se carga

  // Escuchar cambios en el input y almacenar el valor en el almacenamiento local
  inputElement.addEventListener("input", function() {
    localStorage.setItem("inputValue", inputElement.value);
  });
});

//funcion que carga los productos 
function cargarProducto() {
  const divElement = document.querySelector("#padre");
  divElement.innerHTML = '';
  const inputElement = document.getElementById("inputBuscador");
  const inputValor = inputElement.value.trim().toLowerCase();

  const productosFiltrados = inputValor
    ? objetos.filter(producto => {
        const nombreEnMinusculas = producto.Nombre.toLowerCase();
        const rubroEnMinusculas = (producto.Rubro || "").toLowerCase(); // Asegura que Rubro sea una cadena, incluso si es nulo
        return nombreEnMinusculas.includes(inputValor) || rubroEnMinusculas.includes(inputValor);
      })
    : objetos;

  // Aplicar trim() al campo "Rubro" en todos los productos filtrados
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

            <!-- Reemplazar el checkbox con un botón -->
            <button type="button" class="btn btn-primary" id="agregarBtn-${producto.ID}" onclick="agregarALista(${producto.ID}, '${producto.Nombre}', ${producto.Precio})">Agregar a Cotización</button>
        </div>
    </div>
`;

// Agregar logs para depurar
console.log(`ID: ${producto.ID}, Nombre: ${producto.Nombre}, Precio: ${producto.Precio}`);


    divElement.lastChild.appendChild(nuevoElemento);
  });

const oficinaButton = document.getElementById("oficinaButton");
const embalajeButton = document.getElementById("embalajeButton");
const comercialButton = document.getElementById("comercialButton");

// Agrega un controlador de eventos al botón de Oficina
oficinaButton.addEventListener("click", function () {
  inputElement.value = "Oficina";
  cargarProducto(); // Llama a tu función de filtrado
});

// Agrega un controlador de eventos al botón de Embalaje
embalajeButton.addEventListener("click", function () {
  inputElement.value = "Embalaje";
  cargarProducto(); // Llama a tu función de filtrado
});

// Agrega un controlador de eventos al botón de Comercial
comercialButton.addEventListener("click", function () {
  inputElement.value = "Comercial";
  cargarProducto(); // Llama a tu función de filtrado
});
}
//funcion del logo
function resetearPagina() {
  const inputElement = document.getElementById("inputBuscador");
  inputElement.value = ''; // Vaciar el valor del campo de entrada
  localStorage.removeItem("inputValue"); // Eliminar el valor almacenado en el almacenamiento local
  location.reload(); // Recargar la página
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

  let totalPrecio = 0; // Variable para calcular el total del precio

  productosAgrupados.forEach(({ id, nombre, cantidad, precio }) => {
    const listItem = document.createElement('li');
    listItem.className = 'cart-item';

    const precioProducto = parseFloat(precio); // Asegúrate de que el precio sea un número
    const subtotal = precioProducto * cantidad;

    listItem.innerHTML = `
      <span>${nombre} (Cantidad: ${cantidad}, Precio: $${subtotal.toFixed(2)})</span>
      <button class="remove-btn" onclick="eliminarDeLista(${id})">Eliminar</button>
    `;

    cartList.appendChild(listItem);

    // Actualizar el total del precio
    totalPrecio += subtotal;
  });

  const cotizacionContainer = document.getElementById("cotizacion");
  cotizacionContainer.style.display = listaCotizacion.length > 0 ? 'block' : 'none';

  // Mostrar el total al final de la lista
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
  // Limpiar la lista de productos en la cotización
  listaCotizacion.length = 0;

  // Actualizar la interfaz del carrito
  actualizarCarrito();

  // Log para indicar que la cotización ha sido cancelada
  console.log("Cotización cancelada");
}


function reiniciarProductosAgrupados() {
  productosAgrupados.length = 0;
}

function agruparPorId(productos) {
  // Reiniciar la variable global cada vez que se llame a la función
  reiniciarProductosAgrupados();

  productos.forEach(producto => {
    const index = productosAgrupados.findIndex(p => p.id === producto.id);

    if (index === -1) {
      // Si el producto no está en la lista, agregarlo con cantidad 1
      productosAgrupados.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
    } else {
      // Si el producto ya está en la lista, incrementar la cantidad
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

  // Actualizar la interfaz del carrito
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
  // Mostrar el formulario
  const formularioOverlay = document.getElementById("formulario-overlay");
  if (!formularioOverlay) {
    console.error("Elemento 'formulario-overlay' no encontrado.");
    return;
  }
  formularioOverlay.style.display = "flex";

  // Obtener el elemento de la lista en el formulario
  const cartListForm = document.getElementById("cart-list-form");
  if (!cartListForm) {
    console.error("Elemento 'cart-list-form' no encontrado.");
    return;
  }

  // Limpiar la lista actual en el formulario
  cartListForm.innerHTML = '';

  // Mostrar productosAgrupados en el formulario
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





