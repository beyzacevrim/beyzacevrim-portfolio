// In development the API runs on its own port; in production it is served from the same
// domain behind /api (see beyzacevrim-api/DEPLOYMENT.md), so relative URLs are used.
const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5050' : '')).replace(/\/$/, '')

export class ApiRequestError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR', details } = {}) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
    this.details = details
  }
}

// Wraps fetch for the API's { success, data } / { success, error } response convention.
export async function request(path, { method = 'GET', body, signal } = {}) {
  let response
  try {
    response = await fetch(`${API_URL}/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') throw err
    throw new ApiRequestError('Could not reach the server. Please try again later.')
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok || !payload?.success) {
    const error = payload?.error
    throw new ApiRequestError(error?.message || 'Something went wrong. Please try again.', {
      status: response.status,
      code: error?.code || 'UNKNOWN_ERROR',
      details: error?.details,
    })
  }

  return payload.data
}
