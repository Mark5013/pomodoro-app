import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorPage from "./components/ErrorPage/ErrorPage";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";

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
