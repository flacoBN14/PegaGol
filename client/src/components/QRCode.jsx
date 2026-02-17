import { QRCodeSVG } from 'qrcode.react';

export default function QRCode({ onClose }) {
  const url = window.location.origin;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-6"
         onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl"
           onClick={(e) => e.stopPropagation()}>
        <h3 className="text-verde-dark text-xl mb-1">Comparte PegaGol</h3>
        <p className="text-gray-400 text-xs mb-6">
          Escanea este codigo para entrar a la app
        </p>

        <div className="bg-verde-dark rounded-2xl p-6 inline-block mb-6">
          <QRCodeSVG
            value={url}
            size={200}
            bgColor="#1a472a"
            fgColor="#fbbf24"
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="text-[10px] text-gray-400 mb-4 break-all">{url}</p>

        <p className="text-xs text-gray-500 mb-4">
          Imprime este QR y pegalo en tu salon para que tus compas se unan
        </p>

        <button
          onClick={onClose}
          className="w-full bg-verde text-white py-3 rounded-xl font-bold text-sm
                     hover:bg-verde-dark transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
