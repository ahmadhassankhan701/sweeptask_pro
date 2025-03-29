import axios from "axios";
import { SECRET_KEY } from "./keys";

export const AddAccount = async (details) => {
	try {
		const { data } = await axios.post(
			"https://api.paystack.co/bank/validate",
			details,
			{
				headers: {
					Authorization: `Bearer ${SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);
		return data;
	} catch (error) {
		console.log(error);
		return error;
	}
};
