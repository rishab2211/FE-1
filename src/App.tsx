import { BrowserRouter, Route, Routes } from "react-router-dom";
import LargeFiles from "./components/large-file";
import Students from "./components/students";
import HomePage from "./components/home";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/students" element={<Students />} />
          <Route path="/files" element={<LargeFiles />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
