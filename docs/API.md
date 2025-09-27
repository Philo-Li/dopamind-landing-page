# Dopamind Web API 文档

## API 概览

Dopamind Web 应用与现有的后端API完全兼容，同时扩展了Web端特有的功能。本文档描述了Web应用如何与API交互。

## 基础信息

- **API Base URL**: `http://localhost:3001` (开发环境)
- **API Base URL**: `https://api.dopamind.com` (生产环境)
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **请求头**: `Content-Type: application/json`

## 认证 (Authentication)

### 登录
```http
POST /auth/login
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "nickname": "用户昵称",
      "avatarUrl": "https://r2.dopamind.com/avatars/user1.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 注册
```http
POST /auth/register
```

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "用户昵称"
}
```

### Token 刷新
```http
POST /auth/refresh
```

**请求体:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 获取用户信息
```http
GET /auth/profile
Authorization: Bearer <token>
```

## 任务管理 (Tasks)

### 获取任务列表
```http
GET /tasks?page=1&limit=20&status=pending&priority=high
Authorization: Bearer <token>
```

**查询参数:**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)
- `status`: 任务状态 (`pending`, `completed`, `deleted`)
- `priority`: 优先级 (`low`, `medium`, `high`)
- `search`: 搜索关键词
- `dueDate`: 截止日期筛选 (`today`, `week`, `month`)
- `parentId`: 父任务ID (获取子任务)

**响应:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "1",
        "title": "完成项目报告",
        "description": "准备季度总结报告",
        "status": "pending",
        "priority": "high",
        "dueDate": "2024-01-15T09:00:00Z",
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-12T14:30:00Z",
        "parentId": null,
        "subTasks": [],
        "focusTime": 3600,
        "completedAt": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### 创建任务
```http
POST /tasks
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "title": "新任务标题",
  "description": "任务描述",
  "priority": "medium",
  "dueDate": "2024-01-20T15:00:00Z",
  "parentId": null
}
```

### 更新任务
```http
PUT /tasks/:id
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "title": "更新后的任务标题",
  "status": "completed",
  "priority": "low"
}
```

### 删除任务
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

### 批量操作
```http
POST /tasks/batch
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "action": "complete", // "complete", "delete", "updatePriority"
  "taskIds": ["1", "2", "3"],
  "data": { "priority": "high" } // 可选，用于更新操作
}
```

## AI 对话 (Chat)

### 发送消息
```http
POST /ai/chat
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "message": "帮我创建一个明天下午3点的会议任务",
  "sessionId": "session-123", // 可选，用于保持对话上下文
  "context": {
    "currentPage": "tasks",
    "selectedTasks": ["1", "2"]
  }
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "reply": "好的，我已经为您创建了明天下午3点的会议任务。",
    "actions": [
      {
        "type": "createTask",
        "data": {
          "title": "会议",
          "dueDate": "2024-01-16T15:00:00Z"
        }
      }
    ],
    "sessionId": "session-123"
  }
}
```

### 获取聊天历史
```http
GET /ai/chat/history?sessionId=session-123&limit=50
Authorization: Bearer <token>
```

### 任务分解
```http
POST /ai/decompose
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "taskId": "1",
  "taskTitle": "完成项目报告"
}
```

## 专注模式 (Focus)

### 开始专注会话
```http
POST /focus/sessions
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "taskId": "1", // 可选，关联特定任务
  "duration": 1500, // 专注时长（秒），25分钟 = 1500秒
  "type": "focus" // "focus", "shortBreak", "longBreak"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "sessionId": "focus-session-123",
    "startTime": "2024-01-15T10:00:00Z",
    "endTime": "2024-01-15T10:25:00Z",
    "pepTalk": "现在是专注时间！让我们一起完成这个任务，你一定可以的！"
  }
}
```

### 结束专注会话
```http
PUT /focus/sessions/:sessionId/complete
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "actualDuration": 1500,
  "summary": "成功完成了报告的第一部分",
  "interrupted": false
}
```

### 暂停专注 (我卡住了)
```http
POST /focus/sessions/:sessionId/pause
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "reason": "我觉得有点困难，不知道下一步该做什么"
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "supportMessage": "没关系，遇到困难很正常。让我们把任务分解成更小的步骤...",
    "suggestions": [
      "先列出报告的大纲",
      "收集需要的数据",
      "写一个简单的开头"
    ]
  }
}
```

### 获取专注统计
```http
GET /focus/stats?period=week&startDate=2024-01-01&endDate=2024-01-07
Authorization: Bearer <token>
```

**响应:**
```json
{
  "success": true,
  "data": {
    "totalSessions": 15,
    "totalFocusTime": 22500, // 秒
    "averageSessionLength": 1500,
    "completionRate": 0.8,
    "dailyStats": [
      {
        "date": "2024-01-01",
        "sessions": 3,
        "focusTime": 4500,
        "completedSessions": 2
      }
    ],
    "weeklyTrend": [
      { "week": "2024-W01", "focusTime": 22500 },
      { "week": "2024-W02", "focusTime": 18000 }
    ]
  }
}
```

## 订阅管理 (Subscriptions)

### 获取订阅列表
```http
GET /subscriptions
Authorization: Bearer <token>
```

