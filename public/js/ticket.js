const divModal = document.querySelector("#divModal");
const btnGenerarTicket = document.querySelector("#btnGenerarTicket");
const fondoPantalla = document.querySelector("#fondoPantalla");
const myForm = document.querySelector("#myForm");
const closeModal = document.querySelector(".close-modal");
const tblTicket = document.querySelector('#tblTicket tbody');



document.addEventListener('DOMContentLoaded', function () {

    const socket = io();

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

        let saveUser = {
            ...datos,
            fecha_creacion: fecha.toISOString().replace('T', ' ').split('.')[0],
            id_giro: 1,
            nombre: "Moises Guerrero",
            estatus: "Activo",
            fecha_finalizacion: null
        }

        socket.emit('enviar-ticket', saveUser);

    });



    socket.on('recibir-ticket', ({ mensaje, descripcion, fecha_creacion, id_giro, nombre, estatus, fecha_finalizacion, nombre_giro_atendio }) => {
        fecha_finalizacion = fecha_finalizacion ?? "Sin Fecha"
        nombre_giro_atendio = nombre_giro_atendio ?? "Sin asignar"

        const row = `<tr>
                    <td class="px-6 py-4 font-bold">${1}</td>
                    <td class="px-6 py-4 font-bold">${mensaje}</td>
                    <td class="px-6 py-4 font-bold">${descripcion}</td>
                    <td class="px-6 py-4 font-bold">${nombre}</td>
                    <td class="px-6 py-4 font-bold">${fecha_creacion}</td>
                    <td class="px-6 py-4 font-bold"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">${estatus}</span></td>
                    <td class="px-6 py-4 font-bold">${fecha_finalizacion}</td>
                    <td class="px-6 py-4 font-bold">${nombre_giro_atendio}</td>
                 </tr>`;

        // debugger
        tblTicket.insertAdjacentHTML('beforeend', row);
    })

});