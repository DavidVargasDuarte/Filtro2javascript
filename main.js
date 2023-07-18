
// Variable para almacenar todas los departamentos
let todosLosDpto = [];
// Variable para almacenar todos los puntos
let todasLasCiudades = [];

const API_URL = 'http://localhost:3000';
const dataURL = 'data.json'; // Ruta al archivo JSON de datos

function verificarDptoDuplicado(dptoName) {
    return fetch(`${API_URL}/Departamentos?nomDepartamento=${dptoName}`)
        .then((response) => response.json())
        .then((departamentos) => {
            return departamentos.length > 0; // Devuelve true si se encontraron rutas con el mismo nombre
        })
        .catch((error) => {
            console.error('Error al verificar departamento duplicado:', error);
        });
}

function verificarCityDuplicada(cityName, cityId) {
    return fetch(`${API_URL}/Ciudades?NomCiudad=${cityName}&departamentoId=${cityId}`)
        .then((response) => response.json())
        .then((ciudades) => {
            return ciudades.length > 0; // Devuelve true si se encontraron puntos con el mismo nombre y departamentoId
        })
        .catch((error) => {
            console.error('Error al comprobar la ciudad duplicada:', error);
        });
}

function mostrarDetallesDpto(dptoName) {
    // Obtener los datos de la ruta directamente del archivo JSON
    fetch(dataURL)
        .then((response) => response.json())
        .then((data) => {
            const dpto = data.Rutas.find((r) => r.nomDepartamento === dptoName);
            if (dpto) {
                // Muestra los detalles de la ruta en un diálogo modal
                Swal.fire({
                    title: dpto.nomDepartamento,
                    html: `
                    <p><strong>Ruta ID:</strong> ${dpto.id}</p>
                    `,
                    confirmButtonText: 'Cerrar'
                });
            } else {
                console.error('Ruta no encontrada');
            }
        })
        .catch((error) => {
            console.error('Error al cargar los detalles de la ruta:', error);
        });
}

function mostrarDetallesCity(cityName) {
    // Obtener los datos del punto directamente del archivo JSON
    fetch(dataURL)
        .then((response) => response.json())
        .then((data) => {
            const city = data.Puntos.find((p) => p.nomCiudad === cityName);
            if (city) {
                // Muestra los detalles del punto en un diálogo modal
                Swal.fire({
                    title: city.nomCiudad,
                    html: `
                    <p><strong>Ruta ID:</strong> ${city.departamentoId}</p>
                    <p><strong>Imagen:</strong></p>
                    <img src="${city.imagen}" alt="Imagen del Punto" style="width: 200px; height: auto;">
                    `,
                    confirmButtonText: 'Cerrar'
                });
            } else {
                console.error('Punto no encontrado');
            }
        })
        .catch((error) => {
            console.error('Error al cargar detalles del punto:', error);
        });
}

function confirmarEditarDpto(cityId) {
    // Obtener el nombre de la ruta correspondiente al cityId
    fetch(`${API_URL}/Departamentos/${cityId}`)
        .then((response) => response.json())
        .then((dpto) => {
            const dptoName = dpto.nomDepartamento;

            Swal.fire({
                title: 'Editar Ruta',
                text: `¿Deseas editar la ruta "${dptoName}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        mostrarDptoEditarForm(cityId);
                    }
                });
        })
        .catch((error) => {
            console.error('Error al cargar la ruta:', error);
        });
}

function confirmarEditarCity(cityId) {
    // Obtener los datos del puntos correspondiente al cityId
    fetch(`${API_URL}/Ciudades/${cityId}`)
        .then((response) => response.json())
        .then((city) => {
            const cityName = city.nomCiudad;

            Swal.fire({
                title: 'Editar Punto',
                text: `¿Deseas editar el punto "${cityName}"?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        mostrarCityEditarForm(cityId);
                    }
                });
        })
        .catch((error) => {
            console.log('Error al cargar el punto:', error);
        });
}

