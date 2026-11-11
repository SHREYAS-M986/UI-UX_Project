import React from 'react';

export const BackgroundMesh: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base gradient background derived from Mist White and Deep Green undertones */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D2DAD0] via-[#E2E6DD] to-[#ECECE4]" />

      {/* Organic fluid shape 1 - Deep Green flow top-right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-25 filter blur-[90px]"
        style={{
          background: 'radial-gradient(circle, #21402A 0%, rgba(33, 64, 42, 0) 70%)',
        }}
      />

      {/* Organic fluid shape 2 - Sage/Forest curve behind sidebar left */}
      <div
        className="absolute top-1/4 -left-40 w-[650px] h-[750px] rounded-[45%] opacity-20 filter blur-[110px]"
        style={{
          background: 'radial-gradient(ellipse at center, #15231C 0%, #21402A 45%, rgba(33, 64, 42, 0) 75%)',
        }}
      />

      {/* Organic fluid shape 3 - Warm Taupe / Amber bloom bottom-center */}
      <div
        className="absolute -bottom-32 right-1/4 w-[700px] h-[600px] rounded-full opacity-18 filter blur-[120px]"
        style={{
          background: 'radial-gradient(circle, #A08569 0%, #8B6222 35%, rgba(139, 98, 34, 0) 70%)',
        }}
      />

      {/* Organic fluid shape 4 - Deep Green highlight center-top */}
      <div
        className="absolute top-10 left-1/3 w-[500px] h-[400px] rounded-full opacity-12 filter blur-[100px]"
        style={{
          background: 'radial-gradient(circle, #21402A 0%, rgba(236, 236, 228, 0) 70%)',
        }}
      />

      {/* Subtle organic wavy SVG vector lines for realistic depth */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 object-cover"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-100 200 C300 100, 500 400, 900 250 C1200 150, 1400 350, 1600 200"
          fill="none"
          stroke="#21402A"
          strokeWidth="60"
          filter="blur(50px)"
        />
        <path
          d="M-50 700 C400 800, 700 500, 1100 650 C1350 750, 1500 600, 1650 700"
          fill="none"
          stroke="#A08569"
          strokeWidth="70"
          filter="blur(65px)"
        />
      </svg>
    </div>
  );
};

