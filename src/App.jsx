import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Display from "./components/Display";
import Login from "./components/Login";

const App = () => {
  const token = Cookies.get("token");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <div className="h-screen">
      <div className="h-[100%]">
        {isLoggedIn ? <Display /> : <Login setIsLoggedIn={setIsLoggedIn} />}
      </div>
    </div>
  );
};

export default App;
