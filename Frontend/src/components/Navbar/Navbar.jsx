import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo.jsx";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar.jsx/SearchBar.jsx";
import axios from "axios";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      // Make an API call to log out
      const response = await axios.post(
        "http://localhost:5000/user/logout",
        {},
        { withCredentials: true }
      );

      // Check if logout was successful
      if (response.data.success) {
        // Navigate to login page
        navigate("/login");
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    }
  };

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search when "Enter" is pressed
    }
  };

  return (
    <div className="bg-white flex items-center justify-between px-3 md:px-6 xl:px-6 py-2 drop-shadow">
      <h2 className="text-lg xl:text-xl font-medium text-black py-2">Notes</h2>

      <SearchBar 
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value);
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
        onKeyDown={handleKeyDown}
      />

      <ProfileInfo onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
