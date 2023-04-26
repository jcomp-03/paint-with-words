import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import pngDblArrow from "../images/login-double-arrow.png";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const LoginForm = (props) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({
    username: "",
    password: "",
  });
  const [login, { loading, error }] = useMutation(LOGIN_USER);

  // useEffect hook runs when login credentials change
  // determines if submit button is enabled or disabled
  useEffect(() => {
    const canBeSubmitted = () => {
      let { username, password } = loginCredentials;
      return username && password ? true : false;
    };
    setIsDisabled(!canBeSubmitted());
  }, [loginCredentials]);

  if (loading) return 'Submitting...';
  if (error) return <div style={{color: "white"}}>ERROR WILL ROBINSON</div>;

  // handle changes to login form input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginCredentials({
      ...loginCredentials,
      [name]: value,
    });
  };

  // handle submission of login form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      // run login mutation, passing in current values of loginCredentials state
      // await completion and destructure the data property from returned object
      const { data } = await login({
        variables: { ...loginCredentials },
      });
      console.log('data', data);
      // pass in token value to the login class method, which sets key-value pair in local storage
      // and assigns window.location to /
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setLoginCredentials({
      email: "",
      password: "",
    });
  };
  
  return (
    <>
      <Form className="login__form" onSubmit={handleFormSubmit}>
        <Form.Group
          className="login__form__group"
          controlId="login__form__username"
        >
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username here"
            name="username"
            value={loginCredentials.username}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Don't remember your username? Click here.
          </Form.Text>
        </Form.Group>
        <Form.Group
          className="login__form__group"
          controlId="login__form__password"
        >
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={loginCredentials.password}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Forgot your password? Click here.
          </Form.Text>
        </Form.Group>
        <Button
          className="login__form__button"
          id="login__form__button"
          type="submit"
          disabled={isDisabled}
          style={{ opacity: isDisabled ? "0.5" : "1"}}
        >
          <div className="login__form__button--arrows" id="dub-arrow">
            <img src={pngDblArrow} alt="dbl arrow" />
          </div>
          <a href="">Submit</a>
        </Button>
        Don't have an account? Signup here
      </Form>
      {/* {error && <div>Login failed</div>} */}
    </>
  );
};

export default LoginForm;
