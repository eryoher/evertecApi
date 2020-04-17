const RESTUtils = require('./RESTUtils');
const CodeGenerator = require('./CodeGenerator');
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const  Utf8 = require('crypto-js/enc-utf8');
const moment = require('moment');
const Axios = require('axios');

const createRequest = async function (payment) {            
    const urlRequest = 'https://test.placetopay.com/redirection/api/session/';
    const auth = await getAuthObject();
    const expiration = moment().add(1, 'week').format('YYYY-MM-DDTHH:mm:ssZ');
    const bodyRequest = {
        "buyer":{
           "name":"Ericson Yohany",
           "surname":"Hernandez",
           "email":"eryoher@gmail.com",
           "document":"14297922",
           "documentType":"CC",
           "mobile":3127714046
        },
        payment,
        auth,
        expiration, 
        "returnUrl":"https://localhost:3001/api/response",
        "ipAddress":"127.0.0.1",
        "userAgent":"PlacetoPay Sandbox"
    }

    try { 
        const instance = Axios.create();        
        const response = await instance.post( urlRequest, bodyRequest );        
        return response.data;
    } catch (error) {
        console.error(error);
        throw RESTUtils.getServerErrorResponse(RESTUtils.ERROR_GENERIC);       
    }        
}

const getAuthObject = async function () {
    const nonce = await CodeGenerator.generateCode(20);    
    const encrypNonce =  Base64.stringify(Utf8.parse(nonce))
    const now = moment().format('YYYY-MM-DDTHH:mm:ssZ');    
    const passKey = "024h1IlD";
    const login = "6dd490faf9cb87a9862245da41170ff2";
    const trankey =  Base64.stringify(CryptoJS.SHA1(`${nonce}${now}${passKey}`));
    const result = {
        login, 
        tranKey : trankey.toString(),
        nonce : encrypNonce,
        seed : now
    }   

    return result;
}

module.exports = {
    createRequest
}