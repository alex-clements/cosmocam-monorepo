import "./App.css";
import { ApplicationRoutes } from "./components/Routes/ApplicationRoutes";
import { Providers } from "./components/Context/Providers";

function App() {
  return (
    <div className="App">
      <Providers>
        <ApplicationRoutes />
      </Providers>
    </div>
  );
}

export default App;
