const { Router } = require("express");
const notificationService = require("../services/notificationService");
const isAdminMiddleware = require("../middlewares/adminMiddleware");
const { fromJSONSchema } = require("zod");
const router = Router();

/**
 * POST /api/notifications/send-to-user
 * Envia notificação para um usuário específico
 */
router.post("/send-to-user", isAdminMiddleware, async (req, res) => {
    try {
        const { userId, title, message, level, sound, data } = req.body;
        const from = req.user.id;
        if (!userId || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "userId, title e message são obrigatórios"
            });
        }

        notificationService.sendToUser(userId, { title, message, level, sound, data }, from);

        return res.status(200).json({
            success: true,
            message: "Notificação enviada com sucesso"
        });
    } catch (error) {
        console.error("Erro ao enviar notificação:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao enviar notificação"
        });
    }
});

/**
 * POST /api/notifications/send-to-group
 * Envia notificação para um grupo específico
 */
router.post("/send-to-group", isAdminMiddleware, async (req, res) => {
    try {
        const { groupName, title, message, level, sound, data } = req.body;
        const from = req.user.id;

        if (!groupName || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "groupName, title e message são obrigatórios"
            });
        }

        await notificationService.sendToGroup(groupName, { title, message, level, sound, data }, from);

        return res.status(200).json({
            success: true,
            message: "Notificação enviada com sucesso para o grupo"
        });
    } catch (error) {
        console.error("Erro ao enviar notificação para grupo:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao enviar notificação"
        });
    }
});

/**
 * POST /api/notifications/send-to-all
 * Envia notificação para todos os usuários online
 */
router.post("/send-to-all", isAdminMiddleware, async (req, res) => {
    try {
        const { title, message, level, sound, data } = req.body;
        const from = req.user.id;
        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: "title e message são obrigatórios"
            });
        }

        console.log("[API] Enviando notificação para todos:", { title, message, level, sound });
        await notificationService.sendToAll(title, message, { level, sound, data }, from);

        return res.status(200).json({
            success: true,
            message: "Notificação enviada para todos os usuários"
        });
    } catch (error) {
        console.error("Erro ao enviar notificação em broadcast:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao enviar notificação"
        });
    }
});

/**
 * POST /api/notifications/test
 * Envia notificação de teste para validar sistema
 * Apenas para admins
 */
router.post("/test", isAdminMiddleware, async (req, res) => {
    try {
        console.log("[API] Teste de notificação para todos");
        
        await notificationService.sendToAll(
            "Teste de Notificação",
            "Esta é uma notificação de teste do sistema",
            {
                type: "info",
                sound: "notification-simple"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Notificação de teste enviada"
        });
    } catch (error) {
        console.error("Erro ao enviar notificação de teste:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao enviar notificação de teste"
        });
    }
});

module.exports = router;
