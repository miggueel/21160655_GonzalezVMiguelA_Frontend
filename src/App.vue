<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <!-- Menú lateral -->
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-text">
          <h2>Proyecto de</h2>
          <h2>Administración</h2>
          <span>PLATAFORMA DE GESTIÓN</span>
        </div>
      </div>

      <div class="sidebar-divider"></div>

      <nav class="navigation">
        <span class="nav-label">ESPACIO DE TRABAJO</span>

        <RouterLink to="/" class="nav-link">
          <span class="nav-icon">⌂</span>
          <span>Inicio</span>
          <span class="nav-arrow">↗</span>
        </RouterLink>

        <RouterLink to="/usuarios" class="nav-link">
          <span class="nav-icon">♙</span>
          <span>Usuarios</span>
          <span class="nav-arrow">↗</span>
        </RouterLink>

        <RouterLink to="/roles" class="nav-link">
          <span class="nav-icon">◇</span>
          <span>Roles</span>
          <span class="nav-arrow">↗</span>
        </RouterLink>
      </nav>

      <div class="sidebar-note">
        <span class="note-decoration">✳</span>
        <p>Organización, control y gestión en un solo espacio.</p>
      </div>

      <div class="sidebar-footer">
        <div class="footer-line"></div>
        <span>PROYECTO ACADÉMICO</span>
        <small>Vue 3 · Node.js · PostgreSQL</small>
        <small class="version">VERSIÓN 2.0</small>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">
      <header class="topbar">
        <div class="breadcrumb">
          <span>PROYECTO</span>
          <span class="breadcrumb-separator">/</span>
          <strong>ADMINISTRACIÓN</strong>
        </div>

        <div class="topbar-right">
          <div class="system-status">
            <span class="status-dot"></span>
            <span>Sistema local</span>
          </div>
        </div>
      </header>

      <section class="page-content">
        <RouterView />
      </section>

      <footer class="main-footer">
        <span>PROYECTO DE ADMINISTRACIÓN</span>
        <span>DESARROLLO DE SERVICIOS WEB · 2026</span>
      </footer>
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

/* =========================================
   CONFIGURACIÓN GLOBAL
   ========================================= */

:root {
  font-family: 'DM Sans', sans-serif;
  color: #292723;
  background: #f5f2ec;
  font-synthesis: none;
  text-rendering: optimizeLegibility;

  --color-background: #f5f2ec;
  --color-sidebar: #252622;
  --color-text: #292723;
  --color-muted: #89867e;
  --color-accent: #a65f48;
  --color-border: #e5e0d7;
  --color-card: #fffefa;

  --sidebar-width: 265px;
  --topbar-height: 76px;
}

/* Elimina las restricciones predeterminadas de Vue/Vite */
* {
  box-sizing: border-box;
}

html {
  width: 100%;
  min-width: 320px;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
  background: var(--color-background);
  color: var(--color-text);
}

/* Esta es una de las correcciones más importantes */
#app {
  width: 100% !important;
  max-width: none !important;
  min-height: 100vh;
  margin: 0 !important;
  padding: 0 !important;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

/* =========================================
   ESTRUCTURA PRINCIPAL
   ========================================= */

.app-container {
  display: flex;
  width: 100%;
  max-width: none;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  flex: 0 0 var(--sidebar-width);
  min-height: 100vh;
  background: var(--color-sidebar);
  color: #f5f2ec;
  display: flex;
  flex-direction: column;
  padding: 35px 23px 25px;
}

/* =========================================
   IDENTIDAD DEL PROYECTO
   ========================================= */

.brand {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 5px 28px;
}

.brand-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: var(--color-accent);
  color: #fffefa;
  font-family: 'Playfair Display', serif;
  font-size: 29px;
  border-radius: 4px;
}

.brand-text h2 {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-size: 17px;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.brand-text span {
  display: block;
  margin-top: 8px;
  color: #b5b1a7;
  font-size: 8px;
  letter-spacing: 1.4px;
}

.sidebar-divider {
  height: 1px;
  width: 100%;
  background: #41413b;
  margin-bottom: 35px;
}

/* =========================================
   NAVEGACIÓN
   ========================================= */

.navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
}

.nav-label {
  color: #96948b;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.6px;
  margin: 0 10px 14px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 13px;
  width: 100%;
  padding: 14px 12px;
  border-radius: 4px;
  color: #c4c1b8;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
}

.nav-icon {
  width: 22px;
  font-size: 19px;
  text-align: center;
}

.nav-arrow {
  margin-left: auto;
  opacity: 0;
  font-size: 13px;
  transition: opacity 0.2s;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  background: #3b3b34;
  color: #fffefa;
}

.nav-link.router-link-exact-active {
  border-left: 3px solid #bd8068;
  padding-left: 9px;
}

