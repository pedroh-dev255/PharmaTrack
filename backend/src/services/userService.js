const pool = require('../configs/db');
const authService = require("./authService")

async function getUsers() {
    try {
        const [res] = await pool.query("SELECT u.id, u.nome, u.nome_exibicao, u.email, u.ativo, r.nome as perfil FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id LEFT JOIN roles r ON r.id = ur.role_id;");

        if(res.length <= 0){
            throw new Error("Nenhum usuario encontrado");
        }
        return res;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function toggleStatus(id) {
    try {
        const [atual] = await pool.query("SELECT ativo FROM users WHERE id = ?", [id]);
        let status = false;

        if(atual[0].ativo == false){
            status = true;
        }
        const res = await pool.query("UPDATE users SET ativo = ? WHERE id = ?", [status, id]);

        if(res.affectedRows === 0){
            throw new Error("Nenhum usuario encontrado com este ID");
        }

        if(status === false){
            console.log("logoff no usuario: ", id)
            await authService.logout(id);
        }

        return true;
    } catch (error) {
        throw new Error(error.message);
    }    
}


module.exports = {
    getUsers,
    toggleStatus
}