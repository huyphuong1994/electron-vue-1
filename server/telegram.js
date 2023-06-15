const axios = require('axios');

// Hàm gọi API để gửi tin nhắn đến Telegram
async function sendMessage(botToken, chatId, message) {
    try {
        const telegramAPI = `https://api.telegram.org/bot${botToken}/sendMessage`;

        // Gọi API Telegram để gửi tin nhắn
        const response = await axios.post(telegramAPI, {
            chat_id: chatId,
            text: message
        });

        return response.data;
    } catch (error) {
        console.error('Error calling Telegram API:', error);
        throw new Error('Failed to send message to Telegram');
    }
}

// Hàm để đăng ký webhook của Telegram
async function setWebhook(botToken, webhookUrl) {
    try {
        const telegramAPI = `https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`;

        // Gọi API Telegram để đăng ký webhook
        const response = await axios.get(telegramAPI);

        console.log('123wwebhook', response)
        return response;
    } catch (error) {
        console.error('Error calling Telegram API:', error);
        throw new Error('Failed to set Telegram webhook');
    }
}

module.exports = {
    sendMessage,
    setWebhook
};
