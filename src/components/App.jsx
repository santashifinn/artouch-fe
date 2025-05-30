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
        const totalRijksWorks = data[0].count;
        const totalClevelandWorks = data[1].info.total;

        if (totalRijksWorks + totalClevelandWorks <= 10000) {
          setTotalWorks(totalRijksWorks + totalClevelandWorks);
        } else {
          setTotalWorks(10000);
        }

        const rijksReceived = Math.min(data[0].artObjects.length, 5);
        const clevelandReceived = Math.min(data[1].data.length, 5);

        if (rijksReceived < clevelandReceived) {
          Promise.all([
            getRijks(type, q, p),
            getCleveland(type, q, p, 10 - rijksReceived, totalRijksWorks),
          ]).then((data) => {
            setWorks(() => [...data[0].artObjects, ...data[1].data]);
          });
        } else if (rijksReceived > clevelandReceived) {
          const totalClevelandPages = Math.ceil(totalClevelandWorks / 10);

          Promise.all([
            getRijks(type, q, p - totalClevelandPages, 10 - clevelandReceived),
            getCleveland(type, q, p),
          ]).then((data) => {
            setWorks(() => [...data[0].artObjects, ...data[1].data]);
          });
        } else if (rijksReceived === clevelandReceived) {
          setWorks(() => [...data[0].artObjects, ...data[1].data]);
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
      <section className="apple-watch">
        <h1>
          AR<span className="teal-colour">T</span>ouch ☜
        </h1>
        <p>Please view on a device with a larger screen!</p>
      </section>

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