function mostrarDptoEditarForm(cityId) {
    // Obtener el nombre de la ruta correspondiente al cityId
    fetch(`${API_URL}/Departamentos/${cityId}`)
        .then((response) => response.json())
        .then((dpto) => {
            const dptoName = dpto.nomDepartamento;

            Swal.fire({
                title: 'Editar Ruta',
                html: `
                <p>Ruta a editar: ${dptoName}</p>
                <input type="text" id="edit-route-name-input" placeholder="Nuevo Nombre de Ruta" required>
                `,
                confirmButtonText: 'Guardar Cambios',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const newDptoName = document.getElementById('edit-route-name-input').value;
                    return editarDpto(cityId, newDptoName);
                }
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        const { value } = result;
                        if (value) {
                            console.log('Ruta editada exitosamente');
                            cargarDpto();
                        } else {
                            console.error('Error al editar la ruta');
                        }
                    }
                });
        })
        .catch((error) => {
            console.error('Error al cargar la ruta:', error);
        });
}

function mostrarCityEditarForm(cityId) {
    // Obtener los datos del punto correspondiente al cityId
    fetch(`${API_URL}/Ciudades/${cityId}`)
        .then((response) => response.json())
        .then((city) => {
            const cityName = city.nomCiudad;
            const cityImage = city.imagen;

            Swal.fire({
                title: 'Editar Punto',
                html: `
                <p>Llenar todos los campos, Thanks!</p>
                <p>Punto a editar: ${cityName}</p>
                <input type="text" id="edit-point-name-input" placeholder="Nuevo nombre de Punto" required>
                <input type="text" id="edit-point-image-input" placeholder="Nueva imagen de Punto" required>
                `,
                confirmButtonText: 'Guardar Cambios',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    const newPointName = document.getElementById('edit-point-name-input').value;
                    const newPointImage = document.getElementById('edit-point-image-input').value;
                    return editarCity(cityId, newPointName, newPointImage);
                }
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        const { value } = result;
                        if (value) {
                            console.log('Punto editado exitosamente!');
                            cargarCity();
                        } else {
                            console.log('Error al editar el punto!');
                        }
                    }
                });
        })
        .catch((error) => {
            console.log('Error al cargar el punto:', error);
        });
}

function editarDpto(cityId, dptoName) {
    const dpto = { nomDepartamento: dptoName };

    return fetch(`${API_URL}/Departamentos/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dpto),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud de edicion');
            }
        })
        .then((updatedDpto) => {
            // Actualizar los datos en el localStorage
            const departamentos = JSON.parse(localStorage.getItem('routes')) || [];
            const dptoIndex = departamentos.findIndex((dpto) => dpto.id === cityId.toString());
            if (dptoIndex !== -1) {
                departamentos[dptoIndex] = updatedDpto;
                localStorage.setItem('routes', JSON.stringify(departamentos));
            }

            return updatedDpto;
        })
        .catch((error) => {
            console.error('Error al editar la ruta:', error);
        });
}

function editarCity(cityId, cityName, cityImage) {
    const city = {
        nomCiudad: cityName,
        imagen: cityImage,
    };

    return fetch(`${API_URL}/Ciudades/${cityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error en la solicitud de edicion!');
            }
        })
        .then((updatedPoint) => {
            // Actualizar los datos en el localStorage
            const ciudades = JSON.parse(localStorage.getItem('points')) || [];
            const pointIndex = ciudades.findIndex((city) => city.id === cityId.toString());
            if (pointIndex !== -1) {
                ciudades[pointIndex] = updatedPoint;
                localStorage.setItem('points', JSON.stringify(ciudades));
            }

            return updatedPoint;
        })
        .catch((error) => {
            console.error('Error al editar el punto:', error);
        });
}

function confirmarBorrarDpto(cityId) {
    // Obtener los datos de la ruta correspondiente al cityId
    fetch(`${API_URL}/Departamentos/${cityId}`)
        .then((response) => response.json())
        .then((dpto) => {
            const dptoName = dpto.nomDepartamento;
            Swal.fire({
                title: 'Eliminar Ruta',
                html: `Al eliminar la ruta "${dptoName}", eliminas sus puntos correspondientes!
                ¿Aceptas?`,
                text: ``,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        borrarDpto(cityId);
                    }
                });
        })
        .catch((error) => {
            console.error('Error al cargar la ruta:', error);
        })
}

