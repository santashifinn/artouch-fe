import { useContext } from "react";
import { UserContext } from "../contexts/User";

import FaveButton from "./FaveButton";

const Userpage = () => {
  const [user, setUser] = useContext(UserContext);
  
  return (
    <>
      <FaveButton />
    </>
  );
};

export default Userpage;
