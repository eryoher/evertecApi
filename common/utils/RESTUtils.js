'use strict';

const ERROR_GENERIC = "Ocurrió un error en el servidor. Por favor, reintente o contacte al administrador";

const getBusinessErrorResponse = (message) => {
    return buildError(422, message);
}

const getUnauthorizedErrorResponse = (message) => {
    return buildError(403, message);
}

const getNotFoundErrorResponse = (message) => {
    return buildError(404, message);
}

const getConcurrentPersistenceErrorResponse = () => {
    return buildError(500, "No se puede guardar el objecto ya que existe una versión más reciente del mismo. Por favor recargue los datos e intente nuevamente.");
}

/**
 * An unexpected server error
 * 
 * @param {string} message 
 */
const getServerErrorResponse = (message) => {
    return buildError(500, message);
}

const buildError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

/**
 * Builds a generic successful structure to return to UI, with a 200 statusCode
 * @param {*} data an Object with the properties to be passed back to UI as the response
 */
const buildSuccessResponse = (data) => {
    return { ...data, statusCode: 200  }
}

/**
 * Builds a generic successful structure to return to UI, with a 200 statusCode
 * @param {*} data an Object with the properties to be passed back to UI as the response
 */
const buildStandarResponse = (data) => {
    return { data:data, statusCode: 200,  }
}



/**
 * Builds a response structure for a search query
 * 
 * @param {Array} data An array of objects to be returned as the result
 * @param {number} limitQuery the max page size
 * @param {number} page the current page number
 * @param {number} total the total count of items that match the query (regardless of the amount returned in this result)
 */
const buildResponse = (data, limitQuery, page, total) => {
    
    const response = {
        data: data,
        limit: limitQuery,
        page: page,
        totalCount: total,
        success: true
    }

    return response;
}

module.exports = {
    getBusinessErrorResponse,
    getUnauthorizedErrorResponse,
    getServerErrorResponse,
    buildResponse,
    buildSuccessResponse,
    ERROR_GENERIC,
    getNotFoundErrorResponse,
    getConcurrentPersistenceErrorResponse,
    buildStandarResponse
};