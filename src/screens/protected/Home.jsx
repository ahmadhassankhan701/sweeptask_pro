import {
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import { IconButton } from "react-native-paper";
import { Sizes } from "../../utils/theme";
import {
	collection,
	doc,
	getCountFromServer,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import * as Location from "expo-location";
import { ScrollView } from "react-native";
import { Image } from "react-native";

const Home = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [mode, setMode] = useState("offline");
	const [finance, setFinance] = useState({
		totalEarned: 0,
		gotPaid: 0,
		totalBookings: 0,
		currentBookings: 0,
	});
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		state && state.user && getFinanceData();
	}, [state && state.user]);
	const getFinanceData = async () => {
		try {
			setLoading(true);
			const coll = collection(db, "Bookings");
			const q = query(coll, where("selectedPro.proId", "==", state.user.uid));
			const q1 = query(
				coll,
				where("selectedPro.proId", "==", state.user.uid),
				where("status", "!=", "done")
			);
			const userWalletRef = doc(db, "Users", state.user.uid);
			onSnapshot(userWalletRef, async (doc) => {
				setLoading(true);
				const snapshotCurrent = await getCountFromServer(q1);
				const snapshot = await getCountFromServer(q);
				if (doc.exists() && doc.data()) {
					const userData = doc.data();
					if (
						userData.active &&
						userData.location.lat &&
						userData.location.lng
					) {
						setMode("online");
					} else {
						setMode("offline");
					}
				}
				if (doc.exists() && doc.data().wallet) {
					const walletData = doc.data().wallet;
					setFinance({
						...finance,
						totalBookings: snapshot.data().count,
						currentBookings: snapshotCurrent.data().count,
						totalEarned: walletData.totalEarned,
						gotPaid: walletData.gotPaid,
					});
				} else {
					setFinance({
						...finance,
						totalBookings: snapshot.data().count,
						currentBookings: snapshotCurrent.data().count,
						totalEarned: 0,
						gotPaid: 0,
					});
				}
				setLoading(false);
			});
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	const handleActive = async (makemode) => {
		let active = false;
		let location = {};
		if (makemode === "online") {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				alert("Please grant location permissions");
				return;
			}
			let loc = await Location.getCurrentPositionAsync({});
			const { latitude, longitude } = loc.coords;
			location = {
				lat: latitude,
				lng: longitude,
			};
			active = true;
		} else {
			location = {
				lat: 0,
				lng: 0,
			};
			active = false;
		}
		const userRef = doc(db, "Users", state.user.uid);
		await updateDoc(userRef, {
			active,
			location,
		});
		setMode(makemode);
	};
	return (
		<View style={styles.container}>
			{loading && (
				<View
					style={{
						position: "absolute",
						backgroundColor: "#000000",
						opacity: 0.7,
						zIndex: 999,
						width: "100%",
						height: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Image
						source={require("../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<View style={[styles.wrapper, { marginTop: 50 }]}>
				{/* <Text>{JSON.stringify(finance, null, 4)}</Text> */}
				<ScrollView>
					{mode === "online" && (
						<TouchableOpacity onPress={() => handleActive("offline")}>
							<View
								style={{
									width: "100%",
									height: 70,
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
									backgroundColor: "#F50808",
									borderRadius: 10,
									marginVertical: 10,
								}}
							>
								<View
									style={{
										width: "10%",
									}}
								>
									<IconButton
										icon={"chevron-double-right"}
										iconColor={"#ffffff"}
									/>
								</View>
								<View
									style={{
										width: "90%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text
										style={{
											color: "#ffffff",
											fontWeight: "700",
											fontSize: 20,
										}}
									>
										Go offline
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					)}
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							gap: 10,
						}}
					>
						<View
							style={{
								backgroundColor: "#ffffff",
								padding: 10,
								height: 140,
								borderRadius: 10,
								flex: 1,
							}}
						>
							<View
								style={{
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>Total Bookings</Text>
								<IconButton icon={"chevron-right"} />
							</View>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 48,
									}}
								>
									{finance.totalBookings}
								</Text>
							</View>
						</View>
						<View
							style={{
								backgroundColor: "#ffffff",
								padding: 10,
								height: 140,
								borderRadius: 10,
								flex: 1,
							}}
						>
							<View
								style={{
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>Current Bookings</Text>
								<IconButton icon={"chevron-right"} />
							</View>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 48,
									}}
								>
									{finance.currentBookings}
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							marginTop: 10,
							backgroundColor: "#ffffff",
							paddingHorizontal: 10,
							height: 121,
							borderRadius: 10,
							width: "100%",
						}}
					>
						<View
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text>Total earnings</Text>
							<IconButton icon={"chevron-right"} />
						</View>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Text
								style={{
									fontWeight: "700",
									fontSize: 48,
								}}
							>
								{`R${finance.totalEarned}.00`}
							</Text>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => navigation.navigate("WeekData")}
						style={{
							backgroundColor: "#ffffff",
							paddingHorizontal: 10,
							height: 121,
							borderRadius: 10,
							marginTop: 10,
							width: "100%",
						}}
					>
						<View>
							<View
								style={{
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<Text>Received earnings</Text>
								<IconButton icon={"chevron-right"} />
							</View>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 48,
									}}
								>
									{`R${finance.gotPaid}.00`}
								</Text>
							</View>
						</View>
					</TouchableOpacity>
					{mode === "offline" && (
						<TouchableOpacity onPress={() => handleActive("online")}>
							<View
								style={{
									width: "100%",
									height: 60,
									marginTop: 30,
									display: "flex",
									alignItems: "center",
									flexDirection: "row",
									backgroundColor: "#00BF63",
									borderRadius: 10,
								}}
							>
								<View
									style={{
										width: "10%",
									}}
								>
									<IconButton
										icon={"chevron-double-right"}
										iconColor={"#ffffff"}
									/>
								</View>
								<View
									style={{
										width: "90%",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<Text
										style={{
											color: "#ffffff",
											fontWeight: "700",
											fontSize: 20,
										}}
									>
										Go online
									</Text>
								</View>
							</View>
						</TouchableOpacity>
					)}
				</ScrollView>
			</View>
			<View style={styles.footer}>
				<Footer />
			</View>
		</View>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	wrapper: {
		flexGrow: 1,
		width: Sizes.width - 20,
	},
	footer: {
		width: Sizes.width,
		marginBottom: Platform.OS === "ios" ? 20 : 0,
	},
});
