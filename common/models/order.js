'use strict';
const RESTUtils = require('../utils/RESTUtils');
const Request = require('../utils/Request');

module.exports = function (Order) {

    /**
     * To creata a orde
     * @param {object} params data for search
     * @param {Function(Error, object)} callback
     */

    Order.remoteMethod('createOrder', {
        accepts: [
            { arg: 'req', type: 'object', http: { source: 'req' } },
            { arg: 'params', type: 'object', 'description': 'all object data', 'http': { 'source': 'body' } },

        ],
        returns: {
            type: 'object',
            root: true,
            description: 'response data of service'
        },
        description: 'Post Order',
        http: {
            verb: 'post'
        },
    });

    Order.createOrder = async function (req, params) {
        const payment = {
            reference: "test1",
            description: "Prueba de Comprar",
            amount: {
                currency: "COP",
                total: 10000
            }
        };
        try {
            const request  = await Request.createRequest(payment);            
            params.requestId = request.requestId;
            params.processUrl = request.processUrl;
            const response = await Order.create(params);            

            return RESTUtils.buildSuccessResponse({ data: response });

        } catch (error) {
            console.error(error);
            throw RESTUtils.getServerErrorResponse(RESTUtils.ERROR_GENERIC);
        }
    }

};
