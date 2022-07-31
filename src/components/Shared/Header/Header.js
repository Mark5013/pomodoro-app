import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../UI/Button";
import UserContext from "../../../store/userContext";
import { useContext, useEffect } from "react";

function Header() {
	const userCtx = useContext(UserContext);

	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			let tokenResponse;
			let accessToken;
			try {
				tokenResponse = await fetch("http://localhost:5000/login", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-type": "application/json",
					},
					body: JSON.stringify(codeResponse),
				});
				// tokens obtained from google api
				accessToken = await tokenResponse.json();
			} catch (err) {
				console.log(err);
			}

			// fetch users info from google acc
			let userInfoResponse;
			let userInfo;
			try {
				userInfoResponse = await fetch(
					"https://www.googleapis.com/oauth2/v3/userinfo",
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					}
				);

				// google account user info
				userInfo = await userInfoResponse.json();
			} catch (err) {
				console.log(err);
			}

			// find or create google account
			let userResponse;
			let user;
			try {
				userResponse = await fetch(
					"http://localhost:5000/login/findOrCreate",
					{
						method: "POST",
						credentials: "include",
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
			console.log(user);
			// set user to logged in along with storing name and picture, move to database soon :)
			if (user) {
				userCtx.login(userInfo.name, userInfo.picture, userInfo.sub);
			} else {
				console.log(user);
			}
		},
		flow: "auth-code",
	});

	useEffect(() => {
		async function persistLogin() {
			const response = await fetch(
				"http://localhost:5000/login/refreshToken",
				{
					credentials: "include",
				}
			);

			const token = await response.json();

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

			// find or create google account
			let userResponse;
			let user;
			try {
				userResponse = await fetch(
					"http://localhost:5000/login/findOrCreate",
					{
						method: "POST",
						credentials: "include",
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
			console.log(user);
			// set user to logged in along with storing name and picture, move to database soon :)
			if (user) {
				userCtx.login(userInfo.name, userInfo.picture, userInfo.sub);
			} else {
				console.log(user);
			}
		}

		persistLogin();
	}, []);

	return (
		<div className={`${styles.header}`}>
			<h1 className={styles.title}>Pomodoro Timer</h1>
			<div className={styles.navButtons}>
				<NavLink to="stats" className={styles.navButton}>
					Stats
				</NavLink>
				{!userCtx.user.isLoggedIn && (
					<Button
						onClick={() => login()}
						text="Login"
						type="button"
						class="navButton"
					/>
				)}
				{userCtx.user.isLoggedIn && (
					<img
						className={styles.userPic}
						src={`${userCtx.user.picture}`}
						alt="user profile pic"
					/>
				)}
			</div>
		</div>
	);
}

export default Header;
