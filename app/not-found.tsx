import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          404
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Página não encontrada</h1>
        
        <p className="text-gray-400 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2 inline-flex"
          >
            <Home className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>

          <Link
            href="/casas"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 inline-flex"
          >
            <Search className="w-5 h-5" />
            Ver Casas de Apostas
          </Link>
        </div>
      </div>
    </div>
  );
}
