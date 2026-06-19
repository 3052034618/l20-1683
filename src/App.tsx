import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Bookshelf from '@/pages/Bookshelf';
import Reader from '@/pages/Reader';
import Records from '@/pages/Records';
import FamilyVerify from '@/pages/FamilyVerify';
import Family from '@/pages/Family';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Bookshelf />} />
        <Route path="/read/:bookId" element={<Reader />} />
        <Route path="/read/:bookId/chapter/:chapterId" element={<Reader />} />
        <Route path="/records" element={<Records />} />
        <Route path="/family/verify" element={<FamilyVerify />} />
        <Route path="/family" element={<Family />} />
      </Routes>
    </Router>
  );
}
