import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Page1 from './page/Page1'
import Page2 from './page/Page2'
import FlowChart from './page/FlowChart'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Page1 />} />
          <Route path="/2" element={<Page2 />} />
          <Route path="/3" element={<FlowChart />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

