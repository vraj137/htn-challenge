import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Table,
  Tbody,
  Text,
  Stack,
  // Th,
  // Thead,
  // Tr,
} from "@chakra-ui/react";


function App() {
  const [events, setEvents] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showTypingAnimation, setShowTypingAnimation] = useState(true);

  const [wordIndex, setWordIndex] = useState(0);
  const [word, setWord] = useState("code");

  useEffect(() => {
    const words = ["design", "learning", "building"];

    const interval = setInterval(() => {
      setWordIndex((wordIndex + 1) % words.length);
      setWord(words[wordIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, [wordIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTypingAnimation(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title = "Hackathon Global Inc."; // Set the tab title
  }, []);

  useEffect(() => {
    fetch("https://api.hackthenorth.com/v3/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  }, []);

  function handleLogin(event) {
    event.preventDefault();
    if (username === "myusername" && password === "mypassword") {
      setLoggedIn(true);
    } else {
      alert("Invalid login details");
    }
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  function capitalizeEventType(eventType) {
    if (eventType.includes("_")) {
      eventType = eventType.replace("_", " ");
    }
    return eventType.toUpperCase();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={"hackthenorth.png"} alt="logo" width="50" height="50" />
        {showTypingAnimation ? (
          <TypingAnimation text="Hackathon Global Inc." />
        ) : (
          <h1>Hackathon Global Inc.</h1>
        )}
        <div class="arrow-down"></div>
        <p>
          Canada's biggest hackathon where anyone can spark their passion for{" "}
          <span key={word} className="changing-word">
            {word}
          </span>
        </p>
        <p>September 16-18, 2023</p>
        <p>In-Person event @ Waterloo, ON</p>
      </header>
      <table>
        <Box className="content" p="2rem">
          <Card>
            <CardHeader>
              <h2>All Events</h2>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Tbody>
                  {events
                    .sort((a, b) => a.start_time - b.start_time)
                    .map((event) => {
                      const showPrivateEvent =
                        loggedIn && event.permission === "private";
                      const showRelatedEvents =
                        event.permission === "public" || showPrivateEvent;

                      if (!showPrivateEvent && event.permission === "private") {
                        return null;
                      }

                      return (
                        <Card key={event.id} maxW = 'sm'>
                          <CardBody>
                          <CardHeader>
                            <h2>{event.name}</h2>
                          </CardHeader>
                            <Box mt="2" mb="4">
                              <Text fontWeight="bold">Event Type:</Text>
                              <Stack mt='6' spacing='3'></Stack>
                              <Text>
                                {capitalizeEventType(event.event_type)}
                              </Text>
                            </Box>
                            <Box mb="4">
                              <Text fontWeight="bold">Start Time:</Text>
                              <Text>
                                {new Date(event.start_time).toLocaleString()}
                              </Text>
                            </Box>
                            <Box mb="4">
                              <Text fontWeight="bold">End Time:</Text>
                              <Text>
                                {new Date(event.end_time).toLocaleString()}
                              </Text>
                            </Box>
                            <Box mb="4">
                              <Text fontWeight="bold">Description:</Text>
                              <Text>{event.description}</Text>
                            </Box>
                            <Box mb="4">
                              <Text fontWeight="bold">Speakers:</Text>
                              <Text>
                                {event.speakers
                                  .map((speaker) => speaker.name)
                                  .join(", ")}
                              </Text>
                            </Box>
                            {showRelatedEvents && (
                              <Box mb="4">
                                <Text fontWeight="bold">Related Events:</Text>
                                {event.related_events.map((relatedEventId) => {
                                  const relatedEvent = events.find(
                                    (e) => e.id === relatedEventId
                                  );
                                  return (
                                    <div key={relatedEvent.id}>
                                      <RelatedEvent
                                        name={relatedEvent.name}
                                        id={relatedEvent.id}
                                      />
                                      <br />
                                    </div>
                                  );
                                })}
                              </Box>
                            )}
                            <Box mb="4">
                              <Text fontWeight="bold">Event URL:</Text>
                              <Text>
                                {showPrivateEvent
                                  ? event.private_url
                                  : event.public_url}
                              </Text>
                            </Box>
                          </CardBody>
                        </Card>
                      );
                    })}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </Box>
      </table>
      {!loggedIn && (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button type="submit">Log In</button>
        </form>
      )}
      {loggedIn && (
        <div>
          <h2>Logged in as {username}</h2>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </div>
  );
}

function RelatedEvent(props) {
  return (
    <a href={`https://api.hackthenorth.com/v3/events/${props.id}`}>
      {props.name}
    </a>
  );
}

function TypingAnimation({ text }) {
  const [animationText, setAnimationText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setAnimationText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [text, currentIndex]);

  return <h1>{animationText}</h1>;
}

export default App;
