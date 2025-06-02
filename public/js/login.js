const frmLogin = document.querySelector("#frmLogin");
const txtUsuario = document.querySelector("#usuario");
const chkRecuerdame = document.querySelector("#recuerdame");

document.addEventListener('DOMContentLoaded', function () {
    // const btnSubmit = document.querySelector('#btnSubmit');


    // btnSubmit.addEventListener('click', function () {
    //     alert("Hola Mundo");

    //     window.localStorage = 'ticket.html'
    // });

    if (sessionStorage.getItem('usuario')) {
        txtUsuario.value = sessionStorage.getItem('usuario');
        chkRecuerdame.checked = true;
    }
});






frmLogin.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    const datos = Object.fromEntries(formData);

    const { recuerdame, ...data } = datos;

    if (!data.usuario) {
        toastMessage("El campo usuario es requerido");
        return;
    }

    if (!data.password) {
        toastMessage("La contraseña es requerida");
        return;
    }

    if (!recuerdame) {
        sessionStorage.removeItem('usuario')
    } else {
        sessionStorage.setItem('usuario', data.usuario);
    }

    fetch(`${window.origin}/api/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': "application/json"
        }
    })
        .then(data => data.json())
        .then(({ ok, url, token, msg }) => {
            if (!ok) {
                toastMessage(msg);
                return
            }

            sessionStorage.setItem('token', token)
            window.location.href = url

        }).catch(err => {
            console.error(err);
        });
});




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