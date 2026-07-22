const pool = require('../configs/db');

async function getConfig(key) {
    try {
        if(!isset(key) || key == "" || key == null){
            throw new Error("Chave de configuração invalida");
        }

        const [result] = await pool.query("SELECT * FROM configs WHERE chave = ?", [key]);
        
        if (result.length === 0) {
            throw new Error("Config não encontrada!");
        }
    
        return result;
    } catch (error) {
        throw new Error(error.message ?? "Erro interno do servidor");
    }
}


module.exports = {
    getConfig
}