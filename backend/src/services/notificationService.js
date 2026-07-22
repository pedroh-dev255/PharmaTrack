const { sendNotificationToUser, sendNotificationToGroup, broadcastNotification } = require("../ws/index");

// Tipos de notificações disponíveis
const NOTIFICATION_TYPES = {
    INFO: "info",
    SUCCESS: "success",
    WARNING: "warning",
    ERROR: "error",
    ALERT: "alert"
};

// Sons disponíveis
const NOTIFICATION_SOUNDS = {
    SIMPLE: "notification-simple",
    ALERT: "notification-alert"
};

/**
 * Envia uma notificação para um usuário específico
 * @param {number} userId - ID do usuário
 * @param {string} title - Título da notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} level - Tipo de notificação (info, success, warning, error, alert)
 * @param {string} sound - Som a ser tocado (simple, alert)
 * @param {object} data - Dados adicionais da notificação
 */
const sendToUser = (userId, { title, message, level = NOTIFICATION_TYPES.INFO, sound = NOTIFICATION_SOUNDS.SIMPLE, data = {} }, from) => {
    sendNotificationToUser(userId, {
        type: "notification",
        title,
        message,
        level,
        sound,
        data,
        timestamp: new Date().toISOString()
    }, from);
};

/**
 * Envia uma notificação para um grupo específico
 * @param {string} groupName - Nome do grupo
 * @param {string} title - Título da notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} level - Tipo de notificação
 * @param {string} sound - Som a ser tocado
 * @param {object} data - Dados adicionais
 */
const sendToGroup = async (groupName, { title, message, level = NOTIFICATION_TYPES.INFO, sound = NOTIFICATION_SOUNDS.SIMPLE, data = {} }, from) => {
    await sendNotificationToGroup(groupName, {
        type: "notification",
        title,
        level,
        message,
        sound,
        data,
        timestamp: new Date().toISOString()
    }, from);
};

/**
 * Envia uma notificação para todos os usuários online
 * @param {string} title - Título da notificação
 * @param {string} message - Mensagem da notificação
 * @param {string} level - Tipo de notificação
 * @param {string} sound - Som a ser tocado
 * @param {object} data - Dados adicionais
 */
const sendToAll = async (title, message, { level = NOTIFICATION_TYPES.INFO, sound = NOTIFICATION_SOUNDS.SIMPLE, data = {} } = {}, from) => {
    await broadcastNotification({
        title,
        message,
        type: "notification",
        level,
        sound,
        data,
        timestamp: new Date().toISOString()
    }, from);
};

module.exports = {
    sendToUser,
    sendToGroup,
    sendToAll,
    NOTIFICATION_TYPES,
    NOTIFICATION_SOUNDS
};
