import { useState, createContext } from "react";

const UserContext = createContext({
	name: "",
	picture: "",
	refreshToken: "",
	isLoggedIn: false,
	login: (name, picture, refreshToken) => {},
	logout: () => {},
});

export const UserContextProvider = (props) => {
	const [user, setUser] = useState({
		name: "",
		picture: "",
		userId: "",
		isLoggedIn: false,
	});

	function login(name, picture, userId) {
		setUser({
			name,
			picture,
			userId,
			isLoggedIn: true,
		});
	}

	function logout() {
		setUser({
			name: "",
			picture: "",
			userId: "",
			isLoggedIn: false,
		});
	}

	const UserContextValue = {
		user,
		login,
		logout,
	};

	return (
		<UserContext.Provider value={UserContextValue}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
