const divModal = document.querySelector("#divModal");
const btnGenerarTicket = document.querySelector("#btnGenerarTicket");
const fondoPantalla = document.querySelector("#fondoPantalla");
const myForm = document.querySelector("#myForm");
const closeModal = document.querySelector(".close-modal");
const tblTicket = document.querySelector('#tblTicket tbody');
let usuario = null;
let socket = null;
let tickets = null;

btnGenerarTicket.addEventListener('click', function () {
    divModal.classList.remove('hidden');
});

closeModal.addEventListener('click', function () {
    divModal.classList.add('hidden')
})

fondoPantalla.addEventListener('click', function () {
    divModal.classList.add('hidden')
})

myForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fecha = new Date();

    const formData = new FormData(this);


    const datos = Object.fromEntries(formData);

    let guardarTicket = {
        ...datos,
        fecha_creacion: fecha.toISOString().replace('T', ' ').split('.')[0],
        id_giro_solicito: usuario.id,
        nombre_giro_solicito: usuario.nombre,
        estatus: "A",
        id_giro_atendio: null,
        nombre_giro_atendio: null,
        fecha_finalizacion: null
    }
    console.log(guardarTicket);
    socket.emit('enviar-ticket', guardarTicket, (ticket) => {
        console.log(ticket);

    });

});

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

    socket.on('recibir-ticket', ({ id, titulo, descripcion, fecha_creacion, id_giro, nombre_giro_solicito, estatus, fecha_finalizacion, nombre_giro_atendio }) => {

        fecha_finalizacion = fecha_finalizacion ? '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">' + fecha_finalizacion + '</span>' : '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">Sin atender</span>';
        nombre_giro_atendio = nombre_giro_atendio ? '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">' + nombre_giro_atendio + '</span>' : '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">Sin atender</span>';

        const row = `<tr>
                    <td class="px-6 py-4 font-bold">${id}</td>
                    <td class="px-6 py-4 font-bold">${titulo}</td>
                    <td class="px-6 py-4 font-bold">${descripcion}</td>
                    <td class="px-6 py-4 font-bold">${nombre_giro_solicito}</td>
                    <td class="px-6 py-4 font-bold">${fecha_creacion}</td>
                    <td class="px-6 py-4 font-bold"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">Activo</span></td>
                    <td class="px-6 py-4 font-bold">${fecha_finalizacion}</td>
                    <td class="px-6 py-4 font-bold">${nombre_giro_atendio}</td>
                 </tr>`;

        // debugger
        tblTicket.insertAdjacentHTML('beforeend', row);
    });



    socket.on('asignar-usuario-ticket', ({ id, id_giro_atendio, nombre_giro_atendio, estatus, fecha_finalizacion }) => {
        tickets = tickets.map(ticket => {
            if (ticket.id === id) {
                return {
                    ...ticket,
                    estatus,
                    fecha_finalizacion,
                    id_giro_atendio,
                    nombre_giro_atendio
                }
            }
        });
        llenarTabla(tickets);

    });
}

const obtenerDatosTickets = async () => {
    try {
        const response = await fetch(`${window.origin}/api/ticket/${usuario.id}`, {
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
    const rows = data.map(row => {
        let lblEstatus = '';
        let lblAtendio = '';
        let lblFechaFinalizacion = '';

        if (row.estatus === 'A') {
            lblEstatus = '<span class="bg-blue-100 text-blue-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Activo</span>'
        }
        if (row.estatus === 'EP') {
            lblEstatus = '<span class="bg-green-100 text-green-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">En Proceso</span>'
        }
        if (row.estatus === 'F') {
            lblEstatus = '<span class="bg-red-100 text-red-800 text-sm whitespace-nowrap font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Finalizado</span>'
        }

        lblAtendio = !row.id_giro_atendio ? '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Sin atender</span>'
            : '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm">' + row.nombre_giro_atendio +
            '</span>';

        lblFechaFinalizacion = !row.fecha_finalizacion ? '<span class="bg-purple-100 text-purple-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">Sin finalizar</span>'
            : '<span class="bg-indigo-100 text-indigo-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm capitalize">' + row.fecha_finalizacion.replace('T', ' ').split('.')[0] +
            '</span>';

        return '<tr>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.id + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.titulo + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.descripcion + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.nombre_giro_solicito + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + row.fecha_creacion.replace('T', ' ').split('.')[0] + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + lblEstatus + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + lblFechaFinalizacion + '</td>' +
            '     <td class="px-6 py-4 font-bold text-center">' + lblAtendio + '</td>' +
            '   </tr>'
    });


    tblTicket.innerHTML = rows;
}


main();