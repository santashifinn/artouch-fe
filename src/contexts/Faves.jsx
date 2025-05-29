import { createContext, useState } from "react";

const FavesContext = createContext();

const Faves = ({ children }) => {
    const [faveImages, setFaveImages] = useState([]);

  return (
    <>
      <FavesContext.Provider value={[faveImages, setFaveImages]}>
        {children}
      </FavesContext.Provider>
    </>
  );
};

export { FavesContext, Faves };
