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
│ │ ├── friends/ # 友链 (.yaml)
│ │ └── spec/ # 独立页面 (about/friends/projects .md)
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

---

import { hero, author } from '@/config.json'
import { SocialList } from './SocialList'
import Highlight from '@/components/Highlight.astro'
---

<div class="lg:-mt-16 lg:h-dvh lg:min-h-[720px]">
  <div
    class="relative max-w-[1300px] mx-auto h-full px-4 grid lg:grid-cols-2 items-center justify-items-center"
  >
    <div class="mt-[120px] lg:mt-0 max-w-[590px] lg:order-2">
      <h1 class="text-3xl text-center lg:text-center text-balance">
        Hi, I'm <Highlight class="font-bold">{hero.name}</Highlight>👋<br />{hero.bio}
      </h1>
      <div class="text-sm text-secondary mt-3 text-center lg:text-center">{hero.description}</div>
      <SocialList className="mt-[60px]" client:load />
    </div>
    <div class="mt-20 lg:mt-0 lg:order-1">
      <div
        class="size-[200px] lg:size-[300px] rounded-full overflow-hidden border border-primary bg-zinc-100 dark:bg-zinc-800"
      >
        <img class="size-full" src={author.avatar} alt="Site owner avatar" loading="lazy" />
      </div>
    </div>

    <div class="mt-10 lg:mt-0 lg:absolute inset-x-0 bottom-0 flex flex-col items-center">
      <p class="text-xs text-center text-balance text-secondary">
        {hero.yiyan}
      </p>
      <div class="mt-7 text-xl animate-bounce">
        <i class="iconfont icon-down"></i>
      </div>
    </div>

  </div>
</div>
