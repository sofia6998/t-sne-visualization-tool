import React from 'react';
import './App.css';
import {Router} from "./components/pages/Router";
import PlotContextContainer from "./contexts/PlotContext";

function App() {
  return (
    <div className="App">
      <PlotContextContainer>
        <Router />
      </PlotContextContainer>
    </div>
  );
}

export default App;
