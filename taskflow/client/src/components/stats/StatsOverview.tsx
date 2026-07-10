import type { StatsOverview as StatsOverviewType } from '../../types';

interface StatsOverviewProps {
  stats: StatsOverviewType;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  const todoCount = stats.by_status.find((s) => s.status === 'TODO')?.count || 0;
  const inProgressCount = stats.by_status.find((s) => s.status === 'IN_PROGRESS')?.count || 0;
  const doneCount = stats.by_status.find((s) => s.status === 'DONE')?.count || 0;

  const mainCards = [
    { label: '任务总数', value: stats.total, color: 'text-gray-900 dark:text-gray-100', bg: 'bg-gray-50 dark:bg-gray-800' },
    { label: '待办', value: todoCount, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: '进行中', value: inProgressCount, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/30' },
    { label: '已完成', value: doneCount, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/30' },
  ];

  const subCards = [
    { label: '完成率', value: `${stats.completion_rate}%`, color: 'text-primary' },
    { label: '逾期任务', value: stats.overdue_count, color: stats.overdue_count > 0 ? 'text-red-500' : 'text-gray-500' },
    { label: '今日完成', value: stats.today_completed, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Main stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {mainCards.map((card) => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4 transition-colors`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Sub stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {subCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 transition-colors">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
            <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
