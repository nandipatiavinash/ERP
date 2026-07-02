export function BrandLogo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <img
      src="/rk-global-circular.png"
      alt="RK Global"
      className={`${className} object-contain`}
      loading="eager"
      decoding="async"
    />
  );
}
