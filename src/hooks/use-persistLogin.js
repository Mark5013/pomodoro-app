import { useCallback, useContext } from "react";
import UserContext from "../store/userContext";
import SettingsContext from "../store/settingsContext";

function usePersistLogin() {
	const userCtx = useContext(UserContext);
	const settingsCtx = useContext(SettingsContext);

	const persistLogin = useCallback(async () => {
		let response;
		let token;
		// get new access token by using the refresh token
		try {
			response = await fetch("http://localhost:5000/login/refreshToken", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-type": "application/json",
				},
			});

			if (response.ok) {
				token = await response.json();
			}
		} catch (err) {
			console.log(err);
		}

		if (!token) {
			return;
		}

		// get the users info by using the access token
		let userInfoResponse;
		let userInfo;
		try {
			userInfoResponse = await fetch(
				"https://www.googleapis.com/oauth2/v3/userinfo",
				{
					headers: {
						Authorization: `Bearer ${token.accessToken}`,
					},
				}
			);

			// google account user info
			userInfo = await userInfoResponse.json();
		} catch (err) {
			console.log(err);
		}

		if (!userInfo) {
			return;
		}

		// find or create google account
		let userResponse;
		let user;
		try {
			userResponse = await fetch(
				"http://localhost:5000/login/findOrCreate",
				{
					method: "POST",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify({
						name: userInfo.name,
						id: userInfo.sub,
					}),
				}
			);
			// user created or found from data base
			user = await userResponse.json();
		} catch (err) {
			console.log(err);
		}
		// set user to logged in along with storing name and picture, move to database soon :)
		if (user) {
			userCtx.login(userInfo.name, userInfo.picture, userInfo.sub);
			settingsCtx.changePomodoroLength(user.settings.pomodoroLength);
			settingsCtx.changeLongBreakLength(user.settings.longBreakLength);
			settingsCtx.changeShortBreakLength(user.settings.shortBreakLength);
		} else {
			console.log(user);
		}
	}, [userCtx, settingsCtx]);

	return { persistLogin };
}

export default usePersistLogin;
