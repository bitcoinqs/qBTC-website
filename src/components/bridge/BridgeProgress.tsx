import React from 'react';
import type { ProcessingStatus } from './types';

type Props = {
  status: ProcessingStatus;
};

export default function BridgeProgress({ status }: Props) {
  const steps = [
    { status: 'waiting', label: 'Waiting for Deposit' },
    { status: 'confirmed', label: 'Confirming' },
    { status: 'exchanging', label: 'Exchanging' },
    { status: 'sending', label: 'Sending' },
    { status: 'complete', label: 'Complete' }
  ];

  const currentStepIndex = steps.findIndex(s => s.status === status);

  // Mobile progress indicator
  const renderMobileProgress = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium text-gray-900">
          {steps[currentStepIndex].label}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentStepIndex + 1) * (100 / steps.length)}%` }}
          />
        </div>
      </div>
    </div>
  );

  // Desktop progress steps
  const renderDesktopProgress = () => (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => (
        <React.Fragment key={step.status}>
          {index > 0 && (
            <div className={`h-1 w-full mx-2 ${
              index <= currentStepIndex ? 'bg-orange-500' : 'bg-gray-200'
            }`} />
          )}
          <div className={`flex flex-col items-center flex-shrink-0 ${
            index <= currentStepIndex ? 'text-orange-500' : 'text-gray-400'
          }`}>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              index <= currentStepIndex ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              {index + 1}
            </div>
            <span className="mt-2 text-xs text-center w-20">{step.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        {renderDesktopProgress()}
      </div>
      <div className="block md:hidden">
        {renderMobileProgress()}
      </div>
    </>
  );
}