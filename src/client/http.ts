async function getBody<T>(c: Response | Request): Promise<T> {
  return c.json() as Promise<T>
}

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const request = new Request(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const response = await fetch(request)

  if (!response.ok) {
    const errorBody = await response.text()
    const errorData = errorBody
      ? JSON.parse(errorBody)
      : { message: 'Erro desconhecido' }

    throw new Error(errorData.message || `Erro HTTP ${response.status}`)
  }

  const data = await getBody<T>(response)

  return data as T
}
