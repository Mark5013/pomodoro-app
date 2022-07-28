import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserContextProvider } from "./store/userContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<GoogleOAuthProvider clientId="335211572347-2538r3ir2c51hh0o6p2kqm97b6jem5vh.apps.googleusercontent.com">
		<UserContextProvider>
			<App />
		</UserContextProvider>
	</GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
