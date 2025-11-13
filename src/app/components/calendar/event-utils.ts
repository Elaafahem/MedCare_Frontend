import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR,
    end: TODAY_STR 
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR ,
    end: TODAY_STR 
  }
];

export function createEventId() {
  return String(eventGuid++);
}