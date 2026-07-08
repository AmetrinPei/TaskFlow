import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import { categoryApi } from '../api/categoryApi';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error('获取分类失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const createCategory = useCallback(async (name: string) => {
    const res = await categoryApi.create(name);
    await fetchCategories();
    return res.data;
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: number, name: string) => {
    const res = await categoryApi.update(id, name);
    await fetchCategories();
    return res.data;
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: number) => {
    await categoryApi.delete(id);
    await fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
