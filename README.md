# CFn-ovo

基于 [Gyoza](https://github.com/lxchapu/gyoza) 改造的个人博客站点，使用 Astro 和 React 构建。

![astro version](https://img.shields.io/badge/astro-7.2-blue)
![node version](https://img.shields.io/badge/node-18.18-green)

在线访问：[cfn-ovo.github.io](https://cfn-ovo.github.io)

## ✨ 特性

- ✅ 规范的 URL 和 OpenGraph 信息，对 SEO 友好
- ✅ 站点地图 & RSS 订阅
- ✅ 夜间模式
- ✅ 特殊日期变灰
- ✅ 简洁干净的配色和主题
- ✅ 评论系统（Waline）
- ✅ 代码高亮 & 数学公式（KaTeX）
- ✅ 全文搜索（Pagefind）
- ✅ 平滑页面过渡（SWUP）

## 🛠️ 技术栈

- [Astro](https://astro.build/) — 静态站点生成器
- [React](https://reactjs.org/) — UI 框架
- [Tailwind CSS](https://tailwindcss.com/) — 样式工具
- [Framer Motion](https://www.framer.com/motion/) — 交互动画
- [Jotai](https://jotai.org/) — 状态管理
- [Waline](https://waline.js.org/) — 评论系统
- [Pagefind](https://pagefind.app/) — 站内搜索
- [KaTeX](https://katex.org/) — 数学公式渲染

## 📁 项目结构

```text
├── .github/
│   └── workflows/          # GitHub Actions 自动化部署
├── public/
├── scripts/                # 自定义脚本
│   ├── new-post.js         # 创建新文章
│   ├── new-project.js      # 创建新项目
│   └── new-comment.js      # 添加评论
├── src/
│   ├── components/
│   ├── content/            # 博客文章内容
│   ├── layouts/
│   ├── pages/
│   ├── plugins/
│   ├── store/
│   ├── styles/
│   └── utils/
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

网站配置保存在 `config.json` 文件中。

## 📝 常用命令

| 命令               | 说明                                   |
| :----------------- | :------------------------------------- |
| `pnpm i`           | 安装依赖                               |
| `pnpm dev`         | 启动本地开发服务器（`localhost:4321`） |
| `pnpm build`       | 构建生产站点到 `./dist/`               |
| `pnpm preview`     | 本地预览构建结果                       |
| `pnpm lint`        | 使用 Prettier 格式化代码               |
| `pnpm new-post`    | 创建新文章                             |
| `pnpm new-project` | 创建新项目                             |

## 🔧 Git Hooks

项目配置了 [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) 和 [commitlint](https://commitlint.js.org/)[reference:7]：

- **pre-commit**：自动格式化代码
- **commit-msg**：校验提交信息格式
