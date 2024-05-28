$(document).ready(function () {
  // Asignar eventos a los botones
  $("#btnAgregar").click(agregar);
  $("#btnEditar").click(edit);

  // Evento para precargar datos en el modal de edición
  $("#exampleModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget); // Botón que activó el modal
    var nombre = button.data("nombre"); // Extraer información de atributos de datos
    var precio = button.data("precio");
    $("#nombreModal").val(nombre);
    $("#precioModal").val(precio);
    // Mostrar imagen según el deporte seleccionado
    $("#imagenModal").attr("src", getImageUrl(nombre));
  });

  // Cargar datos al cargar la página
  getData();
});

// Objeto que mapea nombres de deportes a URLs de imágenes
const sportImages = {
  futbol: "https://example.com/images/futbol.jpg",
  tenis:"public/imagen/tenis.jpeg",
  voleibol: "https://example.com/images/voleibol.jpg",
  beisbol: "https://example.com/images/beisbol.jpg",
  baloncesto: "https://example.com/images/baloncesto.jpg",
  // Agrega más deportes según sea necesario
};

// Función para obtener la URL de la imagen según el nombre del deporte
function getImageUrl(sportName) {
  // Reemplaza espacios con guiones y convierte todo a minúsculas para formar el nombre de la imagen
  let imageName = sportName.toLowerCase().replace(/\s+/g, "-");
  // Busca la URL de la imagen en el objeto sportImages
  return sportImages[imageName];
}

// Función para obtener datos de deportes
function getData() {
  $("#cuerpo").html("");
  axios
    .get("/deportes")
    .then((response) => {
      let deportes = response.data.deportes;
      deportes.forEach((d, i) => {
        $("#cuerpo").append(`
                      <tr>
                        <th scope="row">${i + 1}</th>
                        <td>${d.nombre}</td>
                        <td>${d.precio}</td>
                        <td><img src="${d.imagen}" alt="${
          d.nombre
        }" class="sport-image"></td>
                        <td>
                          <button class="btn btn-warning btn-editar" data-nombre="${
                            d.nombre
                          }" data-precio="${
          d.precio
        }" data-toggle="modal" data-target="#exampleModal">Editar</button>
                          <button class="btn btn-danger btn-eliminar" data-nombre="${
                            d.nombre
                          }">Eliminar</button>
                        </td>
                      </tr>
                    `);
      });
      // Asignar evento a los botones de eliminar después de agregarlos
      $(".btn-eliminar").click(function () {
        let nombre = $(this).data("nombre");
        eliminar(nombre);
      });
    })
    .catch((error) => {
      showAlert("error", "Error fetching data");
      console.error("Error fetching data:", error);
    });
}

// Función para eliminar un deporte
function eliminar(nombre) {
  // Mostrar ventana modal de confirmación
  $("#confirmarEliminacionModal").modal("show");

  // Asignar evento al botón de confirmación en la ventana modal
  $("#confirmarEliminacionBtn").click(function () {
    // Ocultar ventana modal de confirmación
    $("#confirmarEliminacionModal").modal("hide");

    axios
      .post("/eliminar", { nombre })
      .then((response) => {
        showAlert("success", response.data.message);
        getData();
      })
      .catch((error) => {
        showAlert("error", error.response.data.error);
      });
  });
}

// Función para mostrar alertas
function showAlert(type, message) {
  const alertElement = type === "success" ? "#success-alert" : "#error-alert";
  $(alertElement).text(message).removeClass("d-none");
  setTimeout(() => {
    $(alertElement).addClass("d-none");
  }, 3000);
}

// Función para agregar un deporte
function agregar() {
  let nombre = $("#nombre").val();
  let precio = $("#precio").val();
  // Aquí deberías tener un campo en tu formulario para ingresar la URL de la imagen
  let imagenUrl = $("#imagenUrl").val();
  axios
    .post("/agregar", { nombre, precio, imagen: imagenUrl })
    .then((response) => {
      showAlert("success", response.data.message);
      getData();
      $("#nombre").val("");
      $("#precio").val("");
      $("#imagenUrl").val(""); // Limpiar el campo de la URL de la imagen después de agregar
    })
    .catch((error) => {
      showAlert("error", error.response.data.error);
    });
}

// Función para editar un deporte
function edit() {
  let nombre = $("#nombreModal").val();
  let precio = $("#precioModal").val();
  axios
    .post("/editar", { nombre, precio })
    .then((response) => {
      showAlert("success", response.data.message);
      getData();
    })
    .catch((error) => {
      showAlert("error", error.response.data.error);
    });
  $("#exampleModal").modal("hide");
}
