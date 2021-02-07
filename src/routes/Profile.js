import React, { useEffect, useState } from "react";
import { authService, dbService } from "firebaseInstance";
import { useHistory } from "react-router-dom";
import Nweet from "components/Nweet";

const Profile = ({ userObj, refreshUser, clearUser }) => {
  const history = useHistory();
  const [nweets, setNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    authService.signOut();
    clearUser();
    history.push("/");
  };

  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt", "desc")
      .get();
    const nweetArray = nweets.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNweets(nweetArray);
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          placeholder="Display Name"
          onChange={onChange}
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <div
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.9)",
          paddingBottom: 30,
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
      </div>
      <h2
        style={{
          marginTop: 30,
          padding: "0 5px",
          textAlign: "center",
        }}
      >
        My Nweet
      </h2>
      <div
        style={{
          marginTop: 30,
        }}
      >
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Profile;
