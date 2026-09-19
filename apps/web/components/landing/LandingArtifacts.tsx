'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function DepthFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`relative [perspective:1200px] ${className}`}>{children}</div>;
}

// ─── Chapter 01: The Flow ──────────────────────────────────────────────────────

export function ProcessArtifact() {
  return (
    <DepthFrame className="mx-auto h-[300px] w-full max-w-[520px] sm:h-[360px]">
      {/* Background card: Incoming Requests */}
      <motion.div
        animate={{
          y: [-5, 5, -5],
          rotateY: [15, 19, 15],
          rotateX: [6, 9, 6],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[8%] top-[13%] h-[68%] w-[66%] rounded-2xl border border-border bg-card/80 p-6 shadow-card backdrop-blur"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-info font-semibold">
          Incoming requests
        </p>
        <div className="mt-6 space-y-3">
          {[80, 62, 72].map((width, index) => (
            <div key={width} className="flex items-center gap-3">
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7], scale: [0.97, 1.03, 0.97] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.4, ease: 'easeInOut' }}
                className={`h-7 w-7 rounded-lg ${
                  index === 1
                    ? 'bg-brand-accent/25 border border-brand-accent/40 shadow-xs'
                    : 'bg-muted'
                }`}
              />
              <motion.span
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.4, ease: 'easeInOut' }}
                className="h-2 rounded-full bg-muted-foreground/30"
                style={{ width: `${width}%` }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Foreground card: Scope Scan */}
      <motion.div
        animate={{
          y: [7, -7, 7],
          rotateY: [-22, -17, -22],
          rotateX: [5, 8, 5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute right-[6%] top-[30%] h-[42%] w-[38%] rounded-xl border border-brand-accent/40 bg-accent/80 p-4 shadow-glow overflow-hidden backdrop-blur-md"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(70px)' }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-accent-foreground font-semibold">
            Scope scan
          </p>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent" />
          </span>
        </div>

        {/* Animated scanning lines */}
        <div className="relative mt-7 overflow-hidden rounded-full bg-muted/60 h-2 w-full">
          <motion.span
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 h-full w-2/3 rounded-full bg-gradient-to-r from-transparent via-brand-accent to-transparent"
          />
          <span className="block h-full w-full rounded-full bg-brand-accent/50" />
        </div>

        <div className="relative mt-3 overflow-hidden rounded-full bg-muted/60 h-2 w-3/4">
          <motion.span
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute inset-0 h-full w-2/3 rounded-full bg-gradient-to-r from-transparent via-brand-accent to-transparent"
          />
          <span className="block h-full w-full rounded-full bg-brand-accent/30" />
        </div>

        {/* Card light sweep */}
        <motion.div
          animate={{ x: ['-150%', '200%'] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="pointer-events-none absolute -inset-y-4 w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />
      </motion.div>

      {/* Ambient floating orb */}
      <motion.span
        animate={{
          scale: [1, 1.22, 1],
          opacity: [0.35, 0.75, 0.35],
          y: [0, -6, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[7%] left-[11%] h-16 w-16 rounded-full border border-primary/40 bg-gradient-to-br from-primary/20 via-brand-accent/15 to-transparent blur-[1px]"
        style={{ transform: 'translateZ(40px)' }}
      />
    </DepthFrame>
  );
}

// ─── Chapter 02: The Evidence ──────────────────────────────────────────────────

export function LedgerArtifact() {
  return (
    <DepthFrame className="mx-auto h-[330px] w-full max-w-[570px] sm:h-[400px]">
      {/* Background card: Original Scope */}
      <motion.div
        animate={{
          y: [-5, 5, -5],
          rotateY: [10, 14, 10],
          rotateX: [4, 7, 4],
        }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[9%] top-[15%] h-[64%] w-[68%] rounded-2xl border border-border bg-card/75 p-6 shadow-card backdrop-blur"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
          Original scope
        </p>
        <span className="mt-7 block h-2 w-4/5 rounded-full bg-muted-foreground/30" />
        <span className="mt-3 block h-2 w-3/5 rounded-full bg-muted-foreground/20" />
        <span className="mt-10 block h-px w-full bg-border/80" />
        <span className="mt-5 block h-2 w-2/3 rounded-full bg-muted-foreground/25" />
      </motion.div>

      {/* Sweeping vertical inspection laser scan line */}
      <motion.span
        animate={{
          left: ['24%', '66%', '24%'],
          opacity: [0.45, 0.95, 0.45],
        }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[7%] h-[74%] w-0.5 bg-gradient-to-b from-transparent via-brand-accent to-transparent pointer-events-none"
        style={{
          boxShadow: '0 0 12px 2px rgba(6, 182, 212, 0.7)',
        }}
      />

      {/* Foreground card: Verified Item with Price in INR */}
      <motion.div
        animate={{
          y: [8, -8, 8],
          rotateY: [-18, -13, -18],
          rotateX: [7, 3, 7],
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute right-[4%] top-[32%] h-[40%] w-[46%] rounded-xl border border-success/35 bg-card/90 p-5 shadow-card-hover backdrop-blur-md"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(90px)' }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-wider text-success font-semibold flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
            </span>
            Verified · +8 hrs
          </p>
        </div>
        <span className="mt-5 block h-2 w-full rounded-full bg-success/35" />
        <span className="mt-3 block h-2 w-3/4 rounded-full bg-success/20" />
        <motion.span
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-6 block text-xl font-extrabold text-success tracking-tight"
        >
          ₹ 12,800
        </motion.span>
      </motion.div>
    </DepthFrame>
  );
}

// ─── Chapter 03: The Value ────────────────────────────────────────────────────

export function ValueArtifact() {
  return (
    <DepthFrame className="mx-auto h-[290px] w-full max-w-[480px] sm:h-[340px]">
      {/* Ambient glow behind cards */}
      <motion.div
        animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.95, 1.06, 0.95] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[20%] top-[10%] h-[70%] w-[65%] rounded-3xl filter blur-2xl pointer-events-none bg-gradient-to-tr from-brand-accent/30 via-primary/25 to-success/20"
      />

      {/* Back shadow glass card */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotateY: [13, 17, 13],
          rotateX: [6, 9, 6],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[17%] top-[18%] h-[58%] w-[63%] rounded-2xl border border-primary/35 bg-primary/20 shadow-card backdrop-blur-sm"
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Front glass card */}
      <motion.div
        animate={{
          y: [7, -7, 7],
          rotateY: [16, 12, 16],
          rotateX: [7, 4, 7],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute left-[23%] top-[13%] h-[58%] w-[63%] rounded-2xl border border-brand-accent/40 bg-card/90 p-7 shadow-glow backdrop-blur-md"
        style={{ transformStyle: 'preserve-3d', transform: 'translateZ(70px)' }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-info font-semibold">
            Recovered value
          </p>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-mono font-bold text-success">
            ROI 100%
          </span>
        </div>

        <motion.p
          animate={{ scale: [1, 1.025, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-6 text-4xl font-extrabold tracking-tight text-foreground"
        >
          ₹ 36,800
        </motion.p>

        <div className="mt-6 flex items-center gap-2">
          <div className="relative h-2 w-20 overflow-hidden rounded-full bg-muted/60">
            <motion.span
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
            <span className="block h-full w-full rounded-full bg-success/60" />
          </div>
          <div className="relative h-2 w-12 overflow-hidden rounded-full bg-muted/60">
            <span className="block h-full w-full rounded-full bg-success/25" />
          </div>
        </div>
      </motion.div>
    </DepthFrame>
  );
}
