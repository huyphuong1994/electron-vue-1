function createResponse(status, message, data, code) {
    return {
        status,
        message,
        data,
        code
    };
}

module.exports = {
    createResponse
};
