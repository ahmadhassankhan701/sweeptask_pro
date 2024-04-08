import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const ProIntro = ({ navigation }) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Image
				source={require("../assets/GreenLogo.png")}
				alt="logo"
				style={{ width: 225, height: 44, marginBottom: 50 }}
			/>
			<View style={{ marginTop: 50 }}>
				<TouchableOpacity onPress={() => navigation.navigate("ProLogin")}>
					<View style={styles.IntroProButton}>
						<Text style={styles.btnText}>Log in</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => navigation.navigate("ProRegister")}>
					<View style={styles.IntroProButton}>
						<Text style={styles.btnText}>Sign up</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ProIntro;

const styles = StyleSheet.create({
	IntroProButton: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		width: 313,
		height: 50,
		backgroundColor: "#00BF63",
		marginTop: 30,
	},
	btnText: {
		fontWeight: "400",
		fontSize: 17,
		lineHeight: 24,
		color: "#FFFFFF",
	},
});
