'use client';

import {
  Activity,
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Table,
  ClipboardList
} from 'lucide-react';
import Navbar from "../_components/Navbar";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function Medicamentos() {



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />
      <main className="flex-1 p-8 ml-8 mr-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <ClipboardList className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Medicamentos
              </h1>
              <p className="text-slate-500 text-sm">
                Gerenciador de medicamentos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">


        </div>
      </main>
    </div>
  );
}