import { useEffect, useState } from "react";
import { Router } from "react-router-dom";
import AppRouter from "components/Router";
import { authService } from "firebaseInstance";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggendIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? <AppRouter isLoggendIn={isLoggendIn} /> : "Loading..."}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
