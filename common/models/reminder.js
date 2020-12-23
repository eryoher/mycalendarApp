"use strict";

const RestUtils = require("../utils/RestUtils");
const moment = require("moment");

module.exports = function (Reminder) {
	/**
	 * To search all reminders
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

	/**
	 * To search all reminders
	 * @param {object} params data for search
	 * @param {Function(Error, object)} callback
	 */

	Reminder.remoteMethod("getRemindersByMonth", {
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

	Reminder.getRemindersByMonth = async function (req) {
		const { dateSearch } = req.query;
		const startOfMonth = moment(dateSearch).clone().startOf("month").format("YYYY-MM-DD");
		const endOfMonth = moment(dateSearch).clone().endOf("month").format("YYYY-MM-DD");

		try {
			const filter = {
				realDate: { between: [`${startOfMonth}`, `${endOfMonth}`] },
				active: 1,
			};

			const data = await Reminder.find({ where: filter });

			return RestUtils.buildStandarResponse(data);
		} catch (error) {
			console.error(error);
			throw RestUtils.getServerErrorResponse(ERROR_GENERIC);
		}
	};

	/**
	 * To remove all reminders by day
	 * @param {object} params date to remove
	 * @param {Function(Error, object)} callback
	 */

	Reminder.remoteMethod("removeRemindersByDay", {
		accepts: [
			{ arg: "req", type: "object", http: { source: "req" } },
			{ arg: "params", type: "object", description: "all object data", http: { source: "body" } },
		],
		returns: {
			type: "object",
			root: true,
			description: "response data of service",
		},
		description: "delete reminders by day",
		http: {
			verb: "post",
		},
	});

	Reminder.removeRemindersByDay = async function (req, params) {
		const { removeDate } = params;

		try {
			const data = await Reminder.updateAll({ realDate: moment(removeDate).format("YYYY-MM-DD") }, { active: 0 });

			return RestUtils.buildStandarResponse(data);
		} catch (error) {
			console.error(error);
			throw RestUtils.getServerErrorResponse(ERROR_GENERIC);
		}
	};
};
