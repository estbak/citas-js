const mascotaInput = document.querySelector('#mascota')
const propietarioInput = document.querySelector('#propietario')
const telefonoInput = document.querySelector('#telefono')
const fechaInput = document.querySelector('#fecha')
const horaInput = document.querySelector('#hora')
const sintomasInput = document.querySelector('#sintomas')

const formulario = document.querySelector('#nueva-cita')
const contenedorCitas = document.querySelector('#citas')

let editando

class Citas {
    constructor() {
        this.citas = []
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita]

        console.log(this.citas);
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id)
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
    }
}

class UI {
    imprimirAlerta(mensaje,tipo) {
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12')

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger')
        } else {
            divMensaje.classList.add('alert-success')
        }

        divMensaje.textContent = mensaje

        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'))

        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    imprimirCitas({citas}) {

        this.limpiarHTML()

        citas.forEach(cita => {
            const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita

            const divCita = document.createElement('div')
            divCita.classList.add('cita', 'p-3')
            divCita.dataset.id = id

            const mascotaParrafo = document.createElement('h2')
            mascotaParrafo.classList.add('card-litle', 'font-weight-bolder')
            mascotaParrafo.textContent = mascota

            const propietarioParrafo = document.createElement('p')
            propietarioParrafo.innerHTML = `
                <span class="font-weight-bolder">Propietario: </span> ${propietario}
            `

            const telefonoParrafo = document.createElement('p')
            telefonoParrafo.innerHTML = `
                <span class="font-weight-bolder">Teléfono: </span> ${telefono}
            `

            const fechaParrafo = document.createElement('p')
            fechaParrafo.innerHTML = `
                <span class="font-weight-bolder">Fecha: </span> ${fecha}
            `

            const horaParrafo = document.createElement('p')
            horaParrafo.innerHTML = `
                <span class="font-weight-bolder">Hora: </span> ${hora}
            `

            const sintomasParrafo = document.createElement('p')
            sintomasParrafo.innerHTML = `
                <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
            `

            const btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn', 'btn-danger')
            btnEliminar.innerHTML = 'Eliminar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>'
            btnEliminar.onclick = () => eliminarCita(id)

            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-info')
            btnEditar.innerHTML = 'Editar <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>'
            btnEditar.onclick = () => cargarEdicion(cita)

            divCita.appendChild(mascotaParrafo)
            divCita.appendChild(propietarioParrafo)
            divCita.appendChild(telefonoParrafo)
            divCita.appendChild(fechaParrafo)
            divCita.appendChild(horaParrafo)
            divCita.appendChild(sintomasParrafo)
            divCita.appendChild(btnEliminar)
            divCita.appendChild(btnEditar)

            contenedorCitas.appendChild(divCita)
        })
    }

    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }
    }
}

const ui = new UI()
const administrarCitas = new Citas()

eventListeners()

function eventListeners() {
    mascotaInput.addEventListener('input', datosCita)
    propietarioInput.addEventListener('input', datosCita)
    telefonoInput.addEventListener('input', datosCita)
    fechaInput.addEventListener('input', datosCita)
    horaInput.addEventListener('input', datosCita)
    sintomasInput.addEventListener('input', datosCita)
    
    formulario.addEventListener('submit', nuevaCita)
}

const citaOBJ = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: ''
}

function datosCita(e) {
    citaOBJ[e.target.name] = e.target.value
}

function nuevaCita(e) {
    e.preventDefault()

    const {mascota, propietario, telefono, fecha, hora, sintomas} = citaOBJ

    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        return
    }

    if (editando) {
        ui.imprimirAlerta('Editado correctamente')
        administrarCitas.editarCita({...citaOBJ})
        formulario.querySelector('button[type="submit"]').textContent = 'Crear cita'
        editando = false
    } else {
        citaOBJ.id = Date.now()
        administrarCitas.agregarCita({...citaOBJ})
        ui.imprimirAlerta('Se agregó correctamente')
    }

    reiniciarObjeto()

    formulario.reset()

    ui.imprimirCitas(administrarCitas)
}

function reiniciarObjeto() {
    citaOBJ.mascota = ''
    citaOBJ.propietario = ''
    citaOBJ.telefono = ''
    citaOBJ.fecha = ''
    citaOBJ.hora = ''
    citaOBJ.sintomas = ''
}

function eliminarCita(id) {
    administrarCitas.eliminarCita(id)
    ui.imprimirAlerta('La cita se eliminó correctamente')
    ui.imprimirCitas(administrarCitas)
}

function cargarEdicion(cita) {
    const {mascota, propietario, telefono, fecha, hora, sintomas, id} = cita

    mascotaInput.value = mascota
    propietarioInput.value = propietario
    telefonoInput.value = telefono
    fechaInput.value = fecha
    horaInput.value = hora
    sintomasInput.value = sintomas

    citaOBJ.mascota = mascota
    citaOBJ.propietario = propietario
    citaOBJ.telefono = telefono
    citaOBJ.fecha = fecha
    citaOBJ.hora = hora
    citaOBJ.sintomas = sintomas
    citaOBJ.id = id

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios'

    editando = true
}