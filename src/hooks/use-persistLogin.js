import { useCallback, useContext } from "react";
import UserContext from "../store/userContext";
import SettingsContext from "../store/settingsContext";
import useHttpRequest from "./use-HttpRequest";
import { useNavigate } from "react-router-dom";

function usePersistLogin() {
	const userCtx = useContext(UserContext);
	const settingsCtx = useContext(SettingsContext);
	const sendRequest = useHttpRequest();
	const navigate = useNavigate();

	const persistLogin = useCallback(async () => {
		// get users token
		const token = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/login/refreshToken`,
			"POST",
			{ "Content-type": "application/json" },
			null,
			"include"
		);

		if (!token) {
			navigate("/", { replace: true });
			return;
		}

		// get the users info by using the access token
		const userInfo = await sendRequest(
			"https://www.googleapis.com/oauth2/v3/userinfo",
			"GET",
			{ Authorization: `Bearer ${token.accessToken}` }
		);

		if (!userInfo) {
			navigate("/", { replace: true });
			return;
		}

		// find or create google account, will return users settings
		const user = await sendRequest(
			`${process.env.REACT_APP_BACKEND_URL}/login/findOrCreate`,
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
		} else {
			navigate("/", { replace: true });
		}
	}, [userCtx, settingsCtx, sendRequest, navigate]);

	return { persistLogin };
}

export default usePersistLogin;
