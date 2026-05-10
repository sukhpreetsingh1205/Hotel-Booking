import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const Navbar = () => {
  const {logout, user} = useAppContext()
  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
        <Link to='/'>
        <img src={assets.logo} alt="logo" className='h-9 invert opacity-80'/>
        </Link>

        {user && (
          <button onClick={logout} className='px-4 py-1.5 text-sm rounded-full bg-black text-white cursor-pointer'>
            Logout
          </button>
        )}
      
    </div>
  )
}

export default Navbar
