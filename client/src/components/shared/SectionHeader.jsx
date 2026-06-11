import { Link } from 'react-router-dom';

export default function SectionHeader({ eyebrow, title, to }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
        <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
      </div>
      {to && <Link to={to} className="hidden text-sm font-bold uppercase tracking-[0.18em] underline sm:block">View all</Link>}
    </div>
  );
}
