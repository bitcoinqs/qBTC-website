import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
  address: string;
  label: string;
  description: string;
};

export default function BridgeAddressDisplay({ address = '', label = '', description = '' }: Props) {
  return (
    <div className="bg-orange-50 rounded-lg p-6 text-center">
      <h4 className="text-sm font-medium text-orange-800 mb-4">{label || 'Label not provided'}</h4>
      <div className="flex justify-center mb-4">
        <QRCodeSVG
          value={address || 'No address available'}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>
      <p className="text-sm font-medium text-orange-800 mb-2">{description || 'No description available'}</p>
      <p className="text-sm font-mono break-all text-orange-900 bg-orange-100 p-3 rounded">
        {address || 'No address provided'}
      </p>
    </div>
  );
}