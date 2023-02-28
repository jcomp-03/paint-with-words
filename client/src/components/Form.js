import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";

const FormComponent = () => {
  const imageResolutionArray = ["1024x1024", "512x512", "256x256"];

  // handler for record button
  const handleRecordButton = () => {
    console.log("record button clicked");
    // run fetch request in here
    fetch("/image/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt:
          "A dog riding a surfboard in turbulent water, as a pencil drawing.",
        n: 1,
        size: "1024x1024",
      }),
    }).then(
      (response) => {
        console.log("response is", response);
      },
      (rejection) => {
        console.log("fetch rejected", rejection);
      }
    );
  };

  const handleImageQuantity = () => {
    console.log("handleImageQuantity ran");
  };

  return (
    <>
      <button
        className="modal__body__button"
        id="record-btn"
        onClick={handleRecordButton}
      >
        Record
      </button>

      <Form className="modal__body__form">
        <Form.Group
          className="form__group form__textarea"
          controlId="formTextArea"
        >
          <Form.Label>Your recorded speech translated as:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="As you speak, the words will appear here"
            rows={6}
          />
        </Form.Group>

        <Form.Group className="form__group form__select" controlId="formSelect">
          <Form.Label>How many images do you wish to generate?</Form.Label>
          <Form.Select
            defaultValue={1}
            aria-label="Default select example"
            size="lg"
            onChange={handleImageQuantity}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default FormComponent;
