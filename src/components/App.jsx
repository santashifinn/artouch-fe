import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/User";

import { Routes, Route } from "react-router";

import Header from "./Header";
import NavBar from "./NavBar";
import PageNav from "./PageNav";
import ArtExhibition from "./ArtExhibition";
import Userpage from "./Userpage";
import SignUp from "./SignUp";
import Login from "./Login";
import NotFound from "./NotFound";

const App = () => {
  const [user, setUser] = useContext(UserContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar />
              <PageNav />
              <ArtExhibition />
              <PageNav />
            </>
          }
        />

        <Route path="/user" element={<Userpage />} />

        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/login"
          element={
            <Login
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
            />
          }
        />

        <Route path="*" element={<NotFound replace />} />
      </Routes>
    </>
  );
};

export default App;
