import './App.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes } from 'react-router-dom';
import Register from './Components/Registration';
import { Login } from './Components/Login';
import { HomePage } from './Components/Home';
import { AdminHome } from './Components/AdminHome';
import { EventList } from './Components/ListofEvents';
import { BookedTickets } from './Components/BookedTickets';
import { BookEvent } from './Components/Booking';
import { CreateEvent } from './Components/CreateEvent';
import { AdminEventList } from './Components/AdminEventsList';
import { ModifyEvent } from './Components/ModifyEvent';
import { ProtectedRoute } from './Components/RoutesProtector';
import { UpdateProfile } from './Components/UpdateProfile';
import { LandingPage } from './Components/HomePage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />  
        <Route path="/registerform" element={<Register />} />
        <Route path="/book" element={<EventList />} />
        <Route path="/login" element={<Login />} />   

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/addevent" element={<CreateEvent />} />
          <Route path="/eventlist" element={<AdminEventList />} />
          <Route path="/modifyevent/:eventId" element={<ModifyEvent />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={"user"} />}>
          <Route path="/book" element={<EventList />} />
          <Route path="/book-event/:eventId" element={<BookEvent />} />
          <Route path="/booked-tickets" element={<BookedTickets />} />
          <Route path="/home" element={<HomePage />} />
          
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin","user"]} />}>
          <Route path="/update" element={<UpdateProfile />} />
      </Route>

      </Routes>

      
    </div>
  );
}

export default App;
