'use client';

import { useState } from 'react';

export default function QtyStepper() {
  const [qty, setQty] = useState(1);

  return (
    <div className="qty-stepper">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
      >
        &minus;
      </button>
      <span>{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQty((q) => q + 1)}
      >
        +
      </button>
    </div>
  );
}
