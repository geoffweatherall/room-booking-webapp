import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import AddBookingPage from './pages/AddBookingPage'
import AddPersonPage from './pages/AddPersonPage'
import AddRoomPage from './pages/AddRoomPage'
import BookingsPage from './pages/BookingsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import HomePage from './pages/HomePage'
import PersonsPage from './pages/PersonsPage'
import RoomsPage from './pages/RoomsPage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public: only the home page and the auth forms. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Everything else requires a signed-in user. */}
        <Route element={<RequireAuth />}>
          <Route path="/persons" element={<PersonsPage />} />
          <Route path="/persons/add" element={<AddPersonPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/add" element={<AddRoomPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/add" element={<AddBookingPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
