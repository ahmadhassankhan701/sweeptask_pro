import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

export const Tab = ({ name, handlePress, screenName, routeName, text }) => {
	const activeScreenColor = screenName === routeName ? "black" : "gray";

	return (
		<TouchableOpacity onPress={handlePress}>
			<FontAwesome5
				name={name}
				size={25}
				color="black"
				style={{
					color: activeScreenColor,
					marginBottom: 3,
					alignSelf: "center",
				}}
			/>
			<Text style={{ fontSize: 14, fontWeight: "400" }}>{text}</Text>
		</TouchableOpacity>
	);
};

export default function index() {
	const navigation = useNavigation();
	const route = useRoute();

	return (
		<View
			style={{
				width: "100%",
				backgroundColor: "white",
			}}
		>
			<View
				style={{
					flexDirection: "row",
					margin: 5,
					marginHorizontal: 30,
					justifyContent: "space-between",
				}}
			>
				<Tab
					name="home"
					text="Home"
					handlePress={() => navigation.navigate("Home")}
					screenName="Home"
					routeName={route.name}
				/>
				<Tab
					name="inbox"
					text="Inbox"
					handlePress={() => navigation.navigate("Inbox")}
					screenName="Inbox"
					routeName={route.name}
				/>
				<Tab
					name="list-alt"
					text="Bookings"
					handlePress={() => navigation.navigate("Bookings")}
					screenName="Bookings"
					routeName={route.name}
				/>
				<Tab
					name="user"
					text="Account"
					handlePress={() => navigation.navigate("Account")}
					screenName="Account"
					routeName={route.name}
				/>
			</View>
		</View>
	);
}
