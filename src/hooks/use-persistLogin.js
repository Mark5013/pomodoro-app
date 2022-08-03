import { useCallback, useContext } from "react";
import UserContext from "../store/userContext";
import SettingsContext from "../store/settingsContext";
import useHttpRequest from "./use-HttpRequest";

function usePersistLogin() {
	const userCtx = useContext(UserContext);
	const settingsCtx = useContext(SettingsContext);
	const sendRequest = useHttpRequest();

	const persistLogin = useCallback(async () => {
		// get users token
		const token = await sendRequest(
			"http://localhost:5000/login/refreshToken",
			"POST",
			{ "Content-type": "application/json" },
			null,
			"include"
		);

		if (!token) {
			return;
		}

		// get the users info by using the access token
		const userInfo = await sendRequest(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			"GET",
			{ Authorization: `Bearer ${token.accessToken}` }
		);

		if (!userInfo) {
			return;
		}

		// find or create google account, will return users settings
		const user = await sendRequest(
			"http://localhost:5000/login/findOrCreate",
			"POST",
			{ "Content-type": "application/json" },
			JSON.stringify({
				name: userInfo.name,
				id: userInfo.sub,
			})
		);

		// set user to logged in along with settings users name, picture, id, and settings
		if (user) {
			userCtx.login(userInfo.name, userInfo.picture, userInfo.sub);
			settingsCtx.changePomodoroLength(user.settings.pomodoroLength);
			settingsCtx.changeLongBreakLength(user.settings.longBreakLength);
			settingsCtx.changeShortBreakLength(user.settings.shortBreakLength);
		}
	}, [userCtx, settingsCtx, sendRequest]);

	return { persistLogin };
}

export default usePersistLogin;
