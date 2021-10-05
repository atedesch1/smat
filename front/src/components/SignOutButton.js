import { Fragment, useState } from 'react'
import axios from 'axios'

const SignOutButton = () => {
  const signOut = async (e) => {
    e.preventDefault()
    try {
      await axios('/user/sign-out', { method: 'GET' })
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Fragment>
      <button onClick={signOut}>Sign Out</button>
    </Fragment>
  )
}

export default SignOutButton
