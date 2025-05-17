import { useState } from "react";

const PageNav = ({
  totalWorks,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  setSearchParams,
}) => {
  const [pageOpen, setPageOpen] = useState(false);

  const totalPages = Math.ceil(totalWorks / itemsPerPage);

  const handlePageOpen = () => {
    setPageOpen(!pageOpen);
  };

  const handlePageChange = (event) => {
    const newPage = event.target.value;
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("p", newPage);
      return newParams;
    });
  };

  return (
    <>
      <nav className="pagination">
        <div className="pagination-buttons">
          <button
            className="prev-next-button"
            name="p"
            value={currentPage - 1}
            onClick={(event) => {
              setCurrentPage(currentPage - 1);
              handlePageChange(event);
            }}
            disabled={currentPage <= 1}
          >
            PREVIOUS
          </button>
          <button
            className="prev-next-button"
            name="p"
            value={currentPage + 1}
            onClick={(event) => {
              setCurrentPage(currentPage + 1);
              handlePageChange(event);
            }}
            disabled={currentPage >= totalPages}
          >
            NEXT
          </button>
        </div>
        <div className="pagination-info">
          Page:{" "}
          <button className="page-button" onClick={handlePageOpen}>
            {currentPage}
          </button>
          {" / "}
          <button
            className="page-button"
            name="p"
            value={totalPages}
            onClick={(event) => {
              setCurrentPage(totalPages);
              handlePageChange(event);
            }}
          >
            {totalPages}
          </button>
        </div>

        {pageOpen ? (
          <ul className="page-dropdown">
            {[...Array(totalPages)]
              .map((_, i) => i + 1)
              .map((i) => (
                <li key={i}>
                  <button
                    className="page-option"
                    name="p"
                    value={i}
                    onClick={(event) => {
                      setCurrentPage(i);
                      handlePageOpen(!pageOpen);
                      handlePageChange(event);
                    }}
                  >
                    {i}
                  </button>
                </li>
              ))}
          </ul>
        ) : null}
      </nav>
    </>
  );
};

export default PageNav;
