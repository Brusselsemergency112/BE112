const ITEMS = [
  "Bruxelles",
  "BE112",
  "Photographie documentaire",
  "Section",
  "Medical Team",
  "Ambulanciers",
  "Services",
];

export default function Marquee() {
  const sequence = (
    <div className="marquee-track" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-baseline whitespace-nowrap">
          <span className="px-6 font-display text-2xl italic text-paper/80 md:px-10 md:text-3xl">
            {item}
          </span>
          <span className="text-accent">·</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee border-y border-paper/10 bg-ink py-4" role="presentation">
      {sequence}
      {sequence}
    </div>
  );
}
