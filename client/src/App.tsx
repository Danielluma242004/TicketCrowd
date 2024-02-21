import { Navigation } from "./components/Navigation";
import { EventsPage } from "./pages/EventsPage";
import { AuthProvider } from "./components/UserContext";

function App() {
  return (
    <AuthProvider>
      <div>
        <Navigation />
        <EventsPage />
      </div>
    </AuthProvider>
  );
}

export default App;
