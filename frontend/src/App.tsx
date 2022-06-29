import React, {useEffect} from 'react';
import './App.css';
import {Router} from "./components/pages/Router";
import PlotContextContainer from "./contexts/PlotContext";
import {updateColorTheme} from "./helpers/themeHelper";

function App() {
    useEffect(() => {
        updateColorTheme();
    }, []);
  return (
    <div className="App">
      <PlotContextContainer>
        <Router />
      </PlotContextContainer>
    </div>
  );
}

export default App;
