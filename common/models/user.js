'use strict';

const RestUtils = require("../utils/RestUtils");

module.exports = function (User) {

    /**
     * To search categories by one requerimient
     * @param {object} params data for search
     * @param {Function(Error, object)} callback
     */


    User.remoteMethod('getUsers', {
        accepts: [
            { arg: 'req', type: 'object', http: { source: 'req' } },
        ],
        returns: {
            type: 'object',
            root: true,
            description: 'response data of service'
        },
        description: 'get all user',
        http: {
            verb: 'get'
        },
    });

    User.getUsers = async function (req) {
        
        const { page, pageSize } = req.query;
        const limitQuery = (pageSize) ? pageSize : 10;
        const skip = (page) ? ((page - 1) * limitQuery) : 0;

        try {
            const filter = {
                limit: limitQuery,
                skip
            };

            const [total, data] = await Promise.all([
                User.count(),
                User.find(filter)
            ]);

            return RestUtils.buildResponse(data, parseInt(limitQuery), parseInt((page) ? page : skip), total);

        } catch (error) {
            console.error(error);
            throw RestUtils.getServerErrorResponse(ERROR_GENERIC);
        }
    }

};
