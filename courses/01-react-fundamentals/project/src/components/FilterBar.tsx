export type FilterType = 'all' | 'active' | 'completed';

export type SortOrder = 'recent' | 'priority-high-low' | 'priority-low-high' | 'alphabetical' | 'due-date-soonest';

interface FilterBarProps {
  filter?: FilterType;
  onFilterChange?: (filter: FilterType) => void;
  categoryFilter?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
  sortOrder?: SortOrder;
  onSortChange?: (order: SortOrder) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const ALL_CATEGORIES = '';

export default function FilterBar({ filter = 'all', onFilterChange, categoryFilter = ALL_CATEGORIES, onCategoryChange, categories = [], sortOrder = 'recent', onSortChange, searchQuery = '', onSearchChange }: FilterBarProps) {
  return (
    <div id="filter-bar" data-filter={filter}>
      <button type="button" data-active={filter === 'all'} onClick={() => onFilterChange?.('all')}>All</button>
      <button type="button" data-active={filter === 'active'} onClick={() => onFilterChange?.('active')}>Active</button>
      <button type="button" data-active={filter === 'completed'} onClick={() => onFilterChange?.('completed')}>Completed</button>
      <select id="category-filter" value={categoryFilter} onChange={(e) => onCategoryChange?.(e.target.value)}>
        <option value={ALL_CATEGORIES}>All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        id="search-input"
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange?.(e.target.value)}
        placeholder="Search tasks..."
      />
      {searchQuery && (
        <button type="button" id="clear-search" onClick={() => onSearchChange?.('')}>
          Clear search
        </button>
      )}
      <select id="sort-order" value={sortOrder} onChange={(e) => onSortChange?.(e.target.value as SortOrder)}>
        <option value="recent">Recently Added</option>
        <option value="priority-high-low">Priority: High to Low</option>
        <option value="priority-low-high">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="due-date-soonest">Due Date (Soonest First)</option>
      </select>
    </div>
  );
}
