import { request } from './api.js'

export const sendContactMessage = (message) => request('/contact', { method: 'POST', body: message })
