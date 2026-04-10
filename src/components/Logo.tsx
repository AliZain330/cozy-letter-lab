const Logo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M32 8L52 28L32 48L12 28L32 8Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M32 8L52 28L38 28L32 18L26 28L12 28L32 8Z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M32 48L32 56"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M28 52L36 52"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export default Logo;
