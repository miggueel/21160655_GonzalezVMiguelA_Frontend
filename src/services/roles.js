import { apiRequest } from './api'

export const obtenerRoles = () => {
  return apiRequest('/roles')
}

export const obtenerRol = (id) => {
  return apiRequest(`/roles/${id}`)
}

export const crearRol = (rol) => {
  return apiRequest('/roles', {
    method: 'POST',
    body: JSON.stringify(rol),
  })
}

export const actualizarRol = (id, rol) => {
  return apiRequest(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(rol),
  })
}

export const eliminarRol = (id) => {
  return apiRequest(`/roles/${id}`, {
    method: 'DELETE',
  })
}
