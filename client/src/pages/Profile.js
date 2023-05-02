import React from "react";
import { Navigate, useParams } from "react-router-dom";
import profilePic from "../images/react.svg";
import { useQuery } from "@apollo/client";
import { QUERY_USER, QUERY_ME } from "../utils/queries";
// import { ADD_FRIEND } from '../utils/mutations';
import Auth from "../utils/auth";

const ProfilePage = (props) => {
  const { username: userParam } = useParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  //console.log('query data is', data);
  const user = data?.me || data?.user || {};
  // console.log('user', user);
  // navigate to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to="/profile:username" />;
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <div className="page__profile">
      <h1 className="profile__title">Welcome back, {user.firstName}</h1>
      <div className="profile__content">
        <div className="profile__details">
          <div className="profile__details__div--image">
            <img src={profilePic} className="" />
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
