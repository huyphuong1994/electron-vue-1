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
async function setWebhook(data, webhookUrl) {
    try {
        const telegramAPI = `https://api.telegram.org/bot${data.token_bot}/setWebhook?url=${webhookUrl}`;

        // Gọi API Telegram để đăng ký webhook
        const response = await axios.get(telegramAPI);

        return response.data;
    } catch (error) {
        return {
            ok: false
        };
        console.error('Error calling Telegram API:', error);
    }
}

// Hàm để hủy webhook của Telegram
async function deleteWebhook(botToken) {
    try {
        const telegramAPI = `https://api.telegram.org/bot${botToken}/deleteWebhook`;

        // Gọi API Telegram để hủy webhook
        const response = await axios.get(telegramAPI);

        return response.data;
    } catch (error) {
        console.error('Error calling Telegram API:', error);
        return {
            ok: false
        };
    }
}

//Ham lấy danh sách admin của group
async function getAdminList(data) {
    try {
        const telegramAPI = `https://api.telegram.org/bot${data[1]}/getChatAdministrators?chat_id=${data[2]}`;

        // Gọi API Telegram để đăng ký webhook
        const response = await axios.get(telegramAPI);

        return response.data;
    } catch (e) {
        return false;
    }
}

module.exports = {
    sendMessage,
    setWebhook,
    deleteWebhook,
    getAdminList
};
