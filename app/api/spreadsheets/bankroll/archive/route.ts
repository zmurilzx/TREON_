import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARCHIVE_FILE = path.join(DATA_DIR, 'bankroll-archive.json');

// Garantir que o diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function POST(request: Request) {
  try {
    const monthData = await request.json();
    
    // Adicionar ID único e timestamp
    const archivedMonth = {
      id: Date.now().toString(),
      ...monthData,
      archivedAt: new Date().toISOString()
    };

    // Ler arquivo existente ou criar novo
    let archives = [];
    if (fs.existsSync(ARCHIVE_FILE)) {
      const fileContent = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
      archives = JSON.parse(fileContent);
    }

    // Adicionar novo mês ao início do array
    archives.unshift(archivedMonth);

    // Salvar arquivo
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(archives, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Mês arquivado com sucesso',
      id: archivedMonth.id 
    });
  } catch (error) {
    console.error('Erro ao arquivar mês:', error);
    return NextResponse.json(
      { error: 'Erro ao arquivar mês' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Ler arquivo de arquivos
    if (!fs.existsSync(ARCHIVE_FILE)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
    const archives = JSON.parse(fileContent);

    return NextResponse.json(archives);
  } catch (error) {
    console.error('Erro ao carregar arquivos:', error);
    return NextResponse.json(
      { error: 'Erro ao carregar arquivos' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID não fornecido' },
        { status: 400 }
      );
    }

    if (!fs.existsSync(ARCHIVE_FILE)) {
      return NextResponse.json(
        { error: 'Nenhum arquivo encontrado' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(ARCHIVE_FILE, 'utf-8');
    let archives = JSON.parse(fileContent);

    // Filtrar removendo o mês com o ID especificado
    archives = archives.filter((archive: any) => archive.id !== id);

    // Salvar arquivo atualizado
    fs.writeFileSync(ARCHIVE_FILE, JSON.stringify(archives, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Mês deletado com sucesso' 
    });
  } catch (error) {
    console.error('Erro ao deletar mês:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar mês' },
      { status: 500 }
    );
  }
}
