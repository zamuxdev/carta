// FUENTE DE LA CARTA
//   ""     -> no hay carta (se muestra la vista "sin carta")
//   "json" -> carga la carta desde datos.json
//   "xml"  -> carga la carta desde datos.xml
const FUENTE = "json";

// Coloca el texto en el elemento con el id indicado
function poner(id, texto) {
  document.getElementById(id).textContent = texto;
}

// Muestra la vista "sin carta" y oculta la carta
function mostrarSinCarta() {
  document.getElementById("sinCarta").hidden = false;
  document.getElementById("carta").hidden = true;
}

// Pinta la carta con los datos (misma estructura para JSON y XML)
function mostrarCarta(datos) {
  const { empresa, destinatario, mensaje, remitente } = datos;

  // Encabezado
  document.getElementById("logo").src = empresa.logo;
  poner("nombreEmpresa", empresa.nombre);
  poner("eslogan", empresa.eslogan);

  // Destinatario
  poner("fecha", "Fecha de ingreso: " + destinatario.fechaIngreso);
  poner("destNombre", destinatario.nombre);
  poner("destPuesto", destinatario.puesto);
  poner("destDepartamento", destinatario.departamento);

  // Mensaje
  const contenedor = document.getElementById("mensaje");
  contenedor.innerHTML = "";
  mensaje.forEach(function (texto) {
    const p = document.createElement("p");
    p.textContent = texto;
    contenedor.appendChild(p);
  });

  // Remitente
  poner("firma", remitente.firma);
  poner("remNombre", remitente.nombre);
  poner("remPuesto", remitente.puesto);

  // Pie de página
  poner("pieNombre", empresa.nombre);
  poner("pieDireccion", empresa.direccion);
  poner("pieTelefono", empresa.telefono);
  poner("pieCorreo", empresa.correo);
  poner("pieWeb", empresa.web);

  // Oculta la vista "sin carta" y muestra la carta
  document.getElementById("sinCarta").hidden = true;
  document.getElementById("carta").hidden = false;
}

// Cargar desde JSON
function cargarJSON() {
  fetch("datos.json")
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      mostrarCarta(datos);
    })
    .catch(function (error) {
      console.error("Error al cargar JSON:", error);
      mostrarSinCarta();
    });
}

// Cargar desde XML
function cargarXML() {
  fetch("datos.xml")
    .then(function (respuesta) {
      return respuesta.text();
    })
    .then(function (texto) {
      const xml = new DOMParser().parseFromString(texto, "application/xml");
      const valor = function (ruta) {
        return xml.querySelector(ruta).textContent;
      };

      // Convertimos el XML a un objeto con la misma forma que el JSON
      const datos = {
        empresa: {
          nombre: valor("empresa > nombre"),
          logo: valor("empresa > logo"),
          eslogan: valor("empresa > eslogan"),
          direccion: valor("empresa > direccion"),
          telefono: valor("empresa > telefono"),
          correo: valor("empresa > correo"),
          web: valor("empresa > web")
        },
        destinatario: {
          nombre: valor("destinatario > nombre"),
          puesto: valor("destinatario > puesto"),
          departamento: valor("destinatario > departamento"),
          fechaIngreso: valor("destinatario > fechaIngreso")
        },
        mensaje: Array.from(xml.querySelectorAll("mensaje > parrafo")).map(function (p) {
          return p.textContent;
        }),
        remitente: {
          nombre: valor("remitente > nombre"),
          puesto: valor("remitente > puesto"),
          firma: valor("remitente > firma")
        }
      };

      mostrarCarta(datos);
    })
    .catch(function (error) {
      console.error("Error al cargar XML:", error);
      mostrarSinCarta();
    });
}

// Al abrir la página se carga la fuente indicada (o ninguna)
if (FUENTE === "json") {
  cargarJSON();
} else if (FUENTE === "xml") {
  cargarXML();
} else {
  mostrarSinCarta();
}
