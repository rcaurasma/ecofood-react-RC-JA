import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
function AppRouter() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/login2" element={<Home />} />
</Routes>
</BrowserRouter>
);
}
export default AppRouter;