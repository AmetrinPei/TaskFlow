interface TaskEmptyProps {
  onCreateTask: () => void;
  hasFilters?: boolean;
}

export default function TaskEmpty({ onCreateTask, hasFilters }: TaskEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {hasFilters ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          )}
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
        {hasFilters ? '无匹配结果' : '暂无任务'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {hasFilters ? '尝试调整筛选条件或清空搜索关键词' : '点击下方按钮创建你的第一个任务'}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreateTask}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          + 新建任务
        </button>
      )}
    </div>
  );
}
