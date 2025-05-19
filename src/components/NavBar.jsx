import { useState } from "react";

const NavBar = ({ setSearchParams, setCurrentPage }) => {
  const types = [
    {
      id: "type1",
      name: "drawing",
    },
    {
      id: "type2",
      name: "painting",
    },
    {
      id: "type3",
      name: "sculpture",
    },
    {
      id: "type4",
      name: "photograph",
    },
    {
      id: "type5",
      name: "print",
    },
    {
      id: "type6",
      name: "furniture",
    },
    {
      id: "type7",
      name: "jewellery",
    },
    {
      id: "type8",
      name: "clothing",
    },
    {
      id: "type9",
      name: "embroidery",
    },
  ];

  const [typeOpen, setTypeOpen] = useState(false);

  const [searchField, setSearchField] = useState("");

  const handleTypeOpen = () => {
    setTypeOpen(!typeOpen);
  };

  const handleTypeChange = (event) => {
    setTypeOpen(!typeOpen);
    const newType = event.target.value;
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("type", newType);
      newParams.set("p", 1);
      setCurrentPage(1);
      return newParams;
    });
  };

  const handleSearchChange = (event) => {
    const newSearch = event.target.value;
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set("q", newSearch);
      newParams.set("p", 1);
      setCurrentPage(1);
      setSearchField("");
      return newParams;
    });
  };

  const checkEnterPressed = (event) => {
    if (event.charCode === 13) {
      handleSearchChange(event);
    }
  };

  return (
    <>
      <nav className="filter-and-sort">
        <ul className="filter-and-sort-list">
          <li className="filter-and-sort-click">
            <button className="filter-and-sort-title" onClick={handleTypeOpen}>
              <h2>TYPE</h2>
            </button>
            {typeOpen ? (
              <ul className="filter-and-sort-dropdown">
                <li key="type-all">
                  <button
                    id="filter-type"
                    name="type"
                    value=""
                    onClick={(event) => {
                      handleTypeChange(event);
                    }}
                  >
                    all
                  </button>
                </li>
                {types.map(({ id, name }) => {
                  return (
                    <li key={id}>
                      <button
                        id="filter-type"
                        name="type"
                        value={name}
                        onClick={(event) => {
                          handleTypeChange(event);
                        }}
                      >
                        {name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </li>
        </ul>

        <form className="search-input">
          <label htmlFor="q">Search works:</label>
          🔍
          <input
            type="text"
            name="q"
            id="q"
            value={searchField}
            placeholder="Search works"
            onChange={(event) => {
              setSearchField(event.target.value);
            }}
            onKeyUp={(event) => {
              checkEnterPressed(event);
            }}
          />
        </form>
      </nav>
    </>
  );
};

export default NavBar;
