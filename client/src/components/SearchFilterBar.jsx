import { FiSearch } from "react-icons/fi";

/**
 * Generic search/filter/sort bar.
 * `categories` is optional — when omitted (Income page), the category
 * select is hidden.
 */
export default function SearchFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
}) {
  return (
    <div className="card p-4 flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[200px]">
        <label className="label" htmlFor="search">
          Search
        </label>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            id="search"
            type="text"
            className="input pl-9"
            placeholder="Search by title or notes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {categories && (
        <div className="w-40">
          <label className="label" htmlFor="category">
            Category
          </label>
          <select id="category" className="input" value={category} onChange={(e) => onCategoryChange(e.target.value)}>
            <option value="All">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="w-40">
        <label className="label" htmlFor="startDate">
          From
        </label>
        <input id="startDate" type="date" className="input" value={startDate} onChange={(e) => onStartDateChange(e.target.value)} />
      </div>

      <div className="w-40">
        <label className="label" htmlFor="endDate">
          To
        </label>
        <input id="endDate" type="date" className="input" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} />
      </div>

      <div className="w-36">
        <label className="label" htmlFor="sortBy">
          Sort by
        </label>
        <select id="sortBy" className="input" value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
          <option value="date">Date</option>
          <option value="amount">Amount</option>
        </select>
      </div>

      <div className="w-32">
        <label className="label" htmlFor="order">
          Order
        </label>
        <select id="order" className="input" value={order} onChange={(e) => onOrderChange(e.target.value)}>
          <option value="desc">Newest / High</option>
          <option value="asc">Oldest / Low</option>
        </select>
      </div>
    </div>
  );
}
