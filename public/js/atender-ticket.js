let usuario = null;
let tickets = null;
let socket = null;

const tblTicket = document.querySelector('#tblTicket tbody');
const nombreUsuario = document.querySelector("#nombreUsuario");
const cerrarSesion = document.querySelector("#cerrarSesion");






// document.addEventListener('DOMContentLoaded', function (e) {
//     fetch(`${window.origin}/api/ticket`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': "application/json",
//             'x-token': token
//         }
//     })

// });

const main = async () => {

    await validarJWT();
}


const validarJWT = async () => {
    const token_ = sessionStorage.getItem('token');

    if (!token_) {
        window.location.href = 'index.html';
        return
    }

    try {

        const response = await fetch(`${window.origin}/api/login`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'x-token': token_
            }
        });

        if (!response.ok) {
            window.location.href = 'index.html';
            sessionStorage.removeItem('token');
            usuario = null;
            return
        }
        const { ok, token, data } = await response.json();

        if (!ok) {
            window.location.href = 'index.html';
            sessionStorage.removeItem('token');
            usuario = null;
            return
        }
        sessionStorage.setItem('token', token);
        usuario = data;

        nombreUsuario.innerHTML = usuario.nombre;
        document.title = `Bienvenido ${usuario.nombre}`;
        await conectarSocket();
        await obtenerDatosTickets();
    } catch (error) {
        console.error(error);
    }
}



const conectarSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': sessionStorage.getItem('token')
        }
    });

    socket.on('recibir-ticket', ({ id, titulo, descripcion, fecha_creacion, id_giro_atendio, nombre_giro_atendio, nombre_giro_solicito, fecha_finalizacion }) => {
        // console.log(ticket);

        const fecha = !fecha_finalizacion ? '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">Sin atender</span>'
            : '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">' + fecha_finalizacion + '</span>';

        lblAtendio = !id_giro_atendio ? '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Sin atender</span>'
            : '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">' + nombre_giro_atendio + '</span>';

        const row = `<tr>
                    <td class="px-6 py-4 font-bold">${id}</td>
                    <td class="px-6 py-4 font-bold">${titulo}</td>
                    <td class="px-6 py-4 font-bold">${descripcion}</td>
                    <td class="px-6 py-4 font-bold">${nombre_giro_solicito}</td>
                    <td class="px-6 py-4 font-bold">${fecha_creacion}</td>
                    <td class="px-6 py-4 font-bold"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Activo</span></td>
                    <td class="px-6 py-4 font-bold"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Activo</span></td>
                    <td class="px-6 py-4 font-bold">${fecha}</td>
                    <td class="px-6 py-4 font-bold"><button type="button" class="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Atender</button></td>
                 </tr>`;


        tblTicket.insertAdjacentHTML('beforeend', row);
    });
}



cerrarSesion.addEventListener('click', function (e) {
    window.location.href = 'index.html';
    usuario = null;
    sessionStorage.removeItem('token')
});


const obtenerDatosTickets = async () => {
    try {
        const response = await fetch(`${window.origin}/api/ticket`, {
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'x-token': sessionStorage.getItem('token')
            }
        });


        if (!response.ok) {
            // TODO: Mostrar error
            console.log("Error en el response.ok");
            return
        }

        const { data } = await response.json();
        tickets = data;
        llenarTabla(data);


    } catch (error) {
        console.error(error);
    }
}


const llenarTabla = (data) => {
    // debugger

    const rows = data.map(row => {
        let lblEstatus = '';
        let lblAtendio = '';
        let lblFechaFinalizacion = '';
        let button = '';

        if (row.estatus === 'A') {
            lblEstatus = '<span class="bg-blue-100 text-blue-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Activo</span>'
            button = '<button type="button" onclick="etapasTicket(' + row.id + ')" class="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Atender</button>'
        }
        if (row.estatus === 'EP') {
            lblEstatus = '<span class="bg-green-100 text-green-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">En Proceso</span>'
            button = '<button type="button" onclick="finalizar(' + row.id + ',' + row.id_giro_atendio + ')" class="cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none">Finalizar</button>'
        }
        if (row.estatus === 'F') {
            lblEstatus = '<span class="bg-red-100 text-red-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Finalizado</span>'
            button = '';
        }

        lblAtendio = !row.id_giro_atendio ? '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Sin atender</span>'
            : '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">' + row.nombre_giro_atendio + '</span>';

        lblFechaFinalizacion = !row.fecha_finalizacion ? '<span class="bg-purple-100 text-purple-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Sin finalizar</span>'
            : '<span class="bg-indigo-100 text-indigo-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">' + row.fecha_finalizacion.replace('T', ' ').split('.')[0] + '</span>';

        return '<tr>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.id + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.titulo + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.descripcion + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.nombre_giro_solicito + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.fecha_creacion.replace('T', ' ').split('.')[0] + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + lblEstatus + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + lblAtendio + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + lblFechaFinalizacion + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + button + '</td>' +
            '   </tr>'
    });


    tblTicket.innerHTML = rows;
}



const etapasTicket = (id) => {
    let fecha_finalizacion = null;
    let estatus = '';
    estatus = 'EP';
    tickets = tickets.map(ticket => {
        if (ticket.id === id) {
            return {
                ...ticket,
                estatus,
                id_giro_atendio: usuario.id,
                nombre_giro_atendio: usuario.nombre
            }
        }
    });

    socket.emit('asignar-usuario-ticket', ({ id, id_giro_atendio: usuario.id, nombre_giro_atendio: usuario.nombre, estatus, fecha_finalizacion }));
    llenarTabla(tickets);
}

const finalizar = (id, id_giro_atendio) => {
    let fecha_finalizacion = null;
    if (usuario.id != id_giro_atendio) {
        toastMessage(`El ticket se esta atendiendo por otro usuario`);
        return;
    }

    fecha_finalizacion = getFechaActualFormateada();
    estatus = 'F';
    tickets = tickets.map(ticket => {
        if (ticket.id === id) {
            return {
                ...ticket,
                fecha_finalizacion,
                estatus,
            }
        }
    });
    socket.emit('asignar-usuario-ticket', ({ id, id_giro_atendio: usuario.id, nombre_giro_atendio: usuario.nombre, estatus, fecha_finalizacion }));
    llenarTabla(tickets);
}

const toastMessage = (message, color = "red") => {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            // background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
}

function getFechaActualFormateada() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // los meses van de 0-11
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

main();