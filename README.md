# 定位
作为next开发的尝试性质的项目
目标是高可定义的个人/群体账单管理服务网站
有空会逐渐进行功能的补充

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
- 完善的错误处理
- 逻辑绝对完善的“组件”
- 参数类型校验以及反馈
- 授权和校验（注册登录）
- 数据缓存和预取

## 确定技术栈
ts 最新稳定版
tailwindcss ^3
next 最新版16.0.10（为了避开最近的那个next漏洞）
shadcn 组件库
zod 参数校验
next-auth 授权
postgres 数据库，推荐快速开发时使用neon的线上数据库进行测试

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