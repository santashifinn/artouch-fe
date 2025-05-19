import { useContext, useState } from "react";
import { UserContext } from "../contexts/User";

import { Link, Navigate } from "react-router";

import { signIn } from "../api";

const Login = ({ error, setError, loading, setLoading }) => {
  const [user, setUser] = useContext(UserContext);

  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    signIn(inputs)
      .then((data) => {
        const username = data.user.username;
        setUser({
          username: username,
        });
        setLoading(false);
        alert(data.msg);
      })
      .catch((data) => {
        setError(data.msg);
        setLoading(false);
        alert(data.msg);
      });

    setInputs({});
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
          <h2>Login</h2>
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
            <button type="submit">Login</button>
          </form>
          <p>
            If you don't have an account, please{" "}
            <Link to="/signup">
              <span className="loginsignup-link">sign up</span>
            </Link>
            .
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
