import { BrowserRouter, Routes, Route } from "react-router-dom";

import ErrorPage from "./components/ErrorPage/ErrorPage";
import MainPage from "./components/MainPage/MainPage";
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
				<Route path="/stats" element={<StatsPage />} />
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
