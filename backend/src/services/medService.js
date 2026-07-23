const pool = require('../configs/db');

async function get({ page = 1, limit = 10, search = '', grupo = '', local = '', status = '' }) {
    const offset = (page - 1) * limit;
    const queryParams = [];

    // Construir query base com GROUP BY para agrupar
    let query = `
        SELECT 
            m.nome,
            m.principio,
            m.validade,
            m.disponivel,
            ANY_VALUE(m.dt_retirada) as dt_retirada,
            m.id_local,
            m.id_grupo,
            g.nome as grupo_nome,
            l.nome as local_nome,
            COUNT(*) as quantidade
        FROM medicamentos m
        LEFT JOIN grupo_medicamento g ON m.id_grupo = g.id
        LEFT JOIN local_medicamento l ON m.id_local = l.id
        WHERE 1=1
    `;

    // Filtro de busca
    if (search) {
        query += ` AND (m.nome LIKE ? OR m.principio LIKE ?)`;
        queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Filtro por grupo
    if (grupo) {
        query += ` AND m.id_grupo = ?`;
        queryParams.push(parseInt(grupo));
    }

    // Filtro por local
    if (local) {
        query += ` AND m.id_local = ?`;
        queryParams.push(parseInt(local));
    }

    // Filtro por status
    if (status === 'disponivel') {
        query += ` AND m.disponivel = 1 AND m.validade >= CURDATE()`;
    } else if (status === 'indisponivel') {
        query += ` AND (m.disponivel = 0 OR m.validade < CURDATE())`;
    }

    // Agrupar pelos campos que definem um medicamento único
    query += `
        GROUP BY 
            m.nome, 
            m.principio, 
            m.validade, 
            m.disponivel,
            m.id_local,
            m.id_grupo,
            g.nome,
            l.nome
    `;

    // Query para contar total de grupos
    const countQuery = `
        SELECT COUNT(*) as total FROM (
            ${query}
        ) as grouped
    `;

    // Buscar total de grupos
    const [countResult] = await pool.query(countQuery, queryParams);
    const total = countResult[0]?.total || 0;

    // Adicionar ordenação e paginação
    query += ` ORDER BY m.nome ASC LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    // Executar query principal
    const [rows] = await pool.query(query, queryParams);

    // Formatar dados
    const medicamentos = rows.map(row => ({
        nome: row.nome,
        principio: row.principio,
        validade: row.validade,
        disponivel: row.disponivel === 1,
        dt_retirada: row.dt_retirada,
        id_local: row.id_local,
        id_grupo: row.id_grupo,
        local: {
            id: row.id_local,
            nome: row.local_nome
        },
        grupo: {
            id: row.id_grupo,
            nome: row.grupo_nome
        },
        quantidade: parseInt(row.quantidade)
    }));

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return {
        medicamentos,
        total,
        totalPages,
        hasMore,
        currentPage: page,
        limit
    };
}

/**
 * Buscar medicamento por ID (agora retorna todos os itens do grupo)
 */
async function getById(id) {
    const query = `
        SELECT 
            m.*,
            g.nome as grupo_nome,
            l.nome as local_nome,
            u_cad.nome as cad_user_nome,
            u_upd.nome as upd_user_nome
        FROM medicamentos m
        LEFT JOIN grupo_medicamento g ON m.id_grupo = g.id
        LEFT JOIN local_medicamento l ON m.id_local = l.id
        LEFT JOIN users u_cad ON m.cad_user = u_cad.id
        LEFT JOIN users u_upd ON m.upd_user = u_upd.id
        WHERE m.id = ?
    `;

    const [rows] = await pool.query(query, [id]);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];

    return {
        id: row.id,
        nome: row.nome,
        principio: row.principio,
        validade: row.validade,
        disponivel: row.disponivel === 1,
        dt_retirada: row.dt_retirada,
        id_local: row.id_local,
        id_grupo: row.id_grupo,
        local: {
            id: row.id_local,
            nome: row.local_nome
        },
        grupo: {
            id: row.id_grupo,
            nome: row.grupo_nome
        },
        cad_user: row.cad_user,
        upd_user: row.upd_user,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

/**
 * Buscar detalhes de um grupo específico de medicamentos
 */
async function getGroupDetails(nome, principio, validade, id_local, id_grupo, disponivel) {
    const query = `
        SELECT 
            m.*,
            g.nome as grupo_nome,
            l.nome as local_nome,
            u_cad.nome as cad_user_nome,
            u_upd.nome as upd_user_nome
        FROM medicamentos m
        LEFT JOIN grupo_medicamento g ON m.id_grupo = g.id
        LEFT JOIN local_medicamento l ON m.id_local = l.id
        LEFT JOIN users u_cad ON m.cad_user = u_cad.id
        LEFT JOIN users u_upd ON m.upd_user = u_upd.id
        WHERE m.nome = ? 
          AND m.principio = ? 
          AND m.validade = ?
          AND m.id_local = ?
          AND m.id_grupo = ?
          AND m.disponivel = ?
    `;

    const [rows] = await pool.query(query, [nome, principio, validade, id_local, id_grupo, disponivel ? 1 : 0]);

    return rows;
}

module.exports = {
    get,
    getById,
    getGroupDetails
};