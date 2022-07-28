import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorPage from "./components/ErrorPage/ErrorPage";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { ModeContextProvider } from "./store/modeContext";
import StatsPage from "./components/StatsPage/StatsPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					element={
						<ModeContextProvider>
							<MainPage />
						</ModeContextProvider>
					}
				/>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/stats" element={<StatsPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
