const grupoService = require('../services/grupoService');

async function getAll(req, res) {
    try {
        const result = await grupoService.getAll();

        if(!result || result == null){
            throw new Error("Nenhum resultado encontrado!");
        }

        return res.status(200).json({
            success: true,
            message: "Locais encontrados",
            locais: result
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getAll
}