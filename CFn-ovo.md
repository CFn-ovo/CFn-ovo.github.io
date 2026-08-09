CFn-ovo/
├── public/ # 静态资源
│ ├── favicon.ico / apple-touch-icon.png
│ └── fonts/ # 自定义字体 (Atkinson, iconfont)
│
├── src/
│ ├── assets/ # 资源 (signature.svg)
│ ├── components/ # 组件
│ │ ├── head/ # <head> 相关 (SEO, 主题注入, 分析)
│ │ ├── header/ # 导航栏 (Logo, Drawer, Search)
│ │ ├── hero/ # 首页英雄区
│ │ ├── post/ # 文章相关 (卡片, 列表, 目录, 版权等)
│ │ ├── comment/ # 评论 (Waline)
│ │ ├── footer/ # 页脚 (主题切换, 运行天数)
│ │ ├── provider/ # React Context → Jotai Provider 桥接
│ │ ├── ui/modal/ # 通用模态框系统
│ │ └── *.astro # 纯 Astro 组件 (TagList, Timeline...)
│ │
│ ├── content/ # 内容集合
│ │ ├── posts/ # 博客文章 (.md)
│ │ ├── projects/ # 项目展示 (.yaml)
│ │ ├── comments/ # 评论 (.yaml)
│ │ └── spec/ # 独立页面 (about/comments/projects .md)
│ │
│ ├── content.config.ts # 内容集合 Schema 定义 (Zod)
│ ├── config.json # 全站配置 (站点、作者、配色、菜单等)
│ ├── layouts/ # 布局 (Layout → PageLayout → MarkdownLayout)
│ ├── pages/ # 路由页面
│ ├── plugins/ # Remark/Rehype 自定义插件 (9个)
│ ├── store/ # Jotai 原子状态 (5个 store)
│ ├── styles/ # 全局样式 (global, markdown, shiki, swup...)
│ ├── utils/ # 工具函数 (content, date, theme)
│ └── env.d.ts # 类型声明
│
├── scripts/ # 脚手架脚本 (new-post/friend/project)
├── astro.config.js # Astro 配置
├── tailwind.config.ts # Tailwind 配置
├── tsconfig.json # TypeScript 配置
└── package.json # 项目依赖
