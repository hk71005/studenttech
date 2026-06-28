"use client";

import Image from "next/image";
import { useState } from "react";
import type { Category } from "@/types/product";

interface ProductImageProps {
  src: string;
  alt: string;
  category: Category;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Product image with graceful fallback.
 * If the real image (/images/products/[slug].jpg) is missing, it falls back
 * to the category placeholder SVG — so the UI never shows a broken image.
 * Drop a real .jpg into public/images/products/ and it "just works".
 */
export function ProductImage({
  src,
  alt,
  category,
  fill,
  className,
  sizes,
  priority,
}: ProductImageProps) {
  const placeholder = `/images/placeholder-${category}.svg`;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      // SVG placeholders can't be optimized — skip optimizer when we fall back
      unoptimized={imgSrc === placeholder}
      onError={() => {
        if (imgSrc !== placeholder) setImgSrc(placeholder);
      }}
    />
  );
}
