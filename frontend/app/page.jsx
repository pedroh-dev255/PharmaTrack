import {
  Activity,
  Users,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import Navbar from "./_components/Navbar";
import toast from 'react-hot-toast';

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-[#F4F6F8]">
      {/* Sidebar */}
      <Navbar />

      {/* Área de conteúdo */}
      <main className="flex-1">
        <div className="h-full p-8">
          {/* Conteúdo das páginas será renderizado aqui */}
        </div>
      </main>
    </div>
  );
}