import React from 'react';
import { ProductShade } from '../types';
import { Check } from 'lucide-react';

interface ShadePickerProps {
  shades: ProductShade[];
  selectedShade: string;
  onSelectShade: (shadeName: string) => void;
}

export const ShadePicker: React.FC<ShadePickerProps> = ({
  shades,
  selectedShade,
  onSelectShade
}) => {
  if (!shades || shades.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wider text-[#1A1412]">
          Selected Shade:
        </span>
        <span className="text-[#C5A059] font-medium">
          {selectedShade || shades[0].name}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {shades.map((shade) => {
          const isSelected = selectedShade === shade.name;
          return (
            <button
              key={shade.name}
              type="button"
              onClick={() => onSelectShade(shade.name)}
              className={`group relative flex items-center justify-center rounded-full p-0.5 transition-all focus:outline-none ${
                isSelected
                  ? 'ring-2 ring-[#C5A059] ring-offset-2 ring-offset-[#FAF8F5]'
                  : 'hover:opacity-80'
              }`}
              title={shade.name}
            >
              <span
                className="h-8 w-8 rounded-full shadow-inner border border-black/10 flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: shade.colorHex }}
              >
                {isSelected && (
                  <Check className="h-4 w-4 text-white drop-shadow-md stroke-[3]" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
