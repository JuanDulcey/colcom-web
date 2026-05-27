import { UploadArchivos } from '../../components/admin/UploadArchivos.tsx';

export function FilesPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-[#7A0A83] font-bold text-sm tracking-widest uppercase mb-1">Gestión de Medios</p>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Archivos de la Plataforma</h1>
      </div>
      
      <UploadArchivos />
    </div>
  );
}
