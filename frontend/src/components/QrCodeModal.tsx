import React, { useState } from 'react';
import { X, Download, Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, shortUrl }) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shortUrl)}&color=0-0-0&bgcolor=255-255-255`;

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQr = async () => {
    setDownloading(true);
    try {
      // Fetch the QR code image and convert to blob to trigger immediate browser download
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `nexuslink-qr-${shortUrl.split('/').pop()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download QR code error:', error);
      // Fallback
      window.open(qrCodeUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass relative z-10 w-full max-w-md overflow-hidden rounded-2xl p-6 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <h3 className="font-heading text-xl font-bold text-slate-800 mb-2">QR Code Generated</h3>
              <p className="text-sm text-slate-500 mb-6">
                Scan or download this QR code to share your shortened NexusLink.
              </p>

              {/* QR Image Frame */}
              <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-2xl bg-white p-4 shadow-sm mb-6">
                <img
                  src={qrCodeUrl}
                  alt="NexusLink QR Code"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Link Input Row */}
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 mb-6">
                <span className="text-sm text-slate-600 truncate flex-1 text-left px-2 select-all">
                  {shortUrl}
                </span>
                <button
                  onClick={copyUrl}
                  className="rounded-lg bg-slate-50 p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="h-4.5 w-4.5 text-blue-500" /> : <Copy className="h-4.5 w-4.5" />}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={downloadQr}
                  disabled={downloading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue py-3 text-sm font-semibold text-slate-800 shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {downloading ? 'Downloading...' : 'Download PNG'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
