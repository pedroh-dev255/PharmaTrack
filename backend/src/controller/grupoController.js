const localService = require('../services/localService');

async function getAll(req, res) {
    try {
        const result = await localService.getAll();

        if(!result || result == null){
            throw new Error("Nenhum resultado encontrado!");
        }

        return res.status(200).json({
            success: true,
            message: "Grupos de Medicamentos encontrados",
            groups: result
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