import React from 'react';

const AnimatedLogo = () => (
  <>
    <style>
      {`
        @keyframes gentle-rock {
          0%, 100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
        .animate-gentle-rock {
          animation: gentle-rock 4s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}
    </style>
    <div className="animate-gentle-rock">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-400"
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
    </div>
  </>
);

export default AnimatedLogo;
