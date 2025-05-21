import Artwork from "./Artwork";

const ArtExhibition = ({
  error,
  loading,
  works,
  collections,
  setCollections,
}) => {
  return (
    <>
      <ul className="works-previews-container">
        {error ? (
          { error }
        ) : loading ? (
          <div className="center-loader">
            <span className="loader"></span>
          </div>
        ) : works.length > 0 ? (
          works.map((work) => {
            return (
              <Artwork
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
    </>
  );
};

export default ArtExhibition;
