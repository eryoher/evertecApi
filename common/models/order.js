'use strict';
const RESTUtils = require('../utils/RESTUtils');
const Request = require('../utils/Request');
const CodeGenerator = require('../utils/CodeGenerator');
const config = require('../../server/config.json');


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
        let reference = null;
        let exists = null;
        
        do {
            reference = await CodeGenerator.generateCode(8);
            exists = await Order.findOne({ where: { referenceCode: reference } });  //Se valida de que el codigo sea unico.            
        } while (exists !== null);

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
                reference: reference,
                description:product.name,
                amount: {
                    currency: "COP",
                    total: product.price
                }
            },
            returnUrl:`${config.returnUrl}${reference}`

        }

        try {
            const request = await Request.createRequest(requestParams);
            params.requestId = request.requestId;
            params.processUrl = request.processUrl;            
            params.referenceCode = reference;
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
        const newStatus = ( params.status.status === 'APPROVED' ) ? 'PAYED': params.status.status;
        console.log(params)
        try {
            const orderSearch = await Order.findOne({ where: { requestId: params.requestId } });
            if (orderSearch.status !== newStatus) { //Se compara el estado                                             
                await orderSearch.updateAttributes({ status: newStatus }); //Se modifica el estado.                                
            }

        } catch (error) {
            console.error(error)
        }

        return response;
    }


    Order.remoteMethod('getPayment', {
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

    Order.getPayment = async function (params) {
        const response = true;
        try {
            const order = await Order.findOne({ where: { referenceCode: params.code } });
            const payment = await Request.getRequest(order.requestId);
            const newStatus = ( payment.status.status === 'APPROVED' ) ? 'PAYED': payment.status.status;

            if (order.status !== newStatus) { //Se compara el estado                                             
                await order.updateAttributes({ status: newStatus }); //Se modifica el estado.                                
            }
            return RESTUtils.buildSuccessResponse({ data: {payment, order} });            

        } catch (error) {
            console.error(error)
        }

        return response;
    }

};
