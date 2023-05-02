import React, { useRef } from "react";
import LoginForm from "../components/FormLogin";
import SignupForm from "../components/FormSignup";
import RandomImageContainer from "../components/RandomImageContainer";

const LoginPage = () => {
  const loginForm = useRef(null);
  const signupForm = useRef(null);

  const handleShowSignupForm = () => {
    console.log('span clicked');
    loginForm.current.classList.add('login__form--slide-out');
    signupForm.current.classList.add("signup__form--slide-in");
  }

  return (
    <div className="page__login">
      <h1 className="login__title">Welcome back!</h1>
      <div className="login__content">
        <LoginForm ref={loginForm} handleShowSignupForm={handleShowSignupForm}/>
        <SignupForm ref={signupForm} />
        <RandomImageContainer />
      </div>
    </div>
  );
};

export default LoginPage;
