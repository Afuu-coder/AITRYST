import React from 'react';

// Custom Pottery Wheel Icon
export const PotteryWheelIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6" />
    <path d="M12 12l5-5M12 12l-5-5M12 12l5 5M12 12l-5 5" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

// Custom Handloom Icon
export const HandloomIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 20h16" />
    <path d="M6 16v-8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" />
    <path d="M6 12h12" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 16v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-2" />
  </svg>
);

// Custom Artisan Icon
export const ArtisanIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);