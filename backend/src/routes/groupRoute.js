const { Router } = require("express");
const pool = require("../configs/db");
const router = Router();

/**
 * GET /groups
 * Retorna todos os grupos (roles) disponíveis
 */
router.get("/", async (req, res) => {
    try {
        const [groups] = await pool.query("SELECT id, nome FROM roles ORDER BY nome");
        
        return res.status(200).json({
            success: true,
            message: "Grupos encontrados",
            groups: groups || []
        });
    } catch (error) {
        console.error("Erro ao buscar grupos:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao buscar grupos"
        });
    }
});

module.exports = router;
