import React from 'react'
import routes from '../routes'
import './AppMain.css'

const AppMain = () =>
  <main className="AppMain">
    <div className="AppMainInner">
      {routes}
    </div>
  </main>

export default AppMain
