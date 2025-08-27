// 网站统计数据配置
// 这些数据可以从API获取或定期手动更新

export interface StatItem {
  value: string;
  labelKey: string; // 使用翻译键而不是硬编码文本
}

export const stats = {
  // 主页社交证明统计
  socialProof: [
    {
      value: "500+",
      labelKey: "stats.activeUsers"
    },
    {
      value: "100%",
      labelKey: "stats.userSatisfaction"
    },
    {
      value: "4.9",
      labelKey: "stats.appStoreRating"
    }
  ] as StatItem[],

  // 最终CTA区域的统计
  finalCta: [
    {
      value: "500+",
      labelKey: "stats.activeUsers"
    },
    {
      value: "4.9★",
      labelKey: "stats.appRating"
    },
    {
      value: "100%",
      labelKey: "stats.satisfaction"
    }
  ] as StatItem[]
};

// 如果需要从API获取统计数据，可以使用这个函数
export async function fetchStats(): Promise<typeof stats> {
  try {
    // 这里可以添加API调用逻辑
    // const response = await fetch('/api/stats');
    // const data = await response.json();
    // return data;
    
    // 目前返回静态配置
    return stats;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    // 出错时返回默认配置
    return stats;
  }
}

// 辅助函数：获取特定统计项
export function getStatByKey(statsArray: StatItem[], labelKey: string): StatItem | undefined {
  return statsArray.find(stat => stat.labelKey === labelKey);
}