import { useState } from "react";

import FaveButton from "./FaveButton";

import noImageAvailable from "/assets/no-image-available.jpg";

const Artwork = ({ work, collections, setCollections }) => {
  const [idToShow, setIdToShow] = useState("");
  const [imageToShow, setImageToShow] = useState("");
  const [infoToShow, setInfoToShow] = useState("");
  const [refToShow, setRefToShow] = useState("");

  const [lightboxDisplay, setLightBoxDisplay] = useState(false);

  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };

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

  return (
    <>
      {lightboxDisplay ? (
        <div className="lightbox" onClick={hideLightBox}>
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
            />
            <span className="works-individual-text">{infoToShow}</span>
          </div>
        </div>
      ) : (
        ""
      )}

      <li key={work.id}>
        <div className="works-previews-card" onClick={() => showDetails(work)}>
          <div className="works-previews-image">
            {typeof work.id === "number" ? (
              !work.images.web ? (
                <img src={noImageAvailable} alt="No image available" />
              ) : (
                <img src={work.images.web.url} alt={work.title} />
              )
            ) : work.webImage.url !== "/Static/Images/Responsive/1x1.png" ? (
              <img src={work.webImage.url} alt={work.title} />
            ) : (
              <img src={noImageAvailable} alt="No image available" />
            )}
          </div>{" "}
          <FaveButton
            work={work}
            refToShow={refToShow}
            idToShow={idToShow}
            collections={collections}
            setCollections={setCollections}
          />
          <div className="works-previews-text-back"></div>
          <div className="works-previews-text">
            <span className="works-preview-text-title">{work.title}</span>{" "}
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
    </>
  );
};

export default Artwork;
