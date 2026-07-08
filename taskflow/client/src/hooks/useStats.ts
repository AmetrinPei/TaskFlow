import { useState, useCallback } from 'react';
import type { StatsOverview } from '../types';
import { statsApi } from '../api/statsApi';

export function useStats() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await statsApi.getOverview();
      setStats(res.data);
    } catch (error: any) {
      const message = error?.message || '获取统计数据失败';
      console.error('获取统计数据失败:', error);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
}
