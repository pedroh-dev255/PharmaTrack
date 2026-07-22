'use client';

import {
  Activity,
  Users,
  Building2,
  ShieldCheck,
  Table,
} from 'lucide-react';
import Navbar from "./_components/Navbar";
import { useEffect, useState } from 'react';


export default function Dashboard() {



  return (
    <div className="min-h-screen flex bg-[#F4F6F8]">
      {/* Sidebar */}
      <Navbar />
      {/* Área de conteúdo */}
      <main className="flex-1">
        <div className="h-full p-8 ml-10 mr-10">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 gap-6">

            
          </div>
        </div>
      </main>
    </div>
  );
}