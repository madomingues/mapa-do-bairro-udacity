import React, { Component } from 'react'

class Header extends Component {
  render(){
    return(
      <header>
        <div className= 'bm-burger-button'
        // eslint-disable-next-line
        customburgericon={ <img src="img/icon.svg" /> }>
        </div>
        <h1 className='titulo'>Bares próximos a Jardim Bela Vista</h1>
      </header>
    )
  }
}

export default Header;