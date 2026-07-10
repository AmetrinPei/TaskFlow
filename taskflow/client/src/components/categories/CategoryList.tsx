import type { Category } from '../../types';

interface CategoryListProps {
  categories: Category[];
  activeCategoryId: number | null;
  onCategorySelect: (id: number | null) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryList({
  categories,
  activeCategoryId,
  onCategorySelect,
  onEdit,
  onDelete,
}: CategoryListProps) {
  return (
    <nav className="space-y-1">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`group flex items-center rounded-lg transition-colors ${
            activeCategoryId === cat.id
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <button
            onClick={() => onCategorySelect(cat.id)}
            className={`flex-1 text-left px-3 py-2 text-sm truncate ${
              activeCategoryId === cat.id ? 'font-medium' : ''
            }`}
          >
            {cat.name}
          </button>
          <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(cat);
              }}
              className="p-1 text-gray-400 hover:text-primary rounded transition-colors"
              title="编辑"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cat);
              }}
              className={`p-1 rounded transition-colors ${
                cat.is_builtin
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-400 hover:text-danger'
              }`}
              title={cat.is_builtin ? '预置分类不可删除' : '删除'}
              disabled={!!cat.is_builtin}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </nav>
  );
}
