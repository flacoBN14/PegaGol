import { QRCodeSVG } from 'qrcode.react';

export default function QRCode({ onClose }) {
  const url = window.location.origin;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6"
         onClick={onClose}>
      <div className="bg-negro-light border border-white/[0.06] p-8 text-center max-w-sm w-full animate-slide-up"
           onClick={(e) => e.stopPropagation()}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-[2px] mb-4">
          <div className="w-6 h-[2px] bg-[#00c853]" />
          <div className="w-5 h-[2px] bg-[#2196f3]" />
          <div className="w-4 h-[2px] bg-[#f44336]" />
        </div>
        <h3 className="font-display text-[20px] text-white tracking-wide mb-1">COMPARTE</h3>
        <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase mb-6">
          Escanea para entrar a PegaGol
        </p>

        <div className="bg-negro p-5 inline-block mb-5 border border-white/[0.04]">
          <QRCodeSVG
            value={url}
            size={180}
            bgColor="#0a0a0a"
            fgColor="#ffffff"
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="text-[8px] text-white/15 mb-5 break-all tracking-wider">{url}</p>

        <p className="text-[9px] text-white/20 mb-6 tracking-wider leading-relaxed">
          Imprime este QR y pegalo en tu salon
        </p>

        <button
          onClick={onClose}
          className="btn-primary w-full"
        >
          CERRAR
        </button>
      </div>
    </div>
  );
}
