import React from "react";
import LoginForm from "../components/FormLogin";

const LoginPage = (props) => {

  return (
    <>
      <h1 className="login__title">Welcome back!</h1>
      <LoginForm />
    </>
  );
};

export default LoginPage;
