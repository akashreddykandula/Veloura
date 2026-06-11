import SEO from '../lib/seo.jsx';

const content = {
  about: ['About Us', 'Veloura is a modern fashion label focused on refined essentials, thoughtful textures, and long-wear silhouettes.'],
  privacy: ['Privacy Policy', 'We collect only the data required to operate accounts, orders, payments, support, and personalized shopping experiences.'],
  terms: ['Terms & Conditions', 'By shopping with Veloura, you agree to accurate account information, lawful use, and our order, payment, and return policies.'],
  returns: ['Returns & Refunds', 'Eligible items can be returned within the stated return window. Refund status is visible in your order history once approved.']
};

export default function StaticPage({ type }) {
  const [title, body] = content[type] || content.about;
  return <section className="container-pad max-w-3xl py-16"><SEO title={title} /><h1 className="font-display text-5xl">{title}</h1><p className="mt-6 text-lg leading-8 text-neutral-600">{body}</p></section>;
}
