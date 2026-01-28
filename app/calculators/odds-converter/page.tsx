'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';

type OddsFormat = 'decimal' | 'fractional' | 'american';

export default function OddsConverterPage() {
    const [inputFormat, setInputFormat] = useState<OddsFormat>('decimal');
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState<{
        decimal: string;
        fractional: string;
        american: string;
        probability: string;
    } | null>(null);

    const handleConvert = () => {
        if (!inputValue) return;

        let decimal = 0;

        // Convert input to decimal
        switch (inputFormat) {
            case 'decimal':
                decimal = parseFloat(inputValue);
                break;
            case 'fractional':
                const [num, den] = inputValue.split('/').map(Number);
                decimal = num / den + 1;
                break;
            case 'american':
                const american = parseFloat(inputValue);
                decimal = american > 0 ? american / 100 + 1 : 100 / Math.abs(american) + 1;
                break;
        }

        // Convert decimal to all formats
        const probability = ((1 / decimal) * 100).toFixed(2);
        const fractional = decimalToFractional(decimal);
        const american = decimalToAmerican(decimal);

        setResults({
            decimal: decimal.toFixed(2),
            fractional,
            american,
            probability,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-16">
                <Link href="/calculators" className="btn-secondary inline-flex items-center gap-2 mb-8">
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </Link>

                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
                            <Calculator className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Odds Converter</h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Converta odds entre diferentes formatos
                        </p>
                    </div>

                    <div className="card">
                        <div className="space-y-6">
                            {/* Input Format Selection */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Formato de Entrada</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setInputFormat('decimal')}
                                        className={`btn ${inputFormat === 'decimal' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        Decimal
                                    </button>
                                    <button
                                        onClick={() => setInputFormat('fractional')}
                                        className={`btn ${inputFormat === 'fractional' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        Fracionário
                                    </button>
                                    <button
                                        onClick={() => setInputFormat('american')}
                                        className={`btn ${inputFormat === 'american' ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        Americano
                                    </button>
                                </div>
                            </div>

                            {/* Input Value */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Valor ({inputFormat === 'decimal' ? 'ex: 2.50' : inputFormat === 'fractional' ? 'ex: 3/2' : 'ex: +150'})
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder={inputFormat === 'decimal' ? '2.50' : inputFormat === 'fractional' ? '3/2' : '+150'}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                />
                            </div>

                            {/* Convert Button */}
                            <button onClick={handleConvert} className="btn-primary w-full py-3">
                                Converter
                            </button>

                            {/* Results */}
                            {results && (
                                <div className="mt-6 space-y-4 fade-in">
                                    <h3 className="text-xl font-semibold mb-4">Resultados:</h3>
                                    <ResultRow label="Decimal" value={results.decimal} />
                                    <ResultRow label="Fracionário" value={results.fractional} />
                                    <ResultRow label="Americano" value={results.american} />
                                    <ResultRow label="Probabilidade Implícita" value={`${results.probability}%`} highlight />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className={`flex justify-between items-center p-4 rounded-lg ${highlight ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
            <span className="font-medium">{label}</span>
            <span className={`text-lg font-bold ${highlight ? 'text-primary-600' : ''}`}>{value}</span>
        </div>
    );
}

function decimalToFractional(decimal: number): string {
    const fraction = decimal - 1;
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const denominator = 100;
    const numerator = Math.round(fraction * denominator);
    const divisor = gcd(numerator, denominator);
    return `${numerator / divisor}/${denominator / divisor}`;
}

function decimalToAmerican(decimal: number): string {
    if (decimal >= 2) {
        return `+${Math.round((decimal - 1) * 100)}`;
    } else {
        return `${Math.round(-100 / (decimal - 1))}`;
    }
}
