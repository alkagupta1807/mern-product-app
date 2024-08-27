import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const VerifyEmail = () => {
  const { email, token } = useParams();
 
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email/${email}/${token}`, {
          method: 'GET',
        });

         await response.json();
      

        if (response.ok) {
          toast.success('Email successfully verified! Redirecting to login page...');
            navigate('/sign-in')}; // Adjust delay as needed
        // if(response.ok){
        //   <Link to= "/sign-in"></Link>
        // }
        
      } catch (error) {
        console.error('Verification error:', error);
       
      }
    };

    if (email && token) {
      verifyEmail();
    }
  }, [email, token, navigate]);

  return (
    <div>
      {/* <h2>email verified</h2>
      <Link to="/sign-in">Sign In</Link> */}
      {/* <p>{message}</p> */}
      {/* {user && ( */}
        {/* <div> */}
          {/* <h3>User Info:</h3> */}
          {/* <p>Email: {user.email}</p> */}
          {/* <p>Name: {user.firstName} {user.lastName}</p> */}
          {/* Display other user information if needed */}
        {/* </div> */}
      {/* )} */}
      {/* {tokenData && (
        <div>
          <h3>Token Info:</h3> */}
          {/* <p>Token: {tokenData.token}</p> */}
          {/* Display other token information if needed */}
        {/* </div> */}
      {/* )} */}
    </div>
  );
};

export default VerifyEmail;
