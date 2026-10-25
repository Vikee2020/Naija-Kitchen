import React from 'react';
import { X, MapPin, Clock, ShieldCheck, Bike, Check } from 'lucide-react';
import { DELIVERY_ZONES } from '../data/menuData';
import { DeliveryZone } from '../types';
import { formatNaira } from '../utils/formatters';

interface DeliveryZonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
}

export const DeliveryZonesModal: React.FC<DeliveryZonesModalProps> = ({
  isOpen,
  onClose,
  selectedZone,
  onSelectZone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zones-modal-title"
      >
        <div className="p-4 sm:p-5 bg-[#064E3B] text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-amber-400 text-[11px] font-bold tracking-wider uppercase">
              Transparent Logistics
            </span>
            <h2 id="zones-modal-title" className="font-display font-bold text-lg sm:text-xl leading-tight">
              Lagos Neighborhood Delivery Rates &amp; ETAs
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close zones"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Our dispatch fleet operates out of two temperature-controlled staging hubs in <strong>Surulere (Mainland)</strong> and <strong>Victoria Island (Island)</strong> to guarantee rapid delivery within sealed thermal insulated boxes.
          </p>

          <div className="space-y-2">
            {DELIVERY_ZONES.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    onSelectZone(zone);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#064E3B] bg-emerald-50/70 ring-1 ring-[#064E3B]'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-[#064E3B] bg-[#064E3B]' : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900">{zone.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span className="text-amber-700 font-medium">{zone.hub} Hub</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {zone.estimatedMinutes}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-[#064E3B] tabular-nums block">
                      {formatNaira(zone.fee)}
                    </span>
                    <span className="text-[10px] text-stone-400">Doorstep delivery</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-5 h-5 text-[#064E3B] shrink-0" />
            <span>
              All orders are transported in sealed thermal boxes to maintain piping hot serving temperature.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
