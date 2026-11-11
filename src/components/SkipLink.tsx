import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-forest text-mist font-semibold rounded-xl border border-white/20 shadow-xl focus:outline-none focus:ring-2 focus:ring-deep-green"
    >
      Skip to main content
    </a>
  );
};

