import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { useRef } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice';

const Profile = () => {

  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const {currentUser, error, loading} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

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

  const handleSubmit = async(e) => {
    //prevent the refresh page
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const config = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
      }

      const res = await fetch(`/api/user/update/${currentUser._id}`, config);
      const data = await res.json();

      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDelete = async() => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async() => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');  //this is get method, so no need to mention config data
      const data = await res.json();

      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess(data));

    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  const handleShowListings = async() => {
    try {
      setShowListingError(false);

      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();

      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);

    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleDeleteListings = async(listingId) => {
    	try {
        const config = {
          method: 'DELETE',
        }

        const res = await fetch(`/api/listing/delete/${listingId}`, config);
        const data = await res.json();

        if(data.success === false){
          console.log(data.message);
          return;
        }

        setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));

      } catch (error) {
        console.log(error.message);
      }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-center text-3xl font-semibold my-7'>Profile</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>

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

        <input type='text' placeholder='username' defaultValue={currentUser.username} id='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='email' placeholder='email' defaultValue={currentUser.email} id='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} className='bg-slate-700 rounded-lg p-3 uppercase text-white hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'update'}
        </button>

        <Link to='/create-listing' className='bg-green-700 p-3 uppercase rounded-lg text-center text-white hover:opacity-95'>
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>

      <p className='text-red-500 mt-5'>{error ? error : ''}</p>
      <p className='text-green-500 mt-5'>{updateSuccess ? 'User updated successfully' : ''}</p>
    
      <button onClick={handleShowListings} className='text-green-700 w-full'>Show Listing</button>
      <p>{showListingError ? 'Error showing listings' : ''}</p>

      {userListings && userListings.length > 0 && 
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
        {userListings.map((listing) => (
          <div key={listing._id} className='flex justify-between items-center border rounded-lg p-3 gap-4'>
             <Link to={`/listing/${listing._id}`}>
              <img 
                src={listing.imageUrls[0]}
                alt='listing cover'
                className='h-16 w-16 object-contain'
              />
             </Link>
             <Link to={`/listing/${listing._id}`} className='text-slate-700 font-semibold flex-1 hover:underline truncate'>
              <p>{listing.name}</p>
             </Link>

             <div className='flex flex-col items-center'>
              <button onClick={() => handleDeleteListings(listing._id)} className='text-red-700 uppercase'>Delete</button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
              </Link>
             </div>
          </div>
        ))}
      </div>
      }
    </div>
  )
}

export default Profile
