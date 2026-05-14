FROM mcr.microsoft.com/devcontainers/javascript-node:24

# Install Playwright system dependencies
RUN npx playwright install-deps

# Switch to the non-root 'node' user provided by the base image
USER node

# Enable pnpm for the 'node' user
RUN corepack enable && corepack prepare pnpm@11.1.2 --activate
