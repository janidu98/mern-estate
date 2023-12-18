import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signFailure } from '../redux/user/userSlice';

const SignIn = () => {

  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value});
  }

  const handleSubmit = async(e) => {
    //prevent the refresh page
    e.preventDefault();

    try {
      dispatch(signInStart());

      const config = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      }

      const res = await fetch('/api/auth/signin', config);
      const data = await res.json();

      if(data.success === false) {
        dispatch(signFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      dispatch(signFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-center text-3xl font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='email' placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} className='bg-slate-700 rounded-lg p-3 uppercase text-white hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'sing in'}
        </button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Create an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 hover:underline'>Sign up</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default SignIn
