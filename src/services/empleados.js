import { apiRequest } from './api'

export const obtenerEmpleados = () => apiRequest('/employees')

export const obtenerEmpleado = (id) => apiRequest(`/employees/${id}`)

export const crearEmpleado = (empleado) =>
  apiRequest('/employees', {
    method: 'POST',
    body: JSON.stringify(empleado),
  })

export const actualizarEmpleado = (id, empleado) =>
  apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(empleado),
  })

export const eliminarEmpleado = (id) =>
  apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  })
