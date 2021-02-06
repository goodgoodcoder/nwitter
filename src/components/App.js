import { useEffect, useState } from "react";
import { Router } from "react-router-dom";
import AppRouter from "components/Router";
import { authService } from "firebaseInstance";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  const clearUser = () => {
    setUserObj(null);
  };
  return (
    <>
      {init ? (
        <AppRouter
          isLoggendIn={Boolean(userObj)}
          userObj={userObj}
          refreshUser={refreshUser}
          clearUser={clearUser}
        />
      ) : (
        "Loading..."
      )}
      {/* <footer>&copy; Nwitter {new Date().getFullYear()}</footer> */}
    </>
  );
}

export default App;
