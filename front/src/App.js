import { Fragment } from 'react'
import AuthForm from './components/AuthForm'
import SearchBar from './components/SearchBar'
import PostForm from './components/PostForm'
import SignOutButton from './components/SignOutButton'

function App() {
  return (
    <Fragment>
      <AuthForm></AuthForm>
      <SignOutButton></SignOutButton>
      <SearchBar></SearchBar>
      <PostForm isNewPost={true}></PostForm>
    </Fragment>
  )
}

export default App