function confirmarBorrarCity(cityId) {
    // Obtener los datos del punto correspondiente al cityId
    fetch(`${API_URL}/Ciudades/${cityId}`)
        .then((response) => response.json())
        .then((city) => {
            const cityName = city.nomCiudad;
            const cityImage = city.imagen;
            const pointRutaId = city.departamentoId;
            Swal.fire({
                title: 'Eliminar Punto',
                text: `¿Deseas eliminar este punto "${cityName}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si',
                cancelButtonText: 'No',
            })
                .then((result) => {
                    if (result.isConfirmed) {
                        borrarCity(cityId);
                    }
                })
        })
}

function borrarDpto(cityId) {
    fetch(`${API_URL}/Departamentos/${cityId}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                console.log('Ruta eliminada exitosamente!');

                // Eliminar los puntos asociados a la ruta en el JSON SERVER
                eliminarCityPorDptoId(cityId);

                // Eliminar la ruta del localStorage
                const departamentos = JSON.parse(localStorage.getItem('routes')) || [];
                const updatedDptos = departamentos.filter((dpto) => dpto.id !== cityId.toString());
                localStorage.setItem('routes', JSON.stringify(updatedDptos));
            } else {
                console.log('Error al eliminar la ruta!');
            }
        })
        .then(() => {
            // ... Codigos Adicionales de Apoyo
        })
        .catch((error) => {
            console.error('Error al eliminar la ruta:', error);
        });
}

function eliminarCityPorDptoId(cityId) {
    fetch(`${API_URL}/Ciudades?departamentoId=${cityId}`, {
        method: 'GET',
    })
        .then((response) => response.json())
        .then((ciudades) => {
            if (Array.isArray(ciudades)) {
                const deletePointPromises = ciudades.map((city) =>
                borrarCity(city.id)
                );
                return Promise.all(deletePointPromises);
            }
        })
        .then(() => {
            console.log('Puntos eliminados exitosamente!');
            cargarDpto();
            cargarCity();
        })
        .catch((error) => {
            console.error('Error al eliminar los puntos:', error);
        });
}

function borrarCity(cityId) {
    fetch(`${API_URL}/Ciudades/${cityId}`, {
        method: 'DELETE',
    })
        .then((response) => {
            if (response.ok) {
                console.log('Punto eliminado exitosamente!');

                // Eliminar el punto del localStorage
                const ciudades = JSON.parse(localStorage.getItem('points')) || [];
                const updatedPoints = ciudades.filter((city) => city.id !== cityId.toString());
                localStorage.setItem('points', JSON.stringify(updatedPoints));
            } else {
                console.log('Error al eliminar el punto!');
            }
        })
        .catch((error) => {
            console.error('Error al eliminar la punto:', error);
        })
}

const añadirDptoForm = document.getElementById('add-route-form');
const añadirCityForm = document.getElementById('add-point-form');
const dptoTable = document.getElementById('listaRutas');

añadirDptoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recargar la pagina

    const dptoNameInput = document.getElementById('route-name-input');
    const dptoName = dptoNameInput.value;
    verificarDptoDuplicado(dptoName)
        .then((isDuplicate) => {
            if (isDuplicate) {
                Swal.fire({
                    title: 'Ruta Duplicada',
                    text: 'Ya existe una ruta con el mismo nombre.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                añadirDpto(dptoName)
                    .then(() => {
                        dptoNameInput.value = '';
                        console.log('Ruta agregada exitosamente');
                        cargarDpto();
                    })
                    .catch((error) => {
                        console.error('Error al agregar la ruta:', error);
                    });
            }
        });
});

añadirCityForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cityNameInput = document.getElementById('point-name-input');
    const cityImageInput = document.getElementById('point-image-input');
    const dptoSelect = document.getElementById('route-select');
    const cityId = dptoSelect.value;
    const cityName = cityNameInput.value;
    const cityImage = cityImageInput.value;

    verificarCityDuplicada(cityName, cityId)
        .then((isDuplicate) => {
            if (isDuplicate) {
                Swal.fire({
                    title: 'Punto Duplicado',
                    text: 'Ya existe un punto con el mismo nombre en esta ruta.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                añadirCity(cityId, cityName, cityImage)
                    .then(() => {
                        cityNameInput.value = '';
                        cityImageInput.value = '';
                        console.log('Punto agregado exitosamente');
                    })
                    .catch((error) => {
                        console.error('Error al agregar el punto:', error);
                    });
            }
        });
});

function añadirDpto(dptoName) {
    const dpto = {
        id: null, // Establecer el ID como null para que sea asignado por el JSON SERVER
        nomDepartamento: dptoName
    };

    return fetch(`${API_URL}/Departamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dpto),
    })
        .then((response) => response.json())
        .then((newDpto) => {
            newDpto.id = newDpto.id.toString(); // Convertir el ID a cadena

            // Guardar los datos en el localStorage
            const departamentos = JSON.parse(localStorage.getItem('routes')) || [];
            departamentos.push(newDpto);
            localStorage.setItem('routes', JSON.stringify(departamentos));

            return newDpto;
        })
        .catch((error) => {
            console.error('Error al agregar la ruta:', error);
        });
}

function añadirCity(cityId, cityName, cityImage) {
    const city = {
        id: null, // Establecer el ID como null para que sea asignado por el JSON SERVER
        nomCiudad: cityName,
        departamentoId: parseInt(cityId),
        imagen: cityImage,
    };

    return fetch(`${API_URL}/Ciudades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(city),
    })
        .then((response) => response.json())
        .then((newPoint) => {
            newPoint.id = newPoint.id.toString(); // Convertir el ID a cadena

            // Guardar los datos en el localStorage
            const ciudades = JSON.parse(localStorage.getItem('points')) || [];
            ciudades.push(newPoint);
            localStorage.setItem('points', JSON.stringify(ciudades));

            return newPoint;
        })
        .catch((error) => {
            console.error('Error al agregar el punto:', error);
        });
}

