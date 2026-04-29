'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export default function Logo({ className = "", size = 'md', onClick }: LogoProps) {
  const sizes = {
    sm: {
      diamond: 'w-10 h-10',
      sp: 'text-[14px]',
      shahi: 'text-[12px]',
      posh: 'text-[12px]',
      home: 'text-[6px]',
      spacing: 'gap-1',
      lineScale: 'scale-75'
    },
    md: {
      diamond: 'w-16 h-16',
      sp: 'text-[22px]',
      shahi: 'text-[24px]',
      posh: 'text-[24px]',
      home: 'text-[10px]',
      spacing: 'gap-2',
      lineScale: 'scale-100'
    },
    lg: {
      diamond: 'w-24 h-24',
      sp: 'text-[32px]',
      shahi: 'text-[36px]',
      posh: 'text-[36px]',
      home: 'text-[14px]',
      spacing: 'gap-3',
      lineScale: 'scale-125'
    }
  };

  const s = sizes[size];

  return (
    <Link href="/" onClick={onClick} className={`flex flex-col items-center group ${className}`}>
      {/* 💎 The Diamond Monogram */}
      <div className="relative mb-2">
        <div className={`${s.diamond} border border-accent rotate-45 flex items-center justify-center transition-luxury group-hover:scale-105`}>
          <div className="-rotate-45 font-logo text-accent font-bold tracking-tighter leading-none flex items-center justify-center">
            <span className={`${s.sp} -translate-x-[2px] translate-y-[2px]`}>S</span>
            <span className={`${s.sp} translate-x-[2px] -translate-y-[2px]`}>P</span>
          </div>
        </div>
        {/* Decorative corner lines */}
        <div className="absolute -top-[2px] -left-[2px] w-2 h-2 border-t border-l border-accent/40" />
        <div className="absolute -bottom-[2px] -right-[2px] w-2 h-2 border-b border-r border-accent/40" />
      </div>

      {/* 🏷️ Main Brand Name */}
      <div className={`flex items-baseline ${s.spacing}`}>
        <span className={`${s.shahi} font-logo text-primary uppercase tracking-[0.1em] font-black`}>SHAHI</span>
        <span className={`${s.posh} font-serif text-accent italic tracking-tighter`}>posh</span>
      </div>
    </Link>
  );
}
