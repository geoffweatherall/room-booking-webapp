export interface Person {
  id: string
  name: string
}

export interface Room {
  id: string
  name: string
  capacity: number
}

export type RoomError = 'NameRequired' | 'CapacityTooLow'

export interface CreateRoomResult {
  room: Room | null
  errors: RoomError[]
}

export const ROOM_ERROR_MESSAGES: Record<RoomError, string> = {
  NameRequired: 'Name must not be blank.',
  CapacityTooLow: 'Room capacity must be at least 2.',
}

export interface Booking {
  id: string
  room: Room
  organiser: Person
  attendees: Person[]
  subject: string
  startTime: string
  endTime: string
}

// fromStartTime/toEndTime must be supplied together (or both omitted); personId is independent.
export interface BookingsFilter {
  fromStartTime?: string
  toEndTime?: string
  personId?: string
}

export type BookingError =
  | 'StartMissaligned'
  | 'EndMissaligned'
  | 'SpansMultipleDays'
  | 'InsufficientCapacity'
  | 'TimeRangeUnavailable'
  | 'RoomRequired'
  | 'RoomNotFound'
  | 'OrganiserRequired'
  | 'OrganiserNotFound'
  | 'AttendeeNotFound'
  | 'SubjectRequired'

export interface CreateBookingResult {
  booking: Booking | null
  errors: BookingError[]
}

export const BOOKING_ERROR_MESSAGES: Record<BookingError, string> = {
  StartMissaligned: 'Start time must fall on a 5 minute boundary.',
  EndMissaligned: 'End time must fall on a 5 minute boundary.',
  SpansMultipleDays: 'A booking cannot span midnight - start and end time must be on the same day.',
  InsufficientCapacity: 'The room does not have enough capacity for all attendees.',
  TimeRangeUnavailable: 'The room is already booked during that time range.',
  RoomRequired: 'Please select a room.',
  RoomNotFound: 'The selected room could not be found.',
  OrganiserRequired: 'Please select an organiser.',
  OrganiserNotFound: 'The selected organiser could not be found.',
  AttendeeNotFound: 'One or more selected attendees could not be found.',
  SubjectRequired: 'Please enter a subject.',
}
