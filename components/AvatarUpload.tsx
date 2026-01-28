'use client';

import { useState, useRef } from 'react';
import { Camera, Trash2, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import ConfirmModal from './ConfirmModal';

interface AvatarUploadProps {
  currentPhotoUrl?: string | null;
  userName: string;
  onPhotoUpdate: (url: string | null) => void;
}

export default function AvatarUpload({ currentPhotoUrl, userName, onPhotoUpdate }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de arquivo inválido. Use JPEG, PNG, WebP ou GIF.');
      return;
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Tamanho máximo: 2MB.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/profile/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload');
      }

      toast.success(data.message);
      onPhotoUpdate(data.url);
      
      // Recarregar a página para atualizar a foto em todos os lugares
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const response = await fetch('/api/profile/delete-photo', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar foto');
      }

      toast.success(data.message);
      onPhotoUpdate(null);
      
      // Recarregar a página para atualizar a foto em todos os lugares
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        {currentPhotoUrl ? (
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-emerald-500/30">
            <Image
              src={currentPhotoUrl}
              alt={userName}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl font-bold border-4 border-emerald-500/30">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || deleting}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Alterar Foto
            </>
          )}
        </button>

        {currentPhotoUrl && (
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={uploading || deleting}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-all inline-flex items-center gap-2"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removendo...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remover Foto
              </>
            )}
          </button>
        )}

        <p className="text-xs text-gray-400">
          JPEG, PNG, WebP ou GIF. Máx 2MB.
        </p>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Remover Foto de Perfil"
        message="Tem certeza que deseja remover sua foto de perfil? Esta ação não pode ser desfeita."
        confirmText="Sim, Remover"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
