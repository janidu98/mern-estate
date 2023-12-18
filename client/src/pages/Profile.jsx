import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';

const Profile = () => {

  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {currentUser, error, loading} = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value});
  }

  const handleSubmit = async(e) => {
    //prevent the refresh page
    e.preventDefault();

    try {
      setLoading(true);

      const config = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      }

      const res = await fetch('/api/auth/signup', config);
      const data = await res.json();

      if(data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      navigate('/sign-in');

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-center text-3xl font-semibold my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <img src={currentUser.avatar} alt='profile' className='rounded-full h-30 w-30 object-cover cursor-pointer self-center mt-2'/>
        <input type='text' placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='email' placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} className='bg-slate-700 rounded-lg p-3 uppercase text-white hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'update'}
        </button>
        
      </form>

      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default Profile
