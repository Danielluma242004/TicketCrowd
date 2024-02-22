import { useState, useEffect } from "react";
import { useAuth } from "./UserContext";
import {
  getUser,
  getComments,
  getParticipants,
  postComment,
  getUserID,
  deleteEvent,
  deleteComment,
  deleteUserParticipate,
  postUserParticipate,
} from "../api/events.api";

export interface EventCardProps {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  organizer: number;
}

interface CommentProps {
  id: number;
  content: string;
  created_at: string;
  event: number;
  user: number;
  userName?: string;
}

interface ParticipantProps {
  userName?: string;
  user: number;
}

export const EventCard: React.FC<EventCardProps> = (event) => {
  const [organizer, setOrganizer] = useState("");
  const [comments, setComments] = useState<CommentProps[]>([]);
  const [participants, setParticipants] = useState<ParticipantProps[]>([]);
  const { user } = useAuth();
  const [commentContent, setcommentContent] = useState("");
  const [userParticipate, setUserParticipate] = useState(false);
  const [isModalCommunityOpen, setModalCommunityOpen] = useState(false);
  const [isModalDeleteEventOpen, setModalDeleteEventOpen] = useState(false);
  const [isModalDeleteCommentOpen, setModalDeleteCommentOpen] = useState(false);
  const [errorParticipant, setErrorParticipant] = useState("");

  useEffect(() => {
    loadOrganizer();
    loadComments();
    loadParticipants();
  }, []);

  const newComment = async () => {
    try {
      const userID = user && (await getUserID(user))?.data?.id;
      if (userID) {
        await postComment(commentContent, event.id, userID);
        await loadComments();
        setcommentContent("");
      } else {
        console.error("Error obtaining userID");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUserParticipate = async () => {
    try {
      const userID = user && (await getUserID(user))?.data?.id;
      if (userID) {
        const isUserParticipating = participants.some(
          (participant) => participant.user === userID
        );
        if (isUserParticipating) {
          setErrorParticipant("You are already going!");
          console.log("User is already participating");
        } else {
          setUserParticipate(true);
          await postUserParticipate(event.id, userID, userParticipate);
          await loadParticipants();
          setUserParticipate(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function loadOrganizer() {
    const res = await getUser(event.organizer);
    setOrganizer(res.data.username);
  }
  async function loadComments() {
    const res = await getComments(event.id);
    const commentsData = res.data;
    const commensUsernames = await Promise.all(
      commentsData.map(async (comment: any) => {
        const userRes = await getUser(comment.user);
        return {
          ...comment,
          userName: userRes.data.username,
        };
      })
    );
    setComments(commensUsernames);
  }
  async function loadParticipants() {
    const res = await getParticipants(event.id);
    const ParticipantsData = res.data;
    const ParticipantsUsernames = await Promise.all(
      ParticipantsData.map(async (participant: any) => {
        const userRes = await getUser(participant.user);
        return {
          ...participant,
          userName: userRes.data.username,
        };
      })
    );
    setParticipants(ParticipantsUsernames);
  }

  const handleDeleteEvent = () => {
    deleteEvent(event.id);
    toggleDeleteEvent();
    window.location.reload();
  };

  const handleDeleteComment = async (commentID: number) => {
    try {
      await deleteComment(commentID);
      await loadComments();
      toggleDeleteComment();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDeleteEvent = () => {
    setModalDeleteEventOpen(!isModalDeleteEventOpen);
  };

  const toggleDeleteComment = () => {
    setModalDeleteCommentOpen(!isModalDeleteCommentOpen);
  };

  const toggleSeeCommunity = () => {
    setModalCommunityOpen(!isModalCommunityOpen);
  };

  return (
    <div className="m-4 p-4 border border-gray-300 rounded-lg shadow-lg bg-white">
      <div className="flex justify-between mb-2 items-center">
        <h2 className="text-5xl font-bold text-violet-700">{event.title}</h2>
        {user === organizer && (
          <button
            onClick={toggleDeleteEvent}
            className="text-lg p-2 bg-red-600 text-white rounded-full"
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
        )}
        {isModalDeleteEventOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col w-1/3">
              <div className="justify-end flex">
                <button
                  onClick={toggleDeleteEvent}
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
              <h2 className="text-2xl font-bold mb-6 ml-3">Are you sure?</h2>

              <button
                onClick={() => {
                  handleDeleteEvent();
                }}
                className=" bg-red-700 hover:bg-red-800 active:bg-red-700 active:ring-2 active:ring-red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
      <p className="text-gray-500 mb-4 text-lg">{event.description}</p>

      <div className="flex flex-col space-y-2 ">
        <p className="text-gray-800 flex items-center">
          <strong className="text-xl w-1/3">Location:</strong>
          <span>{event.location}</span>
        </p>
        <p className="text-gray-800 flex items-center">
          <strong className="text-xl w-1/3">Date:</strong>
          <span>{event.date}</span>
        </p>
        <p className="text-gray-800 flex items-center">
          <strong className="text-xl w-1/3">Time:</strong>
          <span>{event.time}</span>
        </p>
        <p className="text-gray-800 flex items-center">
          <strong className="text-xl w-1/3">Organizer:</strong>
          <span>{organizer}</span>
        </p>
        <hr></hr>
      </div>

      {!isModalCommunityOpen && (
        <button
          onClick={toggleSeeCommunity}
          className="mt-2 font-bold text-violet-600 hover:text-violet-700 active:text-violet-800"
        >
          View Community
        </button>
      )}
      {isModalCommunityOpen && (
        <div className="mt-4 ">
          <h3 className="text-xl font-bold mb-2 text-violet-600">Comments:</h3>
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="mb-4 p-2 border border-gray-300 rounded-lg bg-gray-100"
            >
              <div className="flex justify-between">
                <p>{comment.content}</p>
                {user === comment.userName && (
                  <button
                    onClick={toggleDeleteComment}
                    className="text-lg p-1 bg-red-600 text-white rounded-full"
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
                )}
              </div>
              {isModalDeleteCommentOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-md flex flex-col w-1/3">
                    <div className="justify-end flex">
                      <button
                        onClick={toggleDeleteComment}
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
                    <h2 className="text-2xl font-bold mb-6 ml-3">
                      Are you sure?
                    </h2>

                    <button
                      onClick={() => {
                        handleDeleteComment(comment.id);
                      }}
                      className=" bg-red-700 hover:bg-red-800 active:bg-red-700 active:ring-2 active:ring-red-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500">{comment.created_at}</p>
              <p className="text-sm font-semibold text-violet-600">
                {comment.userName}
              </p>
            </div>
          ))}

          {user ? (
            <div className="flex flex-col items-start">
              <p className="text-black">New Comment:</p>
              <input
                value={commentContent}
                onChange={(e) => setcommentContent(e.target.value)}
                type="text"
                className="mt-3 border border-black px-3 py-1 rounded-md text-gray-600"
              />
              <button
                onClick={newComment}
                className="mt-3 p-1 border border-violet-600 rounded-xl text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800"
              >
                Send
              </button>
            </div>
          ) : null}
          <div className="mt-4">
            <hr></hr>
            <h3 className="text-xl font-bold my-2 text-violet-600">
              Participants:
            </h3>
            <ul className="list-disc list-inside mb-4 ">
              {participants.map((participant, index) => (
                <li key={index} className="text-sm">
                  {participant.userName}
                </li>
              ))}
              <div className="my-2">
                {user ? (
                  <div>
                    {errorParticipant ? (
                      <p className="text-violet-600">
                        <strong>* </strong>
                        {errorParticipant}
                        <strong> *</strong>
                      </p>
                    ) : (
                      <button
                        className="mt-3 p-1 border border-violet-600 rounded-xl text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800"
                        onClick={handleUserParticipate}
                      >
                        Im Going
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </ul>
          </div>
          <hr></hr>

          <button
            onClick={toggleSeeCommunity}
            className="mt-2 font-bold text-violet-600 hover:text-violet-700 active:text-violet-800"
          >
            See Less
          </button>
        </div>
      )}
    </div>
  );
};
