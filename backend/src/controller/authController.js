const authService = require("../services/authService");
const { disconnectUserWS } = require("../ws/index");
const redis = require("../configs/redis");
const { z } = require("zod");

// =========================
// SCHEMAS
// =========================

const passwordSchema = z
    .string({
        required_error: "Senha é obrigatória",
        invalid_type_error: "Senha inválida"
    })
    .trim()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/\d/, "Senha deve conter pelo menos um número")
    .regex(/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]]/, "Senha deve conter pelo menos um caractere especial");

const loginSchema = z.object({
    email: z
        .string({
            required_error: "Email é obrigatório",
            invalid_type_error: "Email inválido"
        })
        .trim()
        .toLowerCase()
        .email("Email inválido"),

    password: z
        .string({
            required_error: "Senha é obrigatória",
            invalid_type_error: "Senha inválida"
        })
        .min(1, "Senha é obrigatória")
        .max(100, "Senha inválida")
}).strict("Campos inválidos enviados.");

const registerSchema = z.object({
    nome: z
        .string({
            required_error: "Nome é obrigatório",
            invalid_type_error: "Nome inválido"
        })
        .trim()
        .min(3, "Nome deve possuir no mínimo 3 caracteres")
        .max(100, "Nome deve possuir no máximo 100 caracteres"),

    exib_nome: z
        .string({
            required_error: "Nome de exibição é obrigatório",
            invalid_type_error: "Nome de exibição inválido"
        })
        .trim()
        .min(3, "Nome de exibição deve possuir no mínimo 3 caracteres")
        .max(50, "Nome de exibição deve possuir no máximo 50 caracteres"),

    email: z
        .string({
            required_error: "Email é obrigatório",
            invalid_type_error: "Email inválido"
        })
        .trim()
        .toLowerCase()
        .email("Email inválido"),

    senha: passwordSchema
}).strict("Campos inválidos enviados.");


// =========================
// LOGIN
// =========================

async function login(req, res) {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.flatten().fieldErrors
            });
        }

        const { email, password } = validation.data;

        const userData = await authService.login(email, password);

        return res.status(200).json({
            success: true,
            message: "Login bem-sucedido",
            userData
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message ?? "Credenciais inválidas"
        });
    }
}


// =========================
// REGISTER
// =========================

async function register(req, res) {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                errors: validation.error.flatten().fieldErrors
            });
        }

        const { nome, exib_nome, email, senha } = validation.data;

        const userData = await authService.register(
            nome,
            exib_nome,
            email,
            senha
        );
        
        return res.status(201).json({
            success: true,
            message: "Usuário registrado com sucesso",
            userData
        });

    } catch (error) {
        console.error("Erro ao registrar usuário:", error);

        return res.status(500).json({
            success: false,
            message: error.message ?? "Erro interno do servidor"
        });
    }
}

async function logout(req, res) {
    try {
        //console.log('Logout request received ', req.user);
        const {id} = req.user;
        //console.log('Logout user id:', id);

        await redis.del(`user:${id}:token`);
        await disconnectUserWS(id);

        return res.status(200).json({
            success: true,
            message: 'Logout bem-sucedido'
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Erro no Logout: ' + (error.message ?? "Erro interno do servidor")
        });
    }
}

module.exports = {
    login,
    register,
    logout
};