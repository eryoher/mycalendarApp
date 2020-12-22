"use strict";

const RestUtils = require("../utils/RestUtils");

module.exports = function (Reminder) {
	/**
	 * To search categories by one requerimient
	 * @param {object} params data for search
	 * @param {Function(Error, object)} callback
	 */

	Reminder.remoteMethod("getRemindersByDay", {
		accepts: [{ arg: "req", type: "object", http: { source: "req" } }],
		returns: {
			type: "object",
			root: true,
			description: "response data of service",
		},
		description: "get reminders by day",
		http: {
			verb: "get",
		},
	});

	Reminder.getRemindersByDay = async function (req) {
		const { daydate } = req.query;

		try {
			const filter = {
				date: { between: [`${daydate} 00:00:00`, `${daydate} 23:59:59`] },
			};

			const data = await Reminder.find({ where: filter });

			return RestUtils.buildStandarResponse(data);
		} catch (error) {
			console.error(error);
			throw RestUtils.getServerErrorResponse(ERROR_GENERIC);
		}
	};
};
