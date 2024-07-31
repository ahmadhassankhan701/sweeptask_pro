import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Sizes } from "../../utils/theme";
import Footer from "../../components/Footer";
import { Avatar, IconButton, List } from "react-native-paper";

const Inbox = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<View style={styles.wrapper}>
					<View style={{ marginVertical: 20 }}>
						<List.AccordionGroup>
							<List.Accordion title="Chats" id="1">
								<List.Section style={{ marginVertical: 50 }}>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
										}}
									>
										<View>
											<Text style={{ marginBottom: 5 }}>
												70 New road, Midrand
											</Text>
											<Text style={{ marginBottom: 5 }}>
												2Bedroom, 1 Bathroom
											</Text>
											<Text>Friday @ 08:30 19 May 2023</Text>
										</View>
										<View
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Avatar.Icon icon={"account"} size={50} />
											<Text style={{ marginTop: 5 }}>Trotric Mabuso</Text>
										</View>
									</View>
									<View
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<IconButton
											icon={"chat-processing"}
											iconColor="#000000"
											onPress={() => alert("Coming soon")}
										/>
										<IconButton icon={"phone"} iconColor="#000000" />
									</View>
								</List.Section>
							</List.Accordion>
							<List.Accordion title="Clean Task News" id="2">
								<List.Item title="Clean Task News Item" />
							</List.Accordion>
						</List.AccordionGroup>
					</View>
				</View>
			</View>
			<View style={styles.footer}>
				<Footer />
			</View>
		</View>
	);
};

export default Inbox;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
	},
	main: {
		height: Platform.OS == "ios" ? Sizes.height * 0.8 : Sizes.height * 0.75,
		width: "100%",
		display: "flex",
		alignItems: "center",
	},
	wrapper: {
		width: Sizes.width - 50,
	},
	footer: {
		height: Sizes.height * 0.2,
		width: "100%",
	},
});
