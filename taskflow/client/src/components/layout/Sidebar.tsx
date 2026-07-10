import { useState } from 'react';
import type { TaskStatus, Category } from '../../types';
import { STATUS_OPTIONS } from '../../utils/constants';
import CategoryList from '../categories/CategoryList';
import CategoryForm from '../categories/CategoryForm';
import ConfirmDialog from '../common/ConfirmDialog';

interface SidebarProps {
  activeStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  categories: Category[];
  onCreateCategory: (name: string) => void;
  onUpdateCategory: (id: number, name: string) => void;
  onDeleteCategory: (category: Category) => void;
}

export default function Sidebar({
  activeStatus,
  onStatusChange,
  activeCategoryId,
  onCategoryChange,
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: SidebarProps) {
  // 分类表单状态
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [formLoading, setFormLoading] = useState(false);

  // 删除确认状态
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  function handleCreate() {
    setFormMode('create');
    setEditingCategory(undefined);
    setFormOpen(true);
  }

  function handleEdit(category: Category) {
    setFormMode('edit');
    setEditingCategory(category);
    setFormOpen(true);
  }

  async function handleFormSubmit(name: string) {
    try {
      setFormLoading(true);
      if (formMode === 'create') {
        await onCreateCategory(name);
      } else if (editingCategory) {
        await onUpdateCategory(editingCategory.id, name);
      }
      setFormOpen(false);
    } finally {
      setFormLoading(false);
    }
  }

  return (
    <aside className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-colors">
      {/* Status filter */}
      <div className="p-4">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">状态筛选</h3>
        <nav className="space-y-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onStatusChange(opt.value);
                onCategoryChange(null);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeStatus === opt.value && activeCategoryId === null
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100 dark:border-gray-700" />

      {/* Category list */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">分类</h3>
        <CategoryList
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategorySelect={onCategoryChange}
          onEdit={handleEdit}
          onDelete={(cat) => setDeleteTarget(cat)}
        />
      </div>

      {/* New category button */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleCreate}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          + 新建分类
        </button>
      </div>

      {/* Category form modal */}
      <CategoryForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        mode={formMode}
        initialName={editingCategory?.name}
        loading={formLoading}
      />

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="确认删除"
        message={`确定要删除分类「${deleteTarget?.name}」吗？该分类下的任务将移至「默认」分类。`}
        confirmText="删除"
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteCategory(deleteTarget);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </aside>
  );
}
