import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {

  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {currentUser, error, loading} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(Math.round(progress));
    },
      (error) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        })
      }
    )
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value});
  }

  // const handleSubmit = async(e) => {
  //   //prevent the refresh page
  //   e.preventDefault();

  //   try {
  //     setLoading(true);

  //     const config = {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json',
  //       },
  //       body: JSON.stringify(formData),
  //     }

  //     const res = await fetch('/api/auth/signup', config);
  //     const data = await res.json();

  //     if(data.success === false) {
  //       setError(data.message);
  //       setLoading(false);
  //       return;
  //     }

  //     setLoading(false);
  //     setError(null);
  //     navigate('/sign-in');

  //   } catch (error) {
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // }

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-center text-3xl font-semibold my-7'>Profile</h1>

      <form className='flex flex-col gap-4'>

        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*'/>
        <img 
          onClick={() => fileRef.current.click()} 
          src={formData.avatar || currentUser.avatar} 
          alt='profile' 
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        <p className='text-sm self-center'>
          {fileUploadErr ? (
            <span className='text-red-700'>Error image upload(image must be less than 2 mb)</span>
          ) : (
            filePercentage > 0 && filePercentage < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
            ) : (
              filePercentage === 100 ? (
                <span>Image successfully uploaded</span>
              ) : ""
            )
          )}
        </p>

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
