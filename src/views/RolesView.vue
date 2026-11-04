<script setup>
import { ref, onMounted } from 'vue'
import { obtenerRoles, obtenerRol, crearRol, actualizarRol, eliminarRol } from '../services/roles'

const roles = ref([])
const cargando = ref(false)
const guardando = ref(false)
const error = ref('')
const mensaje = ref('')
const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const modoEdicion = ref(false)
const rolId = ref(null)
const rolSeleccionado = ref(null)
const formulario = ref({ name: '', description: '' })

const cargarRoles = async () => {
  try {
    cargando.value = true
    error.value = ''
    const respuesta = await obtenerRoles()
    roles.value = respuesta.data || []
  } catch (err) {
    error.value = err.message || 'No se pudieron cargar los roles.'
  } finally {
    cargando.value = false
  }
}

const nuevoRol = () => {
  formulario.value = { name: '', description: '' }
  rolId.value = null
  modoEdicion.value = false
  error.value = ''
  mensaje.value = ''
  mostrarFormulario.value = true
}

const editarRol = async (id) => {
  try {
    error.value = ''
    const respuesta = await obtenerRol(id)
    formulario.value = {
      name: respuesta.data.name || '',
      description: respuesta.data.description || '',
    }
    rolId.value = id
    modoEdicion.value = true
    mostrarFormulario.value = true
  } catch (err) {
    error.value = err.message || 'No se pudo obtener el rol.'
  }
}

const guardarRol = async () => {
  if (!formulario.value.name.trim()) {
    error.value = 'El nombre del rol es obligatorio.'
    return
  }

  try {
    guardando.value = true
    error.value = ''
    const datos = {
      name: formulario.value.name.trim(),
      description: formulario.value.description.trim(),
    }

    if (modoEdicion.value) {
      await actualizarRol(rolId.value, datos)
      mensaje.value = 'El rol se actualizó correctamente.'
    } else {
      await crearRol(datos)
      mensaje.value = 'El rol se creó correctamente.'
    }

    mostrarFormulario.value = false
    await cargarRoles()
  } catch (err) {
    error.value = err.message || 'No se pudo guardar el rol.'
  } finally {
    guardando.value = false
  }
}

const verRol = async (id) => {
  try {
    error.value = ''
    const respuesta = await obtenerRol(id)
    rolSeleccionado.value = respuesta.data
    mostrarDetalle.value = true
  } catch (err) {
    error.value = err.message || 'No se pudieron consultar los detalles.'
  }
}

const borrarRol = async (rol) => {
  if (!window.confirm(`¿Eliminar el rol "${rol.name}"?`)) return

  try {
    error.value = ''
    mensaje.value = ''
    await eliminarRol(rol.id)
    mensaje.value = 'El rol se eliminó correctamente.'
    await cargarRoles()
  } catch (err) {
    error.value = err.message || 'No se pudo eliminar. Comprueba si tiene usuarios asociados.'
  }
}

onMounted(cargarRoles)
</script>

