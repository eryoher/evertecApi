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
        const product = await Order.app.models.products.findById(params.productsId);
        const requestParams = {
            buyer:{
                name:params.customer_name,
                surname:params.customer_lastname,
                email:params.customer_email,
                document:params.customer_cedula,
                documentType:"CC",
                mobile:params.customer_mobile
             },
            payment: {
                reference: product.name,
                description: "Prueba de Comprar",
                amount: {
                    currency: "COP",
                    total: product.price
                }
            }
        }

        try {
            const request = await Request.createRequest(requestParams);
            params.requestId = request.requestId;
            params.processUrl = request.processUrl;            
            params.customer_name = params.customer_name.concat()
            const response = await Order.create(params);
            const order = await Order.findById(response.id, { include: ['products'] });
            return RESTUtils.buildSuccessResponse({ data: order });

        } catch (error) {
            console.error(error);
            throw RESTUtils.getServerErrorResponse(RESTUtils.ERROR_GENERIC);
        }
    }


    Order.remoteMethod('checkPayment', {
        accepts: [
            { arg: 'params', type: 'object', 'description': 'all object data', 'http': { 'source': 'body' } },

        ],
        returns: {
            type: 'object',
            root: true,
            description: 'response data of service'
        },
        description: 'Post current orders',
        http: {
            verb: 'post'
        },
    });

    Order.checkPayment = async function (params) {
        const response = true;
        try {
            const orderSearch = await Order.findOne({ where: { requestId: params.requestId } });
            if (orderSearch.status !== params.status.status) { //Se compara el estado                                             
                await orderSearch.updateAttributes({ status: params.status.status }); //Se modifica el estado.                                
            }

        } catch (error) {
            console.error(error)
        }

        return response;
    }

};
