import { Route, Routes, HashRouter } from "react-router-dom";
// import View from "./components/View";
import MainView from "./components/View";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchData } from "../redux/slice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<MainView />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
