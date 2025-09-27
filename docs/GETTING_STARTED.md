# 项目开始指南

恭喜！Dopamind Web项目已经成功创建。以下是下一步的操作指南：

## 📦 安装依赖

由于网络问题，我们已经创建了完整的项目结构和配置，现在你需要安装依赖：

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm (推荐)
pnpm install
```

## 🚀 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

然后访问 [http://localhost:3000](http://localhost:3000) 查看你的应用。

## 📁 项目结构说明

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 认证页面组
│   ├── (dashboard)/       # 主应用页面组
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # shadcn/ui 基础组件
│   ├── layout/           # 布局组件
│   ├── tasks/            # 任务相关组件
│   ├── chat/             # AI对话组件
│   └── common/           # 通用组件
├── lib/                  # 工具库
│   ├── api.ts           # API 客户端
│   └── utils.ts         # 工具函数
├── stores/              # Zustand 状态管理
├── hooks/               # 自定义 Hooks  
├── types/               # TypeScript 类型
└── styles/              # 样式文件
```

## 🔧 配置说明

### 环境变量
- 复制 `.env.example` 到 `.env.local`
- 根据你的后端API地址修改 `NEXT_PUBLIC_API_URL`

### 后端集成
确保你的后端服务正在运行：
- 移动端后端：`C:\Work\CS\GitHub\dopamind\backend`
- 默认端口：3001

## 🎨 shadcn/ui 组件

项目已配置好 shadcn/ui，你可以添加更多组件：

```bash
# 添加新的 UI 组件
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
```

## 📝 下一步开发

按照 `docs/ROADMAP.md` 中的开发路线图进行：

1. **Phase 1**: 基础设施搭建 ✅
2. **Phase 2**: 核心功能开发
   - 用户认证页面
   - 任务管理界面  
   - AI对话功能
3. **Phase 3**: 专注模式和体验优化
4. **Phase 4**: 高级功能和集成
5. **Phase 5**: 测试和发布

## 🔗 有用链接

- [技术架构文档](docs/ARCHITECTURE.md)
- [API接口文档](docs/API.md)
- [开发路线图](docs/ROADMAP.md)
- [Next.js 文档](https://nextjs.org/docs)
- [shadcn/ui 文档](https://ui.shadcn.com)

## 🐛 问题排查

如果遇到问题，请检查：
1. Node.js 版本 >= 18
2. 后端服务是否运行在正确端口
3. 环境变量配置是否正确
4. 依赖是否完全安装

---

🎉 **开始你的 Dopamind Web 开发之旅吧！**