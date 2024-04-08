import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProIntro from "../../screens/ProIntro";
import ProLogin from "../../screens/ProLogin";
import ProRegister from "../../screens/ProRegister";
const Stack = createNativeStackNavigator();
const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="ProIntro"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="ProIntro"
				component={ProIntro}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="ProLogin"
				component={ProLogin}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="ProRegister"
				component={ProRegister}
				options={() => ({
					headerShown: false,
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;