.nav-link.router-link-exact-active .nav-arrow,
.nav-link:hover .nav-arrow {
  opacity: 1;
}

/* =========================================
   INFORMACIÓN DEL MENÚ LATERAL
   ========================================= */

.sidebar-note {
  margin-top: auto;
  margin-bottom: 35px;
  padding: 20px 16px;
  border: 1px solid #41413b;
  background: #2d2e29;
}

.note-decoration {
  color: #bd8068;
  font-size: 23px;
}

.sidebar-note p {
  color: #c4c1b8;
  font-family: 'Playfair Display', serif;
  font-size: 15px;
  line-height: 1.5;
  margin: 10px 0 0;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-line {
  height: 1px;
  background: #41413b;
  margin-bottom: 12px;
}

.sidebar-footer > span {
  font-size: 9px;
  letter-spacing: 1.3px;
  color: #c4c1b8;
  font-weight: 700;
}

.sidebar-footer small {
  color: #96948b;
  font-size: 10px;
}

.sidebar-footer .version {
  color: #bd8068;
  letter-spacing: 1px;
  margin-top: 5px;
}

/* =========================================
   CONTENIDO PRINCIPAL
   ========================================= */

.main-content {
  flex: 1 1 auto;
  width: calc(100% - var(--sidebar-width));
  min-width: 0;
  max-width: none;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

/* =========================================
   BARRA SUPERIOR
   ========================================= */

.topbar {
  width: 100%;
  height: var(--topbar-height);
  min-height: var(--topbar-height);
  flex-shrink: 0;
  padding: 0 45px;
  background: #fffefa;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 11px;
  color: #99958b;
  font-size: 9px;
  letter-spacing: 1.4px;
}

.breadcrumb strong {
  color: #393832;
  font-weight: 700;
}

.breadcrumb-separator {
  color: #c2bdb3;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 22px;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #77756d;
  font-size: 11px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #71936f;
  box-shadow: 0 0 0 3px #e8eee4;
}

.topbar-monogram {
  width: 35px;
  height: 35px;
  border: 1px solid #d9cfc2;
  display: grid;
  place-items: center;
  color: #a65f48;
  font-family: 'Playfair Display', serif;
  font-size: 12px;
}

/* =========================================
   ÁREA DE LAS VISTAS
   ========================================= */

.page-content {
  flex: 1 0 auto;
  width: 100%;
  max-width: none;
  min-width: 0;
  margin: 0;
  padding: 42px 45px;
}

/* =========================================
   PIE DE PÁGINA
   ========================================= */

.main-footer {
  width: auto;
  min-height: 55px;
  flex-shrink: 0;
  border-top: 1px solid var(--color-border);
  margin: 0 45px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  color: #99958b;
  font-size: 8px;
  letter-spacing: 1.2px;
}

/* =========================================
   PANTALLAS MEDIANAS
   ========================================= */

@media (max-width: 900px) {
  :root {
    --sidebar-width: 225px;
  }

  .sidebar {
    padding: 28px 16px 20px;
  }

  .page-content {
    padding: 30px 25px;
  }

  .topbar {
    padding: 0 25px;
  }

  .main-footer {
    margin: 0 25px;
  }
}

/* =========================================
   PANTALLAS PEQUEÑAS
   ========================================= */

@media (max-width: 650px) {
  .app-container {
    flex-direction: column;
    overflow-x: hidden;
  }

  .sidebar {
    width: 100%;
    min-width: 0;
    min-height: auto;
    flex: none;
    padding: 17px 18px;
  }

  .brand {
    padding: 0 3px 15px;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
    font-size: 23px;
  }

  .brand-text h2 {
    font-size: 15px;
  }

  .sidebar-divider,
  .sidebar-note,
  .sidebar-footer {
    display: none;
  }

  .navigation {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
  }

  .nav-label {
    width: 100%;
    margin: 8px 5px;
  }

  .nav-link {
    flex: 1;
    justify-content: center;
    gap: 7px;
    padding: 10px 7px;
    font-size: 12px;
  }

  .nav-arrow {
    display: none;
  }

  .main-content {
    width: 100%;
    min-height: 0;
  }

  .topbar {
    height: 55px;
    min-height: 55px;
    padding: 0 17px;
  }

  .breadcrumb {
    font-size: 8px;
    gap: 7px;
  }

  .topbar-right {
    gap: 10px;
  }

  .system-status {
    font-size: 10px;
  }

  .topbar-monogram {
    width: 30px;
    height: 30px;
  }

  .page-content {
    padding: 25px 16px;
  }

  .main-footer {
    margin: 0 16px;
    padding: 12px 0;
    flex-wrap: wrap;
    font-size: 7px;
  }
}
</style>
