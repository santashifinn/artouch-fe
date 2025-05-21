import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/User";

import { getFavesbyUsername, addFave, deleteFave } from "../api";

const FaveButton = ({
  work,
  refToShow,
  idToShow,
  collections,
  setCollections,
}) => {
  const [user] = useContext(UserContext);

  const [faveImages, setFaveImages] = useState([]);

  const [favesOpen, setFavesOpen] = useState(false);

  useEffect(() => {
    if (user !== null) {
      getFavesbyUsername(user.username).then((faves) => {
        faves.map((fave) => {
          !collections.includes(fave.collection)
            ? setCollections((collections) => [...collections, fave.collection])
            : null;

          setFaveImages((faveImages) => [
            ...faveImages,
            [fave.work_id, fave.collection],
          ]);
        });

        setCollections((collections) => [...new Set(collections)]);

        localStorage.setItem("Collections", collections);
      });
    }
  }, [user]);

  const handleFavesOpen = (event) => {
    event.stopPropagation();
    user ? setFavesOpen(!favesOpen) : alert("Please login to add favourites!");
  };

  const handleFave = (event, item, collection) => {
    event.stopPropagation();
    if (user !== null) {

      let favesInChosenCollection = []

      faveImages.map((faveImage) => {console.log(faveImage); if (faveImage[1] === collection) {favesInChosenCollection.push(faveImage[0])}})

        !favesInChosenCollection.includes(item)
          ? item !== undefined
            ? (addFave(user.username, collection, item),
              setFaveImages([...faveImages, [item, collection]]),
              alert(`Work successfully added to ${collection}.`))
            : alert("There was an error adding the work to your favourites.")
          : (deleteFave(user.username, collection, item),
            setFaveImages(faveImages.filter((faveSet) => !faveSet.includes(item && collection))),
            alert(`Work successfully removed from ${collection}.`)),
          setFavesOpen(!favesOpen);
    } else {
      alert("Please login to add favourites!");
    }
  };

  const handleAddToNewCollection = (event, item) => {
    event.stopPropagation();
    let collection = prompt("Name new collection", "Max 20 characters");
    if (collection == null || collection == "") {
      alert(`No collection created.`);
    } else if (collection.length > 20) {
      alert(
        `"${collection}" is too long. Please keep collection names 20 characters or under.`
      );
    } else {
      addFave(user.username, collection, item);
      setFaveImages([...faveImages, item]);
      alert(`Collection "${collection}" created.`);
    }
    setFavesOpen(!favesOpen);
  };

  return (
    <>
      <button className="add-to-faves" onClick={handleFavesOpen}>
        {refToShow === ""
          ? typeof work.id === "number"
            ? faveImages.flat().includes(work.accession_number)
              ? "★"
              : "☆"
            : faveImages.flat().includes(work.objectNumber)
            ? "★"
            : "☆"
          : typeof idToShow === "number"
          ? faveImages.flat().includes(refToShow)
            ? "★"
            : "☆"
          : faveImages.flat().includes(refToShow)
          ? "★"
          : "☆"}
      </button>

      {favesOpen ? (
        <ul className="faves-dropdown">
          <li key="explanation">
            <div className="faves-option-header">
              Add to/remove from collection:
            </div>
          </li>
          {collections.map((collection) => {
            return (
              <li
                key={collection}
                onClick={(event) => {
                  refToShow === ""
                    ? typeof work.id === "number"
                      ? handleFave(event, work.accession_number, collection)
                      : handleFave(event, work.objectNumber, collection)
                    : handleFave(event, refToShow, collection);
                }}
              >
                <button className="faves-option">{collection}</button>
              </li>
            );
          })}
          <li
            key="create-collection"
            onClick={(event) => {
              refToShow === ""
                ? typeof work.id === "number"
                  ? handleAddToNewCollection(event, work.accession_number)
                  : handleAddToNewCollection(event, work.objectNumber)
                : handleAddToNewCollection(event, refToShow);
            }}
          >
            <button className="faves-option" id="faves-dropdown-last">
              <span className="italics underline">+ Create collection +</span>
            </button>
          </li>
        </ul>
      ) : null}
    </>
  );
};

export default FaveButton;
