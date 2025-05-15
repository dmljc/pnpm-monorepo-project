# 使用 Node.js 18 的 Alpine 版本作为基础镜像
# Alpine 是一个轻量级的 Linux 发行版，可以显著减小镜像大小
FROM node:18-alpine

# 安装 pnpm 包管理器
# pnpm 比 npm 更快，并且能更好地处理依赖关系
RUN npm install -g pnpm

# 设置工作目录
# 后续的 RUN、CMD 等命令都会在这个目录下执行
WORKDIR /app

# 复制 monorepo 的根目录配置文件
# 这些文件包含了整个项目的依赖信息
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制各个包的 package.json 文件
# 这样可以在安装依赖时正确处理工作空间
COPY packages/client/package.json ./packages/client/
COPY packages/server/package.json ./packages/server/
# COPY packages/docs/package.json ./packages/docs/
COPY packages/shared/package.json ./packages/shared/

# 安装项目依赖
# 使用 pnpm install 安装所有依赖
# --frozen-lockfile 确保依赖版本的一致性
RUN pnpm install --frozen-lockfile

# 复制项目源代码
# 注意：这里会复制整个项目目录
# 实际构建时会根据 .dockerignore 排除不需要的文件
COPY . .

# 暴露容器端口
# 这里暴露的是 Vite 开发服务器的默认端口
EXPOSE 5173

# 设置容器启动命令
# 使用 pnpm 运行前端开发服务器
# --filter client 表示只运行 client 包中的命令
CMD ["pnpm", "--filter", "client", "dev"] 