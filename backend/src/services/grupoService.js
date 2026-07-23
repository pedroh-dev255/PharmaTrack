const pool = require("../configs/db");

async function getAll() {
    try {
        const [rows] = await pool.query("SELECT id, nome FROM grupo_medicamento ORDER BY nome ASC");

        return rows;
    } catch (error) {
        console.log(error.message)
        throw new Error("Erro ao consultar grupos");
    }
}


module.exports = {
    getAll
}