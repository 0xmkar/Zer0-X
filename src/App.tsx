import Home from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Airdrops from "./pages/Airdrops";

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<Home />} />
          <Route path="airdrops" element={<Airdrops />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
