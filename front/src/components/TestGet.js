import { Fragment, useState, useEffect } from 'react'

const TestGet = () => {
  const [tests, setTests] = useState([])
  const [t, setT] = useState('')

  const getTests = async () => {
    try {
      const rest = await fetch('/api/')
      const jsonrest = await rest.json()
      setT(jsonrest)
      const res = await fetch('/api/testget')
      const jsonData = await res.json()
      setTests(jsonData)
    } catch (err) {
      console.error(err.message)
    }
  }

  useEffect(() => {
    getTests()
  }, [])

  return (
    <Fragment>
      <h1>{t}</h1>
      <table>
        <thead>
          <tr>
            <th>Test Id</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.test_id}>
              <td>{test.test_id}</td>
              <td>{test.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  )
}

export default TestGet
