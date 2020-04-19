const RESTUtils = require('./RESTUtils');
const CodeGenerator = require('./CodeGenerator');
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const Utf8 = require('crypto-js/enc-utf8');
const moment = require('moment');
const Axios = require('axios');
const config = require('../../server/config.json');


const createRequest = async function (params) {
    const auth = await getAuthObject();
    const expiration = moment().add(1, 'day').format('YYYY-MM-DDTHH:mm:ssZ');
    const bodyRequest = {
        buyer: params.buyer,
        payment: params.payment,
        auth,
        expiration,
        returnUrl: params.returnUrl,
        notificationURL: `${config.baseAppUrl}orders/checkPayment`,
        ipAddress: "127.0.0.1",
        userAgent: "PlacetoPay Sandbox"
    }

    try {
        const instance = Axios.create();
        const response = await instance.post(config.placeToPay.urlRequest, bodyRequest);
        return response.data;
    } catch (error) {
        console.error(error);
        throw RESTUtils.getServerErrorResponse(RESTUtils.ERROR_GENERIC);
    }
}


const getRequest = async function (requestId) {
    const auth = await getAuthObject();
    try {
        const instance = Axios.create();
        const response = await instance.post(`${config.placeToPay.urlRequest}${requestId}`, { auth });
        return response.data;
    } catch (error) {
        console.error(error);
        throw RESTUtils.getServerErrorResponse(RESTUtils.ERROR_GENERIC);
    }
}

const getAuthObject = async function () {
    const nonce = await CodeGenerator.generateCode(20);
    const encrypNonce = Base64.stringify(Utf8.parse(nonce))
    const now = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const passKey = config.placeToPay.passKey;
    const login = config.placeToPay.login;
    const trankey = Base64.stringify(CryptoJS.SHA1(`${nonce}${now}${passKey}`));
    const result = {
        login,
        tranKey: trankey.toString(),
        nonce: encrypNonce,
        seed: now
    }

    return result;
}

module.exports = {
    createRequest,
    getRequest
}