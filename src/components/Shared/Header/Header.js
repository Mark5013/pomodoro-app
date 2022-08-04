import styles from "./Header.module.css";
import { useGoogleLogin } from "@react-oauth/google";
import UserContext from "../../../store/userContext";
import { useContext, useEffect, useState } from "react";
import usePersistLogin from "../../../hooks/use-persistLogin";
import ErrorModal from "../UI/ErrorModal";
import ProfileMenu from "../UI/ProfileMenu";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import SettingsContext from "../../../store/settingsContext";
import useHttpRequest from "../../../hooks/use-HttpRequest";

function Header() {
	const navigate = useNavigate();
	const userCtx = useContext(UserContext);
	const settingsCtx = useContext(SettingsContext);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const { persistLogin } = usePersistLogin();
	const sendRequest = useHttpRequest();

	function toggleErrorModal() {
		setShowErrorModal((prev) => !prev);
	}

	// logs user out
	const logout = async () => {
		// log user out
		const response = await sendRequest(
			"http://localhost:5000/logout",
			"POST",
			{ "Content-type": "application/json" },
			null,
			"include"
		);

		// if successfull redirect and clear userCtx
		if (response) {
			userCtx.logout();
			navigate("/", { replace: true });
		}
	};

	// logs user in
	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			// get access token
			const accessToken = await sendRequest(
				"http://localhost:5000/login",
				"POST",
				{ "Content-type": "application/json" },
				JSON.stringify(codeResponse),
				"include"
			);

			// if no access t oken toggle the error modal
			if (!accessToken) {
				//show error modal
				toggleErrorModal();
				return;
			}

			// fetch users info from google acc
			const userInfo = await sendRequest(
				"https://www.googleapis.com/oauth2/v3/userinfo",
				"GET",
				{ Authorization: `Bearer ${accessToken}` }
			);

			// find or create google account, acc will be returned
			const user = await sendRequest(
				"http://localhost:5000/login/findOrCreate",
				"POST",
				{ "Content-type": "application/json" },
				JSON.stringify({
					name: userInfo.name,
					id: userInfo.sub,
				})
			);

			// set user to logged in along with storing name and picture, also set users settings
			if (user) {
				userCtx.login(userInfo.name, userInfo.picture, userInfo.sub);
				settingsCtx.changePomodoroLength(user.settings.pomodoroLength);
				settingsCtx.changeLongBreakLength(
					user.settings.longBreakLength
				);
				settingsCtx.changeShortBreakLength(
					user.settings.shortBreakLength
				);
			} else {
				toggleErrorModal();
			}
		},
		flow: "auth-code",
	});

	// persists user login across refreshes
	useEffect(() => {
		if (!userCtx.user.isLoggedIn) {
			persistLogin();
		}
	}, [userCtx.user.isLoggedIn, persistLogin]);

	return (
		<>
			{showErrorModal && (
				<ErrorModal
					closeErrorModal={toggleErrorModal}
					errorText="Failed logging in, try again later!"
				/>
			)}
			<div className={`${styles.header}`}>
				<Link to="/" className={styles.title}>
					<h1 className={styles.title}>PomoTracker</h1>
				</Link>
				<div className={styles.navButtons}>
					{!userCtx.user.isLoggedIn && (
						<Button
							onClick={login}
							variant="contained"
							color="inherit"
							size="large"
							sx={{
								textTransform: "capitalize",
								fontFamily: "inherit",
							}}>
							Log in
						</Button>
					)}
					{userCtx.user.isLoggedIn && (
						<ProfileMenu
							src={`${userCtx.user.picture}`}
							logout={logout}
						/>
					)}
				</div>
			</div>
		</>
	);
}

export default Header;
