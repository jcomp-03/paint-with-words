import { Link } from "react-router-dom";

export const displaySignupErrorMessage = (errorsArray) => {
  const errArr = [];
  const errorsObj = errorsArray[0].extensions.exception.errors;
  for (const errorName in errorsObj) {
    const obj = {
      error: errorName,
      message: errorsObj[errorName]["message"],
    };
    errArr.push(obj);
  }
  return errArr.map((error, index) => {
    return (
      <span
        key={`${error.error}-${index}`}
        className="error-popup"
      >{`${error.error}: ${error.message}`}</span>
    );
  });
};

export const displayLoginErrorMessage = (message) => {
  return (
    <span key={`login-error-${message.length}`} className="error-popup">
      {message}
    </span>
  );
};

export const displayLoginRequiredMessage = () => {
  return (
    <span className="error-popup error-login-required">
      Oops, this is awkward 😬. It looks like you came across a page that requires your being logged in, 
      or simply doesn't exist as a location. Please
      click <Link to={"/login"} className="utility-anchor-tag">here</Link> for the login page.
    </span>
  );
};
