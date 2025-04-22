import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainComponent from './components/MainComponent';
// import AddCustomerForm from './components/AddCustomerForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent />} />
        {/* <Route path="/add-new-customer" element={<AddCustomerForm />} /> */}
      </Routes>
    </Router>
  );
}

export default App;