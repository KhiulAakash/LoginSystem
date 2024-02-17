import React from 'react'
import { NavLink } from 'react-router-dom'
import './Error.css'


export default function Error() {
  return (
    <div className='Error'>
        <main>
      <section>
        <div id='heading'>
          <h1>404</h1></div>
          <h4>SORRY! PAGE NOT FOUND</h4>
          <p>
            Oops! It seems like the page you're trying to access doesn't exist.
            If you believe there's an issue, feel free to report it, and we'll
            look into it.
          </p>
          <div className="btns">
            <button><NavLink to="/">RETURN HOME</NavLink></button>
            <button><NavLink to="/contact">REPORT PROBLEM</NavLink></button>
          </div>
      </section>
      </main>
    </div>
  )
}