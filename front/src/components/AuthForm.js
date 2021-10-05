import { Fragment, useState } from 'react'
import axios from 'axios'

const AuthForm = () => {
  const [isSignIn, setisSignIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [nationality, setNationality] = useState('')

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const userData = {
        email: email,
        password: password,
        name: name,
        nationality: nationality,
      }

      if (isSignIn) {
        const res = await axios.post('/api/user/sign-in', userData)
        console.log(res)
      } else {
        const res = await axios.post('/api/user/sign-up', userData)
        console.log(res)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Fragment>
      <form onSubmit={onSubmitForm}>
        <h1>{isSignIn ? 'Sign In' : 'Sign Up'}</h1>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          name="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignIn ? (
          <Fragment></Fragment>
        ) : (
          <Fragment>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              name="nationality"
              placeholder="Nationality"
              onChange={(e) => setNationality(e.target.value)}
            />
          </Fragment>
        )}
        <button>{isSignIn ? 'Access' : 'Register'}</button>
      </form>
      <p>{isSignIn ? 'New to SMAT?' : 'Already a member?'}</p>
      <button
        onClick={(e) => {
          setisSignIn(!isSignIn)
        }}
      >
        {isSignIn ? 'Sign Up' : 'Sign In'}
      </button>
    </Fragment>
  )
}

export default AuthForm
