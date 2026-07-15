import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import FeedbackRoundedIcon from '@mui/icons-material/FeedbackRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import { List, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'
import dayjs from 'dayjs'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext'

const AVAILABILITY_PATH_PATTERN = /^\/rooms\/[^/]+\/availability$/
const CALENDAR_PATH_PATTERN = /^\/persons\/[^/]+\/calendar$/

// Room Booking has no feedback form/backend of its own, so this goes to the project's own issue
// tracker instead - the same URL this project's other READMEs already point to.
const FEEDBACK_URL = 'https://github.com/geoffweatherall/room-booking/issues'

interface MenuContentProps {
  /** Called after navigating via a link in this menu - used to close the mobile flyout. */
  onNavigate?: () => void
}

/**
 * The vertical nav list shared by the desktop sidebar and the mobile flyout: Home, Calendar,
 * Availability, then Sign in/Sign up (signed out) or Sign out (signed in), followed by the
 * secondary About/Feedback items.
 */
export function MenuContent({ onNavigate }: MenuContentProps) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { email, personId, signOut } = useAuth()

  const todayAvailabilityPath = `/rooms/${dayjs().format('YYYY-MM-DD')}/availability`
  const isHomeActive = pathname === '/'
  const isAvailabilityActive = AVAILABILITY_PATH_PATTERN.test(pathname) || pathname === '/rooms/add'
  const isCalendarActive = CALENDAR_PATH_PATTERN.test(pathname)

  function handleSignOut() {
    signOut()
    onNavigate?.()
    navigate('/')
  }

  return (
    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <List dense component="nav">
        <ListItemButton component={Link} to="/" selected={isHomeActive} onClick={onNavigate}>
          <ListItemIcon>
            <HomeRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        {personId ? (
          <ListItemButton
            component={Link}
            to={`/persons/${personId}/calendar`}
            selected={isCalendarActive}
            onClick={onNavigate}
          >
            <ListItemIcon>
              <CalendarMonthRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItemButton>
        ) : (
          <ListItemButton disabled>
            <ListItemIcon>
              <CalendarMonthRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItemButton>
        )}

        <ListItemButton component={Link} to={todayAvailabilityPath} selected={isAvailabilityActive} onClick={onNavigate}>
          <ListItemIcon>
            <EventAvailableRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Availability" />
        </ListItemButton>

        {email ? (
          <ListItemButton onClick={handleSignOut}>
            <ListItemIcon>
              <LogoutRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        ) : (
          <>
            <ListItemButton component={Link} to="/signin" selected={pathname === '/signin'} onClick={onNavigate}>
              <ListItemIcon>
                <LoginRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Sign in" />
            </ListItemButton>
            <ListItemButton component={Link} to="/signup" selected={pathname === '/signup'} onClick={onNavigate}>
              <ListItemIcon>
                <PersonAddRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </ListItemButton>
          </>
        )}
      </List>

      <List dense component="nav">
        <ListItemButton component={Link} to="/about" selected={pathname === '/about'} onClick={onNavigate}>
          <ListItemIcon>
            <InfoRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItemButton>
        <ListItemButton component="a" href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
          <ListItemIcon>
            <FeedbackRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Feedback" />
        </ListItemButton>
      </List>
    </Stack>
  )
}
