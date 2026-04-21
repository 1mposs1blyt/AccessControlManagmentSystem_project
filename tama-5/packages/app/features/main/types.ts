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