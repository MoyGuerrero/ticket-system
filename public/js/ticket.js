const divModal = document.querySelector("#divModal");
const btnGenerarTicket = document.querySelector("#btnGenerarTicket");
const fondoPantalla = document.querySelector("#fondoPantalla");
const closeModal = document.querySelector(".close-modal");



document.addEventListener('DOMContentLoaded', function () {

    btnGenerarTicket.addEventListener('click', function () {
        divModal.classList.remove('hidden');
    });


    closeModal.addEventListener('click', function () {
        divModal.classList.add('hidden')
    })

    fondoPantalla.addEventListener('click', function () {
        divModal.classList.add('hidden')
    })

});