// Obtener todas las rutas al cargar la pagina
const dptoDelLocalStorage = JSON.parse(localStorage.getItem('routes')) || [];
todosLosDpto = dptoDelLocalStorage;
renderizarDpto(dptoDelLocalStorage);

// Obtener todos los puntos al cargar la pagina
const cityDelLocalStorage = JSON.parse(localStorage.getItem('points')) || [];
todasLasCiudades = cityDelLocalStorage;
renderizarCity(cityDelLocalStorage);

function renderizarDpto(departamentos) {
    const tbody = dptoTable.querySelector('tbody');
    tbody.innerHTML = '';

    if (Array.isArray(departamentos)) {
        departamentos.forEach((dpto) => {
            const row = document.createElement('tr');
            row.innerHTML = `
      <td>${dpto.id}</td>
      <td>${dpto.nomDepartamento}</td>
      <td>
        <button class="editar" onclick="confirmarEditarDpto(${dpto.id})">Editar</button>
        <button class="info" onclick="mostrarDetallesDpto('${dpto.nomDepartamento}')">Info</button>
        <button class="borrar" onclick="confirmarBorrarDpto(${dpto.id})">Borrar</button>
      </td>
      `;
            tbody.appendChild(row);
        });
    }
}

function renderizarOpcionesDpto(departamentos) {
    const dptoSelect = document.getElementById('route-select');

    if (Array.isArray(departamentos)) {
        departamentos.forEach((dpto) => {
            const option = document.createElement('option');
            option.value = dpto.id;
            option.textContent = dpto.id; // Usar el ID general como etiqueta de opción
            dptoSelect.appendChild(option);
        });
    }
}

