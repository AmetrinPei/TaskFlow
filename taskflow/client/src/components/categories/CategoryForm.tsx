import Modal from '../common/Modal';
import { useState, useEffect } from 'react';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  mode: 'create' | 'edit';
  initialName?: string;
  loading?: boolean;
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialName = '',
  loading = false,
}: CategoryFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError('');
    }
  }, [isOpen, initialName]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('分类名不能为空');
      return;
    }
    if (trimmed.length > 20) {
      setError('分类名不能超过20个字符');
      return;
    }
    onSubmit(trimmed);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '新建分类' : '编辑分类'}
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            分类名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="请输入分类名称"
            maxLength={20}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              error
                ? 'border-red-300 focus:ring-red-200'
                : 'border-gray-200 focus:ring-primary/20 focus:border-primary'
            }`}
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {mode === 'create' ? '创建' : '保存'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
