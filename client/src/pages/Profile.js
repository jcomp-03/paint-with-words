import React from "react";
import { Navigate, useParams } from "react-router-dom";
import profilePic from "../images/react.svg";
import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
// import { ADD_FRIEND } from '../utils/mutations';
import Auth from "../utils/auth";
import { displayLoginRequiredMessage } from "../utils/errors";

const ProfilePage = (props) => {
  const isLoggedIn = Auth.loggedIn();
  // grab the username parameters from the URL
  const { username: userParam } = useParams();
  // if there's a username from the URL, run the query QUERY_USER, otherwise QUERY_ME
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};
  console.log(user);
  // if the userParam `username` was used, check if the username is the same as the
  // currently logged-in user and if so, navigate to just /profile instead of showing
  // the logged-in user's username in the URL.
  if (isLoggedIn && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    console.log('no user.username found');
    return displayLoginRequiredMessage();
  }

  return (
    <div className="page__profile">
      <h1 className="profile__title">
        {isLoggedIn
          ? `Welcome back, ${user.firstName}`
          : `Viewing profile for ${user.firstName} ${user.lastName}:`}
      </h1>
      <div className="profile__content">
        <div className="profile__details">
          <div className="profile__details__div--image">
            <img src={profilePic} className="" alt="A headshot of the user" />
          </div>
          <div className="profile__details__div--info">
            Sit ea dolor eiusmod exercitation occaecat fugiat proident proident
            veniam minim tempor commodo occaecat. Officia ex ad consectetur
            exercitation et. Laborum nulla ex enim proident culpa exercitation.
            Amet laboris cillum eu nostrud est sit qui et cillum tempor velit
            non irure. Pariatur eiusmod cillum dolore aliquip minim ex eu anim
            id voluptate anim ullamco occaecat. Aute consequat incididunt dolore
            laborum consequat minim fugiat. Amet deserunt aliqua ex nostrud nisi
            qui ad duis exercitation labore qui tempor minim. Occaecat minim
            eiusmod cillum dolore pariatur nisi ex ea eiusmod commodo magna
            cillum ad ex. Ex ea elit cupidatat adipisicing sit sit irure dolor
            non est cupidatat dolor ea ea.
          </div>
        </div>
        <div className="profile__carousel">
          Sit ea dolor eiusmod exercitation occaecat fugiat proident proident
          veniam minim tempor commodo occaecat. Officia ex ad consectetur
          exercitation et. Laborum nulla ex enim proident culpa exercitation.
          Amet laboris cillum eu nostrud est sit qui et cillum tempor velit non
          irure. Pariatur eiusmod cillum dolore aliquip minim ex eu anim id
          voluptate anim ullamco occaecat. Aute consequat incididunt dolore
          laborum consequat minim fugiat. Amet deserunt aliqua ex nostrud nisi
          qui ad duis exercitation labore qui tempor minim. Occaecat minim
          eiusmod cillum dolore pariatur nisi ex ea eiusmod commodo magna cillum
          ad ex. Ex ea elit cupidatat adipisicing sit sit irure dolor non est
          cupidatat dolor ea ea.
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
