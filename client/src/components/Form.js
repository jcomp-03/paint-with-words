import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useWebSocket, { ReadyState } from "react-use-websocket";
// import RecordRTC, { RecordRTCPromisesHandler } from "recordrtc";
import { startRecordingWithPermission } from "../utils/js/index";

const FormComponent = () => {
  // state for submit button
  const [isDisabled, setIsDisabled] = useState(true);
  // state for image parameters
  const [imageParameters, setImageParameters] = useState({
    prompt: "",
    n: 1,
    size: "",
  });
  // array which provides values for radio buttons
  const radioInputArray = [
    { "input-type": "radio", value: "1024x1024" },
    { "input-type": "radio", value: "512x512" },
    { "input-type": "radio", value: "256x256" },
  ];
  // useEffect hook runs when image parameters state changes
  // also determines if submit button is enabled or disabled
  useEffect(() => {
    // console.log("imageParameters state:", imageParameters);
    const canBeSubmitted = () => {
      let { prompt, n, size } = imageParameters;
      return prompt && n && size ? true : false;
    };
    setIsDisabled(!canBeSubmitted());
  }, [imageParameters]);

  // websocket-related state, functions
  let [isRecording, setIsRecording] = useState(false);
  let [socketUrl, setSocketUrl] = useState(null);
  let texts = {};
  // let recorder;
  // const [messageHistory, setMessageHistory] = useState({});
  // function printErrorMessage(error) {
  //   console.log('Your error message turned out to be', error);
  // }
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onMessage: (message) => {
      let msg = "";
      const res = JSON.parse(message.data);
      // JSON response from WebSocket API features keys like audio_start and text
      // In line of code below, assign a new property to object 'texts' with its name as
      // the current audio_start time and text as its value
      texts[res.audio_start] = res.text;
      // traverse the properties of the object 'texts', saving their names in an array 'keys'
      const keys = Object.keys(texts);
      keys.sort((a, b) => a - b);
      for (const key of keys) {
        if (texts[key]) {
          msg += ` ${texts[key]}`;
        }
      }
      // update the state
      setImageParameters({
        ...imageParameters,
        prompt: msg,
      });
    },
    onError: (event) => {
      console.log(`***** Websocket ERROR *****`);
      console.log(event);
      setSocketUrl(null);
    },
    onClose: (event) => {
      console.log(`***** Websocket CLOSED *****`);
      // console.log(event);
      // setSocketUrl(null);
    },
    onOpen: (event) => {
      console.log(`***** Websocket OPENED *****`);
      // call custom hook below to request permission and instantiate recorder
      startRecordingWithPermission("audio", socketUrl)
        .then((recorder) => {
          // what now?
          console.log("recorder is", recorder);
        })
        .catch(handleDOMException);
    },
    // Will NOT attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => false,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  // handler for DOMExceptions
  const handleDOMException = (error) => {
    console.log("***** DOM Exception event: *****\n", error);
    // update state for socket and recording
    setSocketUrl(null);
    setIsRecording(false);
  };

  // handler for record button
  const handleRecordClick = async () => {
    if (isRecording) {
      setSocketUrl(null);
      //   if (socket) {
      //     socket.send(JSON.stringify({ terminate_session: true }));
      //     socket.close();
      //     socket = null;
      //   }
      //   if (recorder) {
      //     recorder.pauseRecording();
      //     recorder = null;
      //   }
    } else {
      // get temp session token from backend
      const response = await fetch("/api/transcribe");
      const data = await response.json();
      // if there's an error, return out of function
      if (data.error) {
        alert("Your transcription request can't be completed:", data.error);
        return null;
      }
      // destructure token from the data
      const { token } = data;
      // establish wss with AssemblyAI (AAI) at 16000 sample rate
      setSocketUrl(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
      );
      // handle incoming messages to display transcription to the DOM
    }

    // negate current state of isRecording
    setIsRecording(!isRecording);
  };

  // event handler for updating image parameters, i.e. prompt, n, & size
  const handleUpdateImageParameter = (e) => {
    // destructure name and value from target
    let { name, value } = e.target;
    // select option value is string; parse to integer
    if (name === "n") {
      value = parseInt(value);
    }
    // update the state
    setImageParameters({
      ...imageParameters,
      [name]: value,
    });
  };

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log("handleFormSubmit ran");

    //   if (!searchInput) {
    //     return false;
    //   }

    //   try {
    //     const response = await searchGoogleBooks(searchInput);

    //     if (!response.ok) {
    //       throw new Error("something went wrong!");
    //     }

    //     const { items } = await response.json();

    //     const bookData = items.map((book) => ({
    //       bookId: book.id,
    //       authors: book.volumeInfo.authors || ["No author to display"],
    //       title: book.volumeInfo.title,
    //       description: book.volumeInfo.description,
    //       image: book.volumeInfo.imageLinks?.thumbnail || "",
    //     }));

    //     setSearchedBooks(bookData);
    //     setSearchInput("");
    //   } catch (err) {
    //     console.error(err);
    //   }
  };

  return (
    <>
      <Form className="modal__body__form" onSubmit={handleFormSubmit}>
        <Button
          className="form__button"
          id="record-btn"
          onClick={handleRecordClick}
        >
          {isRecording ? "Stop Recording" : "Begin Recording"}
        </Button>

        <Form.Group className="form__group" controlId="formTextarea">
          <Form.Label>Your recorded speech translated as:</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="As you speak, your transcribed words will appear here"
            rows={6}
            value={imageParameters.prompt}
            readOnly
            className="form__textarea"
          />
        </Form.Group>

        <Form.Group className="form__group" controlId="formSelect">
          <Form.Label>How many images do you wish to generate?</Form.Label>
          <Form.Select
            defaultValue={1}
            aria-label="Default select example"
            size="lg"
            onChange={handleUpdateImageParameter}
            name="n"
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

        <Form.Group className="form__group" controlId="formRadioButton">
          <Form.Label>Select the image resolution:</Form.Label>
          {radioInputArray.map((item) => (
            <Form.Check
              type={item["input-type"]}
              id={`${item["input-type"]}-${item.value}`}
              label={`${item.value}`}
              value={item.value}
              className="form__radio"
              key={`${item["input-type"]}-${item.value}`}
              name="size"
              onChange={handleUpdateImageParameter}
              checked={item.value === imageParameters.size}
            />
          ))}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isDisabled}>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default FormComponent;
