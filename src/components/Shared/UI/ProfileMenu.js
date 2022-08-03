import * as React from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import styles from "./ProfileMenu.module.css";
import { NavLink } from "react-router-dom";

export default function ProfileMenu(props) {
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);

	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}

		if (event.nativeEvent) {
			const action = event.nativeEvent.target.outerText;
			if (action === "Logout") {
				props.logout();
			}
		}

		setOpen(false);
	};

	function handleListKeyDown(event) {
		if (event.key === "Tab") {
			event.preventDefault();
			setOpen(false);
		} else if (event.key === "Escape") {
			setOpen(false);
		}
	}

	// return focus to the button when we transitioned from !open -> open
	const prevOpen = React.useRef(open);
	React.useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
	}, [open]);

	return (
		<Stack direction="row" spacing={2}>
			<div>
				<IconButton
					ref={anchorRef}
					id="composition-button"
					aria-controls={open ? "composition-menu" : undefined}
					aria-expanded={open ? "true" : undefined}
					aria-haspopup="true"
					onClick={handleToggle}>
					<img
						src={props.src}
						alt="profile pic"
						className={styles.profilePicture}
						referrerPolicy="no-referrer"
					/>
				</IconButton>
				<Popper
					open={open}
					anchorEl={anchorRef.current}
					role={undefined}
					placement="bottom-start"
					transition
					disablePortal>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							style={{
								transformOrigin:
									placement === "bottom-start"
										? "left top"
										: "left bottom",
							}}>
							<Paper>
								<ClickAwayListener onClickAway={handleClose}>
									<MenuList
										autoFocusItem={open}
										id="composition-menu"
										aria-labelledby="composition-button"
										onKeyDown={handleListKeyDown}>
										<NavLink
											to="/stats"
											className={styles.menuBtn}>
											<MenuItem onClick={handleClose}>
												Profile
											</MenuItem>
										</NavLink>
										<NavLink
											to="/settings"
											className={styles.menuBtn}>
											<MenuItem onClick={handleClose}>
												Settings
											</MenuItem>
										</NavLink>
										<MenuItem onClick={handleClose}>
											Logout
										</MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		</Stack>
	);
}
