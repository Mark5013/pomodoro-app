import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorPage from "./components/Pages/ErrorPage";
import LoginPage from "./components/Pages/LoginPage";
import MainPage from "./components/Pages/MainPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
