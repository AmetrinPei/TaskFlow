import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStats } from '../hooks/useStats';
import StatsOverview from '../components/stats/StatsOverview';
import StatusChart from '../components/stats/StatusChart';
import CategoryChart from '../components/stats/CategoryChart';
import Loading from '../components/common/Loading';

export default function StatsPage() {
  const { stats, loading, error, fetchStats } = useStats();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <Loading size="lg" text="加载统计数据..." />;
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-red-500 text-4xl mb-4">⚠</div>
        <p className="text-gray-600 mb-4">{error || '统计数据加载失败'}</p>
        <div className="flex gap-3">
          <button
            onClick={fetchStats}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            重新加载
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            返回任务列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">统计面板</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          返回任务列表
        </button>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <StatusChart data={stats.by_status} completionRate={stats.completion_rate} />
        <CategoryChart data={stats.by_category} />
      </div>
    </div>
  );
}
