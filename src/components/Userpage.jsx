import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../contexts/User";

import {
  getFavesbyUsername,
  getPersonalRijks,
  getPersonalCleveland,
  deleteCollection,
} from "../api";

import Artwork from "./Artwork";

const Userpage = ({
  error,
  setError,
  loading,
  setLoading,
  collections,
  setCollections,
}) => {
  const [user] = useContext(UserContext);

  const [currentCollection, setCurrentCollection] = useState(
    collections.length === 0 || collections[0] === "Favourites"
      ? "Favourites"
      : collections[0]
  );

  const [userWorks, setUserWorks] = useState([]);
  const [totalUserWorks, setTotalUserWorks] = useState(0);

  useEffect(() => {
    if (user !== null) {
      setLoading(true);
      getFavesbyUsername(user.username)
        .then((faves) => {
          faves.map((fave) => {
            const newWork = fave.work_id;
            const newWorkCollection = fave.collection;
            const regex = /^[^A-Za-z]+$/;

            setUserWorks([]);

            currentCollection === newWorkCollection
              ? regex.test(newWork)
                ? getPersonalCleveland(newWork).then((data) => {
                    setUserWorks((currentWorks) => [...currentWorks, data]);
                  })
                : getPersonalRijks(newWork).then((data) => {
                    setUserWorks((currentWorks) => [...currentWorks, data]);
                  })
              : null;
          });
          setTotalUserWorks(faves.length);
          setLoading(false);
        })
        .catch((error) => {
          setError("An error has occurred.");
          setLoading(false);
        });
    }
  }, [user, currentCollection]);

  const handleChangeCollection = (event) => {
    setCurrentCollection(event.target.value);
  };

  const handleDeleteCollection = (event) => {
    if (
      confirm(
        `${
          user.username.split("")[0].toUpperCase() + user.username.slice(1)
        }, do you really want to delete collection "${event.target.id}"?`
      )
    ) {
      deleteCollection(user.username, event.target.id);
      setCurrentCollection("Favourites");
      setCollections(collections.filter((id) => id !== event.target.id));
      alert(`Collection "${event.target.id}" deleted.`);
    } else {
      alert(`Deletion of collection "${event.target.id}" cancelled.`);
    }
  };

  return (
    <>
      {user !== null ? (
        <>
          <section id="userpage">
            <div className="userpage-text">
              <p>
                Hello{" "}
                <span id="userpage-name">
                  {user.username.split("")[0].toUpperCase() +
                    user.username.slice(1)}
                </span>
                !
              </p>
              <p>
                You have <span className="strong">{totalUserWorks}</span> saved
                works across{" "}
                <span className="strong">{collections.length}</span>{" "}
                collections.
              </p>
            </div>

            <div id="collections-list">
              <h2>Collections:</h2>

              <div id="collection-selector">
                {collections.length === 0 ? (
                  <div className="collection-selector-button-container">
                    <button
                      className="collection-selector-button"
                      value="Favourites"
                      onClick={(event) => {
                        handleChangeCollection(event);
                      }}
                    >
                      <span className="strong">Favourites</span>
                    </button>
                  </div>
                ) : (
                  collections.map((collection) => {
                    return (
                      <>
                        <div className="collection-selector-button-container">
                          {collections.length > 1 ? (
                            collection === currentCollection ? (
                              <button
                                className="collection-selector-button"
                                id="collection-selector-button-on"
                                value={collection}
                              >
                                <span className="strong">{collection}</span>
                              </button>
                            ) : (
                              <button
                                className="collection-selector-button"
                                value={collection}
                                onClick={(event) => {
                                  handleChangeCollection(event);
                                }}
                              >
                                {collection}
                              </button>
                            )
                          ) : (
                            <button
                              className="collection-selector-button"
                              value={collection}
                            >
                              {collection === currentCollection ? (
                                <span className="strong">{collection}</span>
                              ) : (
                                collection
                              )}
                            </button>
                          )}
                          {collection === "Favourites" ? null : (
                            <button
                              id={collection}
                              className="collection-delete"
                              onClick={handleDeleteCollection}
                            >
                              ✘
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })
                )}
              </div>
            </div>

            <div className="userpage-text">
              <p>
                <span id="collection-title">
                  {currentCollection} ({userWorks.length})
                </span>
              </p>
            </div>

            <ul className="works-previews-container">
              {error ? (
                { error }
              ) : loading ? (
                <div className="center-loader">
                  <span className="loader"></span>
                </div>
              ) : userWorks.length > 0 ? (
                userWorks.map((userWork) => {
                  let work = "";
                  userWork.artObject
                    ? (work = userWork.artObject)
                    : (work = userWork);
                  return (
                    <Artwork
                      key={work.id}
                      work={work}
                      collections={collections}
                      setCollections={setCollections}
                    />
                  );
                })
              ) : (
                "No results available"
              )}
            </ul>
          </section>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default Userpage;
