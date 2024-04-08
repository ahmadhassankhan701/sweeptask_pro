import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import { Divider } from "react-native-paper";
import { Sizes } from "../../utils/theme";

const WeekData = ({ navigation }) => {
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
				<View style={{ marginVertical: 10 }}>
					<LineChart
						data={{
							labels: [
								"Mon",
								"Tue",
								"Wed",
								"Thu",
								"Fri",
								"Sat",
								"Sun",
							],
							datasets: [
								{
									data: [
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
										Math.random() * 100,
									],
								},
							],
						}}
						// data={{
						// 	datasets: [
						// 		{
						// 			data: chartData,
						// 		},
						// 	],
						// }}
						width={Sizes.width - 20}
						height={170}
						yAxisInterval={1} // optional, defaults to 1
						chartConfig={{
							backgroundColor: "#8FCCC0",
							backgroundGradientFrom: "#8FCCC0",
							backgroundGradientTo: "#8FCCC0",
							decimalPlaces: 0, // optional, defaults to 2dp
							color: (opacity = 1) =>
								`rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) =>
								`rgba(255, 255, 255, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForDots: {
								r: "6",
								strokeWidth: "2",
								stroke: "#ffa726",
							},
						}}
						bezier
						style={{
							borderRadius: 16,
						}}
					/>
				</View>
				<View style={{ marginTop: 30 }}>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: 20,
							padding: 10,
						}}
					>
						<Text>Earnings</Text>
						<Text>R0.00</Text>
					</View>
					<Divider
						style={{
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
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
						<Text>Expenses</Text>
						<Text>R0.00</Text>
					</View>
					<Divider
						style={{
							backgroundColor: "#B7B7B7",
							borderWidth: 0.3,
							borderColor: "#B7B7B7",
						}}
					/>
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
						<Text>Net Earnings</Text>
						<Text>R0.00</Text>
					</View>
				</View>
			</View>
			<View style={styles.bottomBar}>
				<View style={styles.bar}>
					<Text
						style={[
							styles.footerElem,
							{
								borderBottomColor: "#00BF63",
								borderBottomWidth: 5,
							},
						]}
					>
						Earnings
					</Text>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("WeekBalance")
						}
					>
						<Text style={styles.footerElem}>Balance</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default WeekData;

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
});
