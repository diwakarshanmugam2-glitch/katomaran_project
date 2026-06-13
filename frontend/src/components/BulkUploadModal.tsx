import React, { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<{
    successCount: number;
    errorCount: number;
    errors: Array<{ line: number; originalUrl?: string; message: string }>;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('Please upload a CSV file only.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setErrorMsg('');
      } else {
        setErrorMsg('Please upload a CSV file only.');
      }
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'originalUrl,customAlias,expiryDate\nhttps://google.com,google-search,\nhttps://github.com,github-home,2028-12-31\nhttps://react.dev,,2026-10-15\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'nexuslink_bulk_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await api.post('/urls/bulk', formData, true);
      setResult({
        successCount: data.successCount,
        errorCount: data.errorCount,
        errors: data.errors,
      });

      if (data.successCount > 0) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error processing CSV file.');
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setResult(null);
    setErrorMsg('');
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass relative z-10 w-full max-w-lg overflow-hidden rounded-2xl p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">Bulk URL Shortener</h3>
            <p className="text-sm text-slate-500 mb-6">
              Shorten multiple URLs at once using a CSV file.
            </p>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-brand-pink/20 p-3.5 mb-4 text-rose-500 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!result ? (
              <>
                {/* Drag and Drop Container */}
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${
                    dragActive
                      ? 'border-brand-cyan bg-blue-500/5'
                      : file
                      ? 'border-brand-purple bg-indigo-500/5'
                      : 'border-slate-200 hover:border-slate-200 bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {file ? (
                    <>
                      <FileSpreadsheet className="h-12 w-12 text-indigo-500 mb-3 animate-pulse" />
                      <span className="text-sm font-semibold text-slate-800 mb-1">{file.name}</span>
                      <span className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-slate-500 mb-3" />
                      <span className="text-sm font-medium text-slate-800 mb-1">
                        Drag & Drop CSV file here
                      </span>
                      <span className="text-xs text-slate-400 mb-2">or click to browse local files</span>
                      <span className="text-[11px] text-gray-600 bg-slate-50 px-2 py-1 rounded">
                        Max file size: 5MB
                      </span>
                    </>
                  )}
                </div>

                {/* Template Row */}
                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 border border-slate-200">
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-slate-800">Download CSV Template</span>
                    <span className="text-[11px] text-slate-500">Get the correct formatting headers</span>
                  </div>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-1 text-xs text-blue-500 hover:underline transition-all"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Template.csv
                  </button>
                </div>

                {/* Submit Row */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!file || loading}
                    className="flex-1 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue py-3 text-sm font-semibold text-slate-800 shadow-lg hover:opacity-90 disabled:opacity-40"
                  >
                    {loading ? 'Processing...' : 'Upload & Shorten'}
                  </button>
                </div>
              </>
            ) : (
              /* Success / Result View */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-blue-500/10 border border-blue-100 p-4">
                    <CheckCircle className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold text-slate-800">{result.successCount}</span>
                    <span className="text-xs text-slate-500">Links Created</span>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-xl bg-rose-500/10 border border-brand-pink/20 p-4">
                    <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
                    <span className="text-2xl font-bold text-slate-800">{result.errorCount}</span>
                    <span className="text-xs text-slate-500">Failures</span>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="rounded-xl border border-slate-200 bg-black/20 p-3 max-h-48 overflow-y-auto">
                    <span className="block text-xs font-semibold text-slate-600 mb-2 text-left">
                      Error Log Details:
                    </span>
                    <ul className="space-y-2 text-left">
                      {result.errors.slice(0, 10).map((err, idx) => (
                        <li key={idx} className="text-xs text-slate-500">
                          <span className="text-rose-500 font-semibold">Row {err.line}:</span>{' '}
                          {err.originalUrl ? (
                            <span className="truncate max-w-[200px] inline-block align-bottom text-slate-400">
                              {err.originalUrl} -{' '}
                            </span>
                          ) : null}
                          {err.message}
                        </li>
                      ))}
                      {result.errors.length > 10 && (
                        <li className="text-[11px] text-slate-400 italic">
                          ...and {result.errors.length - 10} more errors.
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={resetModal}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Upload Another File
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue py-3 text-sm font-semibold text-slate-800 shadow-lg hover:opacity-90"
                  >
                    Finish
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
