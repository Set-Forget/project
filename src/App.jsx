import {
  Route,
  Routes,
  HashRouter
} from "react-router-dom";
import View from "./components/View";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<View />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
