import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TaskPage from './pages/TaskPage';
import StatsPage from './pages/StatsPage';
import { ToastProvider, useToast } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useCategories } from './hooks/useCategories';
import { useTasks } from './hooks/useTasks';
import { useDebounce } from './utils/helpers';
import type { TaskStatus, Category } from './types';

function AppRoutes() {
  const { showToast } = useToast();
  const {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();
  const taskHook = useTasks();

  const [activeStatus, setActiveStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('sort_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 搜索防抖
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  function handleSortChange(newSortBy: string, newSortOrder: 'asc' | 'desc') {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  }

  function handleCreateTask() {
    // 由 TaskPage 内部处理
  }

  // 分类管理回调（操作后刷新任务列表以同步 category_name）
  async function handleCreateCategory(name: string) {
    try {
      await createCategory(name);
      showToast('success', '分类创建成功');
      taskHook.refreshTasks();
    } catch (err: any) {
      showToast('error', err.message || '分类创建失败');
    }
  }

  async function handleUpdateCategory(id: number, name: string) {
    try {
      await updateCategory(id, name);
      showToast('success', '分类更新成功');
      taskHook.refreshTasks();
    } catch (err: any) {
      showToast('error', err.message || '分类更新失败');
    }
  }

  async function handleDeleteCategory(category: Category) {
    try {
      await deleteCategory(category.id);
      showToast('success', `分类「${category.name}」已删除，相关任务已移至「默认」`);
      // 如果删除的是当前选中的分类，重置筛选
      if (activeCategoryId === category.id) {
        setActiveCategoryId(null);
      }
      taskHook.refreshTasks();
    } catch (err: any) {
      showToast('error', err.message || '分类删除失败');
    }
  }

  return (
    <Routes>
      <Route
        element={
          <Layout
            activeStatus={activeStatus}
            onStatusChange={setActiveStatus}
            activeCategoryId={activeCategoryId}
            onCategoryChange={setActiveCategoryId}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            categories={categories}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onCreateTask={handleCreateTask}
            onCreateCategory={handleCreateCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        }
      >
        <Route
          path="/"
          element={
            <TaskPage
              categories={categories}
              activeStatus={activeStatus}
              onStatusChange={setActiveStatus}
              activeCategoryId={activeCategoryId}
              keyword={debouncedKeyword}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          }
        />
        <Route path="/stats" element={<StatsPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
