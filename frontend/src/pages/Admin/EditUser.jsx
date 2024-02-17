import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext.';
import { toast } from 'react-toastify';

function EditUser() {
  const { id } = useParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [admin, setAdmin] = useState(false);
  const { token } = useAuth();
  const navigate=useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const userData = res.data;
        setFullName(userData.fullName);
        setEmail(userData.email);
        setPhoneNumber(userData.phoneNumber);
        setAdmin(userData.admin);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res=await axios.put(`http://localhost:3000/users/${id}`, {
        fullName,
        email,
        phoneNumber,
        admin
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(res.statusText){
        toast.success('User updated successfully');
        navigate('/admin')
      }
      // Redirect to Admin page after successful edit
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <main id='AdminEdit'>
      <form onSubmit={handleSubmit}>
      <h1>Edit User</h1>
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <div className="label">
        <label>
          Admin:
        </label>
          <input type="checkbox" checked={admin} onChange={(e) => setAdmin(e.target.checked)} />
        </div>
        <div className="btn">
        <button type="submit">Update</button>
        </div>
      </form>
    </main>
  );
}

export default EditUser;
