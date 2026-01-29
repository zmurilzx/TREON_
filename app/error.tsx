'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Algo deu errado!</h1>
        
        <p className="text-gray-400 mb-8">
          Ocorreu um erro ao carregar a página. Isso pode ser temporário.
        </p>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Tentar Novamente
          </button>

          <Link
            href="/dashboard"
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-xs text-gray-500 mb-2">Dicas:</p>
          <ul className="text-xs text-gray-400 text-left space-y-1">
            <li>• Verifique sua conexão com a internet</li>
            <li>• Limpe o cache do navegador (Ctrl + Shift + Delete)</li>
            <li>• Tente acessar em modo anônimo</li>
            <li>• Aguarde alguns minutos e tente novamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
