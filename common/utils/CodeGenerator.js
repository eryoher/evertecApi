const RESTUtils = require('./RESTUtils');

const generateCode = async function ( long ) {        
    const  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";    

    try {
        let pass = '';                
        for (let index = 0; index < long; index++) {                       
            pass += characters.charAt(Math.floor(Math.random()*characters.length));                   
        }
        
        return pass;            

    } catch (error) {
        console.error(error);
        throw RESTUtils.getServerErrorResponse( RESTUtils.ERROR_GENERIC);       
    }        
}

module.exports = {
    generateCode
}