**响应:**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "1",
        "name": "Netflix",
        "price": 15.99,
        "currency": "USD",
        "billingCycle": "monthly", // "monthly", "yearly"
        "nextBillingDate": "2024-02-15T00:00:00Z",
        "category": "Entertainment",
        "isActive": true,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "summary": {
      "monthlyTotal": 89.97,
      "yearlyTotal": 1079.64,
      "activeCount": 8,
      "categories": {
        "Entertainment": 31.98,
        "Productivity": 25.99,
        "Cloud Storage": 19.99
      }
    }
  }
}
```

### 创建订阅
```http
POST /subscriptions
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "name": "Spotify Premium",
  "price": 9.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "startDate": "2024-01-01T00:00:00Z",
  "category": "Entertainment"
}
```

## 数据分析 (Analytics)

### 获取仪表板数据
```http
GET /analytics/dashboard?period=month
Authorization: Bearer <token>
```

**响应:**
```json
{
  "success": true,
  "data": {
    "taskStats": {
      "totalTasks": 156,
      "completedTasks": 124,
      "completionRate": 0.79,
      "overdueTasks": 8
    },
    "focusStats": {
      "totalSessions": 45,
      "totalFocusTime": 67500, // 秒
      "averageSessionLength": 1500,
      "focusStreak": 7 // 连续专注天数
    },
    "productivityTrend": [
      { "date": "2024-01-01", "completed": 5, "created": 6 },
      { "date": "2024-01-02", "completed": 8, "created": 4 }
    ],
    "categoryBreakdown": [
      { "category": "工作", "count": 45, "percentage": 0.4 },
      { "category": "个人", "count": 30, "percentage": 0.27 }
    ]
  }
}
```

### 导出数据
```http
GET /analytics/export?format=csv&type=tasks&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**查询参数:**
- `format`: 导出格式 (`csv`, `json`, `xlsx`)
- `type`: 数据类型 (`tasks`, `focus`, `subscriptions`)
- `startDate`: 开始日期
- `endDate`: 结束日期

## 用户设置 (Settings)

### 获取用户设置
```http
GET /settings
Authorization: Bearer <token>
```

**响应:**
```json
{
  "success": true,
  "data": {
    "preferences": {
      "theme": "light", // "light", "dark", "system"
      "language": "zh-CN",
      "timezone": "Asia/Shanghai",
      "notifications": {
        "taskReminders": true,
        "focusReminders": true,
        "dailySummary": true
      },
      "focus": {
        "defaultDuration": 1500,
        "breakDuration": 300,
        "longBreakInterval": 4
      }
    },
    "shortcuts": {
      "newTask": "Ctrl+N",
      "focusMode": "Ctrl+F",
      "search": "Ctrl+K"
    }
  }
}
```

### 更新用户设置
```http
PUT /settings
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "preferences": {
    "theme": "dark",
    "notifications": {
      "taskReminders": false
    }
  }
}
```

### 上传头像
```http
POST /settings/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体:**
```
avatar: <file>
```

## WebSocket 连接

### 连接建立
```javascript
const ws = new WebSocket('ws://localhost:3001/ws?token=<jwt_token>')

ws.onmessage = (event) => {
  const data = JSON.parse(event.data)
  console.log('收到实时消息:', data)
}
```

### 消息格式
```json
{
  "type": "taskUpdate",
  "data": {
    "taskId": "1",
    "changes": {
      "status": "completed"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 支持的消息类型
- `taskUpdate`: 任务更新
- `taskCreate`: 新任务创建
- `taskDelete`: 任务删除
- `focusStart`: 专注会话开始
- `focusEnd`: 专注会话结束
- `notification`: 系统通知

## 错误处理

### 标准错误格式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求数据格式不正确",
    "details": {
      "field": "email",
      "issue": "邮箱格式无效"
    }
  }
}
```

### 常见错误码
- `AUTH_REQUIRED`: 需要认证
- `AUTH_INVALID`: 认证失败
- `FORBIDDEN`: 无权限访问
- `NOT_FOUND`: 资源不存在
- `VALIDATION_ERROR`: 数据验证失败
- `RATE_LIMIT`: 请求频率限制
- `SERVER_ERROR`: 服务器内部错误

### HTTP 状态码
- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 无权限
- `404`: 资源不存在
- `422`: 数据验证失败
- `429`: 请求频率限制
- `500`: 服务器错误

## 分页和排序

### 分页参数
- `page`: 页码 (从1开始)
- `limit`: 每页数量
- `sort`: 排序字段
- `order`: 排序方向 (`asc`, `desc`)

### 排序支持的字段
**任务 (Tasks):**
- `createdAt`: 创建时间
- `updatedAt`: 更新时间
- `dueDate`: 截止时间
- `priority`: 优先级
- `title`: 标题

**专注会话 (Focus Sessions):**
- `startTime`: 开始时间
- `duration`: 持续时间
- `createdAt`: 创建时间

## 最佳实践

### 1. 认证处理
```javascript
// 自动添加认证头
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. 错误处理
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 处理认证失败
      logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

### 3. 请求去重
```javascript
// 使用React Query防止重复请求
const { data: tasks } = useQuery({
  queryKey: ['tasks', filters],
  queryFn: () => fetchTasks(filters),
  staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
})
```

### 4. 实时更新
```javascript
// 结合WebSocket和React Query
useEffect(() => {
  const ws = new WebSocket(WS_URL)
  
  ws.onmessage = (event) => {
    const { type, data } = JSON.parse(event.data)
    
    if (type === 'taskUpdate') {
      // 更新本地缓存
      queryClient.setQueryData(['tasks'], (oldData) => {
        // 更新任务数据
        return updateTaskInList(oldData, data)
      })
    }
  }
  
  return () => ws.close()
}, [])
```

这份API文档为Dopamind Web应用提供了完整的接口说明，确保前端开发人员能够正确集成和使用后端API。