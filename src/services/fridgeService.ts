import { apiClient } from '@/lib/api';

export interface FridgeItem {
  id: number;
  name: string;
  icon: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  addedAt: string;
  updatedAt: string;
  isConsumed: boolean;
}

export interface FridgeItemInput {
  name: string;
  icon?: string;
  category?: string;
  quantity: number;
  unit?: string;
  expiryDate?: string;
}

export interface FridgeStatsData {
  year: number;
  totalConsumptions: number;
  topItems: { name: string; quantity: number }[];
  monthlyTotal: number;
  monthlyItems: number;
}

// 获取冰箱物品列表
export async function getFridgeItems(): Promise<FridgeItem[]> {
  try {
    const response = await apiClient.get('/fridge/items');
    if (response.success && response.data) {
      return response.data as FridgeItem[];
    }
    throw new Error(response.error?.message || '获取冰箱物品失败');
  } catch (error: any) {
    console.error('获取冰箱物品失败:', error);
    throw error;
  }
}

// 添加冰箱物品
export async function addFridgeItem(itemData: FridgeItemInput): Promise<FridgeItem> {
  try {
    const response = await apiClient.post('/fridge/items', itemData);
    if (response.success && response.data) {
      return response.data as FridgeItem;
    }
    throw new Error(response.error?.message || '添加冰箱物品失败');
  } catch (error: any) {
    console.error('添加冰箱物品失败:', error);
    throw error;
  }
}

// 更新冰箱物品
export async function updateFridgeItem(itemId: number, itemData: Partial<FridgeItemInput>): Promise<FridgeItem> {
  try {
    const response = await apiClient.put(`/fridge/items/${itemId}`, itemData);
    if (response.success && response.data) {
      return response.data as FridgeItem;
    }
    throw new Error(response.error?.message || '更新冰箱物品失败');
  } catch (error: any) {
    console.error('更新冰箱物品失败:', error);
    throw error;
  }
}

// 消耗冰箱物品
export async function consumeFridgeItem(itemId: number, quantity: number = 1): Promise<any> {
  try {
    const response = await apiClient.post(`/fridge/items/${itemId}/consume`, { quantity });
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error?.message || '消耗冰箱物品失败');
  } catch (error: any) {
    console.error('消耗冰箱物品失败:', error);
    throw error;
  }
}

// 删除冰箱物品
export async function deleteFridgeItem(itemId: number): Promise<void> {
  try {
    const response = await apiClient.delete(`/fridge/items/${itemId}`);
    if (!response.success) {
      throw new Error(response.error?.message || '删除冰箱物品失败');
    }
  } catch (error: any) {
    console.error('删除冰箱物品失败:', error);
    throw error;
  }
}

// 获取冰箱统计数据
export async function getFridgeStats(): Promise<FridgeStatsData> {
  try {
    const response = await apiClient.get('/fridge/stats');
    if (response.success && response.data) {
      return response.data as FridgeStatsData;
    }
    throw new Error(response.error?.message || '获取冰箱统计失败');
  } catch (error: any) {
    console.error('获取冰箱统计失败:', error);
    throw error;
  }
}