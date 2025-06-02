// console.log(`Hola Mundo`);
let usuario = null;

const tblTicket = document.querySelector('#tblTicket tbody');
const nombreUsuario = document.querySelector("#nombreUsuario");
const cerrarSesion = document.querySelector("#cerrarSesion");

const socket = io()




socket.on('recibir-ticket', ({ mensaje, descripcion, fecha_creacion, id_giro, nombre, estatus, fecha_finalizacion }) => {
    // console.log(ticket);

    const fecha = !fecha_finalizacion ? 'Sin Fecha' : fecha_finalizacion;
    const row = `<tr>
                    <td class="px-6 py-4 font-bold">${1}</td>
                    <td class="px-6 py-4 font-bold">${mensaje}</td>
                    <td class="px-6 py-4 font-bold">${descripcion}</td>
                    <td class="px-6 py-4 font-bold">${nombre}</td>
                    <td class="px-6 py-4 font-bold">${fecha_creacion}</td>
                    <td class="px-6 py-4 font-bold"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">${estatus}</span></td>
                    <td class="px-6 py-4 font-bold">${fecha}</td>
                    <td class="px-6 py-4 font-bold"><button class="bg-blue-500 px-2.5 py-1 text-white rounded-lg">Asignar</button></td>
                 </tr>`;


    tblTicket.insertAdjacentHTML('beforeend', row);
});



document.addEventListener('DOMContentLoaded', function (e) {
    const token = sessionStorage.getItem('token');

    if (!token) {
        window.location.href = 'index.html';
        return
    }

    fetch(`${window.origin}/api/login`, {
        method: 'GET',
        headers: {
            'Content-Type': "application/json",
            'x-token': token
        }
    })
        .then(data => data.json())
        .then(({ ok, token, data }) => {
            if (!ok) {
                window.location.href = 'index.html';
                sessionStorage.removeItem('token');
                usuario = null;
                return
            }

            sessionStorage.setItem('token', token);
            usuario = data;

            nombreUsuario.innerHTML = usuario.nombre;
        }).catch(err => {
            console.error(err);
        });

});



cerrarSesion.addEventListener('click', function (e) {
    window.location.href = 'index.html';
    usuario = null;
    sessionStorage.removeItem('token')
});