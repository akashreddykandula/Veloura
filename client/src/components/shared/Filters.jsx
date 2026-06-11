export default function Filters({ filters = {}, params, setParam }) {
  const section = (title, values, key) => (
    <div className="border-b border-stone py-5">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em]">{title}</h3>
      <div className="grid gap-2 text-sm">
        {values?.map((value) => (
          <label key={value} className="flex items-center gap-2">
            <input type="checkbox" checked={params.get(key)?.split(',').includes(value) || false} onChange={() => setParam(key, value, true)} />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
  return (
    <aside>
      <div className="border-b border-stone pb-5">
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>
      {section('Category', filters.categories?.map((item) => item._id), 'category')}
      {section('Size', filters.sizes, 'size')}
      {section('Color', filters.colors, 'color')}
      {section('Brand', filters.brands, 'brand')}
      <div className="border-b border-stone py-5">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.18em]">Availability</h3>
        <button onClick={() => setParam('availability', 'in-stock')} className="text-sm underline">In stock only</button>
      </div>
    </aside>
  );
}
