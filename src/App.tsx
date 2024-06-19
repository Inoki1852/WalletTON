import React from 'react';
import './App.css';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Camera from './components/Camera/Camera';
import Payment from './components/Payment/Payment';


const App: React.FC = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://telegram-mini-apps-bot.netlify.app/tonconnect-manifest.json">
      <Router>
        <div className="App">
          <header className="App-main">
            <Routes>
              <Route index element={<Home />} />
              <Route path="/camera" element={<Camera />} />
              <Route path="/payment" element={<Payment />}/>
              <Route path="*" element={<h2>Error, Page not found</h2>} />
            </Routes>
          </header>
        </div>
      </Router>
    </TonConnectUIProvider>
  );
};

export default App;
