import React from "react";
import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput.jsx";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper.js";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a Valid Email");
      return;
    }

    if (!name) {
      setError("Please enter Your Name");
      return;
    }

    if (!password) {
      setError("Please enter The Password");
      return;
    }

    setError("");

    // SignUp Api Call
    try {
      // SignUp API Call using Axios
      const response = await axios.post("http://localhost:5000/user/create", {
        email,
        name,
        password,
      });

      if (response.data.success) {
        // Navigate to login on successful signup
        navigate("/login");
      } else {
        setError(response.data.message || "Sign up failed");
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

      <div className="flex items-center justify-center mt-12 md:mt-20 xl:mt-28  ">
        <div className="w-80 xl:w-96 border bg-white px-7 py-10 rounded-3xl md:rounded-3xl xl:rounded-2xl ">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>

            <input
              type="text"
              className="input-box"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="text"
              className="input-box"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              SignUp
            </button>

            <p className="text-sm text-center mt-4">
              Already have an Account? {""}
              <Link
                to="/login"
                className="font-medium
              text-primary underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
