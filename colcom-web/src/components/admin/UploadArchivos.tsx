import { useState } from 'react';
import { useArchivos } from '../../hooks/useArchivos';
import { motion } from 'framer-motion';
import { apiRequest } from '../../lib/api';

export function UploadArchivos() {
  const archivos = useArchivos();
  const [file, setFile] = useState<File | null>(null);
  const [modulo, setModulo] = useState('noticias');
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleOpen = async (e: React.MouseEvent, archivoId: string, fallbackUrl: string) => {
    e.preventDefault();
    try {
      const res = await apiRequest<{url: string}>(`/archivos/${archivoId}/signed-url`);
      window.open(res.data?.url || fallbackUrl, '_blank');
    } catch (err) {
      // Fallback a la url que ya tenemos si falla
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Upload Box */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/40"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#7A0A83]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Subir Nuevo Archivo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* File Input */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-[#7A0A83] bg-[#7A0A83]/5' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-[#7A0A83] hover:bg-gray-50'}`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
            {file ? (
              <div className="text-center">
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <label htmlFor="file-upload" className="text-[#7A0A83] font-medium text-sm mt-4 cursor-pointer hover:underline block">
                  Cambiar archivo
                </label>
              </div>
            ) : (
              <label htmlFor="file-upload" className="text-center cursor-pointer flex flex-col items-center w-full">
                <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 font-medium">Arrastra tu archivo aquí o <span className="text-[#7A0A83] hover:underline">explora</span></p>
                <p className="text-xs text-gray-400 mt-2">Soporta imágenes, documentos y videos</p>
              </label>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Módulo Destino</label>
              <select 
                value={modulo} 
                onChange={(e) => setModulo(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#7A0A83]/50 focus:border-[#7A0A83] outline-none transition-all"
              >
                <option value="noticias">Noticias</option>
                <option value="testimonios">Testimonios</option>
                <option value="solicitudes">Solicitudes</option>
                <option value="general">General</option>
              </select>
            </div>
            
            <button 
              disabled={!file} 
              onClick={() => {
                if (file) {
                  archivos.upload(file, { modulo })
                    .then(() => {
                      archivos.refresh();
                      setFile(null);
                    })
                    .catch(err => {
                      const msg = err.errors ? err.errors.join(', ') : err.message;
                      alert('Error al subir: ' + msg);
                    });
                }
              }}
              className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg ${file ? 'bg-[#7A0A83] text-white hover:bg-[#610769] hover:-translate-y-0.5 hover:shadow-xl shadow-[#7A0A83]/30' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              Confirmar y Subir
            </button>
          </div>
        </div>
      </motion.div>

      {/* File List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg shadow-gray-200/40"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Archivos Disponibles
        </h2>
        
        {archivos.items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">No hay archivos subidos aún.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {archivos.items.map((item) => {
              const isImage = item.tipo_archivo?.startsWith('image/');
              return (
                <a 
                  key={item.id} 
                  href={item.url} 
                  onClick={(e) => handleOpen(e, item.id as string, item.url as string)}
                  className="group p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-[#7A0A83]/30 hover:bg-[#7A0A83]/5 transition-all flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md cursor-pointer"
                >
                  {isImage ? (
                    <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-gray-200 border border-gray-200 shadow-sm">
                      <img src={item.url} alt={item.nombre_archivo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  ) : (
                    <svg className="w-10 h-10 text-gray-300 group-hover:text-[#7A0A83] transition-colors mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 line-clamp-2 word-break-all" title={item.nombre_archivo}>
                    {item.nombre_archivo}
                  </span>
                  <span className="text-xs text-gray-400 mt-2 bg-white px-2 py-1 rounded-md shadow-sm uppercase tracking-wider font-bold">
                    {item.modulo || 'general'}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
