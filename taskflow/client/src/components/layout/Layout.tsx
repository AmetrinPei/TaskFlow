import { useState, useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import type { TaskStatus, Category } from '../../types';

interface LayoutProps {
  activeStatus: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  activeCategoryId: number | null;
  onCategoryChange: (id: number | null) => void;
  searchKeyword: string;
  onSearchChange: (keyword: string) => void;
  categories: Category[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  onCreateTask: () => void;
  onCreateCategory: (name: string) => void;
  onUpdateCategory: (id: number, name: string) => void;
  onDeleteCategory: (category: Category) => void;
}

export default function Layout({
  activeStatus,
  onStatusChange,
  activeCategoryId,
  onCategoryChange,
  searchKeyword,
  onSearchChange,
  categories,
  sortBy,
  sortOrder,
  onSortChange,
  onCreateTask,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否是平板/小屏（< 1024px）
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    handler(mql);
    mql.addEventListener('change', handler as (e: MediaQueryListEvent) => void);
    return () => mql.removeEventListener('change', handler as (e: MediaQueryListEvent) => void);
  }, []);

  // 切换侧边栏
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  // 在移动端，筛选操作后自动关闭侧边栏
  const handleStatusChange = useCallback(
    (status: TaskStatus | 'ALL') => {
      onStatusChange(status);
      if (isMobile) setSidebarOpen(false);
    },
    [onStatusChange, isMobile]
  );

  const handleCategoryChange = useCallback(
    (id: number | null) => {
      onCategoryChange(id);
      if (isMobile) setSidebarOpen(false);
    },
    [onCategoryChange, isMobile]
  );

  // Esc 关闭侧边栏
  useEffect(() => {
    if (!isMobile || !sidebarOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setSidebarOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobile, sidebarOpen]);

  const sidebarElement = (
    <Sidebar
      activeStatus={activeStatus}
      onStatusChange={handleStatusChange}
      activeCategoryId={activeCategoryId}
      onCategoryChange={handleCategoryChange}
      categories={categories}
      onCreateCategory={onCreateCategory}
      onUpdateCategory={onUpdateCategory}
      onDeleteCategory={onDeleteCategory}
    />
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar: 桌面端固定显示，移动端覆盖层 */}
      {isMobile ? (
        sidebarOpen && (
          <>
            {/* 半透明遮罩 */}
            <div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            {/* 侧边栏覆盖层 */}
            <div className="fixed left-0 top-0 h-full z-50">
              {sidebarElement}
            </div>
          </>
        )
      ) : (
        sidebarElement
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchKeyword={searchKeyword}
          onSearchChange={onSearchChange}
          isMobile={isMobile}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet context={{
            sortBy,
            sortOrder,
            onSortChange,
            onCreateTask,
          }} />
        </main>
      </div>
    </div>
  );
}
