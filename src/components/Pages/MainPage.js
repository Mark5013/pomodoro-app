import Header from "../Header/Header";
import TimerCard from "../UI/TimerCard";

function MainPage() {
	return (
		<>
			<Header />
			<TimerCard timerRunning={true}>
				<h1>Main Page</h1>
			</TimerCard>
		</>
	);
}

export default MainPage;
