'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    User,
    Mail,
    Lock,
    Calendar,
    CheckCircle,
    XCircle,
    Eye,
    EyeOff,
    Sparkles,
    Shield,
    TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
    });

    const [validation, setValidation] = useState({
        name: false,
        email: false,
        birthDate: false,
        password: false,
        confirmPassword: false,
    });

    const [passwordStrength, setPasswordStrength] = useState(0);

    // Validação em tempo real
    const validateField = (field: string, value: string) => {
        switch (field) {
            case 'name':
                return value.length >= 3;
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            case 'birthDate':
                if (!value) return false;
                const age = new Date().getFullYear() - new Date(value).getFullYear();
                return age >= 18;
            case 'password':
                return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
            case 'confirmPassword':
                return value === formData.password && value.length > 0;
            default:
                return false;
        }
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password)) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        return strength;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (type !== 'checkbox') {
            setValidation(prev => ({ ...prev, [name]: validateField(name, value) }));
        }

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
            if (formData.confirmPassword) {
                setValidation(prev => ({ ...prev, confirmPassword: value === formData.confirmPassword }));
            }
        }

        if (name === 'confirmPassword') {
            setValidation(prev => ({ ...prev, confirmPassword: value === formData.password }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.acceptTerms) {
            toast.error('Você precisa aceitar os termos de uso');
            return;
        }

        const allValid = Object.values(validation).every(v => v);
        if (!allValid) {
            toast.error('Por favor, preencha todos os campos corretamente');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    birthDate: formData.birthDate,
                    password: formData.password,
                    acceptTerms: formData.acceptTerms,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar conta');
            }

            toast.success('Conta criada com sucesso! Redirecionando...');

            // Auto login
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.ok) {
                router.push('/dashboard');
            } else {
                router.push('/auth/login');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 50) return 'bg-red-500';
        if (passwordStrength < 75) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 50) return 'Fraca';
        if (passwordStrength < 75) return 'Média';
        return 'Forte';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute w-64 h-64 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-4 animate-bounce">
                        <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Criar Conta
                    </h1>
                    <p className="text-gray-400">Junte-se à TREON e melhore suas apostas</p>
                </div>

                {/* Form Card */}
                <div className="bg-[#0f1419]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Nome Completo */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-11 py-3 bg-[#0a0e1a] border rounded-lg focus:outline-none focus:ring-2 transition-all ${formData.name && (validation.name ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')
                                        } ${!formData.name && 'border-white/10 focus:ring-emerald-500'}`}
                                    placeholder="Seu nome completo"
                                    required
                                />
                                {formData.name && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {validation.name ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-11 py-3 bg-[#0a0e1a] border rounded-lg focus:outline-none focus:ring-2 transition-all ${formData.email && (validation.email ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')
                                        } ${!formData.email && 'border-white/10 focus:ring-emerald-500'}`}
                                    placeholder="seu@email.com"
                                    required
                                />
                                {formData.email && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {validation.email ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Data de Nascimento */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Data de Nascimento
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-11 py-3 bg-[#0a0e1a] border rounded-lg focus:outline-none focus:ring-2 transition-all ${formData.birthDate && (validation.birthDate ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')
                                        } ${!formData.birthDate && 'border-white/10 focus:ring-emerald-500'}`}
                                    required
                                />
                                {formData.birthDate && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {validation.birthDate ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                            {formData.birthDate && !validation.birthDate && (
                                <p className="text-xs text-red-400 mt-1">Você deve ter pelo menos 18 anos</p>
                            )}
                        </div>

                        {/* Senha */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-11 py-3 bg-[#0a0e1a] border rounded-lg focus:outline-none focus:ring-2 transition-all ${formData.password && (validation.password ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')
                                        } ${!formData.password && 'border-white/10 focus:ring-emerald-500'}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-gray-400">Força da senha:</span>
                                        <span className={`font-semibold ${passwordStrength < 50 ? 'text-red-400' : passwordStrength < 75 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-[#0a0e1a] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{ width: `${passwordStrength}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Mín. 8 caracteres, maiúscula, minúscula e número
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirmar Senha */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-11 pr-11 py-3 bg-[#0a0e1a] border rounded-lg focus:outline-none focus:ring-2 transition-all ${formData.confirmPassword && (validation.confirmPassword ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500')
                                        } ${!formData.confirmPassword && 'border-white/10 focus:ring-emerald-500'}`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmPassword && !validation.confirmPassword && (
                                <p className="text-xs text-red-400 mt-1">As senhas não coincidem</p>
                            )}
                        </div>

                        {/* Termos */}
                        <div className="flex items-start gap-3 p-4 bg-[#0a0e1a] rounded-lg border border-white/10">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="mt-1 w-4 h-4 rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 bg-[#0a0e1a]"
                                required
                            />
                            <label className="text-sm text-gray-300">
                                Eu aceito os{' '}
                                <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 transition">
                                    termos de uso
                                </Link>{' '}
                                e confirmo que tenho 18 anos ou mais
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !formData.acceptTerms}
                            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    Criar Conta
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Já tem uma conta?{' '}
                            <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition">
                                Fazer Login
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Dados Protegidos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>100% Seguro</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
