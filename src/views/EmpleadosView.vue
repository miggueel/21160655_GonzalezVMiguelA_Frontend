<script setup>
import { ref, onMounted } from 'vue'
import {
  obtenerEmpleados,
  obtenerEmpleado,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from '../services/empleados'
import { obtenerUsuarios } from '../services/usuarios'

const empleados = ref([])
const usuarios = ref([])
const cargando = ref(false)
const guardando = ref(false)
const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const modoEdicion = ref(false)
const empleadoSeleccionado = ref(null)
const error = ref('')
const mensaje = ref('')

const formularioInicial = () => ({
  user_id: '',
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  job_title: '',
  hired_at: '',
  is_active: true,
})

const formulario = ref(formularioInicial())

const cargarDatos = async () => {
  try {
    cargando.value = true
    error.value = ''

    const [e, u] = await Promise.all([obtenerEmpleados(), obtenerUsuarios()])

    empleados.value = e.data
    usuarios.value = u.data
  } catch (err) {
    error.value = err.message || 'No fue posible cargar los datos.'
  } finally {
    cargando.value = false
  }
}

const abrirFormulario = () => {
  formulario.value = formularioInicial()
  modoEdicion.value = false
  empleadoSeleccionado.value = null
  error.value = ''
  mensaje.value = ''
  mostrarFormulario.value = true
}

const editarEmpleado = async (empleado) => {
  try {
    error.value = ''
    const respuesta = await obtenerEmpleado(empleado.id)
    const datos = respuesta.data

    formulario.value = {
      user_id: datos.user_id,
      first_name: datos.first_name,
      last_name: datos.last_name,
      phone: datos.phone || '',
      address: datos.address || '',
      job_title: datos.job_title || '',
      hired_at: datos.hired_at ? datos.hired_at.substring(0, 10) : '',
      is_active: datos.is_active,
    }

    empleadoSeleccionado.value = empleado.id
    modoEdicion.value = true
    mostrarFormulario.value = true
  } catch (err) {
    error.value = err.message || 'No se pudo consultar el empleado.'
  }
}

const guardarEmpleado = async () => {
  try {
    guardando.value = true
    error.value = ''

    const datos = {
      user_id: Number(formulario.value.user_id),
      first_name: formulario.value.first_name.trim(),
      last_name: formulario.value.last_name.trim(),
      phone: formulario.value.phone.trim(),
      address: formulario.value.address.trim(),
      job_title: formulario.value.job_title.trim(),
      hired_at: formulario.value.hired_at,
      is_active: formulario.value.is_active,
    }

    if (modoEdicion.value) {
      await actualizarEmpleado(empleadoSeleccionado.value, datos)
      mensaje.value = 'Empleado actualizado correctamente.'
    } else {
      await crearEmpleado(datos)
      mensaje.value = 'Empleado registrado correctamente.'
    }

    mostrarFormulario.value = false
    formulario.value = formularioInicial()
    await cargarDatos()
  } catch (err) {
    error.value = err.message || 'No se pudo guardar el empleado.'
  } finally {
    guardando.value = false
  }
}

const borrarEmpleado = async (empleado) => {
  if (
    !window.confirm(
      `¿Eliminar a "${empleado.first_name} ${empleado.last_name}"? El usuario asociado no será eliminado.`,
    )
  )
    return

  try {
    error.value = ''
    await eliminarEmpleado(empleado.id)
    mensaje.value = 'Empleado eliminado correctamente.'
    await cargarDatos()
  } catch (err) {
    error.value = err.message || 'No se pudo eliminar el empleado.'
  }
}

const verEmpleado = async (empleado) => {
  try {
    error.value = ''
    const respuesta = await obtenerEmpleado(empleado.id)
    empleadoSeleccionado.value = respuesta.data
    mostrarDetalle.value = true
  } catch (err) {
    error.value = err.message || 'No se pudo consultar el empleado.'
  }
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  error.value = ''
}

const nombreUsuario = (id) => {
  const usuario = usuarios.value.find((item) => item.id === id)
  return usuario ? usuario.username : `Usuario ${id}`
}

onMounted(cargarDatos)
</script>

<template>
  <main class="empleados">
    <header class="encabezado">
      <div>
        <span class="etiqueta">GESTIÓN DEL SISTEMA</span>
        <h1>Empleados</h1>
        <p>Consulta y administra la información de los empleados.</p>
      </div>
      <button class="btn-primary" @click="abrirFormulario">+ Nuevo empleado</button>
    </header>

    <div v-if="mensaje" class="alerta exito">{{ mensaje }}</div>
    <div v-if="error && !mostrarFormulario" class="alerta error">{{ error }}</div>

    <section class="resumen">
      <article class="resumen-card">
        <span>Total de empleados</span>
        <strong>{{ empleados.length }}</strong>
      </article>
      <article class="resumen-card">
        <span>Empleados activos</span>
        <strong>{{ empleados.filter((e) => e.is_active).length }}</strong>
      </article>
      <article class="resumen-card">
        <span>Empleados inactivos</span>
        <strong>{{ empleados.filter((e) => !e.is_active).length }}</strong>
      </article>
    </section>

    <section class="tabla-container">
      <div class="tabla-titulo">
        <div>
          <span class="etiqueta">REGISTROS</span>
          <h2>Listado de empleados</h2>
        </div>
        <button class="btn-recargar" @click="cargarDatos">↻ Actualizar</button>
      </div>

      <p v-if="cargando" class="mensaje">Cargando empleados...</p>
      <p v-else-if="empleados.length === 0" class="mensaje">No hay empleados registrados.</p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Empleado</th>
            <th>Usuario</th>
            <th>Puesto</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="empleado in empleados" :key="empleado.id">
            <td class="id">{{ empleado.id }}</td>
            <td class="nombre">{{ empleado.first_name }} {{ empleado.last_name }}</td>
            <td>{{ nombreUsuario(empleado.user_id) }}</td>
            <td>{{ empleado.job_title || '—' }}</td>
            <td>{{ empleado.phone || '—' }}</td>
            <td>
              <span :class="empleado.is_active ? 'estado activo' : 'estado inactivo'">
                {{ empleado.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones-tabla">
                <button class="btn-ver" @click="verEmpleado(empleado)">Ver</button>
                <button class="btn-editar" @click="editarEmpleado(empleado)">Editar</button>
                <button class="btn-eliminar" @click="borrarEmpleado(empleado)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Registro y edición -->
    <div v-if="mostrarFormulario" class="modal-fondo">
      <section class="modal">
        <header class="modal-header">
          <div>
            <span class="etiqueta">
              {{ modoEdicion ? 'MODIFICAR REGISTRO' : 'NUEVO REGISTRO' }}
            </span>
            <h2>{{ modoEdicion ? 'Editar empleado' : 'Registrar empleado' }}</h2>
            <p>Completa la información solicitada.</p>
          </div>
          <button class="cerrar" @click="cerrarFormulario">×</button>
        </header>

        <form @submit.prevent="guardarEmpleado">
          <label>Usuario asociado</label>
          <select v-model="formulario.user_id" required>
            <option value="" disabled>Selecciona un usuario</option>
            <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
              {{ usuario.username }} ({{ usuario.email }})
            </option>
          </select>

          <label>Nombre(s)</label>
          <input v-model="formulario.first_name" type="text" placeholder="Ej. Ana" required />

          <label>Apellidos</label>
          <input v-model="formulario.last_name" type="text" placeholder="Ej. González" required />

          <label>Teléfono</label>
          <input v-model="formulario.phone" type="tel" placeholder="Ej. 5551234567" />

          <label>Dirección</label>
          <input v-model="formulario.address" type="text" placeholder="Ej. Calle Principal 123" />

          <label>Puesto de trabajo</label>
          <input v-model="formulario.job_title" type="text" placeholder="Ej. Gerente" />

          <label>Fecha de contratación</label>
          <input v-model="formulario.hired_at" type="date" required />

          <template v-if="modoEdicion">
            <label>Estado del empleado</label>
            <select v-model="formulario.is_active">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </template>

          <p v-if="error" class="alerta error">{{ error }}</p>

          <div class="acciones">
            <button type="button" class="btn-secundario" @click="cerrarFormulario">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="guardando">
              {{
                guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Registrar empleado'
              }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- Detalle -->
    <div v-if="mostrarDetalle" class="modal-fondo">
      <section class="modal">
        <header class="modal-header">
          <div>
            <span class="etiqueta">INFORMACIÓN</span>
            <h2>Detalle del empleado</h2>
          </div>
          <button class="cerrar" @click="mostrarDetalle = false">×</button>
        </header>

        <div v-if="empleadoSeleccionado" class="detalle">
          <p>
            <strong>ID</strong><span>{{ empleadoSeleccionado.id }}</span>
          </p>
          <p>
            <strong>Usuario</strong><span>{{ nombreUsuario(empleadoSeleccionado.user_id) }}</span>
          </p>
          <p>
            <strong>Nombre</strong><span>{{ empleadoSeleccionado.first_name }}</span>
          </p>
          <p>
            <strong>Apellidos</strong><span>{{ empleadoSeleccionado.last_name }}</span>
          </p>
          <p>
            <strong>Teléfono</strong><span>{{ empleadoSeleccionado.phone || '—' }}</span>
          </p>
          <p>
            <strong>Dirección</strong><span>{{ empleadoSeleccionado.address || '—' }}</span>
          </p>
          <p>
            <strong>Puesto</strong><span>{{ empleadoSeleccionado.job_title || '—' }}</span>
          </p>
          <p>
            <strong>Contratación</strong><span>{{ empleadoSeleccionado.hired_at || '—' }}</span>
          </p>
          <p>
            <strong>Estado</strong>
            <span>{{ empleadoSeleccionado.is_active ? 'Activo' : 'Inactivo' }}</span>
          </p>
          <p v-if="empleadoSeleccionado.created_at">
            <strong>Fecha de creación</strong>
            <span>{{ new Date(empleadoSeleccionado.created_at).toLocaleString() }}</span>
          </p>
        </div>

        <div class="acciones">
          <button class="btn-primary" @click="mostrarDetalle = false">Cerrar</button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.empleados {
  width: 100%;
  color: #252622;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
}
.etiqueta {
  display: block;
  color: #a65f48;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 9px;
}
h1,
h2 {
  font-family: 'Playfair Display', Georgia, serif;
}
h1 {
  font-size: 32px;
  margin: 0 0 7px;
}
.encabezado p,
.modal-header p {
  color: #77766f;
  margin: 0;
  font-size: 14px;
}

button {
  cursor: pointer;
  font-family: inherit;
}
.btn-primary {
  background: #a65f48;
  color: white;
  border: 0;
  padding: 12px 18px;
  border-radius: 4px;
}
.btn-primary:hover {
  background: #874a38;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.resumen {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}
.resumen-card {
  background: #fffefa;
  border: 1px solid #e7e1d7;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.resumen-card span {
  color: #77766f;
  font-size: 13px;
}
.resumen-card strong {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 29px;
}

.tabla-container {
  background: #fffefa;
  border: 1px solid #e7e1d7;
  overflow-x: auto;
}
.tabla-titulo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 22px;
}
.tabla-titulo .etiqueta {
  margin-bottom: 5px;
}
.tabla-titulo h2 {
  font-size: 20px;
  margin: 0;
}
.btn-recargar,
.btn-secundario {
  background: transparent;
  border: 1px solid #d8cec1;
  color: #55544e;
  padding: 10px 14px;
  border-radius: 4px;
}
table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  text-align: left;
}
th,
td {
  padding: 15px;
  border-bottom: 1px solid #eeeae3;
  font-size: 13px;
}
th {
  background: #f8f5ef;
  color: #77766f;
  font-weight: 600;
}
.id {
  color: #99948a;
}
.nombre {
  font-weight: 600;
}
.estado {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
}
.activo {
  color: #53745a;
  background: #eaf1e8;
}
.inactivo {
  color: #a34e45;
  background: #f8eae7;
}

.acciones-tabla {
  display: flex;
  gap: 6px;
}
.acciones-tabla button {
  border: 0;
  border-radius: 3px;
  padding: 7px 9px;
  font-size: 11px;
}
.btn-ver {
  background: #eeeae2;
  color: #55544e;
}
.btn-editar {
  background: #f5eadc;
  color: #99613b;
}
.btn-eliminar {
  background: #f8eae7;
  color: #a34e45;
}

.mensaje {
  padding: 35px;
  text-align: center;
  color: #77766f;
}
.alerta {
  padding: 12px 15px;
  margin-bottom: 16px;
  font-size: 13px;
  border-radius: 4px;
}
.exito {
  color: #53745a;
  background: #eaf1e8;
}
.error {
  color: #a34e45;
  background: #f8eae7;
}

.modal-fondo {
  position: fixed;
  inset: 0;
  z-index: 10;
  padding: 20px;
  background: #25262299;
  display: grid;
  place-items: center;
  overflow-y: auto;
}
.modal {
  background: #fffefa;
  width: 100%;
  max-width: 470px;
  padding: 28px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
}
.modal-header h2 {
  font-size: 23px;
  margin: 0 0 7px;
}
.modal-header p {
  font-size: 13px;
}
.cerrar {
  border: 0;
  background: none;
  color: #77766f;
  font-size: 27px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
form label {
  color: #55544e;
  font-size: 13px;
  font-weight: 600;
}
form input,
form select {
  width: 100%;
  padding: 11px 12px;
  margin-bottom: 8px;
  border: 1px solid #ded8ce;
  background: white;
  border-radius: 3px;
  font: inherit;
  font-size: 13px;
}
form input:focus,
form select:focus {
  outline: 1px solid #a65f48;
  border-color: #a65f48;
}
.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.detalle p {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 0;
  margin: 0;
  border-bottom: 1px solid #eeeae3;
  font-size: 13px;
}
.detalle strong {
  color: #77766f;
}
.detalle span {
  text-align: right;
  overflow-wrap: anywhere;
}

@media (max-width: 650px) {
  .encabezado {
    align-items: flex-start;
    flex-direction: column;
  }
  .resumen {
    grid-template-columns: 1fr;
  }
  .tabla-titulo {
    gap: 12px;
    flex-wrap: wrap;
  }
  .modal {
    padding: 20px;
  }
}
</style>
