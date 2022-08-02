import styles from "./SubStatSection.module.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function SubStatSection(props) {
	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardMedia
				component="img"
				height="140"
				image="https://m.media-amazon.com/images/I/71S7kLF9iLL._SS500_.jpg"
				alt="green iguana"
			/>
			<CardContent>
				<Typography
					gutterBottom
					variant="h5"
					component="div"
					fontFamily="inherit">
					{props.title}
				</Typography>
				<Typography
					variant="body2"
					color="text.secondary"
					fontFamily="inherit">
					{props.body} minutes
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Share</Button>
				<Button size="small">Learn More</Button>
			</CardActions>
		</Card>
	);
}

export default SubStatSection;
