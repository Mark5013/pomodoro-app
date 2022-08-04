import styles from "./HowItWorks.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function HowItWorks() {
	return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header">
				<Typography fontSize={20}>How It Works</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<div className={styles.infoCategories}>
					<h3>Tasks</h3>
					<ul className={styles.infoSection}>
						<li>You're able to create 10 tasks at once</li>
						<li>
							You're able to delete, add, and edit any task you
							want and the tasks themselves are also draggable
						</li>
						<li>
							Task titles are required, but the description is
							optional
						</li>
					</ul>
				</div>
				<div className={styles.infoCategories}>
					<h3>Timer</h3>
					<ul className={styles.infoSection}>
						<li>
							Default timer lengths are 25 minutes for Pomodoro
							mode, 5 minutes for a short break, and 15 minutes
							for a long break
						</li>
						<li>
							After completing a pomodoro, short break, or long
							break session, the browser will play a sound to let
							you know the session has ended
						</li>
						<li>
							After a pomodoro session, a short break session will
							follow. After 4 pomodoro sessions, a long break
							session will follow. Refreshing or leaving the page
							will reset the count
						</li>
						<li>
							You can start/pause the timer at your convenience
							and switch between modes anytime you want
						</li>
					</ul>
					<p></p>
				</div>
				<div className={styles.infoCategories}>
					<h3>Logging in with Google</h3>
					<ul className={styles.infoSection}>
						<li>
							There are a couple of advantages to logging in with
							your google account
						</li>
						<li>
							Firstly, your time spent in pomodoro mode will be
							tracked and you will be able to view how long you
							have spent in pomodoro for the current
							week/month/year or anytime you want
						</li>
						<li>
							If the webpage is exited during a session, the time
							will not be counted. But if you switch to a break in
							the middle of a pomodoro session the time will still
							be counted
						</li>
						<li>
							Logging in with an account will also allow you to
							configure the timer setting, so you can
							increment/decrement any timer by 5 minute intervals
							in the range of 0-60 minutes.
						</li>
						<li>
							Your google profile picture will also be shown at
							the top of the page which is pretty cool I guess
						</li>
						<li>
							More features may come in the future such as
							configuring the sound for the timer alert and other
							things
						</li>
						<li>
							No sensitive information from your google account is
							obtained.
						</li>
					</ul>
				</div>
			</AccordionDetails>
		</Accordion>
	);
}

export default HowItWorks;
