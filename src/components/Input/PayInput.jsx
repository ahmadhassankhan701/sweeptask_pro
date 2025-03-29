import React from "react";
import { TextInput } from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";

const PayInput = ({ title, name, handleChange, value }) => {
	return (
		<TextInput
			label={title}
			mode="outlined"
			style={{
				backgroundColor: "#ffffff",
				width: Sizes.width - 20,
				marginVertical: 5,
				fontSize: 12,
			}}
			outlineColor="transparent"
			activeOutlineColor={"gray"}
			selectionColor={colors.desc}
			onChangeText={(text) => handleChange(name, text)}
			value={value}
			keyboardType={"default"}
		/>
	);
};

export default PayInput;
