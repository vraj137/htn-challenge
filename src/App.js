import React, { useState, useEffect } from "react";
import "./App.css";
import {
  Box,
  Card,
  CardHeader,
  Text,
  Button,
  Badge,
  Flex,
  Select,

  // Th,
  // Thead,
  // Tr,
} from "@chakra-ui/react";
import Modal from "react-modal";
import { Input } from "@chakra-ui/react";



function App(props) {
  const [events, setEvents] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [eventType, setEventType] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const eventTypes = [...new Set(events.map(event => event.event_type))];


  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const filteredEvents = events.filter(event => {
    if (!eventType) {
      return true;
    }
    return event.event_type === eventType;
  });

  useEffect(() => {
    document.title = "2021 Hackathon Global Inc."; // Set the tab title
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
      closeModal();
    } else {
      alert("Invalid login details");
    }
  }

  function handleLogout() {
    setLoggedIn(false);
    closeModal();
  }

  function capitalizeEventType(eventType) {
    if (eventType.includes("_")) {
      eventType = eventType.replace("_", " ");
    }
    return eventType.toUpperCase();
  }

  return (
    <div className="App">
      <Box className="content" p="2rem">
        <Card>
          <CardHeader>
            <h2 style={{ fontWeight: "bold", fontSize: "30px" }}>
              2021 Upcoming Events @ Hackathon Global Inc.
            </h2>
          </CardHeader>

          <Flex justifyContent="center" mt="2">
          <Box mr="2">
            <Text fontWeight="bold">Filter by Event Type:</Text>
          </Box>
          <Box w="40%">
            <Select value={eventType} onChange={e => setEventType(e.target.value)}>
              <option value="">All</option>
              {eventTypes.map(eventType => (
                <option key={eventType} value={eventType}>{eventType}</option>
              ))}
            </Select>
          </Box>
        </Flex>

        {!loggedIn && (
        <Button size="lg" margin="10" onClick={openModal}>
          Log In To View All Events!
        </Button>
      )}

      {loggedIn && (
        <Button margin="10" onClick={handleLogout}>
          Log Out
        </Button>
      )}

      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        {!loggedIn && (
          <form onSubmit={handleLogin}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "25vh",
              }}
            >
              <h2>Login</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <label>
                Username:
                <Input
                  pr="4.5rem"
                  placeholder="Enter myusername"
                  type={"username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  mt="3"
                />
              </label>
              <label>
                Password:
                <Input
                  mt="3"
                  pr="4.5rem"
                  type={"password"}
                  placeholder="Enter mypassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "5vh",
              }}
            >
              <Button type="submit">Log In</Button>
            </div>
          </form>
        )}
      </Modal>

          <Flex mt = "4" flexWrap="wrap" flexDirection="row" justifyContent="center">
            {filteredEvents
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
                  <Box
                    key={event.id}
                    mb="4"
                    mx="2"
                    width={["100%"]}
                    maxW="sm"
                    borderWidth="2px"
                    borderRadius="lg"
                    overflow="hidden"
                  >
                    <Box p="6">
                      <Box d="flex" alignItems="baseline">
                        <Badge
                          size="lg"
                          borderRadius="full"
                          px="2"
                          colorScheme="teal"
                        >
                          {capitalizeEventType(event.name)}
                        </Badge>
                      </Box>
                      <Box mt="1" as="h4" lineHeight="tight">
                        <Text fontWeight="bold">
                          Event Type: 
                        </Text>
                        <Text color ="gray.500">
                        {capitalizeEventType(event.event_type)}
                        </Text>
                      </Box>
                      <Box>
                        <Text mt="2" color="gray.500">
                          <Text>
                            Start: {new Date(event.start_time).toLocaleString()}
                          </Text>
                          <Text>
                            End: {new Date(event.end_time).toLocaleString()}
                          </Text>
                        </Text>
                      </Box>
                      <Box>
                        <Text mt="2" color="gray.500">
                          <Text color="black" fontWeight="bold">
                            Description:
                          </Text>
                          {event.description}
                        </Text>
                      </Box>
                      {event.speakers && event.speakers.length > 0 && (
                        <Box>
                          <Text mt="2" color="gray.500">
                            <Text color="black" fontWeight="bold">
                              Speakers:
                            </Text>
                            {event.speakers
                              .map((speaker) => speaker.name)
                              .join(", ")}
                          </Text>
                        </Box>
                      )}

                      {showRelatedEvents && event.related_events.length > 0 && (
                        <Box>
                          <Text mt="2" color="black" fontWeight="bold">
                            Related Events:
                          </Text>

                          {event.related_events.map((relatedEventId) => {
                            const relatedEvent = events.find(
                              (e) => e.id === relatedEventId
                            );
                            return (
                              <div key={relatedEvent.id}>
                                <Badge
                                  size="lg"
                                  borderRadius="full"
                                  px="2"
                                  colorScheme="pink"
                                >
                                  <RelatedEvent
                                    name={relatedEvent.name}
                                    id={relatedEvent.id}
                                  />
                                </Badge>
                              </div>
                            );
                          })}
                        </Box>
                      )}
                      <Box>
                        <Text fontWeight="bold" mt="2" color="black">
                          Event URL:
                        </Text>
                        <Button
                          mt="2"
                          onClick={() =>
                            (window.location.href = showPrivateEvent
                              ? event.private_url
                              : event.public_url)
                          }
                        >
                          Click Me!
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
          </Flex>
        </Card>
      </Box>

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

export default App;
