import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { IconButton, Modal, Portal } from "react-native-paper";
const DocTypes = ({ visible, setVisible, titles, handleAction }) => {
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: "90%",
		alignSelf: "center",
	};
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={containerStyle}
			>
				<View>
					<Text style={{ fontSize: 20, fontWeight: "700" }}>Type</Text>
					<View style={{ marginTop: 30, marginBottom: 30 }}>
						{titles &&
							titles.map((title, index) => (
								<TouchableOpacity
									style={{
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										width: "100%",
										backgroundColor: "#efefef",
										borderRadius: 10,
										marginTop: 5,
										paddingLeft: 20,
										paddingVertical: 5,
									}}
									key={index}
									onPress={() => handleAction(title.type, title.value)}
								>
									<Text
										style={{
											fontSize: 20,
											fontWeight: "400",
											marginVertical: 5,
										}}
									>
										{title.text}
									</Text>
									<IconButton icon={"radiobox-blank"} iconColor="gray" />
								</TouchableOpacity>
							))}
					</View>
				</View>
			</Modal>
		</Portal>
	);
};

export default DocTypes;

const styles = StyleSheet.create({});
