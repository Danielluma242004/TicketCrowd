import { useState, useEffect } from "react";
import { getAllEvents } from "../api/events.api";
import { EventCardProps, EventCard } from "./EventCard";

export function EventList() {
  const [events, setEvents] = useState<EventCardProps[]>([]);

  useEffect(() => {
    async function loadEvents() {
      const res = await getAllEvents();
      setEvents(res.data);
    }
    loadEvents();
  }, []);

  return (
    <div className="flex flex-wrap bg-violet-950 h-full">
      {events.map((event) => (
        <div key={event.id} className="w-full md:w-1/2 lg:w-1/3 p-2">
          <EventCard
            id={event.id}
            title={event.title}
            description={event.description}
            location={event.location}
            date={event.date}
            time={event.time}
            organizer={event.organizer}
          />
        </div>
      ))}
    </div>
  );
}
