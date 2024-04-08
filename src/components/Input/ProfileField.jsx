import { StyleSheet } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";

const ProfileField = ({ title, name, val, handleChange }) => {
	return (
		<TextInput
			placeholder={title}
			mode="outlined"
			value={val}
			outlineColor="transparent"
			activeOutlineColor="lightgray"
			theme={{ roundness: 0 }}
			onChangeText={(text) => handleChange(name, text)}
			disabled={title === "Email" ? true : false}
		/>
	);
};

export default ProfileField;

const styles = StyleSheet.create();
