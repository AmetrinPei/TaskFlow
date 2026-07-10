import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { CategoryCount } from '../../types';

interface CategoryChartProps {
  data: CategoryCount[];
}

const COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6366F1', '#EF4444', '#14B8A6'];

export default function CategoryChart({ data }: CategoryChartProps) {
  if (data.length === 0 || data.every((d) => d.count === 0)) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">分类分布</h3>
        <div className="flex items-center justify-center h-48 text-sm text-gray-400 dark:text-gray-500">暂无数据</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.name,
    count: item.count,
  }));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 transition-colors">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">分类分布</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} 个`, '任务数']} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
