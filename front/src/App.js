import { Fragment } from 'react'
import TestGet from './components/TestGet'

import TestPost from './components/TestPost'

function App() {
  return (
    <Fragment>
      <TestPost></TestPost>
      <TestGet></TestGet>
    </Fragment>
  )
}

export default App
