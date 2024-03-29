import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


const OAuth = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

  const handleGoogleClick = async() => {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);
        
        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                name: result.user.displayName, 
                email: result.user.email, 
                photo: result.user.photoURL,
            })
        }

        const res = await fetch('/api/auth/google', config);
        const data = await res.json();
        dispatch(signInSuccess(data));
        navigate('/');

    } catch (error) {
        console.log('could not sign in with google', error);
    }
  }

  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 p-3 text-white rounded-lg hover:opacity-95 uppercase'>
      Continue With Google
    </button>
  )
}

export default OAuth
