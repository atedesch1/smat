import { Fragment, useState } from 'react'

const TestUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [url, setUrl] = useState('')

  const changeHandler = (e) => {
    setSelectedFile(e.target.files[0])
  }

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      console.log(formData)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const url = await res.text()
      setUrl(url)
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Fragment>
      <h1>Test UPLOAD</h1>
      <form onSubmit={onSubmitForm}>
        <input type="file" name="file" onChange={changeHandler} />
        <button>Upload</button>
      </form>
      <h3>Uploaded file url: {<a href={url}>{url}</a>}</h3>
    </Fragment>
  )
}

export default TestUpload
