import { BrowserRouter, Route, Routes } from "react-router-dom";
import LargeFiles from "./components/large-file";
import Students from "./components/students";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/students" element={<Students />} />
          <Route path="/files" element={<LargeFiles />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
