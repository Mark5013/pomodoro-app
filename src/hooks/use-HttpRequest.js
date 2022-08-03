import { useCallback } from "react";

function useHttpRequest() {
	const sendRequest = useCallback(
		async (
			url,
			method = "GET",
			headers = {},
			body = null,
			credentials = "omit"
		) => {
			try {
				const response = await fetch(`${url}`, {
					method,
					credentials,
					headers,
					body,
				});

				const responseData = await response.json();

				if (!response.ok) {
					throw new Error("Something went wrong, try again later");
				}
				return responseData;
			} catch (err) {}
		},
		[]
	);

	return sendRequest;
}

export default useHttpRequest;
