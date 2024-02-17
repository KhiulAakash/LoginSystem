import React, { useEffect } from "react";
import { useAuth } from "../AuthContext/AuthContext.";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
  const { userProfile, storedToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!storedToken) {
      toast.info("You haven't logged in.")
      navigate('/login');
      return;
    }
  }, []);

  return (
    <main>
      {storedToken && (
        <div className="Profile">
          <fieldset>
            <legend>Personal Information</legend>
            {userProfile && (
              <div>
                <p>Full Name: {userProfile.fullName}</p>
                <p>Email: {userProfile.email}</p>
                <p>Phone Number: {userProfile.phoneNumber}</p>
                <p>Admin: {userProfile.admin ? "Yes" : "No"}</p>
              </div>
            )}
          </fieldset>
        </div>
      )}
    </main>
  );
}

export default Profile;
