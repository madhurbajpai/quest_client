import React, { useState } from "react";
import "./loginregister.css";
import { Link } from "react-router-dom";
import Header from "../Header";
import axios from "axios";
import BannerBackground from "./home-banner-background.png";
import { BACK_URL } from "../backend";
const Register = (props) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // default role
  const [isError, setisError] = useState(false);
  const [error, setError] = useState("Some Error Occured!")
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (role === "user") {
      setisError(false);
      if (!name || !email || !pass) {
        setError("Some Fields are Missing!")
        setIsLoading(false);
        setisError(true);
        return ;
      }

      try {
        const response = await axios.post(
          `${BACK_URL}/register-user`,
          {
            name: name,
            email: email,
            password: pass,
          }
        );
        // console.log(response);
        if (!response) {
          setIsLoading(false);
          setisError(true);
          setError("Something went wrong")
          return;
        } else {
            setError(response.data.error);
            setisError(true);
        }
        if (response.data.error === "User already Exist") {
          setIsLoading(false);
          setisError(true);
          setError(response.data.error);
        } 
        else if (response.data.error === "Already registered as Admin"){
            // console.log(response.data.error);
            setIsLoading(false);
            setisError(true);
            setError(response.data.error);
        } else{
          window.alert("Registered successfully!\nYou can head to the login page.");
          isLoading(false);
          isError(false);
        }
      } catch (error) {
        setIsLoading(false);
        setisError(true);
      }
    } else {
      setisError(false);
      if (!name || !email || !pass) {
        setIsLoading(false);
        setisError(true);
      }

      try {
        const response = await axios.post(
          `${BACK_URL}/register-admin`,
          {
            name: name,
            email: email,
            password: pass,
          }
        );
        if (!response) {
          setIsLoading(false);
          setisError(true);
          return;
        } else {
          setisError(false);
        }
        if (response.data.error === "Alreday registered as User") {
          window.alert("Already registered as User");
          setIsLoading(false);
        } else{
          setisError(false);
          console.log(response.data.error);
          setIsLoading(false);
          window.alert("Registered successfully error");
        } 
      } catch (error) {
        setIsLoading(false);
        setisError(true);
        // console.log(error);
      }
    }
  };
  return (
    <div>
      <Header />
      <div className="body">
      <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="auth-form-container">
          <div style={{ marginBottom: "30px" }}>
            <h2>Register</h2>
          </div>
          <div className="forms">
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="input-field">
                <label htmlFor="name">Full name</label>
                <input
                  value={name}
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  placeholder="Full Name"
                />
              </div>

              <div className="input-field">
                <label htmlFor="email">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="youremail@gmail.com"
                  id="email"
                  name="email"
                />
              </div>

              <div className="input-field">
                <label htmlFor="password">Password</label>
                <input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  placeholder="********"
                  id="password"
                  name="password"
                />
              </div>

              <div className="input-field">
                <label htmlFor="role" style={{ marginRight: "55px" }}>
                  Role
                </label>
                <select
                  style={{ marginRight: "auto" }}
                  className="drop"
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                style={{ marginTop: "30px" }}
                class="button-30"
                role="button"
                disabled={isLoading}
              >
                {isLoading ? <div className="spinner"></div> : "Register"}
              </button>
            </form>
            {isError ? (
              <div className="error" style={{marginTop: "20px"}}>
                <span style={{color: "red"}}>{error}</span>
              </div>
            ) : (
              ""
            )}
          </div>
          <div style={{ marginTop: "30px" }}>
            <Link to={"/login"}>
              <span style={{ color: "#22092c" }}>
                Already Registered? Login Here
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
