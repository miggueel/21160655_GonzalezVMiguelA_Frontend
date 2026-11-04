<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { obtenerUsuarios } from '../services/usuarios'
import { obtenerRoles } from '../services/roles'

const totalUsuarios = ref(0)
const totalRoles = ref(0)
const cargando = ref(true)
const error = ref('')

const cargarResumen = async () => {
  cargando.value = true
  error.value = ''

  try {
    const [usuarios, roles] = await Promise.all([obtenerUsuarios(), obtenerRoles()])

    totalUsuarios.value = usuarios.total ?? usuarios.data?.length ?? 0
    totalRoles.value = roles.total ?? roles.data?.length ?? 0
  } catch (err) {
    error.value = err.message || 'No se pudieron cargar los datos.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarResumen)
</script>

<template>
  <div class="dashboard">
    <!-- Bienvenida -->
    <section class="welcome">
      <div>
        <span class="eyebrow">PANEL DE ADMINISTRACIÓN</span>
        <h1>¡Bienvenido!</h1>
        <p>
          Administra los recursos de tu plataforma desde un solo lugar. Consulta y organiza tus
          usuarios y roles fácilmente.
        </p>
      </div>
    </section>

    <!-- Resumen -->
    <section class="summary">
      <div class="section-heading">
        <div>
          <h2>Resumen del sistema</h2>
          <p>Consulta los registros actuales de tu plataforma.</p>
        </div>

        <button
          class="refresh-button"
          @click="cargarResumen"
          :disabled="cargando"
          title="Actualizar estadísticas"
        >
          ↻ Actualizar
        </button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
        <button @click="cargarResumen">Reintentar</button>
      </div>

      <div class="cards">
        <!-- Usuarios -->
        <article class="card users-card">
          <div class="card-header">
            <div class="card-icon">♙</div>
            <span class="card-label">GESTIÓN DE USUARIOS</span>
          </div>

          <h3>Usuarios</h3>
          <p>Consulta y administra los usuarios registrados.</p>

          <div class="card-bottom">
            <div>
              <span class="number">
                {{ cargando ? '...' : totalUsuarios }}
              </span>
              <span class="number-label">Registrados</span>
            </div>

            <RouterLink to="/usuarios" class="card-link"> Ver usuarios <span>→</span> </RouterLink>
          </div>
        </article>

        <!-- Roles -->
        <article class="card roles-card">
          <div class="card-header">
            <div class="card-icon">◇</div>
            <span class="card-label">CONTROL DE ACCESO</span>
          </div>

          <h3>Roles</h3>
          <p>Administra los perfiles disponibles en el sistema.</p>

          <div class="card-bottom">
            <div>
              <span class="number">
                {{ cargando ? '...' : totalRoles }}
              </span>
              <span class="number-label">Disponibles</span>
            </div>

            <RouterLink to="/roles" class="card-link"> Ver roles <span>→</span> </RouterLink>
          </div>
        </article>
      </div>
    </section>

    <!-- Estado -->
    <section class="system-status">
      <div class="status-indicator">
        <span class="status-dot"></span>
        <div>
          <strong>Sistema local</strong>
          <span>Plataforma de administración</span>
        </div>
      </div>

      <span class="technology">Vue 3 · Node.js · PostgreSQL</span>
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  width: 100%;
  max-width: none;
  color: #292723;
}

/* Bienvenida */

.welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  padding: 30px 35px;
  margin-bottom: 35px;
  background: #eae4d9;
  border-left: 4px solid #a65f48;
}

.eyebrow {
  color: #a65f48;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.welcome h1 {
  margin: 12px 0 8px;
  font-family: 'Playfair Display', serif;
  font-size: 34px;
  font-weight: 600;
}

.welcome p {
  max-width: 600px;
  margin: 0;
  color: #77736a;
  font-size: 13px;
  line-height: 1.7;
}

.welcome-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 85px;
  height: 85px;
  border: 1px solid #cbb9a7;
  color: #a65f48;
  font-family: 'Playfair Display', serif;
  font-size: 25px;
}

/* Encabezado */

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.section-heading h2 {
  margin: 0 0 6px;
  font-family: 'Playfair Display', serif;
  font-size: 23px;
  font-weight: 600;
}

.section-heading p {
  margin: 0;
  color: #89867e;
  font-size: 12px;
}

.refresh-button {
  padding: 9px 13px;
  background: #fffefa;
  border: 1px solid #e5e0d7;
  color: #77736a;
  font-size: 11px;
  cursor: pointer;
}

.refresh-button:hover {
  border-color: #a65f48;
  color: #a65f48;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* Tarjetas */

.cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
}

.card {
  min-width: 0;
  padding: 25px;
  background: #fffefa;
  border: 1px solid #e5e0d7;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(41, 39, 35, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  display: grid;
  place-items: center;
  width: 39px;
  height: 39px;
  background: #f2e7e0;
  color: #a65f48;
  font-size: 22px;
}

.roles-card .card-icon {
  background: #e9eee4;
  color: #69785e;
}

.card-label {
  color: #89867e;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.1px;
}

.card h3 {
  margin: 22px 0 7px;
  font-family: 'Playfair Display', serif;
  font-size: 23px;
  font-weight: 600;
}

.card > p {
  margin: 0;
  color: #89867e;
  font-size: 12px;
  line-height: 1.6;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-top: 25px;
  padding-top: 18px;
  border-top: 1px solid #eeeae3;
}

.card-bottom > div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.number {
  font-family: 'Playfair Display', serif;
  font-size: 35px;
  font-weight: 600;
  line-height: 1;
}

.number-label {
  color: #89867e;
  font-size: 10px;
}

.card-link {
  color: #a65f48;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.roles-card .card-link {
  color: #69785e;
}

.card-link span {
  margin-left: 4px;
}

.card-link:hover {
  text-decoration: underline;
}

/* Estado del sistema */

.system-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 28px;
  padding: 17px 20px;
  background: #fffefa;
  border: 1px solid #e5e0d7;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #71936f;
  box-shadow: 0 0 0 4px #e8eee4;
}

.status-indicator div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.status-indicator strong {
  font-size: 11px;
}

.status-indicator div span {
  color: #89867e;
  font-size: 10px;
}

.technology {
  color: #89867e;
  font-size: 10px;
}

/* Errores */

.error-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  margin-bottom: 15px;
  background: #f8eae6;
  color: #8d4638;
  font-size: 12px;
}

.error-message button {
  border: none;
  background: transparent;
  color: #8d4638;
  font-weight: 700;
  cursor: pointer;
}

/* Adaptación a pantallas pequeñas */

@media (max-width: 750px) {
  .cards {
    grid-template-columns: 1fr;
  }

  .welcome {
    padding: 25px;
  }

  .welcome-icon {
    width: 65px;
    height: 65px;
  }
}

@media (max-width: 480px) {
  .welcome-icon {
    display: none;
  }

  .welcome h1 {
    font-size: 29px;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .card-bottom {
    align-items: flex-start;
    flex-direction: column;
  }

  .system-status {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
