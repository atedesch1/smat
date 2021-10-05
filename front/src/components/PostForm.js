import { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { useHistory } from 'react-router'

const PostForm = ({ isNewPost, token }) => {
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [instructor, setInstructor] = useState('')
  const history = useHistory()
  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('language', language)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('subject', subject)
      formData.append('instructor', instructor)
      // Needs to be authenticated
         await axios('/api/post/create', {
           method: 'POST',
           data: formData,
           headers: {
             'Content-Type': 'multipart/form-data',
             'Authorization': `Bearer ${token}`
           },
         })
      history.push("/")
      console.log(formData)
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <PostFormBox>
      <h1>{isNewPost ? 'Create Post' : 'Update Post'}</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="file"
          name="file"
          onChange={(e) => {
            setFile(e.target.files[0])
          }}
        />
        <input
          type="text"
          name="email"
          placeholder="Language"
          onChange={(e) => setLanguage(e.target.value)}
        />
        <input
          type="text"
          name="email"
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          name="email"
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          name="email"
          placeholder="Subject"
          onChange={(e) => setSubject(e.target.value)}
        />
        <input
          type="text"
          name="email"
          placeholder="Instructor"
          onChange={(e) => setInstructor(e.target.value)}
        />
        <button>{isNewPost ? 'Create' : 'Update'}</button>
      </form>
    </PostFormBox>
  )
}

export default PostForm

const PostFormBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  form  {
    display: flex;
    flex-direction: column;
    input {
      margin-top: 10px;
      margin-bottom: 10px;
    }
  }
`