import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext.';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Admin.css';
import { toast } from 'react-toastify';

function AdminUser() {
  const { token,storedToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [contactDetails, setContactDetails] = useState([]);
  const navigate=useNavigate();
  const isAdmin=localStorage.getItem('admin');
  console.log(isAdmin)

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchContact = async () => {
    try {
      const res = await axios.get('http://localhost:3000/contactDetails', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.statusText) {
        setContactDetails(res.data.response);
      }
    } catch (error) {
      console.log('Failed to fetch contact', error);
    }
  };

  useEffect(() => {
    if(!storedToken){
      toast.info("You haven't logged in.")
      navigate('/login')
      return;
    }
    fetchUsers();
    fetchContact();
  }, [token]);

  const handleDelete = async (userId) => {
    // Show confirmation dialog using SweetAlert
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    // If user confirms deletion, proceed with the delete request
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user._id !== userId));
        // Show success message using SweetAlert
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (error) {
        console.error('Failed to delete user:', error);
        // Show error message using SweetAlert
        Swal.fire('Error!', 'Failed to delete user.', 'error');
      }
    }
  };

  const handleDeleteCon = async (contactId) => {
    // Show confirmation dialog using SweetAlert
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this contact!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    // If user confirms deletion, proceed with the delete request
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/contactDetails/${contactId}`);
        // Remove the deleted contact from the state
        setContactDetails(contactDetails.filter((contact) => contact._id !== contactId));
        // Show success message using SweetAlert
        Swal.fire('Deleted!', 'Contact has been deleted.', 'success');
      } catch (error) {
        console.error('Failed to delete contact:', error);
        // Show error message using SweetAlert
        Swal.fire('Error!', 'Failed to delete contact.', 'error');
      }
    }
  };

  return (
    <main id="Admin">
      {storedToken && isAdmin=='true' && (<><h2>Users Information</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Edit</th>
            <th>Ation</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            if (!user.admin) {
              return (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button className="edit">
                      <Link to={`/edit/${user._id}`}>Edit</Link>
                    </button>
                  </td>
                  <td>
                    <button className="delete" onClick={() => handleDelete(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
      <h2>Contact User</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contactDetails.map((contact, index) => (
            <tr key={index}>
              <td>{contact.fullName}</td>
              <td>{contact.email}</td>
              <td>{contact.message}</td>
              <td>
                <button className="delete" onClick={() => handleDeleteCon(contact._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></>)}
    </main>
  );
}

export default AdminUser;
