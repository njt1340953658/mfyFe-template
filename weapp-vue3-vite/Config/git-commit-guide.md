# Git 提交规范

## 提交信息格式

### 基本格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 格式说明
- **type**: 提交类型（必填）
- **scope**: 影响范围（可选）
- **subject**: 简短描述（必填）
- **body**: 详细描述（可选）
- **footer**: 关联 Issue 或 Breaking Changes（可选）

## Type 类型

### 主要类型
- **feat**: 新功能（feature）
- **fix**: 修复 Bug
- **docs**: 文档变更
- **style**: 代码格式调整（不影响代码运行的变动）
- **refactor**: 重构（既不是新功能，也不是修复 Bug）
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **revert**: 回滚之前的提交

### 类型示例
```bash
# 新功能
feat(user): 添加用户列表查询功能

# 修复 Bug
fix(login): 修复登录页面验证码不刷新的问题

# 文档
docs(readme): 更新项目 README 文档

# 样式调整
style(button): 调整按钮间距和颜色

# 重构
refactor(api): 重构用户 API 接口封装

# 性能优化
perf(table): 优化表格虚拟滚动性能

# 测试
test(user): 添加用户模块单元测试

# 构建
chore(deps): 升级 React 到 18.2.0

# 回滚
revert: revert commit abc123
```

## Scope 范围

### 常用范围
- **user**: 用户模块
- **auth**: 认证模块
- **login**: 登录页面
- **home**: 首页
- **api**: API 接口
- **router**: 路由
- **redux**: 状态管理
- **utils**: 工具函数
- **components**: 组件
- **layout**: 布局
- **config**: 配置
- **deps**: 依赖

### 范围示例
```bash
feat(user): 添加用户编辑功能
fix(auth): 修复 token 过期处理
docs(api): 完善 API 文档
style(layout): 调整页面布局样式
refactor(redux): 重构 Redux store 结构
```

## Subject 描述

### 描述规范
- 使用中文描述
- 使用祈使句，动词开头
- 第一个字母小写
- 结尾不加句号
- 简洁明了，不超过 50 个字符

### 正确示例
```bash
✅ feat(user): 添加用户删除功能
✅ fix(login): 修复验证码显示错误
✅ docs(readme): 更新安装说明
✅ refactor(api): 优化请求拦截器
```

### 错误示例
```bash
❌ feat(user): 添加了用户删除功能。（不使用过去时，不加句号）
❌ fix(login): Fix bug（使用中文）
❌ docs: update（太简单，不明确）
❌ 修复 Bug（缺少 type 和 scope）
```

## Body 详细描述

### 何时使用
- 提交的改动较大
- 需要解释改动的原因
- 需要说明改动的影响

### 格式规范
- 详细描述改动内容
- 说明改动的原因和目的
- 如有必要，说明解决方案的选择

### 示例
```bash
feat(user): 添加用户批量删除功能

增加批量删除功能，支持选中多个用户同时删除。
- 添加 Checkbox 选择功能
- 添加全选和反选功能
- 添加批量删除确认对话框
- 优化删除后的列表刷新逻辑

该功能提升了管理员操作效率，减少重复操作。
```

## Footer 页脚

### Breaking Changes
当提交包含不兼容的变更时，需要在 footer 中说明：

```bash
feat(api): 重构用户 API 接口

BREAKING CHANGE: 
getUserList 接口返回数据结构变更：
- 原: { users: [], total: 0 }
- 新: { list: [], total: 0 }

需要更新调用此接口的所有代码。
```

### 关联 Issue
```bash
fix(login): 修复登录失败后跳转错误

修复用户登录失败后跳转到首页的问题，
现在会停留在登录页并显示错误提示。

Closes #123
```

## 完整示例

### 示例 1：新功能
```bash
feat(user): 添加用户状态切换功能

在用户列表中添加状态开关，支持快速启用/禁用用户。
- 添加 Switch 组件
- 实现状态切换 API 调用
- 添加乐观更新和错误回滚
- 添加操作权限控制

Closes #456
```

### 示例 2：Bug 修复
```bash
fix(table): 修复分页切换时数据重复的问题

问题描述：
切换分页时，新数据会追加到旧数据后面，导致数据重复显示。

解决方案：
在获取新数据前清空现有数据。

Fixes #789
```

### 示例 3：重构
```bash
refactor(redux): 重构状态管理结构

将单个大的 Redux store 拆分为多个模块：
- auth: 认证状态
- user: 用户数据
- global: 全局配置
- menu: 菜单状态

提升代码可维护性和可读性。
```

### 示例 4：文档更新
```bash
docs(readme): 完善项目文档

- 添加项目介绍和技术栈说明
- 完善安装和运行步骤
- 添加项目结构说明
- 补充常见问题解答
```

## 提交最佳实践

### 1. 原子性提交
- 一个提交只做一件事
- 不同功能分多次提交
- 便于代码审查和回滚

```bash
# ✅ 正确：分开提交
git commit -m "feat(user): 添加用户列表查询"
git commit -m "feat(user): 添加用户新增功能"

# ❌ 错误：混在一起
git commit -m "feat(user): 添加用户列表和新增功能"
```

### 2. 及时提交
- 完成一个小功能就提交
- 不要等到做完所有功能才提交
- 提交历史清晰，便于追踪

### 3. 提交前检查
```bash
# 查看修改内容
git diff

# 查看暂存内容
git diff --staged

# 检查代码规范
npm run lint

# 类型检查
npm run type-check
```

### 4. 修改提交信息
```bash
# 修改最后一次提交
git commit --amend

# 修改最后一次提交信息
git commit --amend -m "新的提交信息"
```

### 5. 合并提交
```bash
# 合并最近 3 次提交
git rebase -i HEAD~3

# 在编辑器中将 pick 改为 squash
pick abc123 feat: 第一次提交
squash def456 feat: 第二次提交
squash ghi789 feat: 第三次提交
```

## Commit Hooks

### Husky 配置
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### Commitlint 配置
```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert'
      ]
    ],
    'subject-case': [0]
  }
}
```

## 常见问题

### Q1: 提交了错误的代码怎么办？
```bash
# 撤销最后一次提交，保留修改
git reset --soft HEAD^

# 撤销最后一次提交，丢弃修改
git reset --hard HEAD^
```

### Q2: 如何撤销已推送的提交？
```bash
# 创建一个新的提交来撤销
git revert <commit-hash>

# 推送到远程
git push origin main
```

### Q3: 提交信息写错了怎么办？
```bash
# 修改最后一次提交信息
git commit --amend -m "正确的提交信息"

# 如果已推送，需要强制推送（谨慎使用）
git push --force-with-lease
```

## 检查清单

提交前请确认：
- [ ] 提交类型（type）正确
- [ ] 提交范围（scope）明确
- [ ] 提交描述（subject）清晰简洁
- [ ] 代码通过 ESLint 检查
- [ ] 代码通过 TypeScript 类型检查
- [ ] 移除了 console.log 等调试代码
- [ ] 一个提交只做一件事
- [ ] 提交信息使用中文

