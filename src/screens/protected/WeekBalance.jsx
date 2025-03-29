import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { Sizes } from "../../utils/theme";

const WeekBalance = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						backgroundColor: "#EFEEEE",
						padding: 10,
					}}
				>
					<Text>Last Week</Text>
					<Text>Current Week</Text>
				</View>
				<View style={styles.topCover}>
					<Text style={{ fontSize: 15, marginBottom: 10 }}>Your Balance</Text>
					<Text style={{ fontSize: 20, marginBottom: 10 }}>R0.00</Text>
					<Text style={{ fontSize: 15, marginBottom: 10 }}>
						Next Weekly Payout: 25 April
					</Text>
					<Button
						mode="contained"
						buttonColor="#00BF63"
						textColor="#fff"
						style={{
							width: 150,
							marginVertical: 10,
							paddingHorizontal: 10,
							paddingVertical: 5,
							borderRadius: 50,
						}}
					>
						Cash out
					</Button>
				</View>
				<View style={{ marginTop: 30 }}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: 10,
							padding: 10,
						}}
					>
						<Text>Starting balance</Text>
						<Text>R0.00</Text>
					</View>

					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: 10,
							padding: 10,
						}}
					>
						<Text>Ending balance</Text>
						<Text>R0.00</Text>
					</View>

					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: 10,
							padding: 10,
						}}
					>
						<Text>Clean Task owes you</Text>
						<Text>R0.00</Text>
					</View>
				</View>
			</View>
			<View style={styles.bottomBar}>
				<View style={styles.bar}>
					<TouchableOpacity onPress={() => navigation.navigate("WeekData")}>
						<Text style={styles.footerElem}>Earnings</Text>
					</TouchableOpacity>
					<Text
						style={[
							styles.footerElem,
							{
								borderBottomColor: "#00BF63",
								borderBottomWidth: 5,
							},
						]}
					>
						Balance
					</Text>
				</View>
			</View>
		</View>
	);
};

export default WeekBalance;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "space-between",
	},
	main: {
		width: Sizes.width - 20,
		height: Sizes.height * 0.76,
	},
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	bottomBar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff",
		width: Sizes.width,
		height: Sizes.height * 0.1,
	},
	bar: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		width: Sizes.width,
		height: 50,
	},
	footerElem: {
		fontStyle: "normal",
		fontWeight: "400",
		fontSize: 20,
		lineHeight: 20,
		letterSpacing: -0.24,
		color: "#000000",
		paddingBottom: 10,
	},
	topCover: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 20,
	},
});
