import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome';
import SongDetails from './SongDetails';
import UpdateSong from './UpdateSong';
import CreateSong from './CreateSong';
import MemberPage from './Member';

const Display = () => {

  return (
    <div className='w-[100%] h-[100%]'>
      <Routes>
        <Route path='/' element={<DisplayHome />} />
        <Route path='/:id' element={<SongDetails />}/>
        <Route path='/update/:id' element={<UpdateSong />}/>
        <Route path='/create' element={<CreateSong />}/>
        <Route path='/Member' element={<MemberPage />} />
      </Routes>
    </div>
  )
}



export default Display;