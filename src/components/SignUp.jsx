import { useContext, useState } from "react";
import { UserContext } from "../contexts/User";

import { Link, Navigate } from "react-router";

import { signUp } from "../api";

const SignUp = ({ error, setError, loading, setLoading }) => {
  const [user, setUser] = useContext(UserContext);

  const [inputs, setInputs] = useState({});

  const [passwordLengthIs8, setPasswordLengthIs8] = useState(false);
  const [passwordContainsLowerCase, setPasswordContainsLowerCase] =
    useState(false);
  const [passwordContainsUpperCase, setPasswordContainsUpperCase] =
    useState(false);
  const [passwordContainsNumber, setPasswordContainsNumber] = useState(false);
  const [passwordContainsSpecialChar, setPasswordContainsSpecialChar] =
    useState(false);
  const [emailIsEmail, setEmailIsEmail] = useState(false);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    if (event.target.name === "password") {
      if (event.target.value.length >= 8) {
        setPasswordLengthIs8(true);
      }
      if (/[a-z]/.test(event.target.value)) {
        setPasswordContainsLowerCase(true);
      }
      if (/[A-Z]/.test(event.target.value)) {
        setPasswordContainsUpperCase(true);
      }
      if (/\d/.test(event.target.value)) {
        setPasswordContainsNumber(true);
      }
      if (/[#?!@$%^&*-]/.test(event.target.value)) {
        setPasswordContainsSpecialChar(true);
      }
    }
    if (event.target.name === "email") {
      if (
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(event.target.value)
      ) {
        setEmailIsEmail(true);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    if (emailIsEmail) {
      if (
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          inputs.password
        )
      ) {
        signUp(inputs)
          .then(({ data }) => {
            const username = data.user.username;
            setUser({
              username: username,
            });
            setLoading(false);
            alert("Successfully signed up!");
          })
          .catch((data) => {
            setError(data.msg);
            setLoading(false);
            alert("Username already taken. Please choose another.");
          });

        setInputs({});
      } else {
        setLoading(false);
        alert("Please set a stronger password.");
      }
    } else {
      setLoading(false);
      alert("Please enter a valid email address.");
    }
  };

  return (
    <>
      {user ? (
        <Navigate to="/user" replace />
      ) : loading ? (
        <div className="center-loader">
          <span className="loader"></span>
        </div>
      ) : (
        <section className="loginsignup">
          <h2>Sign Up</h2>
          <form className="signup-form" onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <input
                type="text"
                placeholder="Enter username"
                name="username"
                id="username"
                value={inputs.username || ""}
                required
                onChange={handleChange}
              />
            </label>
            <label htmlFor="email">
              Email:
              <input
                type="text"
                placeholder="Enter email"
                name="email"
                id="email"
                value={inputs.email || ""}
                required
                onChange={handleChange}
              />
            </label>
            <label htmlFor="password">
              Password:
              <input
                type="password"
                placeholder="Enter password"
                name="password"
                id="password"
                value={inputs.password || ""}
                required
                onChange={handleChange}
              />
            </label>
            <div className="loginsignup-password-info">
              <span className="strong">Password must:</span>
              <ul>
                <li>
                  {passwordLengthIs8 ? (
                    <span className="loginsignup-password-true">✔</span>
                  ) : (
                    <span className="loginsignup-password-false">✘</span>
                  )}{" "}
                  be 8 characters or more
                </li>
                <li>
                  {passwordContainsLowerCase ? (
                    <span className="loginsignup-password-true">✔</span>
                  ) : (
                    <span className="loginsignup-password-false">✘</span>
                  )}{" "}
                  contain at least 1 lowercase letter
                </li>
                <li>
                  {passwordContainsUpperCase ? (
                    <span className="loginsignup-password-true">✔</span>
                  ) : (
                    <span className="loginsignup-password-false">✘</span>
                  )}{" "}
                  contain at least 1 uppercase letter
                </li>
                <li>
                  {passwordContainsNumber ? (
                    <span className="loginsignup-password-true">✔</span>
                  ) : (
                    <span className="loginsignup-password-false">✘</span>
                  )}{" "}
                  contain at least 1 number
                </li>
                <li>
                  {passwordContainsSpecialChar ? (
                    <span className="loginsignup-password-true">✔</span>
                  ) : (
                    <span className="loginsignup-password-false">✘</span>
                  )}{" "}
                  contain at least 1 special character
                </li>
              </ul>
            </div>
            <button type="submit">Sign Up</button>
          </form>
          <p>
            If you already have an account, please{" "}
            <Link to="/login">
              <span className="loginsignup-link">login</span>
            </Link>
            .
          </p>
        </section>
      )}
    </>
  );
};

export default SignUp;
