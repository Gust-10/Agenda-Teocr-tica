
import React from 'react';

const RepeatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-5 w-5 ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4v5h5M20 20v-5h-5M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4"
    />
     <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5l-5 5" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 14.5l-5-5" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 9.5l5 5" />
  </svg>
);

// Fallback simple repeat icon, just in case. A more complex one is above.
// const RepeatIcon = ({ className }: { className?: string }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 19v-5h-5M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
//     </svg>
// );


// Alternative icon
// <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// <path d="M17 2l4 4-4 4" />
// <path d="M3 12a9 9 0 0 0 9 9h9" />
// <path d="M21 2h-9a9 9 0 0 0-9 9v2" />
// <path d="M7 22l-4-4 4-4" />


const FinalRepeatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 11a5 5 0 10-5 5M17 11V6M17 6H7V2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 13a5 5 0 105-5M7 13v5M7 18h10v4" />
    </svg>
);


// Using a simpler, clearer repeat icon
const CleanRepeatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-2.5-2.5M19 13l-2.5 2.5m-11-3l2.5 2.5m-2.5-2.5l2.5-2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default CleanRepeatIcon;
