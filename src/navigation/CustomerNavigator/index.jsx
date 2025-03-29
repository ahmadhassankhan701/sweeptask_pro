import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../../screens/protected/Home";
import WeekData from "../../screens/protected/WeekData";
import { IconButton } from "react-native-paper";
import WeekBalance from "../../screens/protected/WeekBalance";
import Bookings from "../../screens/protected/Bookings";
import Inbox from "../../screens/protected/Inbox";
import Chat from "../../screens/protected/Chat/Chat";
import Account from "../../screens/protected/Account";
import Feedback from "../../screens/protected/Feedback";
import NewAccount from "../../screens/protected/Payment/NewAccount";

const Stack = createNativeStackNavigator();
const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="Home"
				component={Home}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Bookings"
				component={Bookings}
				options={() => ({
					headerShown: false,
					headerTitle: "Booking",
					headerTitleAlign: "center",
					headerLeft: () => {},
				})}
			/>
			<Stack.Screen
				name="Feedback"
				component={Feedback}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="Inbox"
				component={Inbox}
				options={() => ({
					headerShown: true,
					headerTitle: "Inbox",
					headerTitleAlign: "center",
					headerLeft: () => {},
				})}
			/>
			<Stack.Screen
				name="Account"
				component={Account}
				options={() => ({
					headerShown: true,
					headerTitle: "Profile",
					headerTitleAlign: "center",
					headerLeft: () => {},
				})}
			/>
			<Stack.Screen
				name="NewAccount"
				component={NewAccount}
				options={() => ({
					headerShown: true,
					headerTitle: "Payment Method",
					headerTitleAlign: "center",
					headerLeft: () => {},
				})}
			/>
			<Stack.Screen
				name="Chat"
				component={Chat}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="WeekData"
				component={WeekData}
				options={() => ({
					headerShown: true,
					headerTitle: "Earnings",
					headerTitleAlign: "center",
					headerRight: () => <IconButton icon={"calendar-blank-outline"} />,
				})}
			/>
			<Stack.Screen
				name="WeekBalance"
				component={WeekBalance}
				options={() => ({
					headerShown: true,
					headerTitle: "Balance",
					headerTitleAlign: "center",
					headerRight: () => <IconButton icon={"calendar-blank-outline"} />,
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;
