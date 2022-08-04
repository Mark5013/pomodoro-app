import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import MainPage from "./components/MainPage/MainPage";
import { ModeContextProvider } from "./store/modeContext";
import { CircularProgress } from "@mui/material";
import React from "react";
import { HashRouter } from "react-router-dom";
// import StatsPage from "./components/StatsPage/StatsPage";
// import SettingsPage from "./components/SettingsPage/SettingsPage";

const StatsPage = React.lazy(() => import("./components/StatsPage/StatsPage"));
const SettingsPage = React.lazy(() =>
	import("./components/SettingsPage/SettingsPage")
);

function App() {
	return (
		<HashRouter>
			<Suspense
				fallback={
					<div className="center">
						<CircularProgress />
					</div>
				}>
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
					<Route path="/settings" element={<SettingsPage />} />
					<Route path="*" element={<ErrorPage />} />
				</Routes>
			</Suspense>
		</HashRouter>
	);
}

export default App;
