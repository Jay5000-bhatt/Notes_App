import React, { useState, useEffect } from "react";
import axios from "axios";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details from the server
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/user/get-user",
          { withCredentials: true }
        );
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          console.error("Failed to fetch user details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center text-slate-950 font-medium bg-slate-200 rounded-full">
        {getInitials(user.name)}
      </div>
      <div>
        <p className="text-sm font-medium">{user.name}</p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
