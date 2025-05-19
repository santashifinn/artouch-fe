import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { UserContext } from "../contexts/User";

import {
  getFavesbyUsername,
  getPersonalRijks,
  getPersonalCleveland,
  deleteCollection,
} from "../api";

import FaveButton from "./FaveButton";

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

  const [idToShow, setIdToShow] = useState("");
  const [imageToShow, setImageToShow] = useState("");
  const [infoToShow, setInfoToShow] = useState("");
  const [refToShow, setRefToShow] = useState("");

  const [lightboxDisplay, setLightBoxDisplay] = useState(false);

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

  const showDetails = (work) => {
    setIdToShow(work.id);
    typeof work.id === "number"
      ? setImageToShow(work.images.web.url)
      : setImageToShow(work.webImage.url);
    typeof work.id === "number"
      ? setInfoToShow(work.tombstone.split(").")[0] + ").")
      : setInfoToShow(work.longTitle);
    typeof work.id === "number"
      ? setRefToShow(work.accession_number)
      : setRefToShow(work.objectNumber);
    setLightBoxDisplay(true);
  };

  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

  const handleChangeCollection = (event) => {
    setCurrentCollection(event.target.value);
  };

  const handleDeleteCollection = (event) => {
    if (confirm("Do you really want to delete this collection?")) {
      deleteCollection(user.username, event.target.id);
      setCurrentCollection("Favourites");
      setCollections(collections.filter((id) => id !== event.target.id));
      alert(`Collection "${event.target.id}" deleted.`);
    } else {
      alert(`Deletion cancelled.`);
    }
  };

  return (
    <>
      {lightboxDisplay ? (
        <div id="lightbox" onClick={hideLightBox}>
          <div className="works-individual">
            {imageToShow !== "/Static/Images/Responsive/1x1.png" ? (
              <img src={imageToShow} alt={infoToShow}></img>
            ) : (
              <img src={noImageAvailable} alt="No image available" />
            )}
            <FaveButton
              work={refToShow}
              refToShow={refToShow}
              idToShow={idToShow}
              collections={collections}
              setCollections={setCollections}
              userWorks={userWorks}
              setUserWorks={setUserWorks}
            />
            <span className="works-individual-text">{infoToShow}</span>
          </div>
        </div>
      ) : (
        ""
      )}

      {user !== null ? (
        <>
          <div className="userpage">
            <div className="userpage-text">
              <p>
                Hello{" "}
                <span className="userpage-name">
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

            <div className="collections-list">
              <p>Collections:</p>

              <div className="collection-selector">
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
                <span className="collection-title">
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
                  console.log(userWork);
                  let work = "";
                  userWork.artObject
                    ? (work = userWork.artObject)
                    : (work = userWork);
                  return (
                    <li key={work.id}>
                      <div
                        className="works-previews-card"
                        onClick={() => showDetails(work)}
                      >
                        {typeof work.id === "number"}
                        <div className="works-previews-image">
                          {typeof work.id === "number" ? (
                            !work.images.web ? (
                              <img
                                src={noImageAvailable}
                                alt="No image available"
                              />
                            ) : (
                              <img src={work.images.web.url} alt={work.title} />
                            )
                          ) : work.webImage.url !==
                            "/Static/Images/Responsive/1x1.png" ? (
                            <img src={work.webImage.url} alt={work.title} />
                          ) : (
                            <img
                              src={noImageAvailable}
                              alt="No image available"
                            />
                          )}
                        </div>{" "}
                        <FaveButton
                          work={work}
                          refToShow={refToShow}
                          idToShow={idToShow}
                          collections={collections}
                          setCollections={setCollections}
                          userWorks={userWorks}
                          setUserWorks={setUserWorks}
                        />
                        <div className="works-previews-text-back"></div>
                        <div className="works-previews-text">
                          <span className="works-preview-text-title">
                            {work.title}
                          </span>{" "}
                          <br /> by <br />
                          <span className="works-preview-text-creator">
                            {typeof work.id === "number"
                              ? work.creators[0]
                                ? work.creators[0].description.split("(")[0]
                                : "anonymous"
                              : work.principalOrFirstMaker}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })
              ) : (
                "No results available"
              )}
            </ul>
          </div>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};

export default Userpage;
