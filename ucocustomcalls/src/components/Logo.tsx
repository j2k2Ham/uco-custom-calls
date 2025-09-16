"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { ElementType } from 'react';

interface LogoProps {
  variant?: 'auto' | 'light' | 'dark';
  as?: 'link' | 'div';
  inlineSvg?: boolean; // when true, render inline SVG instead of raster
  className?: string;
  priority?: boolean;
  height?: number; // desired display height in px (defaults to 32)
  ariaLabel?: string;
}

// Intrinsic raster asset dimensions (2x version)
const INTRINSIC = { width: 248, height: 140 };

// Responsive sizes: prefer slightly smaller on narrow viewports
const SIZES = '(max-width: 640px) 140px, (max-width: 1024px) 180px, 220px';

// Inline SVG fallback (simple placeholder / can be replaced)
const InlineSvg = (props: { className?: string }) => (
  <svg
    viewBox="0 0 248 140"
    role="img"
    aria-label="UCO Custom Calls"
    className={props.className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="248" height="140" rx="12" fill="#1b1f1b" />
    <text
      x="50%"
      y="50%"
      fill="#d2a857"
      fontSize="42"
      fontFamily="system-ui, Arial, sans-serif"
      dominantBaseline="middle"
      textAnchor="middle"
      fontWeight="700"
    >
      UCO
    </text>
  </svg>
);

export function Logo({ variant = 'auto', as = 'link', inlineSvg = false, className = '', priority, height = 32, ariaLabel = 'UCO Custom Calls' }: LogoProps) {
  const Tag: ElementType = as === 'link' ? Link : 'div';

  // Scale width proportionally based on desired display height vs intrinsic height
  const scale = height / INTRINSIC.height;
  const scaledWidth = Math.round(INTRINSIC.width * scale);

  const lightSrc = '/images/company-logo-green-2x.png';
  const darkSrc = '/images/company-logo-green-2x-dark.png'; // expected dark variant file
  const useDark = variant === 'dark';
  const useLight = variant === 'light';

  const showDark = variant === 'auto' ? 'dark:inline' : useDark ? 'inline' : 'hidden';
  const showLight = variant === 'auto' ? 'inline dark:hidden' : useLight ? 'inline' : 'hidden';

  const sharedClasses = `h-[${height}px] w-auto object-contain ${className}`.trim();

  if (inlineSvg) {
    return (
      <Tag {...(as === 'link' ? { href: '/' } : {})} aria-label={ariaLabel} className={`flex items-center ${className}`}>
        <InlineSvg className={sharedClasses} />
        <span className="sr-only">{ariaLabel}</span>
      </Tag>
    );
  }

  return (
  <Tag {...(as === 'link' ? { href: '/' } : {})} aria-label={ariaLabel} className={`flex items-center ${className}`}>
      {/* Light / default */}
      <Image
        src={lightSrc}
        alt={ariaLabel}
        width={scaledWidth}
        height={height}
        priority={priority}
        sizes={SIZES}
        className={`${sharedClasses} ${showLight}`}
      />
      {/* Dark variant (expects file to exist) */}
      <Image
        src={darkSrc}
        alt={ariaLabel}
        width={scaledWidth}
        height={height}
        priority={priority}
        sizes={SIZES}
        className={`${sharedClasses} ${showDark}`}
      />
      <span className="sr-only">{ariaLabel}</span>
    </Tag>
  );
}
