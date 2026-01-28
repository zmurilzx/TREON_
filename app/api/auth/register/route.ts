import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validateEmail, validatePassword, validateAge } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, birthDate, acceptTerms } = body;

        // Validation
        if (!email || !password || !name || !birthDate) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios' },
                { status: 400 }
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: 'Email inválido' },
                { status: 400 }
            );
        }

        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return NextResponse.json(
                { error: passwordValidation.errors.join(', ') },
                { status: 400 }
            );
        }

        const birthDateObj = new Date(birthDate);
        if (!validateAge(birthDateObj)) {
            return NextResponse.json(
                { error: 'Você deve ter pelo menos 18 anos para se cadastrar' },
                { status: 400 }
            );
        }

        if (!acceptTerms) {
            return NextResponse.json(
                { error: 'Você deve aceitar os termos de uso' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Este email já está cadastrado' },
                { status: 400 }
            );
        }

        // Create user
        const passwordHash = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                birthDate: birthDateObj,
                isVerified: true, // For MVP, auto-verify. In production, send verification email
            },
        });

        // Create verification token (for future email verification)
        const verificationToken = crypto.randomBytes(32).toString('hex');
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: verificationToken,
                type: 'EMAIL_VERIFICATION',
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                userId: user.id,
            },
        });

        // TODO: Send verification email
        // await sendVerificationEmail(email, verificationToken);

        return NextResponse.json(
            {
                message: 'Cadastro realizado com sucesso! Você já pode fazer login.',
                userId: user.id,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Erro ao criar conta. Tente novamente.' },
            { status: 500 }
        );
    }
}
