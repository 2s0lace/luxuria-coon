import { useId } from "react";

type CatPeekProps = {
  className?: string;
  expression?: "curious" | "happy";
};

export default function CatPeek({
  className = "",
  expression = "curious",
}: CatPeekProps) {
  const maskId = `cat-peek-${useId().replace(/:/g, "")}`;

  return (
    <svg
      viewBox="0 0 320 190"
      className={className}
      fill="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <mask id={maskId}>
          <rect width="320" height="190" fill="white" />
          {expression === "happy" ? (
            <>
              <path
                d="m116 86 10-10 10 10m48 0 10-10 10 10"
                stroke="black"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <ellipse cx="160" cy="112" rx="10" ry="12" fill="black" />
            </>
          ) : (
            <>
              <ellipse cx="126" cy="82" rx="7" ry="10" fill="black" />
              <ellipse cx="194" cy="82" rx="7" ry="10" fill="black" />
            </>
          )}
          <path
            d="M154 101c4-4 8-4 12 0-2 7-10 7-12 0Z"
            fill="black"
          />
          {expression === "curious" && (
            <path
              d="M160 108v7m0 0c-7 0-12-3-14-8m14 8c7 0 12-3 14-8"
              stroke="black"
              strokeWidth="5"
              strokeLinecap="round"
            />
          )}
          <path
            d="m94 43 23-17-8 31m117-14-23-17 8 31"
            stroke="black"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M88 154c8-7 17-7 25 0m-12-6v16m106-10c8-7 17-7 25 0m-12-6v16"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </mask>
      </defs>

      <g fill="currentColor" mask={`url(#${maskId})`}>
        <path d="M87 49 73 7l49 25c12-6 24-9 38-9s26 3 38 9l49-25-14 42c13 14 20 31 20 51 0 35-31 49-93 49S67 135 67 100c0-20 7-37 20-51Z" />
        <rect x="70" y="119" width="66" height="67" rx="31" />
        <rect x="184" y="119" width="66" height="67" rx="31" />
      </g>
      <path
        d="M118 105 55 91m67 27-72 1m152-14 63-14m-67 27 72 1"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.72"
      />
    </svg>
  );
}
