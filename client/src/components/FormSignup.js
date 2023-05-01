import React, { useState, useEffect, useRef, forwardRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import pngDblArrow from "../images/login-double-arrow.png";
// import { useMutation } from "@apollo/client";
// import { SIGNUP_USER } from "../utils/mutations";
// import Auth from "../utils/auth";

const SignUpForm = forwardRef(function SignupForm(props, ref) {
  const [isDisabled, setIsDisabled] = useState(true);
  const [signupCredentials, setSignupCredentials] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  //   const [signup, { loading, error }] = useMutation(SIGNUP_USER);
  const greenSubmitBtn = useRef(null);
  const arrowsContainer = useRef(null);
  const spanEl = useRef(null);
  // useEffect hook runs when signup credentials change
  // determines if submit button is enabled or disabled
  useEffect(() => {
    const canBeSubmitted = () => {
      let { firstName, lastName, email, username, password } =
        signupCredentials;
      return firstName && lastName && email && username && password
        ? true
        : false;
    };
    setIsDisabled(!canBeSubmitted());
  }, [signupCredentials]);

  // handle changes to signup form input fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupCredentials({
      ...signupCredentials,
      [name]: value,
    });
  };

  // handle submission of signup form
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('form submit ran');
    // try {
    //   // run login mutation, passing in current values of loginCredentials state
    //   // await completion and destructure the data property from returned object
    //   const { data } = await signup({
    //     variables: { ...signupCredentials },
    //   });
    //   console.log("data", data);
    //   // pass in token value to the login class method, which sets key-value pair in local storage
    //   // and assigns window.location to /
    //   Auth.login(data.login.token);
    // } catch (e) {
    //   console.error(e);
    // }
    // clear form values
    // setSignupCredentials({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   username: "",
    //   password: "",
    // });
  };

  return (
    <>
      <Form
        ref={ref}
        className="signup__form"
        onSubmit={handleFormSubmit}
      >
        <Form.Group
          className="form__group"
          controlId="signup__form__firstname"
        >
          <Form.Label>First name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter first name here"
            name="firstName"
            value={signupCredentials.firstName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group
          className="form__group"
          controlId="signup__form__lastname"
        >
          <Form.Label>Last name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter last name here"
            name="lastName"
            value={signupCredentials.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group
          className="form__group"
          controlId="signup__form__email"
        >
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email here"
            name="email"
            value={signupCredentials.email}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            We'll use this email in the event you forget your password.
          </Form.Text>
        </Form.Group>
        <Form.Group
          className="form__group"
          controlId="signup__form__username"
        >
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username here"
            name="username"
            value={signupCredentials.username}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group
          className="form__group"
          controlId="signup__form__password"
        >
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={signupCredentials.password}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Min. 8 characters with 1 uppercase, 1 lowercase, & 1 number.
          </Form.Text>
        </Form.Group>
        <Button
          ref={greenSubmitBtn}
          className="form__button"
          id="signup__form__button"
          type="submit"
          disabled={isDisabled}
          style={{ opacity: isDisabled ? "0.7" : "1" }}
        >
          <div
            ref={arrowsContainer}
            className="form__button--arrows"
            id="dub-arrow"
          >
            <img src={pngDblArrow} alt="dbl arrow" />
          </div>
          <span ref={spanEl}>Join</span>
        </Button>
      </Form>
    </>
  );
}); 

// const SignUpForm = (props) => {
//   const [isDisabled, setIsDisabled] = useState(true);
//   const [signupCredentials, setSignupCredentials] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     username: "",
//     password: "",
//   });

//   //   const [signup, { loading, error }] = useMutation(SIGNUP_USER);
//   const signupForm = useRef(null);
//   const greenSubmitBtn = useRef(null);
//   const arrowsContainer = useRef(null);
//   const spanEl = useRef(null);
//   // useEffect hook runs when signup credentials change
//   // determines if submit button is enabled or disabled
//   useEffect(() => {
//     const canBeSubmitted = () => {
//       let { firstName, lastName, email, username, password } =
//         signupCredentials;
//       return firstName && lastName && email && username && password
//         ? true
//         : false;
//     };
//     setIsDisabled(!canBeSubmitted());
//   }, [signupCredentials]);

//   // handle changes to signup form input fields
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setSignupCredentials({
//       ...signupCredentials,
//       [name]: value,
//     });
//   };

//   // handle submission of signup form
//   const handleFormSubmit = async (event) => {
//     event.preventDefault();
//     console.log('form submit ran');
//     // try {
//     //   // run login mutation, passing in current values of loginCredentials state
//     //   // await completion and destructure the data property from returned object
//     //   const { data } = await signup({
//     //     variables: { ...signupCredentials },
//     //   });
//     //   console.log("data", data);
//     //   // pass in token value to the login class method, which sets key-value pair in local storage
//     //   // and assigns window.location to /
//     //   Auth.login(data.login.token);
//     // } catch (e) {
//     //   console.error(e);
//     // }
//     // clear form values
//     // setSignupCredentials({
//     //   firstName: "",
//     //   lastName: "",
//     //   email: "",
//     //   username: "",
//     //   password: "",
//     // });
//   };

//   return (
//     <>
//       <Form
//         ref={signupForm}
//         className="signup__form hide"
//         onSubmit={handleFormSubmit}
//       >
//         <Form.Group
//           className="form__group"
//           controlId="signup__form__firstname"
//         >
//           <Form.Label>First name:</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter first name here"
//             name="firstName"
//             value={signupCredentials.firstName}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group
//           className="form__group"
//           controlId="signup__form__lastname"
//         >
//           <Form.Label>Last name:</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter last name here"
//             name="lastName"
//             value={signupCredentials.lastName}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group
//           className="form__group"
//           controlId="signup__form__email"
//         >
//           <Form.Label>Email:</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter email here"
//             name="email"
//             value={signupCredentials.email}
//             onChange={handleChange}
//           />
//           <Form.Text className="text-muted">
//             We'll use this email in the event you forget your password.
//           </Form.Text>
//         </Form.Group>
//         <Form.Group
//           className="form__group"
//           controlId="signup__form__username"
//         >
//           <Form.Label>Username:</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter username here"
//             name="username"
//             value={signupCredentials.username}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         <Form.Group
//           className="form__group"
//           controlId="signup__form__password"
//         >
//           <Form.Label>Password:</Form.Label>
//           <Form.Control
//             type="password"
//             placeholder="Password"
//             name="password"
//             value={signupCredentials.password}
//             onChange={handleChange}
//           />
//           <Form.Text className="text-muted">
//             Min. 8 characters with 1 uppercase, 1 lowercase, & 1 number.
//           </Form.Text>
//         </Form.Group>
//         <Button
//           ref={greenSubmitBtn}
//           className="form__button"
//           id="signup__form__button"
//           type="submit"
//           disabled={isDisabled}
//           style={{ opacity: isDisabled ? "0.7" : "1" }}
//         >
//           <div
//             ref={arrowsContainer}
//             className="form__button--arrows"
//             id="dub-arrow"
//           >
//             <img src={pngDblArrow} alt="dbl arrow" />
//           </div>
//           <span ref={spanEl}>Join</span>
//         </Button>
//       </Form>
//     </>
//   );
// };

export default SignUpForm;
