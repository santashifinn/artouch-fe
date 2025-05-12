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

        <Route path="/login" element={<Login />} />

        <Route path="*" element={<NotFound replace />} />
      </Routes>
    </>
  );
};

export default App;
