import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './pages/Navbar';
import GeneSearch from './pages/GeneSearch';
import DiseaseSearch from './pages/DiseaseSearch';
import AdminPanel from './pages/AdminPanel';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        
        {/* Main Content Area */}
        <main>
          <Routes>
            <Route path="/" element={<GeneSearch />} />
            <Route path="/diseases" element={<DiseaseSearch />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 