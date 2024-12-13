import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome';
import SongDetails from './SongDetails';

const Display = () => {

  return (
    <div className='w-[100%] h-[100%]'>
      <Routes>
        <Route path='/' element={<DisplayHome />} />
        <Route path='/:id' element={<SongDetails />}/>
      </Routes>
    </div>
  )
}



export default Display;