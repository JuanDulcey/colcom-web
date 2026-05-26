import { UploadArchivos } from '../../components/admin/UploadArchivos.tsx';

export function FilesPage() {
  return (
    <main className="admin-content">
      <div className="admin-heading">
        <div><p className="eyebrow">Media</p><h1>Archivos</h1></div>
      </div>
      <UploadArchivos />
    </main>
  );
}
