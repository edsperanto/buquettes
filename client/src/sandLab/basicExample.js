import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'


const Example = ({ match }) => {
  return (
  <div>
    <h2>Home</h2>

    <h3></h3>
  </div>



    )
}

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr/>

    </div>
  </Router>
)

export default {Example, BasicExample};