<template>
  <main class="roles">
    <header class="encabezado">
      <div>
        <span class="etiqueta">GESTIÓN DEL SISTEMA</span>
        <h1>Roles</h1>
        <p>Administra los roles disponibles en tu plataforma.</p>
      </div>
      <button class="btn-primary" @click="nuevoRol">+ Nuevo rol</button>
    </header>

    <div v-if="mensaje" class="alerta exito">{{ mensaje }}</div>
    <div v-if="error && !mostrarFormulario" class="alerta error">{{ error }}</div>

    <section class="resumen">
      <span>Total de roles registrados</span>
      <strong>{{ roles.length }}</strong>
    </section>

    <section class="tabla-container">
      <div class="tabla-header">
        <div>
          <span class="etiqueta">REGISTROS</span>
          <h2>Listado de roles</h2>
        </div>
        <button class="btn-secundario" @click="cargarRoles">↻ Actualizar</button>
      </div>

      <p v-if="cargando" class="mensaje">Cargando roles...</p>
      <p v-else-if="!roles.length" class="mensaje">No hay roles registrados.</p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rol in roles" :key="rol.id">
            <td>{{ rol.id }}</td>
            <td class="nombre">{{ rol.name }}</td>
            <td>{{ rol.description || 'Sin descripción' }}</td>
            <td class="acciones-tabla">
              <button class="ver" @click="verRol(rol.id)">Ver</button>
              <button class="editar" @click="editarRol(rol.id)">Editar</button>
              <button class="eliminar" @click="borrarRol(rol)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Formulario -->
    <div v-if="mostrarFormulario" class="modal-fondo" @click.self="mostrarFormulario = false">
      <section class="modal">
        <header class="modal-header">
          <div>
            <span class="etiqueta">{{ modoEdicion ? 'MODIFICAR' : 'NUEVO REGISTRO' }}</span>
            <h2>{{ modoEdicion ? 'Editar rol' : 'Registrar rol' }}</h2>
          </div>
          <button class="cerrar" @click="mostrarFormulario = false">×</button>
        </header>

        <form @submit.prevent="guardarRol">
          <label>Nombre del rol</label>
          <input
            v-model="formulario.name"
            placeholder="Ej. Administrador"
            maxlength="100"
            required
          />

          <label>Descripción</label>
          <textarea
            v-model="formulario.description"
            rows="3"
            placeholder="Describe las funciones del rol..."
          ></textarea>

          <p v-if="error" class="alerta error">{{ error }}</p>

          <div class="acciones">
            <button type="button" class="btn-secundario" @click="mostrarFormulario = false">
              Cancelar
            </button>
            <button type="submit" class="btn-primary" :disabled="guardando">
              {{ guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Crear rol' }}
            </button>
          </div>
        </form>
      </section>
    </div>

    <!-- Detalles -->
    <div
      v-if="mostrarDetalle && rolSeleccionado"
      class="modal-fondo"
      @click.self="mostrarDetalle = false"
    >
      <section class="modal">
        <header class="modal-header">
          <div>
            <span class="etiqueta">INFORMACIÓN</span>
            <h2>Detalle del rol</h2>
          </div>
          <button class="cerrar" @click="mostrarDetalle = false">×</button>
        </header>

        <div class="detalle">
          <p>
            <strong>ID</strong><span>{{ rolSeleccionado.id }}</span>
          </p>
          <p>
            <strong>Nombre</strong><span>{{ rolSeleccionado.name }}</span>
          </p>
          <p>
            <strong>Descripción</strong
            ><span>{{ rolSeleccionado.description || 'Sin descripción' }}</span>
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
.roles {
  width: 100%;
  color: #252622;
}
.encabezado,
.tabla-header,
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}
.encabezado {
  margin-bottom: 28px;
}
.etiqueta {
  color: #a65f48;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
}
h1,
h2 {
  font-family: 'Playfair Display', Georgia, serif;
}
h1 {
  font-size: 32px;
  margin: 8px 0;
}
.encabezado p {
  color: #77766f;
  font-size: 14px;
  margin: 0;
}
button {
  cursor: pointer;
  font-family: inherit;
}
.btn-primary {
  background: #a65f48;
  color: white;
  border: 0;
  padding: 11px 17px;
  border-radius: 4px;
}
.btn-primary:hover {
  background: #874a38;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-secundario {
  background: transparent;
  border: 1px solid #d8cec1;
  color: #55544e;
  padding: 10px 14px;
  border-radius: 4px;
}
.resumen,
.tabla-container {
  background: #fffefa;
  border: 1px solid #e7e1d7;
}
.resumen {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 22px;
  width: fit-content;
  min-width: 230px;
  margin-bottom: 24px;
}
.resumen span {
  color: #77766f;
  font-size: 13px;
}
.resumen strong {
  font:
    30px 'Playfair Display',
    Georgia,
    serif;
}
.tabla-container {
  overflow-x: auto;
}
.tabla-header {
  padding: 20px 22px;
}
.tabla-header h2 {
  font-size: 20px;
  margin: 5px 0 0;
}
table {
  width: 100%;
  min-width: 600px;
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
}
.nombre {
  font-weight: 600;
}
.acciones-tabla {
  display: flex;
  gap: 6px;
}
.acciones-tabla button {
  border: 0;
  padding: 7px 10px;
  border-radius: 3px;
  font-size: 11px;
}
.ver {
  background: #eeeae2;
  color: #55544e;
}
.editar {
  background: #f5eadc;
  color: #99613b;
}
.eliminar {
  background: #f8eae7;
  color: #a34e45;
}
.mensaje {
  padding: 30px;
  text-align: center;
  color: #77766f;
}
.alerta {
  padding: 12px;
  margin-bottom: 15px;
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
  background: #25262299;
  display: grid;
  place-items: center;
  padding: 20px;
  overflow-y: auto;
}
.modal {
  background: #fffefa;
  width: 100%;
  max-width: 460px;
  padding: 25px;
}
.modal-header {
  align-items: flex-start;
  margin-bottom: 22px;
}
.modal-header h2 {
  font-size: 23px;
  margin: 7px 0 0;
}
.cerrar {
  border: 0;
  background: none;
  font-size: 26px;
  color: #77766f;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
form label {
  font-size: 13px;
  font-weight: 600;
  color: #55544e;
}
form input,
form textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  border: 1px solid #ded8ce;
  border-radius: 3px;
  font: inherit;
  font-size: 13px;
}
form input:focus,
form textarea:focus {
  outline: 1px solid #a65f48;
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
@media (max-width: 600px) {
  .encabezado {
    align-items: flex-start;
    flex-direction: column;
  }
  .tabla-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
