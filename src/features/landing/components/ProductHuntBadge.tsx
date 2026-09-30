export function ProductHuntBadge({ className }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className || 'py-6'}`}>
      <a
        href="https://www.producthunt.com/products/kuinbee?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-kuinbee"
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        <img
          alt="Kuinbee - The Data OS | Product Hunt"
          width="250"
          height="54"
          src="/product-hunt-badge.svg"
          loading="lazy"
          decoding="async"
          className="h-10 w-auto object-contain sm:h-[54px]"
        />
      </a>
    </div>
  );
}
