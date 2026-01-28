"use client";

import Link from "next/link";
import { TrendingUp, ArrowRight, Database } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
    const [testingDb, setTestingDb] = useState(false);
    const [dbResult, setDbResult] = useState<any>(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersResult, setUsersResult] = useState<any>(null);

    const testDatabaseConnection = async () => {
        setTestingDb(true);
        setDbResult(null);
        
        try {
            const response = await fetch('/api/test-db');
            const data = await response.json();
            setDbResult(data);
        } catch (error) {
            setDbResult({
                success: false,
                message: 'Erro ao testar conexão',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        } finally {
            setTestingDb(false);
        }
    };

    const listUsers = async () => {
        setLoadingUsers(true);
        setUsersResult(null);
        
        try {
            const response = await fetch('/api/users/list');
            const data = await response.json();
            setUsersResult(data);
        } catch (error) {
            setUsersResult({
                success: false,
                message: 'Erro ao listar usuários',
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        } finally {
            setLoadingUsers(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center px-4">
            {/* Centered Content */}
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold">
                            TRE<span className="text-emerald-400">ON</span>
                        </h1>
                    </div>
                    <div className="h-1 w-24 bg-emerald-500 mx-auto rounded-full"></div>
                </div>

                {/* Tagline */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Calculadoras, métodos e ferramentas profissionais
                    </h2>
                    <p className="text-gray-400 text-lg">
                        tudo em um só lugar
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-4">
                    <Link
                        href="/auth/register"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
                    >
                        Acesse grátis agora
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="/auth/login"
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center border border-gray-700"
                    >
                        Já tenho conta
                    </Link>

                    <button
                        onClick={testDatabaseConnection}
                        disabled={testingDb}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-blue-500"
                    >
                        <Database className="w-5 h-5" />
                        {testingDb ? 'Testando conexão...' : 'Testar Banco de Dados'}
                    </button>

                    <button
                        onClick={listUsers}
                        disabled={loadingUsers}
                        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-purple-500"
                    >
                        <Database className="w-5 h-5" />
                        {loadingUsers ? 'Carregando...' : 'Ver Usuários Cadastrados'}
                    </button>
                </div>

                {/* Database Test Result */}
                {dbResult && (
                    <div className={`mt-6 p-4 rounded-xl border ${
                        dbResult.success 
                            ? 'bg-emerald-900/20 border-emerald-500/30' 
                            : 'bg-red-900/20 border-red-500/30'
                    }`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                dbResult.success ? 'bg-emerald-500' : 'bg-red-500'
                            }`}></div>
                            <div className="flex-1">
                                <p className={`font-semibold mb-2 ${
                                    dbResult.success ? 'text-emerald-400' : 'text-red-400'
                                }`}>
                                    {dbResult.message}
                                </p>
                                {dbResult.success && dbResult.data?.tables && (
                                    <div className="text-sm text-gray-400">
                                        <p className="mb-1">Tabelas encontradas: {dbResult.data.tables.length}</p>
                                        <div className="max-h-32 overflow-y-auto">
                                            {dbResult.data.tables.map((table: any, idx: number) => (
                                                <span key={idx} className="inline-block bg-gray-800 px-2 py-1 rounded mr-2 mb-1 text-xs">
                                                    {table.table_name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!dbResult.success && dbResult.error && (
                                    <p className="text-sm text-red-300 mb-2">Erro: {dbResult.error}</p>
                                )}
                                {dbResult.suggestions && (
                                    <div className="text-xs text-gray-400 mt-2">
                                        <p className="font-semibold mb-1">Sugestões:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            {dbResult.suggestions.map((suggestion: string, idx: number) => (
                                                <li key={idx}>{suggestion}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users List Result */}
                {usersResult && (
                    <div className={`mt-6 p-4 rounded-xl border ${
                        usersResult.success 
                            ? 'bg-purple-900/20 border-purple-500/30' 
                            : 'bg-red-900/20 border-red-500/30'
                    }`}>
                        <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                usersResult.success ? 'bg-purple-500' : 'bg-red-500'
                            }`}></div>
                            <div className="flex-1">
                                <p className={`font-semibold mb-2 ${
                                    usersResult.success ? 'text-purple-400' : 'text-red-400'
                                }`}>
                                    {usersResult.success ? `${usersResult.count} usuário(s) cadastrado(s)` : usersResult.message}
                                </p>
                                {usersResult.success && usersResult.users && (
                                    <div className="text-sm text-gray-400 space-y-3 max-h-64 overflow-y-auto">
                                        {usersResult.users.map((user: any) => (
                                            <div key={user.id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-white">{user.name}</span>
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {!usersResult.success && usersResult.error && (
                                    <p className="text-sm text-red-300 mb-2">Erro: {usersResult.error}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="text-center mt-16">
                    <p className="text-sm text-gray-500">
                        © 2025 TREON. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