function renderizarCity(ciudades) {
    const tbody = document.getElementById('listaPuntos').querySelector('tbody');
    tbody.innerHTML = '';

    if (Array.isArray(ciudades)) {
        ciudades.forEach((city) => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>${city.id}</td>
        <td>${city.nomCiudad}</td>
        <td>${city.departamentoId}</td>
        <td><img src="${city.imagen}" alt="Imagen del Punto" style="width: 100px; height:50px;"></td>
        <td>
          <button class="editar" onclick="confirmarEditarCity(${city.id})">Editar</button>
          <button class="info" onclick="mostrarDetallesCity('${city.nomCiudad}')">Info</button>
          <button class="borrar" onclick="confirmarBorrarCity(${city.id})">Borrar</button>
        </td>
      `;
            tbody.appendChild(row);
        });
    }
}

function cargarDpto() {
    const dptoDelLocalStorage = JSON.parse(localStorage.getItem('routes')) || [];

    if (dptoDelLocalStorage.length > 0) {
        todosLosDpto = dptoDelLocalStorage;
        renderizarDpto(dptoDelLocalStorage);
        renderizarOpcionesDpto(dptoDelLocalStorage);
    } else {
        fetch(`${API_URL}/Departamentos`)
            .then((response) => response.json())
            .then((departamentos) => {
                todosLosDpto = departamentos;
                localStorage.setItem('routes', JSON.stringify(departamentos));
                renderizarDpto(departamentos);
                renderizarOpcionesDpto(departamentos);
            })
            .catch((error) => {
                console.error('Error loading routes:', error);
            });
    }
}

function cargarCity() {
    const cityDelLocalStorage = JSON.parse(localStorage.getItem('points')) || [];

    if (cityDelLocalStorage.length > 0) {
        todasLasCiudades = cityDelLocalStorage;
        renderizarCity(cityDelLocalStorage);
    } else {
        fetch(`${API_URL}/Ciudades`)
            .then((response) => response.json())
            .then((ciudades) => {
                todasLasCiudades = ciudades;
                localStorage.setItem('points', JSON.stringify(ciudades));
                renderizarCity(ciudades);
            })
            .catch((error) => {
                console.error('Error loading points:', error);
            });
    }
}

// Agregar evento de entrada en el campo de busqueda
document.getElementById("buscador-rutas").addEventListener("input", buscarDpto);


// Obtener todas las rutas al cargar la pagina
fetch(`${API_URL}/Departamentos`)
    .then((response) => response.json())
    .then((departamentos) => {
        todosLosDpto = departamentos;
        actualizarListaDpto(todosLosDpto);
    })
    .catch((error) => {
        console.error('Error loading routes:', error);
    });

// Funcion para buscar rutas por su nombre
function buscarDpto() {
    const filtro = document.getElementById("buscador-rutas").value.trim();
    const mensajeElement = document.getElementById("mensaje-rutas");

    // Restablecer el contenido del mensaje a una cadena vacia
    mensajeElement.textContent = "";

    if (filtro === "") {
        // Si el campo de busqueda esta vacio, mostrar todas las rutas
        actualizarListaDpto(todosLosDpto);
    } else {
        // Filtrar las rutas segun el nombre
        const rutasFiltradas = todosLosDpto.filter((ruta) =>
            ruta.nomDepartamento.toLowerCase().includes(filtro.toLowerCase())
        );

        if (rutasFiltradas.length > 0) {
            // Si se encontraron rutas que coinciden con el filtro, mostrarlas
            actualizarListaDpto(rutasFiltradas);
        } else {
            // Si no se encontraron rutas, mostrar mensaje de no encontrado
            mensajeElement.textContent = `No se encontró ninguna ruta con el nombre "${filtro}"`;
            actualizarListaDpto([]);
        }
    }
}

function actualizarListaDpto(dptoMostrar) {
    const tablaRutasElement = document.getElementById("listaRutas");
    const tablaHTML =
        "<table>" +
        "<thead>" +
        "<tr>" +
        "<th>ID</th>" +
        "<th>Ruta</th>" +
        "<th>Acciones</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "</table>";

    // Agregar la tabla de rutas al elemento HTML
    tablaRutasElement.innerHTML = tablaHTML;

    // Obtener el cuerpo de la tabla
    const tbodyElement = tablaRutasElement.querySelector("tbody");

    // Si no se proporciona la lista de rutas a mostrar, se utiliza la lista completa
    if (!dptoMostrar) {
        dptoMostrar = todosLosDpto;
    }

    // Generar las filas de la tabla con los datos de las rutas
    const filasHTML = dptoMostrar.map(function (ruta) {
        return (
            "<tr>" +
            "<td>" +
            ruta.id +
            "</td>" +
            "<td>" +
            ruta.nomDepartamento +
            "</td>" +
            "<td>" +
            "<button class=\"editar-button\" onclick=\"confirmarEditarDpto(" +
            ruta.id +
            ")\">Editar</button>" +
            "<button class=\"eliminar-button\" onclick=\"confirmarBorrarDpto(" +
            ruta.id +
            ")\">Borrar</button>" +
            "</td>" +
            "</tr>"
        );
    });

    // Agregar las filas al cuerpo de la tabla
    tbodyElement.innerHTML = filasHTML.join("");
}

// Obtener todos los puntos al cargar la página
fetch(`${API_URL}/Ciudades`)
    .then((response) => response.json())
    .then((puntos) => {
        todasLasCiudades = puntos;
        actualizarListaPuntos(todasLasCiudades);
    })
    .catch((error) => {
        console.error('Error loading points:', error);
    });

// Funcion para buscar puntos por nombre y departamentoId
function buscarCity() {
    const filtro = document.getElementById("buscador-puntos").value.trim();
    const mensajeElement = document.getElementById("mensaje-puntos");

    // Restablecer el contenido del mensaje a una cadena vacia
    mensajeElement.textContent = "";

    if (filtro === "") {
        // Si el campo de busqueda esta vacio, mostrar todos los puntos
        actualizarListaPuntos(todasLasCiudades);
    } else {
        // Filtrar los puntos segun el nombre y departamentoId
        const puntosFiltrados = todasLasCiudades.filter((punto) =>
            punto.nomCiudad && punto.nomCiudad.toLowerCase().includes(filtro.toLowerCase()) ||
            punto.departamentoId.toString() === filtro
        );

        if (puntosFiltrados.length > 0) {
            // Si se encontraron puntos que coinciden con el filtro, mostrarlos
            actualizarListaPuntos(puntosFiltrados);
        } else {
            // Si no se encontraron puntos, mostrar mensaje de no encontrado
            mensajeElement.textContent = `No se encontro ningun punto con el nombre "${filtro}" o el ID de Ruta "${filtro}"`;
            actualizarListaPuntos([]);
        }
    }
}

// Funcion para actualizar la lista de puntos en el HTML
function actualizarListaPuntos(cityMostrar) {
    const tablaPuntosElement = document.getElementById("listaPuntos");
    const tablaHTML =
        "<table>" +
        "<thead>" +
        "<tr>" +
        "<th>ID</th>" +
        "<th>Punto</th>" +
        "<th>Ruta ID</th>" +
        "<th>Imagen</th>" +
        "<th>Acciones</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "</table>";

    // Agregar la tabla de puntos al elemento HTML
    tablaPuntosElement.innerHTML = tablaHTML;

    // Obtener el cuerpo de la tabla
    const tbodyElement = tablaPuntosElement.querySelector("tbody");

    // Si no se proporciona la lista de puntos a mostrar, se utiliza la lista completa
    if (!cityMostrar) {
        cityMostrar = todasLasCiudades;
    }

    // Generar las filas de la tabla con los datos de los puntos
    const filasHTML = cityMostrar.map(function (punto) {
        return (
            "<tr>" +
            "<td>" + punto.id + "</td>" +
            "<td>" + punto.nomCiudad + "</td>" +
            "<td>" + punto.departamentoId + "</td>" +
            "<td><img src=\"" + punto.imagen + "\" alt=\"Imagen del Punto\" style=\"width: 100px; height: 50px;\"></td>" +
            "<td>" +
            "<button class=\"editar\" onclick=\"confirmarEditarCity(" + punto.id + ")\">Editar</button>" +
            "<button class=\"borrar\" onclick=\"confirmarBorrarCity(" + punto.id + ")\">Borrar</button>" +
            "</td>" +
            "</tr>"
        );
    });

    // Agregar las filas al cuerpo de la tabla
    tbodyElement.innerHTML = filasHTML.join("");
}

// Llamar a la funcion buscarCity despues de obtener los puntos a traves de fetch
document.getElementById("buscador-puntos").addEventListener("input", buscarCity);

cargarDpto();
cargarCity();