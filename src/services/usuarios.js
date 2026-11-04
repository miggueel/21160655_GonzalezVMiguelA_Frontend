import { apiRequest } from './api'

export const obtenerUsuarios = () => {
  return apiRequest('/usuarios')
}

export const obtenerUsuario = (id) => {
  return apiRequest(`/usuarios/${id}`)
}

export const crearUsuario = (usuario) => {
  return apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(usuario),
  })
}

export const actualizarUsuario = (id, usuario) => {
  return apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(usuario),
  })
}

export const eliminarUsuario = (id) => {
  return apiRequest(`/usuarios/${id}`, {
    method: 'DELETE',
  })
}
