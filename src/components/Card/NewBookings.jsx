import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Avatar, Button, IconButton } from "react-native-paper";
import { Sizes } from "../../utils/theme";
import moment from "moment";
import Confirm from "../Modal/Confirm";
import { useNavigation } from "@react-navigation/native";
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
	"Jan",
	"Feb",
	"March",
	"April",
	"May",
	"June",
	"July",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];
const NewBookings = ({
	booking,
	handleAccept,
	handleWithdraw,
	handleReject,
	handleBookingCancel,
	handleDelayAccept,
	handleBookingDone,
	handleDelayReject,
}) => {
	const navigation = useNavigation();
	const [cancelVisible, setCancelVisible] = useState(false);
	const [doneVisible, setDoneVisible] = useState(false);
	const handleCancel = async () => {
		setCancelVisible(false);
		handleBookingCancel(
			booking.key,
			booking.selectedPro.proId,
			booking.push_token,
			booking.payData.discountedAmount,
			booking.payData.choice,
			booking.payData.commission
		);
	};
	const handleDone = async () => {
		setDoneVisible(false);
		handleBookingDone(
			booking.key,
			booking.push_token,
			booking.payData.choice,
			booking.selectedPro.proId,
			booking.payData.discountedAmount,
			booking.payData.commission
		);
	};
	let newDispDate = "";
	if (booking.delayDate) {
		let newDate = moment(booking.delayDate.seconds * 1000).format(
			"dd , DD MMMM YYYY"
		);
		newDispDate = newDate;
	}
	let today = new Date(booking.date);
	let date =
		days[today.getDay()] +
		" , " +
		today.getDate() +
		" " +
		months[parseInt(today.getMonth())] +
		" " +
		today.getFullYear();
	return (
		<View style={styles.cardsCover}>
			<Confirm
				visible={cancelVisible}
				setVisible={setCancelVisible}
				title={"Are you sure?"}
				subtitle={
					"If you cancel. You will be penalized with 10% deduction from your payment"
				}
				icon={"alert"}
				handleAction={handleCancel}
			/>
			<Confirm
				visible={doneVisible}
				setVisible={setDoneVisible}
				title={"Are you sure?"}
				subtitle={
					booking.payData && booking.payData.choice === "cash"
						? "Cash Booking! Make sure to receive amount before confirmation"
						: "This means completion of booking"
				}
				icon={"alert"}
				handleAction={handleDone}
			/>
			<View style={styles.card}>
				<View style={styles.cardTop}>
					<View style={styles.cardTopLeft}>
						<View style={styles.cardTopIcon}>
							<IconButton icon={"ticket"} />
							<Text>Booking Detail</Text>
						</View>
						<View style={{ marginLeft: 15 }}>
							<Text style={{ width: 200 }}>{booking.location.address}</Text>
							<Text>
								{booking.details.bedrooms}Bedroom, {booking.details.bathrooms}{" "}
								Bathroom
							</Text>
							{booking.extras && booking.extras.length > 0 && (
								<Text>
									Extras:{" "}
									{booking.extras.map((extra, i) => (
										<Text key={i}>{extra + " "}</Text>
									))}
								</Text>
							)}
							<Text>{date}</Text>
							{newDispDate !== "" && <Text>Delay Date: {newDispDate}</Text>}
						</View>
					</View>
					<View style={styles.cardTopRight}>
						<Avatar.Icon icon={"account"} size={50} />
						<Text
							style={{
								textAlign: "center",
							}}
						>
							Cost: R{booking.cost}
						</Text>
						<Text
							style={{
								textAlign: "center",
							}}
						>
							{booking.status}
						</Text>
					</View>
				</View>
				{booking.status == "assigned" ? (
					<View>
						<View style={styles.cardBottom}>
							<Button
								mode="contained"
								buttonColor="green"
								style={styles.actionBtn}
								onPress={() => handleAccept(booking.key, booking.push_token)}
							>
								Accept
							</Button>
							<Button
								mode="contained"
								buttonColor="red"
								style={styles.actionBtn}
								onPress={() => handleReject(booking.key, booking.push_token)}
							>
								Reject
							</Button>
						</View>
					</View>
				) : booking.status == "accepted" ? (
					<View style={{ marginLeft: 10 }}>
						<Button
							mode="contained"
							buttonColor="red"
							style={styles.actionBtn}
							onPress={() => handleWithdraw(booking.key, booking.push_token)}
						>
							Withdraw
						</Button>
					</View>
				) : (
					booking.status == "delayed" && (
						<View
							style={{
								marginLeft: 15,
								display: "flex",
								flexDirection: "row",
								gap: 5,
							}}
						>
							<Button
								mode="contained"
								buttonColor="green"
								style={styles.actionBtn}
								onPress={() =>
									handleDelayAccept(booking.key, booking.push_token)
								}
							>
								Accept
							</Button>
							<Button
								mode="contained"
								buttonColor="red"
								style={styles.actionBtn}
								onPress={() =>
									handleDelayReject(booking.key, booking.push_token)
								}
							>
								Deny
							</Button>
						</View>
					)
				)}
				{booking.status == "confirmed" && (
					<View style={{ marginLeft: 10 }}>
						<Button
							mode="contained"
							buttonColor="red"
							style={styles.actionBtn}
							onPress={() => setCancelVisible(true)}
						>
							Cancel
						</Button>
					</View>
				)}
				{booking.status === "pending" && (
					<View
						style={{
							margin: 10,
							display: "flex",
							flexDirection: "row",
							gap: 5,
						}}
					>
						<Button
							mode="text"
							icon={"check-circle"}
							buttonColor="white"
							textColor="green"
							onPress={() => {}}
						>
							Customer confirmed
						</Button>
						<Button
							mode="contained"
							icon={"check-circle"}
							buttonColor="green"
							textColor="white"
							style={{
								borderRadius: 5,
							}}
							onPress={() => setDoneVisible(true)}
						>
							Done
						</Button>
					</View>
				)}
				{booking.status != "requested" &&
					booking.status != "assigned" &&
					booking.status != "accepted" && (
						<View
							style={{
								marginLeft: 10,
								display: "flex",
								flexDirection: "row",
								gap: 5,
							}}
						>
							<IconButton
								icon={"chat"}
								onPress={() =>
									navigation.navigate("Chat", {
										custName: booking.customerName,
										custToken: booking.push_token,
										custId: booking.uid,
									})
								}
							/>
						</View>
					)}
			</View>
		</View>
	);
};

