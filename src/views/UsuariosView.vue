<script setup>
import { ref, onMounted } from 'vue'
import {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../services/usuarios'
import { obtenerRoles } from '../services/roles'

const usuarios = ref([])
const roles = ref([])
const cargando = ref(false)
const guardando = ref(false)
const mostrarFormulario = ref(false)
const mostrarDetalle = ref(false)
const modoEdicion = ref(false)
const usuarioSeleccionado = ref(null)
const error = ref('')
const mensaje = ref('')

const formularioInicial = () => ({
  username: '',
  email: '',
  password: '',
  role_id: '',
  is_active: true,
})
const formulario = ref(formularioInicial())

const cargarDatos = async () => {
  try {
    cargando.value = true
    error.value = ''
    const [u, r] = await Promise.all([obtenerUsuarios(), obtenerRoles()])
    usuarios.value = u.data
    roles.value = r.data
  } catch (err) {
    error.value = err.message || 'No fue posible cargar los datos.'
  } finally {
    cargando.value = false
  }
}

const abrirFormulario = () => {
  formulario.value = formularioInicial()
  modoEdicion.value = false
  usuarioSeleccionado.value = null
  error.value = ''
  mensaje.value = ''
  mostrarFormulario.value = true
}

const editarUsuario = async (usuario) => {
  try {
    error.value = ''
    const respuesta = await obtenerUsuario(usuario.id)
    const datos = respuesta.data
    formulario.value = {
      username: datos.username,
      email: datos.email,
      password: '',
      role_id: datos.role_id,
      is_active: datos.is_active,
    }
    usuarioSeleccionado.value = usuario.id
    modoEdicion.value = true
    mostrarFormulario.value = true
  } catch (err) {
    error.value = err.message || 'No se pudo consultar el usuario.'
  }
}

const guardarUsuario = async () => {
  try {
    guardando.value = true
    error.value = ''
    const datos = {
      username: formulario.value.username.trim(),
      email: formulario.value.email.trim(),
      role_id: Number(formulario.value.role_id),
      is_active: formulario.value.is_active,
    }

    if (!modoEdicion.value || formulario.value.password) {
      datos.password = formulario.value.password
    }

    if (modoEdicion.value) {
      await actualizarUsuario(usuarioSeleccionado.value, datos)
      mensaje.value = 'Usuario actualizado correctamente.'
    } else {
      await crearUsuario(datos)
      mensaje.value = 'Usuario registrado correctamente.'
    }

    mostrarFormulario.value = false
    formulario.value = formularioInicial()
    await cargarDatos()
  } catch (err) {
    error.value = err.message || 'No se pudo guardar el usuario.'
  } finally {
    guardando.value = false
  }
}

const borrarUsuario = async (usuario) => {
  if (
    !window.confirm(`¿Eliminar al usuario "${usuario.username}"? Esta acción no se puede deshacer.`)
  )
    return

  try {
    error.value = ''
    await eliminarUsuario(usuario.id)
    mensaje.value = 'Usuario eliminado correctamente.'
    await cargarDatos()
  } catch (err) {
    error.value = err.message || 'No se pudo eliminar el usuario.'
  }
}

const verUsuario = async (usuario) => {
  try {
    error.value = ''
    const respuesta = await obtenerUsuario(usuario.id)
    usuarioSeleccionado.value = respuesta.data
    mostrarDetalle.value = true
  } catch (err) {
    error.value = err.message || 'No se pudo consultar el usuario.'
  }
}

const cerrarFormulario = () => {
  mostrarFormulario.value = false
  error.value = ''
}

const nombreRol = (id) => {
  const rol = roles.value.find((item) => item.id === id)
  return rol ? rol.name : `Rol ${id}`
}

onMounted(cargarDatos)
</script>

<template>
  <main class="usuarios">
    <header class="encabezado">
      <div>
        <span class="etiqueta">GESTIÓN DEL SISTEMA</span>
        <h1>Usuarios</h1>
        <p>Consulta y administra los usuarios de tu plataforma.</p>
      </div>
      <button class="btn-primary" @click="abrirFormulario">+ Nuevo usuario</button>
    </header>

    <div v-if="mensaje" class="alerta exito">{{ mensaje }}</div>
    <div v-if="error && !mostrarFormulario" class="alerta error">{{ error }}</div>

    <section class="resumen">
      <article class="resumen-card">
        <span>Total de usuarios</span>
        <strong>{{ usuarios.length }}</strong>
      </article>
      <article class="resumen-card">
        <span>Usuarios activos</span>
        <strong>{{ usuarios.filter((u) => u.is_active).length }}</strong>
      </article>
      <article class="resumen-card">
        <span>Usuarios inactivos</span>
        <strong>{{ usuarios.filter((u) => !u.is_active).length }}</strong>
      </article>
    </section>

    <section class="tabla-container">
      <div class="tabla-titulo">
        <div>
          <span class="etiqueta">REGISTROS</span>
          <h2>Listado de usuarios</h2>
        </div>
        <button class="btn-recargar" @click="cargarDatos">↻ Actualizar</button>
      </div>

      <p v-if="cargando" class="mensaje">Cargando usuarios...</p>
      <p v-else-if="usuarios.length === 0" class="mensaje">No hay usuarios registrados.</p>

      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Correo electrónico</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td class="id">{{ usuario.id }}</td>
            <td class="nombre">{{ usuario.username }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ nombreRol(usuario.role_id) }}</td>
            <td>
              <span :class="usuario.is_active ? 'estado activo' : 'estado inactivo'">
                {{ usuario.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td>
              <div class="acciones-tabla">
                <button class="btn-ver" @click="verUsuario(usuario)">Ver</button>
                <button class="btn-editar" @click="editarUsuario(usuario)">Editar</button>
                <button class="btn-eliminar" @click="borrarUsuario(usuario)">Eliminar</button>
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
            <span class="etiqueta">{{
              modoEdicion ? 'MODIFICAR REGISTRO' : 'NUEVO REGISTRO'
            }}</span>
            <h2>{{ modoEdicion ? 'Editar usuario' : 'Registrar usuario' }}</h2>
            <p>
              {{
                modoEdicion
                  ? 'Actualiza la información del usuario.'
                  : 'Completa los datos solicitados.'
              }}
            </p>
          </div>
          <button class="cerrar" @click="cerrarFormulario">×</button>
        </header>

        <form @submit.prevent="guardarUsuario">
          <label>Nombre de usuario</label>
          <input v-model="formulario.username" type="text" placeholder="Ej. ana28" required />

          <label>Correo electrónico</label>
          <input
            v-model="formulario.email"
            type="email"
            placeholder="Ej. ana@example.com"
            required
          />

          <label>Contraseña <small v-if="modoEdicion">(Opcional)</small></label>
          <input
            v-model="formulario.password"
            type="password"
            :placeholder="
              modoEdicion ? 'Dejar vacío para conservar la actual' : 'Escribe una contraseña'
            "
            :required="!modoEdicion"
          />

          <label>Rol</label>
          <select v-model="formulario.role_id" required>
            <option value="" disabled>Selecciona un rol</option>
            <option v-for="rol in roles" :key="rol.id" :value="rol.id">{{ rol.name }}</option>
          </select>

          <template v-if="modoEdicion">
            <label>Estado del usuario</label>
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
                guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Registrar usuario'
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
            <h2>Detalle del usuario</h2>
          </div>
          <button class="cerrar" @click="mostrarDetalle = false">×</button>
        </header>

        <div v-if="usuarioSeleccionado" class="detalle">
          <p>
            <strong>ID</strong><span>{{ usuarioSeleccionado.id }}</span>
          </p>
          <p>
            <strong>Usuario</strong><span>{{ usuarioSeleccionado.username }}</span>
          </p>
          <p>
            <strong>Correo</strong><span>{{ usuarioSeleccionado.email }}</span>
          </p>
          <p>
            <strong>Rol</strong><span>{{ nombreRol(usuarioSeleccionado.role_id) }}</span>
          </p>
          <p>
            <strong>Estado</strong
            ><span>{{ usuarioSeleccionado.is_active ? 'Activo' : 'Inactivo' }}</span>
          </p>
          <p v-if="usuarioSeleccionado.created_at">
            <strong>Fecha de creación</strong>
            <span>{{ new Date(usuarioSeleccionado.created_at).toLocaleString() }}</span>
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
.usuarios {
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
  min-width: 720px;
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
form small {
  color: #99948a;
  font-weight: normal;
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
