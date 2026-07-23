const userService = require('../services/userService');


async function getUsers(req, res) {
    try {
        const users = await userService.getUsers();

        if(!users || users == null){
            throw new Error("Erro ao consultar usuarios");
        }

        return res.status(200).json({
            success: true,
            message: "Dados encontrados",
            users
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


async function toggleStatus(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        if(!id || id == null || id == ""){
            throw new Error("Cliente a ser inativado não foi recebido");
        }

        if(id == userId){
            throw new Error("Você não pode mudar seu proprio status!");
        }

        const result = await userService.toggleStatus(id);

        if(result !== true){
            throw new Error("Erro ao alterar Status do usuario!");
        }

        return res.status(200).json({
            success: true,
            message: "Usuario inativado",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


module.exports = {
    getUsers,
    toggleStatus
}