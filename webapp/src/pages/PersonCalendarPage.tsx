import { useQuery } from '@apollo/client/react'
import {
  Autocomplete,
  Box,
  ButtonBase,
  CircularProgress,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/authContext'
import { ErrorBanner } from '../components/ErrorBanner'
import { errorMessages } from '../graphql/errorMessages'
import { formatLocalTime } from '../graphql/formatDateTime'
import { LIST_BOOKINGS, LIST_PEOPLE } from '../graphql/queries'
import type { Booking, BookingsFilter, Person } from '../graphql/types'

const WEEKS_SHOWN = 6
const WORK_DAYS_PER_WEEK = 5
const WORK_DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const DATE_KEY_FORMAT = 'YYYY-MM-DD'
const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss'

// dayjs .day() is 0 (Sunday) .. 6 (Saturday); shift so the week starts Monday.
function startOfWorkWeek(from: Dayjs): Dayjs {
  const day = from.day()
  const daysSinceMonday = day === 0 ? 6 : day - 1
  return from.subtract(daysSinceMonday, 'day').startOf('day')
}

export default function PersonCalendarPage() {
  const { personId } = useParams<{ personId: string }>()
  const navigate = useNavigate()
  const [dismissedError, setDismissedError] = useState(false)
  const { personId: ownPersonId, displayName: ownDisplayName } = useAuth()

  // People change rarely, so fetch once and read from the cache from then on (`cache-first`)
  // instead of refetching on every visit; a full page refresh resets the in-memory cache and
  // picks up any changes.
  const {
    data: peopleData,
    loading: peopleLoading,
    error: peopleError,
  } = useQuery<{ people: Person[] }>(LIST_PEOPLE, { fetchPolicy: 'cache-first' })

  const people = useMemo(
    () => [...(peopleData?.people ?? [])].sort((a, b) => a.name.localeCompare(b.name)),
    [peopleData],
  )
  // Before the full people list has loaded, fall back to the signed-in user's own name - already
  // known via useAuth(), independent of this page's own LIST_PEOPLE query - rather than leaving
  // the dropdown showing placeholder text until the list resolves. This covers the common case
  // ("My Calendar" always links here with the signed-in user's own personId); it doesn't help for
  // a cold deep link to someone else's calendar, since nothing else knows their name yet either.
  const selectedPerson = useMemo(() => {
    const fromList = people.find((person) => person.id === personId)
    if (fromList) return fromList
    if (personId && personId === ownPersonId && ownDisplayName) {
      return { id: personId, name: ownDisplayName }
    }
    return undefined
  }, [people, personId, ownPersonId, ownDisplayName])

  const firstMonday = useMemo(() => startOfWorkWeek(dayjs()), [])

  const weeks = useMemo(
    () =>
      Array.from({ length: WEEKS_SHOWN }, (_, weekIndex) =>
        Array.from({ length: WORK_DAYS_PER_WEEK }, (_, dayIndex) =>
          firstMonday.add(weekIndex * 7 + dayIndex, 'day'),
        ),
      ),
    [firstMonday],
  )

  // This person's bookings across the full visible window (first Monday through the last
  // Friday shown) - the API filters server-side (organiser-or-attendee match, date range) so
  // this page never fetches another person's bookings or bookings outside the weeks shown.
  const bookingsFilter = useMemo<BookingsFilter>(() => {
    const lastFriday = firstMonday.add((WEEKS_SHOWN - 1) * 7 + (WORK_DAYS_PER_WEEK - 1), 'day')
    return {
      fromStartTime: firstMonday.format(DATE_TIME_FORMAT),
      toEndTime: lastFriday.add(1, 'day').format(DATE_TIME_FORMAT),
      personId,
    }
  }, [firstMonday, personId])
  const {
    data: bookingsData,
    loading: bookingsLoading,
    error: bookingsError,
  } = useQuery<{ bookings: Booking[] }, { filter: BookingsFilter }>(LIST_BOOKINGS, {
    variables: { filter: bookingsFilter },
    skip: !personId,
    fetchPolicy: 'cache-and-network',
  })

  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const booking of bookingsData?.bookings ?? []) {
      const dateKey = booking.startTime.slice(0, 10)
      const list = map.get(dateKey) ?? []
      list.push(booking)
      map.set(dateKey, list)
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime))
    }
    return map
  }, [bookingsData])

  function handlePersonChange(selected: Person | null) {
    if (selected) {
      navigate(`/persons/${selected.id}/calendar`)
    }
  }

  const loading = peopleLoading || bookingsLoading
  // True only on a genuine first load - no cached people, or no cached bookings for the currently
  // selected person - not on a cache-and-network background revalidation of data we already have
  // (bookingsLoading stays true then too, but bookingsData is already populated from the cache).
  const showSpinner = (peopleLoading && !peopleData) || (bookingsLoading && !bookingsData)
  const bannerMessages = [...errorMessages(peopleError), ...errorMessages(bookingsError)]
  const today = dayjs().format(DATE_KEY_FORMAT)

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        Person Calendar
      </Typography>

      <Autocomplete
        sx={{ maxWidth: 320 }}
        options={people}
        getOptionLabel={(person) => person.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        // `?? null` (rather than leaving this `undefined` before people have loaded) keeps the
        // component controlled from the very first render — Autocomplete decides
        // controlled-vs-uncontrolled once, based on whether `value` starts out `undefined`, and
        // warns if that ever changes.
        value={selectedPerson ?? null}
        onChange={(_event, selected) => handlePersonChange(selected)}
        autoHighlight
        renderInput={(params) => <TextField {...params} label="Person" />}
      />

      {loading && !showSpinner && <LinearProgress />}

      {!dismissedError && (
        <ErrorBanner messages={bannerMessages} onDismiss={() => setDismissedError(true)} />
      )}

      {showSpinner ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : people.length === 0 ? (
        !peopleError && <Typography color="text.secondary">No people exist yet.</Typography>
      ) : (
        <Paper sx={{ p: 2, overflowX: 'auto' }}>
          <Box sx={{ minWidth: 700 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${WORK_DAYS_PER_WEEK}, 1fr)`,
                gap: 1,
                mb: 1,
              }}
            >
              {WORK_DAY_NAMES.map((dayName) => (
                <Typography
                  key={dayName}
                  variant="subtitle2"
                  align="center"
                  sx={{ fontWeight: 700 }}
                >
                  {dayName}
                </Typography>
              ))}
            </Box>

            <Stack spacing={1}>
              {weeks.map((week) => (
                <Box
                  key={week[0].format(DATE_KEY_FORMAT)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${WORK_DAYS_PER_WEEK}, 1fr)`,
                    gap: 1,
                  }}
                >
                  {week.map((date) => {
                    const dateKey = date.format(DATE_KEY_FORMAT)
                    const dayBookings = bookingsByDate.get(dateKey) ?? []
                    return (
                      <Paper
                        key={dateKey}
                        variant="outlined"
                        sx={{
                          p: 1,
                          minHeight: 110,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                          bgcolor: dateKey === today ? 'action.selected' : undefined,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {date.format('D MMM')}
                        </Typography>
                        {dayBookings.map((booking) => (
                          <ButtonBase
                            key={booking.id}
                            component={Link}
                            to={`/bookings/${booking.id}`}
                            focusRipple
                            sx={{
                              display: 'block',
                              width: '100%',
                              textAlign: 'left',
                              borderRadius: 1,
                              px: 0.5,
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                              {formatLocalTime(booking.startTime)}–{formatLocalTime(booking.endTime)}{' '}
                              {booking.subject} – {booking.room.name}
                            </Typography>
                          </ButtonBase>
                        ))}
                      </Paper>
                    )
                  })}
                </Box>
              ))}
            </Stack>
          </Box>
        </Paper>
      )}
    </Stack>
  )
}
