import styles from "./Header.module.css";
import { NavLink } from "react-router-dom";
import { useGoogleLogin, hasGrantedAllScopesGoogle } from "@react-oauth/google";
import Button from "../UI/Button";
import UserContext from "../../../store/userContext";
import { useContext } from "react";

function Header() {
	const userCtx = useContext(UserContext);
	console.log(userCtx);

	const login = useGoogleLogin({
		onSuccess: async (codeResponse) => {
			const response = await fetch("http://localhost:5000/login", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify(codeResponse),
			});
			// tokens obtained from logging in
			const tokens = await response.json();
			console.log(tokens);
			const userInfo = await fetch(
				"https://www.googleapis.com/oauth2/v3/userinfo",
				{
					headers: { Authorization: `Bearer ${tokens.access_token}` },
				}
			);
			// google account user info
			const info = await userInfo.json();
			// set user to logged in along with storing name and picture, move to database soon :)
			userCtx.login(info.name, info.picture, info.sub);
			console.log(info);
		},
		flow: "auth-code",
	});

	// const hasAccess = hasGrantedAllScopesGoogle(
	// 	tokenResponse,
	// 	"google-scope-1",
	// 	"google-scope-2"
	// );

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
					/>
				)}
			</div>
		</div>
	);
}

export default Header;
