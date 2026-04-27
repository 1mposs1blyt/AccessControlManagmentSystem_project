export interface Checkin {
  id: number
  type: string
  userId: number
  user: User
  location: string
  method: string
  createdAt: string
}
export interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  cardId: string
  checkins: Checkin[]
}
export interface UserState {
  users: User[]
  setUsers: (users: User[]) => void
  updateUser: (id: number, data: Partial<User>) => void
  refreshSignal: number
  triggerRefresh: () => void
}
export interface AuthState {
  isAuthenticated: boolean
  user: any | null
  login: (userData: any) => void
  logout: () => void
}