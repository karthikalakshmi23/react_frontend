import Button from './Button'
import FormInput from './FormInput'

type Filter = 'all' | 'active' | 'completed'

interface FilterBarProps {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  sortOrder: string
  onSortChange: (value: string) => void
  searchText: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  categories: string[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
}

export default function FilterBar({
  filter,
  onFilterChange,
  sortOrder,
  onSortChange,
  searchText,
  onSearchChange,
  onClearSearch,
  categories,
  selectedCategory,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div id="filter-bar">
      <Button
        variant={filter === 'all' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('all')}
      >
        All
      </Button>

      <Button
        variant={filter === 'active' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('active')}
      >
        Active
      </Button>

      <Button
        variant={filter === 'completed' ? 'primary' : 'secondary'}
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </Button>

      <select
        id="sort-order"
        value={sortOrder}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="recent">Recently Added</option>
        <option value="high">Priority: High to Low</option>
        <option value="low">Priority: Low to High</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="due-date">Due Date (Soonest First)</option>
      </select>

      <select
        id="category-filter"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="All categories">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>

      <FormInput
        id="search-input"
        label=""
        type="text"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      {searchText && (
        <Button id="clear-search" variant="secondary" onClick={onClearSearch}>
          Clear search
        </Button>
      )}
    </div>
  )
}
