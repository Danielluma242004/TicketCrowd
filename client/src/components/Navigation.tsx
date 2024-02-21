import { useState, useEffect } from "react";
import { userLogin, userRegister, userLogout } from "../api/login.api";
import { postEvent } from "../api/events.api";
import { getUserID } from "../api/events.api";
import { useAuth } from "./UserContext";

export function Navigation() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalRegisterOpen, setModalRegisterOpen] = useState(false);
  const [isModalCrateEventOpen, setModalCreateEvent] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameR, setUsernameR] = useState("");
  const [passwordR, setPasswordR] = useState("");
  const [email, setEmail] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [titleEvent, setTitleEvent] = useState("");
  const [descriptionEvent, setDescriptionEvent] = useState("");
  const [locationEvent, setLocationEvent] = useState("");
  const [dateEvent, setDateEvent] = useState("");
  const [timeEvent, setEventTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageRegister, setErrorMessageRegister] = useState("");
  const [errorTypeR, setErrorTypeR] = useState(0);
  const { user, setUser } = useAuth();

  useEffect(() => {
    // Recuperar el usuario del almacenamiento local al cargar el componente
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  const emptyInputs = () => {
    setUsername("");
    setPassword("");
    setUsernameR("");
    setPasswordR("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setErrorMessage("");
    setErrorMessageRegister("");
    setErrorTypeR(0);
    setTitleEvent("");
    setDateEvent("");
    setDescriptionEvent("");
    setLocationEvent("");
    setEventTime("");
  };

  const handleLogin = () => {
    userLogin(username, password)
      .then((res) => {
        console.log(res.data.message);
        const loggedInUser = res.data.user;
        setUser(loggedInUser);
        emptyInputs();
        localStorage.setItem("user", loggedInUser);
        toggleModal();
      })
      .catch((error) => {
        console.error("Login failed:", error.message);
        setErrorMessage("Incorrect username or password");
      });
  };
  const handleRegister = () => {
    userRegister(usernameR, passwordR, email, first_name, last_name)
      .then((res) => {
        console.log(res.data.message);
        const loggedInUser = res.data.user;
        toggleModalRegister();
        setUser(loggedInUser);
        emptyInputs();
        localStorage.setItem("user", loggedInUser);
        window.location.reload();
      })
      .catch((error: any) => {
        console.error("Register failed:", error.message);
        setErrorTypeR(error.errorType);
        setErrorMessageRegister(error.message);
      });
  };

  const handleLogout = () => {
    userLogout()
      .then((res) => {
        console.log(res.data.message);
        setUser(null); // Establecer el usuario como vacío
        localStorage.removeItem("user");
      })
      .catch((error) => {
        console.error("Logout failed:", error.message);
      });
  };

  const handleCreateEvent = async () => {
    try {
      const userID = user && (await getUserID(user))?.data?.id;
      if (userID) {
        console.log(
          titleEvent,
          descriptionEvent,
          locationEvent,
          dateEvent,
          timeEvent,
          userID
        );
        await postEvent(
          titleEvent,
          descriptionEvent,
          locationEvent,
          dateEvent,
          timeEvent,
          userID
        );
        toggleModalCreateEvent();
        emptyInputs();
        window.location.reload();
      } else {
        console.error("Error obtaining userID");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
    emptyInputs();
  };

  const toggleModalRegister = () => {
    setModalRegisterOpen(!isModalRegisterOpen);
    emptyInputs();
  };

  const toggleModalCreateEvent = () => {
    setModalCreateEvent(!isModalCrateEventOpen);
    emptyInputs();
  };

  return (
    <div className="sticky top-0 z-50">
      <nav className="w-full bg-gray-800 flex items-center justify-between ">
        <div className="ml-4 flex items-center">
          <h1 className="py-1 px-6 text-violet-700 font-bold text-3xl">
            TicketCrowd
          </h1>
        </div>
        <div>
          {user ? (
            <div className="m-6 ml-0 flex items-center justify-end">
              <button
                className=" px-4 py-1 text-lg text-white bg-violet-700 hover:bg-violet-800 active:bg-violet-700 active:ring-2 active:ring-violet-700  font-medium rounded-lg text-center inline-flex items-center"
                onClick={toggleModalCreateEvent}
              >
                Create Event
              </button>
              <p className="text-white text-lg mx-3">{user}</p>
              <button
                className="px-4 py-1 text-lg text-white bg-violet-700 hover:bg-violet-800 active:bg-violet-700 active:ring-2 active:ring-violet-700  font-medium rounded-lg text-center inline-flex items-center"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={toggleModal}
              className="m-6 px-4 py-1 text-xl text-white bg-violet-700 hover:bg-violet-800 active:bg-violet-700 active:ring-2 active:ring-violet-700  font-medium rounded-lg text-center inline-flex items-center"
              id="dropdownDefaultButton"
              type="button"
            >
              Sign In
            </button>
          )}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
                <div className="justify-end flex">
                  <button
                    onClick={toggleModal}
                    className="bg-gray-200 p-2 rounded-full active:bg-gray-300 active:ring-2 active:ring-gray-300"
                  >
                    <svg
                      fill="currentColor"
                      height="16"
                      icon-name="close-outline"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path>
                    </svg>
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-6 ml-3">Sign In</h2>
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errorMessage && (
                  <p className="text-red-500 mx-3 ">{errorMessage}</p>
                )}
                <p className="flex flex-row p-3 mb-4">
                  New to Authentication App?{" "}
                  <button
                    onClick={() => {
                      toggleModal();
                      toggleModalRegister();
                    }}
                    className="text-violet-700 ml-1 cursor-pointer active:text-violet-900"
                  >
                    Sign Up
                  </button>
                </p>
                <button
                  onClick={() => {
                    handleLogin();
                  }}
                  className=" bg-violet-700 hover:bg-violet-800 active:bg-violet-700 active:ring-2 active:ring-violet-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {isModalRegisterOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col w-1/3">
                <div className="justify-end flex">
                  <button
                    onClick={toggleModalRegister}
                    className="bg-gray-200 p-2 rounded-full active:bg-gray-300 active:ring-2 active:ring-gray-300"
                  >
                    <svg
                      fill="currentColor"
                      height="16"
                      icon-name="close-outline"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path>
                    </svg>
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-6 ml-3">Sign Up</h2>
                <label className="mb-1 ml-3">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <label className="mb-1 ml-3">Last Name</label>

                <input
                  type="text"
                  placeholder="Last Name"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <div className="flex flex-row">
                  <label className="mb-1 ml-3">Username</label>

                  {(errorTypeR === 2 ||
                    errorTypeR === 5 ||
                    errorTypeR === 6) && (
                    <p className="text-red-500 mx-3 mb-4">
                      {errorMessageRegister}
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={usernameR}
                  onChange={(e) => setUsernameR(e.target.value)}
                />
                <div className="flex flex-row">
                  <label className="mb-1 ml-3">Email</label>

                  {(errorTypeR === 1 ||
                    errorTypeR === 4 ||
                    errorTypeR === 6) && (
                    <p className="text-red-500 mx-3 mb-4 ">
                      {errorMessageRegister}
                    </p>
                  )}
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="flex flex-row">
                  <label className="mb-1 ml-3">Password</label>
                  {errorTypeR === 3 && (
                    <p className="text-red-500 mx-3 mb-4 ">
                      {errorMessageRegister}
                    </p>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={passwordR}
                  onChange={(e) => setPasswordR(e.target.value)}
                />
                <button
                  onClick={() => {
                    handleRegister();
                  }}
                  className=" bg-violet-700 hover:bg-violet-800 active:bg-violet-700 active:ring-2 active:ring-violet-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {isModalCrateEventOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md flex flex-col w-1/3">
                <div className="justify-end flex">
                  <button
                    onClick={toggleModalCreateEvent}
                    className="bg-gray-200 p-2 rounded-full active:bg-gray-300 active:ring-2 active:ring-gray-300"
                  >
                    <svg
                      fill="currentColor"
                      height="16"
                      icon-name="close-outline"
                      viewBox="0 0 20 20"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path>
                    </svg>
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-6 ml-3">Create Event</h2>
                <label className="mb-1 ml-3">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={titleEvent}
                  onChange={(e) => setTitleEvent(e.target.value)}
                />
                <label className="mb-1 ml-3">Description</label>

                <input
                  type="text"
                  placeholder="Description"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={descriptionEvent}
                  onChange={(e) => setDescriptionEvent(e.target.value)}
                />
                <div className="flex flex-row">
                  <label className="mb-1 ml-3">Location</label>
                </div>
                <input
                  type="text"
                  placeholder="Location"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={locationEvent}
                  onChange={(e) => setLocationEvent(e.target.value)}
                />
                <div className="flex flex-row">
                  <label className="mb-1 ml-3">Date</label>
                </div>
                <input
                  type="text"
                  placeholder="Date"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={dateEvent}
                  onChange={(e) => setDateEvent(e.target.value)}
                />
                <div className="flex flex-row">
                  <label className="mb-1 ml-3">Time</label>
                </div>
                <input
                  type="text"
                  placeholder="Time"
                  className="bg-gray-200 rounded-2xl p-3 mb-4 focus:outline-none"
                  value={timeEvent}
                  onChange={(e) => setEventTime(e.target.value)}
                />
                <button
                  onClick={() => {
                    handleCreateEvent();
                  }}
                  className=" bg-violet-700 hover:bg-violet-800 active:bg-violet-700 active:ring-2 active:ring-violet-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
