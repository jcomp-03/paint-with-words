import React from "react";
import LoginForm from "../components/FormLogin";
import RandomImageContainer from "../components/RandomImageContainer";
const LoginPage = (props) => {
  return (
    <div className="page__login">
      <h1 className="login__title">Welcome back!</h1>
      <div className="login__content">
        <RandomImageContainer />
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
