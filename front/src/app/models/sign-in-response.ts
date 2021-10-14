export interface SignInResponse {
  user: {
    id: string,
    email: string
  },
  token: string
}
