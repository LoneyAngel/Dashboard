# 定位
作为next开发的尝试性质的项目
高可定义的个人/群体账单管理服务网站
这个项目让我介绍我怎么介绍？


## 架构
为了避免组件重名，这里的client组件末尾同意加上Interactive
- ui
 - page1
    - page1(1)
      - zujian1.tsx
      - zujian1.client.tsx
      - zujian2.tsx
      - zujian2.client.tsx
    - index(2)

## 已经处理的问题
- 状态管理
- 完善的错误处理
- 逻辑绝对完善的“组件”
- 参数类型校验（数据库）
- 搞清楚react页面的重渲染的因素
- 授权和校验
- 数据缓存和预取

## 确定技术栈
ts 最新稳定版
tailwindcss ^3
next 稳定版
目前没有使用组件库


# 环境变量示例

// Recommended for most uses
DATABASE_URL=

// For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=
// Parameters for constructing your own connection string
PGHOST=
PGHOST_UNPOOLED=
PGUSER=
PGDATABASE=
PGPASSWORD=

// Parameters for Vercel Postgres Templates
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_URL_NO_SSL=
POSTGRES_PRISMA_URL=

// Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
STACK_SECRET_SERVER_KEY=

// AUTH_URL=http://localhost:3000
// NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=

IMAGE_CUSTOMER_PATH =

GOOGLE_ID =
GOOGLE_SECRET =