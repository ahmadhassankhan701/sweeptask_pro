import {
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { Button } from "react-native-paper";
import InputText from "../components/Input/InputText";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { activateNotify } from "../utils/Helpers/NotifyConfig";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sizes } from "../utils/theme";
const ProLogin = ({ navigation }) => {
	const { setState } = useContext(AuthContext);
	const [details, setDetails] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const handleChange = async (name, value) => {
		setDetails({ ...details, [name]: value });
	};
	const userRef = collection(db, "Users");
	const q = query(userRef, where("email", "==", details.email));
	const handleSubmit = async () => {
		if (details.email === "" || details.password === "") {
			alert("Please fill all the fields");
			return;
		}
		setLoading(true);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.size == 0) {
			setLoading(false);
			alert("User not found. Please register first");
			return;
		}
		let item = {};
		querySnapshot.forEach((doc) => {
			item = { key: doc.id, data: doc.data() };
		});
		if (item.data.role !== "professional") {
			setLoading(false);
			alert(
				"No such professional found. Please register as a professional first"
			);
			return;
		}
		if (item.data.status === "requested") {
			setLoading(false);
			alert("Your account is being verified. Your patience is appreciated");
			return;
		}
		if (item.data.status === "suspended") {
			setLoading(false);
			alert(
				"Your account is suspended and under investigation. Please contact support"
			);
			return;
		}
		signInUser(item.key);
		setLoading(false);
	};

	const signInUser = async (docId) => {
		signInWithEmailAndPassword(auth, details.email, details.password)
			.then((userCredential) => {
				handleMailVerification(userCredential.user, docId);
			})
			.catch((error) => {
				setLoading(false);
				const errorMessage = error.message;
				console.log("Error signing in:", errorMessage);
				alert("Wrong credentials. Try again!");
			});
	};
	const handleMailVerification = async (user, docId) => {
		try {
			if (user.emailVerified) {
				handleUserState(docId);
			} else {
				// await sendEmailVerification(auth.currentUser);
				await signOut(auth);
				setLoading(false);
				alert("Verification email sent to you. Verify then Login!");
			}
		} catch (error) {
			setLoading(false);
			alert("Verfication mail failed. Try again!");
			console.log(error);
		}
	};
	const handleUserState = async (userId) => {
		const tokRef = doc(db, "Users", userId);
		const push_token = await activateNotify(tokRef);
		const user = {
			uid: userId,
			role: "professional",
			push_token,
		};
		const stateData = { user };
		setState({
			user: stateData.user,
		});
		AsyncStorage.setItem("clean_pro_auth", JSON.stringify(stateData));
		setLoading(false);
		navigation.navigate("Home");
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
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
						source={require("../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<View style={styles.wrapper}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						flexGrow: 1,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Image
						source={require("../assets/GreenLogo.png")}
						alt="logo"
						style={{ width: 225, height: 44, marginBottom: 50 }}
					/>
					<View>
						<InputText
							title={"Email"}
							name={"email"}
							handleChange={handleChange}
							value={details.email}
						/>
						<InputText
							title={"Password"}
							name={"password"}
							handleChange={handleChange}
							value={details.password}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
						<Button
							mode="contained"
							style={{
								backgroundColor: "#00BF63",
								color: "#ffffff",
								borderRadius: 0,
								marginVertical: 20,
							}}
							onPress={handleSubmit}
						>
							Log in
						</Button>
						<View
							style={{
								display: "flex",
								alignItems: "center",
								flexDirection: "row",
							}}
						>
							<Text>Don’t have an account? </Text>
							<TouchableOpacity
								onPress={() => navigation.navigate("ProRegister")}
							>
								<Text
									style={{
										fontWeight: "800",
										color: "#00BF63",
									}}
								>
									Sign up
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};

export default ProLogin;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
		alignItems: "center",
	},
	wrapper: {
		flexGrow: 1,
		width: Sizes.width - 50,
		marginTop: 20,
		marginBottom: 10,
		alignItems: "center",
		justifyContent: "center",
	},
});
