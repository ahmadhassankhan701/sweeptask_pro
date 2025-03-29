import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Image,
	TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Avatar, Button, IconButton, Modal, Portal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import ProfileField from "../../components/Input/ProfileField";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sizes } from "../../utils/theme";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";

const Account = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [user, setUser] = useState({
		name: "Trotric",
		email: "trot@gmail.com",
		phone: "+27-26565656",
		image: "",
	});
	const [files, setFiles] = useState({
		id: "",
		workPermit: "",
		residence: "",
	});
	const [uploadedImage, setUploadedImage] = useState("");
	const [accounts, setAccounts] = useState(null);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	useEffect(() => {
		if (state && state.user) {
			fetchUser();
			fetchAccount();
		}
	}, [state && state.user]);
	const fetchAccount = async () => {
		try {
			setLoading(true);
			const accountRef = doc(db, "Accounts", state.user.uid);
			const docSnap = await getDoc(accountRef);
			if (docSnap.exists() && docSnap.data() && docSnap.data().banks) {
				setAccounts(docSnap.data().banks);
				setLoading(false);
			}
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	const fetchUser = async () => {
		setLoading(true);
		const docRef = doc(db, `Users`, state.user.uid);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					const res = docSnap.data();
					setUser({
						...user,
						name: res.name,
						phone: res.phone,
						email: res.email,
						image: res.image,
					});
					setFiles({
						...files,
						id: res.id,
						workPermit: res.workPermit,
						residence: res.residence,
					});
				}
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	const handlePDF = async (uri, type) => {
		const downloadResumable = FileSystem.createDownloadResumable(
			uri,
			FileSystem.documentDirectory + `${type}-file.pdf`
		);
		try {
			const { uri } = await downloadResumable.downloadAsync();
			await shareAsync(uri);
		} catch (error) {
			console.log(error);
		}
	};
	const handleLogout = async () => {
		try {
			const active = false;
			const location = {
				lat: 0,
				lng: 0,
			};
			const userRef = doc(db, "Users", state && state.user && state.user.uid);
			await updateDoc(userRef, {
				active,
				location,
			});
			await AsyncStorage.removeItem("clean_pro_auth");
			setState({ ...state, user: null });
			navigation.navigate("ProLogin");
		} catch (error) {
			console.log(error);
		}
	};
	const handleChange = (name, value) => {
		setUser({ ...user, [name]: value });
	};
	const handleUpdate = async () => {
		if (user.name === "" || user.phone === "") {
			return alert("Please fill in all fields");
		}
		if (user.phone.length != 9) {
			return alert("Phone number length should be 9");
		}
		try {
			setLoading(true);
			const userRef = doc(db, "Users", state.user.uid);
			await updateDoc(userRef, {
				name: user.name,
				phone: user.phone,
			});
			setLoading(false);
			alert("Profile updated successfully");
		} catch (error) {
			setLoading(false);
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleImage = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Gallery access is required");
			return;
		}
		// get image from gallery
		let pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});
		if (pickerResult.canceled === true) {
			return;
		}
		const path = `Profiles/pro/${state.user.uid}/${Date.now()}`;
		const img = await uploadImage(path, pickerResult.assets[0].uri);
		setUploadedImage(img);
		await saveImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			setLoading(true);
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 100, height: 100 } }],
				{
					compress: 0.5,
					format: ImageManipulator.SaveFormat.JPEG,
				}
			);
			const response = await fetch(result.uri);
			const blob = await response.blob();
			const storageRef = ref(storage, imageReferenceID);
			await uploadBytes(storageRef, blob);
			setLoading(false);
			return getDownloadURL(storageRef);
		}
		return null;
	};
	const saveImage = async (img) => {
		const userRef = doc(db, `Users`, state.user.uid);
		await updateDoc(userRef, {
			image: img,
		});
	};
	return (
		<View style={{ display: "flex", alignItems: "center" }}>
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
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<Text style={{ textAlign: "center" }}>
							Are you sure you want to logout?
						</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-around",
								alignItems: "center",
							}}
						>
							<IconButton
								icon={"check-circle"}
								iconColor="green"
								size={35}
								onPress={handleLogout}
							/>
							<IconButton
								icon={"close-circle"}
								iconColor="red"
								size={35}
								onPress={hideModal}
							/>
						</View>
					</View>
				</Modal>
			</Portal>
			<View style={{ width: Sizes.width - 20 }}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ paddingBottom: 20 }}
				>
					<View>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								marginVertical: 20,
							}}
						>
							{uploadedImage ? (
								<Avatar.Image size={80} source={{ uri: uploadedImage }} />
							) : user.image ? (
								<Avatar.Image size={80} source={{ uri: user.image }} />
							) : (
								<Avatar.Icon size={80} icon="account" />
							)}
						</View>
						<TouchableOpacity
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={handleImage}
						>
							<IconButton
								icon={"camera"}
								mode="contained"
								containerColor={"#00BF63"}
								iconColor="#fff"
							/>
						</TouchableOpacity>
						<View>
							<ProfileField
								title={"Name"}
								name={"name"}
								val={user.name}
								handleChange={handleChange}
							/>
							<ProfileField
								title={"Phone"}
								name={"phone"}
								val={user.phone}
								handleChange={handleChange}
							/>
							<ProfileField
								title={"Email"}
								name={"email"}
								val={user.email}
								handleChange={handleChange}
							/>
							<Button
								mode="contained"
								buttonColor="#00BF63"
								style={{ borderRadius: 0, marginTop: 10 }}
								onPress={handleUpdate}
							>
								Update
							</Button>
						</View>
						<View
							style={{
								marginTop: 30,
								width: Sizes.width - 20,
								alignSelf: "center",
							}}
						>
							<Text
								style={{
									fontStyle: "normal",
									fontWeight: "700",
									fontSize: 20,
									lineHeight: 24,
									color: "#000000",
								}}
							>
								Cleaner documents
							</Text>
							<View style={{ marginVertical: 10 }}>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text>ID/Passport</Text>
									<Button
										textColor="red"
										disabled={files.id == "" ? true : false}
										onPress={() => handlePDF(files.id, "id")}
									>
										View PDF
									</Button>
								</View>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text>Work Permit</Text>
									<Button
										textColor="red"
										disabled={files.workPermit == "" ? true : false}
										onPress={() => handlePDF(files.workPermit, "workPermit")}
									>
										View PDF
									</Button>
								</View>
								<View
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text>Proof of Residence</Text>
									<Button
										textColor="red"
										disabled={files.residence == "" ? true : false}
										onPress={() => handlePDF(files.residence, "residence")}
									>
										View PDF
									</Button>
								</View>
							</View>
						</View>
						<View
							style={{
								width: Sizes.width - 20,
								alignItems: "center",
								justifyContent: "space-between",
								flexDirection: "row",
							}}
						>
							<Text
								style={{
									fontStyle: "normal",
									fontWeight: "700",
									fontSize: 20,
									lineHeight: 24,
									color: "#000000",
								}}
							>
								Payment Accounts
							</Text>
							<IconButton
								icon={"plus-circle"}
								iconColor="green"
								size={35}
								onPress={() => navigation.navigate("NewAccount")}
							/>
						</View>
						{accounts && accounts.length > 0 ? (
							accounts.map((account, index) => (
								<View
									style={{
										width: Sizes.width - 20,
										backgroundColor: "#ffffff",
										borderRadius: 5,
										padding: 10,
									}}
									key={index}
								>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											flexWrap: "wrap",
										}}
									>
										<Text>Account Name: {account.account_name}</Text>
										<Text>Account Number: {account.account_number}</Text>
									</View>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											flexWrap: "wrap",
										}}
									>
										<Text>Document Number: {account.document_number}</Text>
										<Text>Country Code: {account.country_code}</Text>
									</View>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											flexWrap: "wrap",
										}}
									>
										<Text>Account Type: {account.account_type}</Text>
										<Text>Document Type: {account.document_type}</Text>
									</View>
								</View>
							))
						) : (
							<Text>No Accounts Found</Text>
						)}
						<View>
							<TouchableOpacity onPress={showModal}>
								<Button
									mode="outlined"
									textColor="#000000"
									style={{
										width: "100%",
										height: 55,
										alignSelf: "center",
										borderRadius: 5,
										borderColor: "#000000",
										marginTop: 30,
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									Sign out
								</Button>
							</TouchableOpacity>
							<Button
								mode="contained"
								textColor="#FFFFFF"
								style={{
									width: "100%",
									height: 55,
									alignSelf: "center",
									borderRadius: 5,
									borderColor: "#000000",
									marginTop: 10,
									marginBottom: 20,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
								buttonColor="#F91111"
							>
								Delete account
							</Button>
						</View>
					</View>
				</ScrollView>
			</View>
		</View>
	);
};

export default Account;

const styles = StyleSheet.create({
	uploadBtn: {
		backgroundColor: "#00BF63",
		borderRadius: 5,
		color: "#ffffff",
		width: 120,
		height: 40,
	},
});
