# Dopamind Landing Page Integration Guide

## 概述
本指南说明如何将 dopamind.app (landing page) 与 web.dopamind.app (web app) 无缝集成。

## 架构设计

### 域名策略
- **dopamind.app**: 营销主站 + 注册/登录功能
- **web.dopamind.app**: 登录后的完整应用体验

### 用户流程
1. 用户访问 web.dopamind.app
2. 如未登录，自动重定向到 dopamind.app/login
3. 在 dopamind.app 完成登录
4. 登录成功后跳转回 web.dopamind.app

## dopamind.app 需要的配置

### 1. 环境变量配置

在 web.dopamind.app 项目中配置以下环境变量：
```env
# 域名配置
NEXT_PUBLIC_LANDING_PAGE_URL=https://dopamind.app
NEXT_PUBLIC_WEB_APP_URL=https://web.dopamind.app
```

### 2. 登录成功后的重定向逻辑

登录成功后，需要重定向到：
```
{WEB_APP_URL}/auth/callback?token={token}&refreshToken={refreshToken}&user={encodeURIComponent(JSON.stringify(user))}&redirect={redirect}
```

### 3. URL 参数处理

- `token`: JWT 认证令牌
- `refreshToken`: 刷新令牌（可选）
- `user`: 用户信息的 JSON 字符串（需要 encodeURIComponent）
- `redirect`: 登录成功后的目标页面（从登录页面的 redirect 参数传递）

### 4. 登录页面 URL 参数支持

dopamind.app/login 需要支持 `redirect` 参数：
- 例如：`dopamind.app/login?redirect=https://web.dopamind.app/dashboard`
- 登录成功后将此参数传递给回调 URL

### 5. 示例代码

```javascript
// 登录成功后的处理逻辑
function handleLoginSuccess(token, refreshToken, user) {
  const urlParams = new URLSearchParams(window.location.search);
  const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || 'https://web.dopamind.app';
  const redirect = urlParams.get('redirect') || `${webAppUrl}/dashboard`;

  const callbackUrl = new URL(`${webAppUrl}/auth/callback`);
  callbackUrl.searchParams.set('token', token);
  if (refreshToken) {
    callbackUrl.searchParams.set('refreshToken', refreshToken);
  }
  callbackUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(user)));
  callbackUrl.searchParams.set('redirect', redirect);

  window.location.href = callbackUrl.toString();
}
```

## web.dopamind.app 的实现

### 1. 认证检查
- 所有需要认证的页面已移至 `(protected)` 路由组
- 使用 `AuthGuard` 组件检查登录状态
- 未登录用户自动重定向到 dopamind.app/login

### 2. 登录回调处理
- `/auth/callback` 页面处理从 dopamind.app 传来的认证信息
- 自动保存 token 和用户信息到 localStorage
- 重定向到目标页面

### 3. 首页智能路由
- 未登录用户：显示介绍页面，引导到 dopamind.app
- 已登录用户：自动重定向到 /dashboard

## 测试流程

1. 清除浏览器缓存和 localStorage
2. 访问 web.dopamind.app/dashboard
3. 应自动重定向到 dopamind.app/login?redirect=...
4. 在 dopamind.app 完成登录
5. 应自动跳转回 web.dopamind.app/dashboard
6. 验证用户已成功登录，能正常使用应用功能

## SEO 优化

### 各域名职责分工
- **dopamind.app**: 专攻营销关键词（"专注力训练"、"ADHD工具"等）
- **web.dopamind.app**: 专攻应用功能关键词（"在线番茄钟"、"任务管理工具"等）

### 避免重复内容
- 两个域名职责清晰分离
- web.dopamind.app 的首页只对已登录用户显示，SEO 爬虫看到的是介绍页面
- 使用 canonical 标签指向主版本

## 安全考虑

1. **Token 验证**: web.dopamind.app 需要验证从 dopamind.app 传来的 token
2. **HTTPS**: 所有认证相关的重定向都必须使用 HTTPS
3. **参数验证**: 验证回调参数的有效性和完整性
4. **跨域安全**: 确保只接受来自 dopamind.app 的认证回调

## 部署清单

### dopamind.app 需要实现：
- [ ] 登录页面支持 `redirect` 参数
- [ ] 登录成功后重定向到 web.dopamind.app/auth/callback
- [ ] 注册成功后的类似处理逻辑
- [ ] URL 参数正确编码和传递

### web.dopamind.app 已完成：
- [x] 移除本地登录/注册页面
- [x] 实现 AuthGuard 组件
- [x] 创建 /auth/callback 处理页面
- [x] 更新首页链接指向 dopamind.app
- [x] 实现智能首页路由
- [x] 配置路由组结构