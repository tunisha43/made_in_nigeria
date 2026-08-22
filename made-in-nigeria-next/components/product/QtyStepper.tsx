'use client';

interface QtyStepperProps {
  value: number;
  onChange: (qty: number) => void;
}

export default function QtyStepper({ value, onChange }: QtyStepperProps) {
  return (
    <div className="qty-stepper">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        &minus;
      </button>
      <span>{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}