export default NewBookings;

const styles = StyleSheet.create({
	title: {
		fontFamily: "Inter-SemiBold",
		fontStyle: "normal",
		fontSize: 20,
		lineHeight: 24,
		color: "#000000",
		marginVertical: 30,
	},
	subtitle: {
		fontFamily: "Inter-Regular",
		fontStyle: "normal",
		fontSize: 16,
		lineHeight: 19,
		color: "#000000",
		textAlign: "center",
		marginVertical: 5,
		borderWidth: 1,
		borderColor: "#000000",
		flex: 1,
		padding: 10,
	},
	wrapper: {
		width: Sizes.width - 50,
		alignSelf: "center",
	},
	subtitleText: {
		fontFamily: "Inter-Regular",
		fontStyle: "normal",
		fontSize: 16,
		lineHeight: 19,
		textAlign: "center",
	},
	cardsCover: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
		width: Sizes.width,
		marginVertical: 5,
	},
	card: {
		width: "100%",
		backgroundColor: "#ffffff",
		paddingHorizontal: 10,
		paddingVertical: 10,
		display: "flex",
		flexDirection: "column",
	},
	cardTopIcon: {
		display: "flex",
		alignItems: "center",
		flexDirection: "row",
	},
	cardTop: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		flexDirection: "row",
		marginBottom: 20,
	},
	cardBottom: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-around",
		flexDirection: "row",
	},
	cardTopRight: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		gap: 10,
		height: 110,
		marginRight: 20,
	},
	actionBtn: {
		borderRadius: 10,
		height: 40,
		width: 156,
	},
});
