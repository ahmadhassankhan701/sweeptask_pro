import {
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
	ScrollView,
} from "react-native";
import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { Button, IconButton, TextInput } from "react-native-paper";
import InputText from "../components/Input/InputText";
import { Sizes } from "../utils/theme";
import * as DocumentPicker from "expo-document-picker";
import { nanoid } from "nanoid/non-secure";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

const ProRegister = ({ navigation }) => {
	const [details, setDetails] = useState({
		name: "",
		email: "",
		pswd: "",
		username: nanoid(6),
		phone: "",
		code: "+27",
		city: "",
		id: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		phone: "",
		email: "",
		pswd: "",
		id: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [id, setId] = useState({
		file: null,
		path: "",
		uploadedUri: "",
	});
	const [workPermit, setWorkPermit] = useState({
		file: null,
		path: "",
		uploadedUri: "",
	});
	const [residence, setResidence] = useState({
		file: null,
		path: "",
		uploadedUri: "",
	});
	const [loading, setLoading] = useState({
		id: false,
		workPermit: false,
		residence: false,
		submit: false,
	});
	const handleChange = async (name, value) => {
		if (name === "city") {
			setDetails({ ...details, city: value });
		}
		if (name === "id") {
			setDetails({ ...details, id: value });
			if (value.length !== 13) {
				setErrors({
					...errors,
					id: "ID is 13 characters long",
				});
			} else {
				setErrors({ ...errors, id: "" });
			}
		}
		if (name === "name") {
			setDetails({ ...details, name: value });
			if (value.length > 32) {
				setErrors({
					...errors,
					name: "Name is too long",
				});
			} else {
				setErrors({ ...errors, name: "" });
			}
		}
		if (name === "pswd") {
			setDetails({ ...details, pswd: value });
			if (value.length < 8 || value.length > 20) {
				setErrors({
					...errors,
					pswd: "Password should be 8-20 characters",
				});
			} else {
				setErrors({ ...errors, pswd: "" });
			}
		}
		if (name === "phone") {
			setDetails({ ...details, phone: value });
			if (value.length !== 9) {
				setErrors({
					...errors,
					phone: "Phone is 9 characters",
				});
			} else {
				setErrors({
					...errors,
					phone: "",
				});
			}
		}
		if (name === "email") {
			handleEmail(value);
		}
	};
	const handleEmail = async (val) => {
		setDetails({ ...details, email: val });
		const regex =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (regex.test(val) === false) {
			setErrors({
				...errors,
				email: "Email is invalid",
			});
		} else {
			setErrors({
				...errors,
				email: "",
			});
		}
	};
	const pickDocument = async (name) => {
		try {
			let result = await DocumentPicker.getDocumentAsync({
				type: "application/pdf",
			});
			if (result.canceled) {
				alert("No file selected");
			} else {
				if (name === "id") {
					setId({ ...id, file: result.assets[0] });
				}
				if (name === "workPermit") {
					setWorkPermit({ ...workPermit, file: result.assets[0] });
				}
				if (name === "residence") {
					setResidence({ ...residence, file: result.assets[0] });
				}
			}
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	const handleUpload = async (name) => {
		name == "id"
			? setLoading({ ...loading, id: true })
			: name == "workPermit"
			? setLoading({ ...loading, workPermit: true })
			: setLoading({ ...loading, residence: true });
		const path = `ProfileDocs/${details.username}/${new Date().getTime()}`;
		const uploadUri =
			name == "id"
				? id.file.uri
				: name == "workPermit"
				? workPermit.file.uri
				: residence.file.uri;
		const doc = await uploadDoc(path, uploadUri);
		if (doc) {
			name == "id"
				? setId({ ...id, uploadedUri: doc, path })
				: name == "workPermit"
				? setWorkPermit({
						...workPermit,
						uploadedUri: doc,
						path,
				  })
				: setResidence({
						...residence,
						uploadedUri: doc,
						path,
				  });
		}
		name == "id"
			? setLoading({ ...loading, id: false })
			: name == "workPermit"
			? setLoading({ ...loading, workPermit: false })
			: setLoading({ ...loading, residence: false });
	};
	const uploadDoc = async (imageReferenceID, uri) => {
		if (uri) {
			const response = await fetch(uri);
			const blob = await response.blob();
			const storageRef = ref(storage, imageReferenceID);
			await uploadBytes(storageRef, blob);
			return getDownloadURL(storageRef);
		}
		return null;
	};
	const handleSubmit = async () => {
		if (
			details.name === "" ||
			details.pswd === "" ||
			details.phone === "" ||
			details.email === "" ||
			id.uploadedUri === "" ||
			workPermit.uploadedUri === "" ||
			residence.uploadedUri === "" ||
			details.city === "" ||
			details.id === ""
		) {
			alert("All Fields are required");
			return;
		}
		if (
			errors.name !== "" ||
			errors.pswd !== "" ||
			errors.phone !== "" ||
			errors.email !== "" ||
			errors.id !== ""
		) {
			alert("Please remove errors first");
			return;
		}
		createUser();
	};
	const createUser = async () => {
		try {
			setLoading({
				...loading,
				submit: true,
			});
			await createUserWithEmailAndPassword(auth, details.email, details.pswd);
			updateProfile(auth.currentUser, {
				displayName: details.name,
			});
			handleAddPro();
			setLoading({
				...loading,
				submit: false,
			});
		} catch (error) {
			setLoading({
				...loading,
				submit: false,
			});
			if (error.code === "auth/email-already-in-use") {
				alert("Email already registered. Try using different email");
			} else {
				alert("Error creating user:", error.message);
			}
			console.log(error);
		}
	};
	const handleAddPro = async () => {
		let userData = {
			role: "professional",
			status: "requested",
			name: details.name,
			username: details.username,
			pswd: details.pswd,
			email: details.email,
			phone: details.phone,
			code: details.code,
			city: details.city,
			idNumber: details.id,
			id: id.uploadedUri,
			workPermit: workPermit.uploadedUri,
			residence: residence.uploadedUri,
			createdAt: new Date(),
		};
		addDoc(collection(db, "Users"), userData)
			.then(() => {
				setLoading({ ...loading, submit: false });
				alert(
					"Success. Once your details are verified we will send you a verification email"
				);
				navigation.navigate("ProLogin");
			})
			.catch((e) => {
				setLoading({ ...loading, submit: false });
				alert("Error adding document");
				console.log(e);
			});
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			{loading.submit && (
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
					}}
				>
					<Image
						source={require("../assets/GreenLogo.png")}
						alt="logo"
						style={{
							width: 225,
							height: 44,
							objectFit: "contain",
							marginBottom: 30,
							alignSelf: "center",
						}}
					/>
					<InputText
						title={"Name"}
						name={"name"}
						handleChange={handleChange}
						value={details.name}
					/>
					{errors.name != "" && (
						<Text
							style={{
								color: "red",
								textAlign: "center",
							}}
						>
							{errors.name}
						</Text>
					)}
					<InputText
						title={"Email"}
						name={"email"}
						handleChange={handleChange}
						value={details.email}
					/>
					{errors.email != "" && (
						<Text
							style={{
								color: "red",
								textAlign: "center",
							}}
						>
							{errors.email}
						</Text>
					)}
					<InputText
						title={"Password"}
						name={"pswd"}
						handleChange={handleChange}
						value={details.pswd}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
					/>
					{errors.pswd != "" && (
						<Text
							style={{
								color: "red",
								textAlign: "center",
							}}
						>
							{errors.pswd}
						</Text>
					)}
					<View
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							width: Sizes.width - 50,
						}}
					>
						<TextInput
							label="Code"
							mode="outlined"
							style={{
								backgroundColor: "#ffffff",
								width: "20%",
								marginVertical: 10,
								fontSize: 12,
								marginRight: 6,
							}}
							outlineColor="#000000"
							activeOutlineColor={"#000000"}
							selectionColor={"gray"}
							onChangeText={(text) => handleChange("code", text)}
							value={details.code}
						/>
						<TextInput
							label="Phone number"
							mode="outlined"
							style={{
								backgroundColor: "#ffffff",
								width: "78%",
								marginVertical: 10,
								fontSize: 12,
							}}
							outlineColor="#000000"
							activeOutlineColor={"#000000"}
							selectionColor={"gray"}
							keyboardType="numeric"
							onChangeText={(text) => handleChange("phone", text)}
							value={details.phone}
						/>
					</View>
					{errors.phone != "" && (
						<Text
							style={{
								color: "red",
								textAlign: "center",
							}}
						>
							{errors.phone}
						</Text>
					)}
					<InputText
						title={"City"}
						name={"city"}
						handleChange={handleChange}
						value={details.city}
					/>
					<InputText
						title={"ID Number/Passport ( without dashes )"}
						name={"id"}
						handleChange={handleChange}
						value={details.id}
					/>
					{errors.id != "" && (
						<Text
							style={{
								color: "red",
								textAlign: "center",
							}}
						>
							{errors.id}
						</Text>
					)}
					<View style={{ marginVertical: 30 }}>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Text>ID/Passport</Text>
							{id.path == "" && (
								<Button
									textColor="#ffffff"
									style={styles.uploadBtn}
									loading={loading.id}
									disabled={loading.id}
									onPress={
										id.file
											? () => handleUpload("id")
											: () => pickDocument("id")
									}
								>
									{id.file ? "+ Upload file" : "+ Choose file"}
								</Button>
							)}
						</View>
						{id.file && (
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "row",
									alignSelf: "flex-start",
								}}
							>
								<View>
									<Text>{id.file.name}</Text>
									<Text>{id.file.size}KB</Text>
								</View>
								<View>
									<IconButton
										onPress={() => setId({ ...id, file: null })}
										icon={id.path ? "check-circle" : "close-circle"}
									/>
								</View>
							</View>
						)}
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								marginVertical: 10,
							}}
						>
							<Text>Work Permit</Text>
							{workPermit.path == "" && (
								<Button
									textColor="#ffffff"
									style={styles.uploadBtn}
									loading={loading.workPermit}
									disabled={loading.workPermit}
									onPress={
										workPermit.file
											? () => handleUpload("workPermit")
											: () => pickDocument("workPermit")
									}
								>
									{workPermit.file ? "+ Upload file" : "+ Choose file"}
								</Button>
							)}
						</View>
						{workPermit.file && (
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "row",
									alignSelf: "flex-start",
								}}
							>
								<View>
									<Text>{workPermit.file.name}</Text>
									<Text>{workPermit.file.size}KB</Text>
								</View>
								<View>
									<IconButton
										onPress={() =>
											setWorkPermit({
												...workPermit,
												file: null,
											})
										}
										icon={workPermit.path ? "check-circle" : "close-circle"}
									/>
								</View>
							</View>
						)}
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}
						>
							<Text style={{ width: 100 }}>Proof of Residence</Text>
							{residence.path == "" && (
								<Button
									textColor="#ffffff"
									style={styles.uploadBtn}
									loading={loading.residence}
									disabled={loading.residence}
									onPress={
										residence.file
											? () => handleUpload("residence")
											: () => pickDocument("residence")
									}
								>
									{residence.file ? "+ Upload file" : "+ Choose file"}
								</Button>
							)}
						</View>
						{residence.file && (
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "row",
									alignSelf: "flex-start",
									marginTop: 5,
								}}
							>
								<View>
									<Text>{residence.file.name}</Text>
									<Text>{residence.file.size}KB</Text>
								</View>
								<View>
									<IconButton
										onPress={() =>
											setResidence({
												...residence,
												file: null,
											})
										}
										icon={residence.path ? "check-circle" : "close-circle"}
									/>
								</View>
							</View>
						)}
					</View>
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
						Sign up
					</Button>
					<View
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							marginBottom: 20,
						}}
					>
						<Text>Already have an account? </Text>
						<TouchableOpacity onPress={() => navigation.navigate("ProLogin")}>
							<Text
								style={{
									fontWeight: "800",
									color: "#00BF63",
								}}
							>
								Sign in
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};

export default ProRegister;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 50,
		marginBottom: 20,
	},
	wrapper: {
		flexGrow: 1,
		width: Sizes.width - 50,
		marginTop: 20,
		marginBottom: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	uploadBtn: {
		backgroundColor: "#00BF63",
		borderRadius: 5,
		color: "#ffffff",
		width: 120,
		height: 40,
	},
});
