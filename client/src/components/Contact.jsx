import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Contact({listing}) {

  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {

    const fetchLandlord = async() => {
        try {
           const res = await fetch(`/api/user/${listing.userRef}`);
           const data = await res.json();
           setLandlord(data);
            
        } catch (error) {
            console.log(error.message);
        }
    }
    fetchLandlord();

  }, [listing.userRef])

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-4'>
            <p>Contact <span className='font-semibold '>{landlord.username}</span> for <span className='font-semibold '>{listing.name.toLowerCase()}</span></p>

            <textarea 
                id='message'
                name='message'
                rows='2'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className='w-full border p-3 rounded-lg'
                placeholder='Enter your message here..'
            />
            <Link 
                to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                className='bg-slate-700 text-white p-3 rounded-lg text-center uppercase hover:opacity-95'
            >
                Send Message
            </Link>
        </div>
      )
      }
    </>
  )
}
