import axios from "axios";

const eventsApi = axios.create({
  baseURL: "http://localhost:8000/events/",
});

export const getAllEvents = () => {
  return eventsApi.get("/events/");
};

export const postEvent = (
  title: string,
  description: string,
  location: string,
  date: string,
  time: string,
  organizer: number
) => {
  return eventsApi.post(`/events/`, {
    title,
    description,
    location,
    date,
    time,
    organizer,
  });
};

export const deleteEvent = (id: number) => {
  return eventsApi.delete(`/events/${id}/`);
};

export const getUser = (id: number) => {
  return eventsApi.get(`/users/${id}/`);
};

export const getUserID = (username: string) => {
  return eventsApi.get(`users/username/${username}/`);
};

export const getComments = (id: number) => {
  return eventsApi.get(`/comments/event/${id}`);
};

export const postComment = (content: string, event: number, user: number) => {
  return eventsApi.post(`/comments/`, { content, event, user });
};

export const deleteComment = (id: number) => {
  return eventsApi.delete(`/comments/${id}/`);
};

export const getParticipants = (id: number) => {
  return eventsApi.get(`/participants/event/${id}`);
};

export const postUserParticipate = (
  event: number,
  user: number,
  attended: boolean
) => {
  return eventsApi.post(`/participants/`, { event, user, attended });
};

export const deleteUserParticipate = (event: number, user: number) => {
  return eventsApi.delete(`/participants/${event}/${user}/`);
};
