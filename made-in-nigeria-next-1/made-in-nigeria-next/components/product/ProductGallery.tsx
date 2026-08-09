'use client';

import { useState } from 'react';

interface ProductGalleryProps {
  images: string[]; // thumb-N class names standing in for real photo URLs
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className={`gallery-main ${images[activeIndex]}`} aria-hidden="true" />
      <div className="gallery-thumbs">
        {images.map((thumb, i) => (
          <button
            key={i}
            type="button"
            className={`thumb-opt ${thumb}${i === activeIndex ? ' is-active' : ''}`}
            aria-label={`View image ${i + 1}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
