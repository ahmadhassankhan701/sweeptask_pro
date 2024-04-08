import {
	Image,
	KeyboardAvoidingView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import { Button, IconButton } from "react-native-paper";
import PayInput from "../../../components/Input/PayInput";
import { Sizes, colors } from "../../../utils/theme";
import DocTypes from "../../../components/Modal/DocTypes";
import { Platform } from "react-native";
import { AddAccount } from "../../../utils/Helpers/PayConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

const NewAccount = () => {
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [docVisible, setDocVisible] = useState(false);
	const [details, setDetails] = useState({
		name: "",
		accountNumber: "",
		bankCode: "",
		countryCode: "ZA",
		accountType: "",
		docType: "",
		docNumber: "",
	});
	const handleTypeChange = (name, val) => {
		setVisible(false);
		setDocVisible(false);
		setDetails({ ...details, [name]: val });
	};
	const handleChange = (name, val) => {
		setDetails({ ...details, [name]: val });
	};
	const handleSubmit = async () => {
		try {
			if (
				details.name === "" ||
				details.accountNumber === "" ||
				details.bankCode === "" ||
				details.countryCode === "" ||
				details.accountType === "" ||
				details.docType === "" ||
				details.docNumber === ""
			) {
				alert("All fields are required");
				return;
			}
			setLoading(true);
			const body = {
				bank_code: details.bankCode,
				country_code: details.countryCode,
				account_number: details.accountNumber,
				account_name: details.name,
				account_type: details.accountType,
				document_type: details.docType,
				document_number: details.docNumber,
			};
			const data = await AddAccount(body);
			if (data.data && data.status) {
				if (data.data.verified) {
					await addData(body, state && state.user && state.user.uid);
				} else {
					setLoading(false);
					alert("Account could not be verified");
				}
			} else {
				setLoading(false);
				alert("Something went wrong");
			}
		} catch (error) {
			setLoading(false);
			alert(error.message);
			console.log(error);
		}
	};
	const addData = async (body, uid) => {
		try {
			const docRef = doc(db, "Accounts", uid);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists() && docSnap.data()) {
				const banks = docSnap.data().banks;
				banks.push(body);
				await updateDoc(docRef, { banks });
				alert("Account added successfully");
				navigation.navigate("Account");
			} else {
				await setDoc(docRef, { banks: [body] });
				alert("Account added successfully");
				navigation.navigate("Account");
			}
			setLoading(false);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={{ flex: 1 }}
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
						source={require("../../../assets/loader.gif")}
						style={{
							alignSelf: "center",
							width: 250,
							height: 200,
						}}
					/>
				</View>
			)}
			<DocTypes
				visible={visible}
				setVisible={setVisible}
				titles={[
					{
						text: "Personal",
						value: "personal",
						type: "accountType",
					},
					{
						text: "Business",
						value: "business",
						type: "accountType",
					},
				]}
				handleAction={handleTypeChange}
			/>
			<DocTypes
				visible={docVisible}
				setVisible={setDocVisible}
				titles={[
					{
						text: "Identity Number",
						value: "identityNumber",
						type: "docType",
					},
					{
						text: "Passport Number",
						value: "passportNumber",
						type: "docType",
					},
					{
						text: "Business Registration Number",
						value: "businessRegistrationNumber",
						type: "docType",
					},
				]}
				handleAction={handleTypeChange}
			/>
			<View
				style={{
					width: Sizes.width - 20,
					alignSelf: "center",
					marginTop: 10,
					marginBottom: 10,
				}}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<Text
						style={{
							fontStyle: "normal",
							fontWeight: "700",
							fontSize: 20,
							lineHeight: 24,
							color: "#000000",
						}}
					>
						Payment details
					</Text>
					<TouchableOpacity
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexDirection: "row",
							backgroundColor: "#ffffff",
							borderRadius: 5,
							marginTop: 10,
						}}
						onPress={() => setVisible(true)}
					>
						<Text style={{ marginLeft: 15, fontSize: 13, color: colors.desc }}>
							{details.accountType === ""
								? "Account Type"
								: details.accountType.charAt(0).toUpperCase() +
								  details.accountType.slice(1)}
						</Text>
						<IconButton icon={"chevron-down"} />
					</TouchableOpacity>
					<PayInput
						title={"Account Name"}
						name={"name"}
						handleChange={handleChange}
						value={details.name}
					/>
					<PayInput
						title={"Account Number"}
						name={"accountNumber"}
						handleChange={handleChange}
						value={details.accountNumber}
					/>
					<PayInput
						title={"Bank Code"}
						name={"bankCode"}
						handleChange={handleChange}
						value={details.bankCode}
					/>
					<PayInput
						title={"Country Code"}
						name={"countryCode"}
						handleChange={handleChange}
						value={details.countryCode}
					/>
					<TouchableOpacity
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							flexDirection: "row",
							backgroundColor: "#ffffff",
							borderRadius: 5,
							marginTop: 10,
						}}
						onPress={() => setDocVisible(true)}
					>
						<Text style={{ marginLeft: 15, fontSize: 13, color: colors.desc }}>
							{details.docType === ""
								? "Document Type"
								: details.docType.charAt(0).toUpperCase() +
								  details.docType.slice(1)}
						</Text>
						<IconButton icon={"chevron-down"} />
					</TouchableOpacity>
					<PayInput
						title={"Document Number"}
						name={"docNumber"}
						handleChange={handleChange}
						value={details.docNumber}
					/>
					<TouchableOpacity onPress={handleSubmit}>
						<Button
							mode="contained"
							textColor="#FFFFFF"
							style={{
								width: 370,
								height: 55,
								alignSelf: "center",
								borderRadius: 5,
								borderColor: "#000000",
								marginTop: 10,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
							buttonColor="#00BF63"
						>
							Add payment details
						</Button>
					</TouchableOpacity>
				</ScrollView>
			</View>
		</KeyboardAvoidingView>
	);
};

export default NewAccount;

const styles = StyleSheet.create({});
