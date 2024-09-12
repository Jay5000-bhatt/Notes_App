import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../../components/Navbar/Navbar.jsx";
import PasswordInput from "../../components/Input/PasswordInput.jsx";
import { validateEmail } from "../../utils/helper.js";
import axios from "axios"; // Import axios

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a Valid Email");
      return;
    }

    if (!password) {
      setError("Please enter The Password");
      return;
    }

    setError("");

    //Login Api Call
    try {
      // Login API Call using Axios
      const response = await axios.post(
        "http://localhost:5000/user/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Navigate to /dashboard on successful login
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      // Set error message on failure
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
        <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      </div>

      <div className="flex items-center justify-center mt-16 md:mt-20 xl:mt-28  ">
        <div className="w-3/4 md:w-96 xl:w-96 border bg-white px-5 xl:px-7 py-10 rounded-3xl md:rounded-3xl xl:rounded-2xl ">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            <input
              type="text"
              className="input-box"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not Registered Yet? {""}
              <Link
                to="/"
                className="font-medium
              text-primary underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
