import { Fragment, useState } from 'react'

const TestPost = () => {
  const [text, setText] = useState('')

  const onSubmitForm = async (e) => {
    e.preventDefault()
    try {
      const body = { text }
      await fetch('/api/testpost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      window.location = '/'
    } catch (err) {
      console.error(err.message)
    }
  }

  return (
    <Fragment>
      <h1>Test POST</h1>
      <form className="" onSubmit={onSubmitForm}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button>Add</button>
      </form>
    </Fragment>
  )
}

export default TestPost
