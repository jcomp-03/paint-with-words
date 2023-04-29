import React, { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import useWebSocket from "react-use-websocket";
import { getPermissionToRecordAudio } from "../utils/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faMicrophone,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import { GET_ASSEMBLYAI_TOKEN } from "../utils/mutations";
import { useMutation } from "@apollo/client";

const GeneratePaintingForm = () => {
  // state for submit button
  const [isDisabled, setIsDisabled] = useState(true);
  // state for image parameters
  const [imageParameters, setImageParameters] = useState({
    prompt: "",
    n: 1,
    size: "",
  });
  // state for websocket-related stuff
  let [isRecording, setIsRecording] = useState(false);
  let [socketUrl, setSocketUrl] = useState(null);
  let [texts, setTexts] = useState({});
  // ref for submit button to conditionally render animation
  const submitBtn = useRef(null);
  // array which provides values for radio buttons
  const radioInputArray = [
    { "input-type": "radio", value: "1024x1024" },
    { "input-type": "radio", value: "512x512" },
    { "input-type": "radio", value: "256x256" },
  ];
  const playIcon = <FontAwesomeIcon icon={faPlay} className="nav__icon" />;
  const microphoneIcon = (
    <FontAwesomeIcon icon={faMicrophone} className="nav__icon" />
  );
  const pauseIcon = <FontAwesomeIcon icon={faPause} className="nav__icon" />;

  const [getAAITemporaryToken, { data, loading, error }] =
    useMutation(GET_ASSEMBLYAI_TOKEN);

  // useEffect hook runs when the recording state changes
  useEffect(() => {
    console.log("isRecording useEffect ran");
    isRecording
      ? submitBtn.current.classList.add("animation-pulse")
      : submitBtn.current.classList.remove("animation-pulse");
  }, [isRecording]);

  // useEffect hook runs when image parameters state changes
  // also determines if submit button is enabled or disabled
  useEffect(() => {
    const canBeSubmitted = () => {
      let { prompt, n, size } = imageParameters;
      return prompt && n && size ? true : false;
    };
    setIsDisabled(!canBeSubmitted());
  }, [imageParameters]);

  // const [messageHistory, setMessageHistory] = useState({});
  // function printErrorMessage(error) {
  //   console.log('Your error message turned out to be', error);
  // }
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onMessage: (message) => {
      console.log(`***** Websocket MESSAGE *****`);
      // console.log('message.data object is', message.data);
      console.log("text before setting", texts);
      let msg = "";
      const res = JSON.parse(message.data);
      // console.log(res);
      // JSON response from WebSocket API features keys like audio_start and text
      // In line of code below, assign a new property to object 'texts' with its name as
      // the current audio_start time and text as its value
      if (res.text) {
        setTexts({ ...texts, [res.audio_start]: res.text });
      }

      console.log("text after setting", texts);

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
      console.log(event);
      setSocketUrl(null);
    },
    onOpen: () => {
      console.log(`***** Websocket OPENED *****`);
      // request permission and instantiate recorder
      getPermissionToRecordAudio(socketUrl, sendJsonMessage)
        .then((recorder) => {
          // what now?
          recorder.startRecording();
          console.log(
            "***** Recording initiated. Recorder object below. *****",
            recorder
          );
          // negate current state of isRecording
          setIsRecording(!isRecording);
        })
        .catch(handleDOMException);
    },
    retryOnError: true,
    // Will NOT attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => false,
  });

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  // handler for DOM Exceptions
  const handleDOMException = (error) => {
    console.log("***** DOM Exception event: *****\n", error);
    // update state for socket and recording
    setSocketUrl(null);
    setIsRecording(false);
  };

  // handler for record button
  const handleRecordClick = async () => {
    if (isRecording) {
      if (socketUrl) {
        sendJsonMessage({ terminate_session: true });
        setSocketUrl(null);
        // negate current state of isRecording
        setIsRecording(!isRecording);
      }
    } else {
      const { data } = await getAAITemporaryToken();
      //console.log(data.getAAITemporaryToken);
      const { token } = data.getAAITemporaryToken.data;
      // establish wss with AssemblyAI (AAI) at 16000 sample rate; by setting a url,
      // this causes websocket-related events to fire
      setSocketUrl(
        `wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`
      );
    }
    // // negate current state of isRecording
    // setIsRecording(!isRecording);
  };

  // handler for updating image parameters, i.e. prompt, n, & size
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

  const handleFormReset = () => {
    console.log("handleFormReset ran");
    // reset image parameters to default state;
    setImageParameters({
      prompt: "",
      n: 1,
      size: "",
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
          ref={submitBtn}
          className="form__button--record"
          id="record-btn"
          onClick={handleRecordClick}
        >
          {isRecording ? pauseIcon : microphoneIcon}
        </Button>
        <p>Hello</p>

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
            value={imageParameters.n}
            aria-label="Default select example"
            size="lg"
            onChange={handleUpdateImageParameter}
            name="n"
            className="form__select"
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

        <Button
          className="form__button--submit"
          type="submit"
          disabled={isDisabled}
        >
          Submit
        </Button>
        <Button className="form__button--reset" onClick={handleFormReset}>
          Reset Form
        </Button>
      </Form>
    </>
  );
};

export default GeneratePaintingForm;
