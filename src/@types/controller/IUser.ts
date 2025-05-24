export interface LoginProps {
  email: string
  password: string
}

export interface RegisterProps {
  name: string
  email: string
  password: string
}

export interface UpdateUser {
  id?: number
  name?: string
  email?: string
  password?: string
}
