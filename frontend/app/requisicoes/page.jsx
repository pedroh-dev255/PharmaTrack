
'use client';

import { useState, useEffect, useCallback } from "react";
import Navbar from "../_components/Navbar";
import {
    Users,
    ClipboardPlus,
    Search,
    ShieldCheck,
    CheckCircle2,
    XCircle,
    Mail,
    X,
    Edit,
    Power,
    PowerOff,
    AlertTriangle,
    Loader2,
    Stethoscope,
    ShieldCog,
    User as UserIcon
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function Requisicoes() {

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">

            <Navbar />

            <main className="flex-1 p-8 ml-8 mr-8 lg:p-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl">
                            <ClipboardPlus className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">
                                Requisições
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Pedido de Medicamentos
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => {

                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 px-5 py-3 rounded-xl text-white font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                    >
                        <ClipboardPlus size={18} />
                        Nova Requisição
                    </button>
                </div>


            </main>
        </div>
    )
}