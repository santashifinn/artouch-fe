import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/User";

import { Routes, Route, useSearchParams } from "react-router";

import { getRijks, getCleveland } from "../api";

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

  const [collections, setCollections] = useState([]);

  const [works, setWorks] = useState([]);
  const [totalWorks, setTotalWorks] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const type = searchParams.get("type");
  const q = searchParams.get("q");
  const p = searchParams.get("p");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const storedCollections = localStorage.getItem("collections");
    if (storedCollections) {
      setCollections(JSON.parse(storedCollections));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  useEffect(() => {
    setLoading(true);
    Promise.all([getRijks(type, q, p), getCleveland(type, q, p)])
      .then((data) => {
        if (data[0].count + data[1].info.total <= 10000)
          {setTotalWorks(data[0].count + data[1].info.total)} else {setTotalWorks(10000)}
        console.log(totalWorks)
        setWorks((works) => [...data[0].artObjects, ...data[1].data]);

        if (data[0].artObjects.length < 5) {
          Promise.all([
            getRijks(type, q, p),
            getCleveland(type, q, p, 10 - data[0].artObjects.length),
          ]).then((data) => {
            setWorks((works) => [...data[0].artObjects, ...data[1].data]);
          });
        }

        if (data[1].data.length < 5) {
          Promise.all([
            getRijks(
              type,
              q,
              p - Math.ceil(data[1].info.total / 10),
              10 - data[1].data.length
            ),
            getCleveland(type, q, p),
          ]).then((data) => {
            setWorks((works) => [...data[0].artObjects, ...data[1].data]);
          });
        }

        setLoading(false);
      })
      .catch((error) => {
        setError("An error has occurred.");
        setLoading(false);
      });
  }, [type, q, p]);

  return (
    <>
      <Header setCurrentPage={setCurrentPage} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar
                setSearchParams={setSearchParams}
                setCurrentPage={setCurrentPage}
              />
              <PageNav
                totalWorks={totalWorks}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setSearchParams={setSearchParams}
              />
              <ArtExhibition
                error={error}
                loading={loading}
                works={works}
                collections={collections}
                setCollections={setCollections}
              />
              <PageNav
                totalWorks={totalWorks}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                setSearchParams={setSearchParams}
              />
            </>
          }
        />

        <Route
          path="/user"
          element={
            <Userpage
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
              collections={collections}
              setCollections={setCollections}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignUp
              error={error}
              setError={setError}
              loading={loading}
              setLoading={setLoading}
            />
          }
        />

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
