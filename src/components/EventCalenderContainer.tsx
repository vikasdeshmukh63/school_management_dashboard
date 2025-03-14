import Image from 'next/image';
import EventCalendar from './EventCalender';
import EventList from './EventList';
import { Ellipsis } from 'lucide-react';

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4 rounded-md">
      {/* calendar */}
      <EventCalendar />
      {/* title */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Ellipsis className="h-6 w-6" />
      </div>
      {/* event list */}
      <div className="flex flex-col gap-4">
        <EventList dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
