import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Image,
	Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Sizes } from "../../utils/theme";
import Footer from "../../components/Footer";
import {
	arrayUnion,
	collection,
	deleteDoc,
	deleteField,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { sendNotification } from "../../utils/Helpers/NotifyConfig";
import NewBookings from "../../components/Card/NewBookings";
import Toast from "react-native-toast-message";
import DoneBookings from "../../components/Card/DoneBookings";
const Bookings = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [mode, setMode] = useState("upcoming");
	const [bookings, setBookings] = useState([]);
	const [actionLoading, setActionLoading] = useState(false);
	useEffect(() => {
		state && state.user && handleUpcoming();
	}, [state && state.user]);
	const handleHistory = async (name, value) => {
		setActionLoading(true);
		setMode("history");
		const bookRef = query(
			collection(db, "Bookings"),
			where("selectedPro.proId", "==", state.user.uid),
			orderBy("createdAt", "desc")
		);
		onSnapshot(bookRef, (querySnapshot) => {
			if (querySnapshot.size == 0) {
				setActionLoading(false);
				setBookings([]);
				return;
			} else {
				let items = [];
				querySnapshot.docs.map((doc) => {
					if (doc.data().status == "done" || doc.data().status == "cancelled") {
						items.push({
							key: doc.id,
							...doc.data(),
						});
					}
				});
				setBookings(items);
				setActionLoading(false);
			}
		});
	};
	const handleUpcoming = async () => {
		setActionLoading(true);
		setMode("upcoming");
		const bookRef = query(
			collection(db, "Bookings"),
			where("selectedPro.proId", "==", state.user.uid),
			orderBy("createdAt", "desc")
		);
		onSnapshot(bookRef, (querySnapshot) => {
			if (querySnapshot.size == 0) {
				setActionLoading(false);
				setBookings([]);
				return;
			} else {
				let items = [];
				querySnapshot.docs.map((doc) => {
					if (doc.data().status != "done" && doc.data().status != "cancelled") {
						items.push({
							key: doc.id,
							...doc.data(),
						});
					}
				});
				setBookings(items);
				setActionLoading(false);
			}
		});
	};
	const handleCancel = async (docId, pToken) => {
		try {
			const docRef = doc(db, "Bookings", docId);
			await deleteDoc(docRef);
			await sendNotification(
				pToken,
				"Booking Cancelled!",
				"We are sad to inform you that customer has cancelled the booking"
			);
			alert("Booking cancelled");
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleAccept = async (docId, custToken) => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Bookings", docId);
			const request = {
				status: "accepted",
			};
			await updateDoc(docRef, request);
			await sendNotification(
				custToken,
				"Request Accepted",
				"Congrats. Professional accepted the cleaning request!"
			);
			setActionLoading(false);
			Toast.show({
				type: "success",
				text1: "Booking Request Accepted",
				visibilityTime: 2000,
			});
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something went wrong",
				visibilityTime: 2000,
			});
			console.log(error);
		}
	};
	const handleReject = async (docId, custToken) => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Bookings", docId);
			const request = {
				selectedPro: deleteField(),
				status: "requested",
			};
			await updateDoc(docRef, request);
			await sendNotification(
				custToken,
				"Request DisApproved",
				"Sad. Professional disapproved the request. Try to find another!"
			);
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Booking Rejected",
				visibilityTime: 2000,
			});
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something went wrong",
				visibilityTime: 2000,
			});
			console.log(error);
		}
	};
	const handleWithdraw = async (docId, custToken) => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Bookings", docId);
			const request = {
				selectedPro: deleteField(),
				status: "requested",
			};
			await updateDoc(docRef, request);
			await sendNotification(
				custToken,
				"Request Withdrawn",
				"Sad. Professional has withdrawn. Try to find another!"
			);
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Booking Withdrawn",
				visibilityTime: 2000,
			});
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something went wrong",
				visibilityTime: 2000,
			});
			console.log(error);
		}
	};
	const handleDelayAccept = async (docId, custToken) => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Bookings", docId);
			const request = {
				status: "confirmed",
			};
			await updateDoc(docRef, request);
			await sendNotification(
				custToken,
				"Delay Request Accepted",
				"Great. Professional has accepted the delay request!"
			);
			setActionLoading(false);
			Toast.show({
				type: "success",
				text1: "Delay Request Accepted",
				visibilityTime: 2000,
			});
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something went wrong",
				visibilityTime: 2000,
			});
			console.log(error);
		}
	};
	const handleDelayReject = async (docId, custToken) => {
		try {
			setActionLoading(true);
			const docRef = doc(db, "Bookings", docId);
			const request = {
				status: "requested",
				selectedPro: deleteField(),
			};
			await updateDoc(docRef, request);
			await sendNotification(
				custToken,
				"Delay Request Rejected",
				"Sad. Professional rejected delay request and withdrawn. Find Another"
			);
			setActionLoading(false);
			Toast.show({
				type: "success",
				text1: "Delay Request Rejected",
				visibilityTime: 2000,
			});
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something went wrong",
				visibilityTime: 2000,
			});
			console.log(error);
		}
	};
	const handleBookingDone = async (
		docId,
		custToken,
		payChoice,
		proId,
		discountedAmount,
		commission
	) => {
		try {
			setActionLoading(true);
			const userWalletRef = doc(db, `Users`, proId);
			const bookingRef = doc(db, `Bookings`, docId);
			const userWalletSnap = await getDoc(userWalletRef);
			const userWalletData = userWalletSnap.data().wallet;
			let wallet;
			const proEarning = parseInt(discountedAmount) - parseInt(commission);
			if (payChoice === "cash") {
				if (userWalletData) {
					await updateDoc(userWalletRef, {
						"wallet.totalEarned":
							parseInt(userWalletData.totalEarned) + parseInt(proEarning),
						"wallet.gotPaid":
							parseInt(userWalletData.gotPaid) + parseInt(proEarning),
						"wallet.payToApp":
							parseInt(userWalletData.payToApp) + parseInt(commission),
					});
				} else {
					wallet = {
						totalEarned: parseInt(proEarning),
						totalPenalty: 0,
						penaltyPaid: 0,
						gotPaid: parseInt(proEarning),
						payToApp: parseInt(commission),
					};
					await updateDoc(userWalletRef, { wallet });
				}
			} else {
				if (userWalletData) {
					await updateDoc(userWalletRef, {
						"wallet.totalEarned":
							parseInt(userWalletData.totalEarned) + parseInt(proEarning),
					});
				} else {
					wallet = {
						totalEarned: parseInt(proEarning),
						totalPenalty: 0,
						penaltyPaid: 0,
						gotPaid: 0,
						payToApp: 0,
					};
					await updateDoc(userWalletRef, { wallet });
				}
			}
			await updateDoc(bookingRef, {
				status: "done",
			});
			await sendNotification(
				custToken,
				"Professional Confirmed",
				"Great News. Professional has confirmed Booking Completion. Happy cleaning!"
			);
			setActionLoading(false);
			navigation.navigate("Feedback", { docId });
		} catch (error) {
			setActionLoading(false);
			Toast.show({
				type: "error",
				text1: "Something, went wrong!",
			});
			console.log(error);
		}
	};
	const handleBookingCancel = async (
		docId,
		proId,
		custToken,
		discountedAmount
	) => {
		try {
			setActionLoading(true);
			const userWalletRef = doc(db, `Users`, proId);
			const bookingRef = doc(db, `Bookings`, docId);
			const userWalletSnap = await getDoc(userWalletRef);
			const userWalletData = userWalletSnap.data().wallet;
			let wallet;
			const penalty = parseInt(discountedAmount) * 0.1;
			if (userWalletData) {
				await updateDoc(userWalletRef, {
					"wallet.totalPenalty":
						parseInt(userWalletData.totalPenalty) + parseInt(penalty),
				});
			} else {
				wallet = {
					totalEarned: 0,
					totalPenalty: parseInt(penalty),
					penaltyPaid: 0,
					gotPaid: 0,
					payToApp: 0,
				};
				await updateDoc(userWalletRef, { wallet });
			}
			await updateDoc(bookingRef, {
				status: "requested",
				selectedPro: deleteField(),
				cancelledBy: arrayUnion(proId),
			});
			await sendNotification(
				custToken,
				"Booking Cancelled",
				"Sad News. Professional has cancelled Booking!"
			);
			setActionLoading(false);
			Toast.show({
				type: "error",
				position: "top",
				text1: "Booking has been Cancelled",
				visibilityTime: 2000,
				autoHide: true,
			});
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
			setActionLoading(false);
		}
	};
	return (
		<View style={styles.container}>
			<Toast />
			{actionLoading && (
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
			<View
				style={{
					display: "flex",
					alignItems: "center",
					flexDirection: "row",
					justifyContent: "center",
					width: Sizes.width - 50,
					alignSelf: "center",
					marginTop: 50,
					marginBottom: 5,
				}}
			>
				<TouchableOpacity
					style={
						mode === "history"
							? [
									styles.subtitle,
									{
										backgroundColor: "green",
									},
							  ]
							: styles.subtitle
					}
					onPress={handleHistory}
				>
					<Text style={styles.subtitleText}>History</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={
						mode === "upcoming"
							? [
									styles.subtitle,
									{
										backgroundColor: "green",
									},
							  ]
							: styles.subtitle
					}
					onPress={handleUpcoming}
				>
					<Text style={styles.subtitleText}>Upcoming</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.wrapper}>
				{/* <Text>{JSON.stringify(bookings, null, 4)}</Text> */}
				<View style={{ flex: 1, paddingBottom: 10 }}>
					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flexGrow: 1,
						}}
					>
						{Object.keys(bookings).length > 0 ? (
							mode == "upcoming" ? (
								bookings.map((booking, i) => (
									<NewBookings
										booking={booking}
										key={i}
										handleAccept={handleAccept}
										handleCancel={handleCancel}
										handleReject={handleReject}
										handleWithdraw={handleWithdraw}
										handleDelayAccept={handleDelayAccept}
										handleBookingDone={handleBookingDone}
										handleDelayReject={handleDelayReject}
										handleBookingCancel={handleBookingCancel}
									/>
								))
							) : (
								bookings.map((booking, i) => (
									<DoneBookings booking={booking} key={i} />
								))
							)
						) : (
							<View
								style={{
									height: Sizes.height - 300,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										textAlign: "center",
									}}
								>
									No bookings found
								</Text>
							</View>
						)}
					</ScrollView>
				</View>
			</View>
			<View style={styles.footer}>
				<Footer />
			</View>
		</View>
	);
};

export default Bookings;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
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
		flexGrow: 1,
	},
	footer: {
		width: Sizes.width,
		marginBottom: Platform.OS === "ios" ? 20 : 0,
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
