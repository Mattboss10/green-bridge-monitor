import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import BridgeStats from './components/BridgeStats';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<BridgeStats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;