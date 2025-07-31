# Dopamind Landing Page

这是 Dopamind 应用的官方 Landing Page，基于 Next.js 构建，集成了用户注册和登录功能。

## 产品介绍

Dopamind 是一款专为 ADHD（注意力缺陷多动障碍）用户设计的智能任务管理应用。它不仅仅是一个待办事项工具，更是一个理解你、支持你的 AI 伙伴。

### 核心特点

**对话式任务管理**：你只需像和朋友聊天一样描述任务，比如"明天下午要开会"，AI 就会自动帮你创建任务并设置提醒。

**智能任务分解**：当面对复杂任务时，AI 会将"大象"分解成可执行的"小台阶"，让你知道下一步具体该做什么。

**专注模式训练**：25分钟番茄钟配合沉浸式体验，帮你进入深度工作状态，并自动记录你的专注数据。

**情感支持**：AI 不仅是工具，更是你的教练和伙伴。在你启动困难时给你鼓励，在你卡住时提供帮助。

## 功能特性

- 🌐 多语言支持 (中文/英文/日文)
- 🔐 用户注册和登录
- 📱 响应式设计
- 🚀 基于 Next.js 15 和 React 19
- 🎨 使用 Tailwind CSS 进行样式设计
- 🔗 与现有 Backend API 集成

## 技术栈

- **前端框架**: Next.js 15.4.1
- **UI 库**: React 19.1.0
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **TypeScript**: 完整类型支持

## 项目结构

```
dopamind-landing-page/
├── src/
│   ├── app/
│   │   ├── [locale]/          # 多语言路由
│   │   ├── login/             # 登录页面
│   │   ├── register/          # 注册页面
│   │   ├── dashboard/         # 用户仪表板
│   │   └── globals.css        # 全局样式
│   ├── lib/
│   │   ├── api.ts            # Backend API 服务
│   │   └── i18n.ts           # 国际化配置
│   └── middleware.ts         # Next.js 中间件
├── components/
│   ├── AuthButton.tsx        # 认证按钮组件
│   └── LanguageSwitcher.tsx  # 语言切换组件
├── locales/                  # 翻译文件
├── public/                   # 静态资源
└── database/
    └── create_users_table.sql # 数据库表结构
```

## 环境配置

1. 复制环境配置文件：
```bash
cp .env.example .env.local
```

2. 配置环境变量：
```env
# Backend API 配置
BACKEND_URL="http://localhost:3001"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret_here"
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问应用：
打开 [http://localhost:3000](http://localhost:3000)

## 与 Backend 集成

这个 Landing Page 设计为与现有的 Dopamind Backend 项目集成：

- **Backend 项目位置**: `C:\Work\CS\GitHub\dopamind\backend`
- **Frontend 应用位置**: `C:\Work\CS\GitHub\dopamind\frontend`
- **Landing Page 位置**: `C:\Work\CS\GitHub\dopamind-landing-page`

### Backend API 端点

Landing Page 使用以下 Backend API 端点：

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `GET /auth/profile` - 获取用户信息
- `POST /auth/refresh` - 刷新 Token

### 认证流程

1. 用户在 Landing Page 注册/登录
2. 成功后保存 JWT Token 到 localStorage
3. 用户可以访问仪表板查看基本信息
4. 可以跳转到主应用 (Frontend) 继续使用

## 部署

1. 构建生产版本：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

## 开发说明

- 使用 `npm run lint` 进行代码检查
- 支持热重载开发
- 包含 TypeScript 类型检查
- 使用 ESLint 进行代码质量控制

## 用户流程

1. **首页访问** - 用户访问 Landing Page，了解产品功能
2. **注册账户** - 新用户注册，创建账户并获得 7 天试用
3. **登录系统** - 现有用户登录
4. **查看仪表板** - 登录后可以查看基本用户信息
5. **跳转主应用** - 从 Landing Page 跳转到主应用继续使用

## 联系信息

- 邮箱: support@dopamind.com
- 项目: Dopamind - 专为 ADHD 用户设计的 AI 专注伙伴