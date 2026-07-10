import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusCount } from '../../types';

interface StatusChartProps {
  data: StatusCount[];
  completionRate: number;
}

const COLOR_MAP: Record<string, string> = {
  TODO: '#3B82F6',
  IN_PROGRESS: '#F59E0B',
  DONE: '#22C55E',
};

const LABEL_MAP: Record<string, string> = {
  TODO: '待办',
  IN_PROGRESS: '进行中',
  DONE: '已完成',
};

export default function StatusChart({ data, completionRate }: StatusChartProps) {
  const chartData = data.map((item) => ({
    name: LABEL_MAP[item.status] || item.status,
    value: item.count,
    color: COLOR_MAP[item.status] || '#9CA3AF',
  }));

  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">状态分布</h3>
        <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">暂无数据</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">状态分布</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} 个`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completionRate}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">完成率</span>
          </div>
        </div>
        <div className="space-y-3">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
