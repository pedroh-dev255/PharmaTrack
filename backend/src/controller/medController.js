const medService = require('../services/medService');

async function get(req, res) {
    try {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            grupo = '', 
            local = '', 
            status = '' 
        } = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const result = await medService.get({
            page: pageNum,
            limit: limitNum,
            search,
            grupo,
            local,
            status
        });

        return res.status(200).json({
            success: true,
            message: "Medicamentos agrupados listados com sucesso",
            ...result
        });

    } catch (error) {
        console.error('Erro ao listar medicamentos:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao listar medicamentos"
        });
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID do medicamento é obrigatório"
            });
        }

        const medicamento = await medService.getById(id);

        if (!medicamento) {
            return res.status(404).json({
                success: false,
                message: "Medicamento não encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Medicamento encontrado",
            medicamento
        });

    } catch (error) {
        console.error('Erro ao buscar medicamento:', error);
        return res.status(500).json({
            success: false,
            message: error.message || "Erro ao buscar medicamento"
        });
    }
}


module.exports = {
    get,
    getById
}