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
