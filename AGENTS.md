# AGENTS.md - n8n-nodes-nano-gpt

This document provides guidelines for agentic coding tools working on the n8n-nodes-nano-gpt repository, an n8n community node package for executing NanoGPT API calls.

## Project Overview

This is an n8n community node package for interacting with the NanoGPT API. It provides TypeScript-based nodes that integrate with NanoGPT's AI services, allowing users to use AI capabilities (chat, image/video/audio generation, web search, etc.) through n8n workflows, payable with Nano cryptocurrency.

## Build/Lint Commands

### Build Commands

```bash
# Build the project
pnpm run build

# Build with watch mode (for development)
pnpm run build:watch

# Development mode
pnpm run dev
```

### Lint Commands

```bash
# Run linting
pnpm run lint

# Run linting with auto-fix
pnpm run lint:fix
```

### Release Commands

```bash
# Prepare release
pnpm run release

# Pre-release checks
pnpm run prepublishOnly
```

## Code Style Guidelines

### TypeScript Configuration

- **Target**: ES2019
- **Module System**: CommonJS
- **Strict Mode**: Enabled (all strict options)
- **Type Checking**: Strict null checks, no implicit any
- **Output**: Compiled to `./dist/` directory

### Formatting (Prettier)

```json
{
	"semi": true,
	"trailingComma": "all",
	"bracketSpacing": true,
	"useTabs": true,
	"tabWidth": 2,
	"arrowParens": "always",
	"singleQuote": true,
	"quoteProps": "as-needed",
	"endOfLine": "lf",
	"printWidth": 100
}
```

### Import Guidelines

1. **Group imports** by source (external, internal, types)
2. **Use absolute paths** for internal imports starting from project root
3. **Type imports** should be separate from value imports
4. **Order**: External libraries → Internal utilities → Types → Local files

```typescript
import { IExecuteFunctions } from 'n8n-workflow';
import { NanoGPTClient } from '../../utils/NanoGPTClient';
import type { ChatCompletionResponse } from '../../types/nanogpt';
```

### Naming Conventions

- **Classes**: PascalCase (e.g., `NanoGPT`, `NanoGPTClient`)
- **Interfaces**: PascalCase with `I` prefix (e.g., `INanoGPTConfig`)
- **Types**: PascalCase (e.g., `ChatCompletionResponse`)
- **Functions**: camelCase (e.g., `chatCompletion`, `generateImage`)
- **Variables**: camelCase (e.g., `apiClient`, `responseData`)
- **Files**: kebab-case (e.g., `nano-gpt-client.ts`)
- **Node names**: PascalCase (e.g., `NanoGPT.node.ts`)

### Error Handling

1. **Use NodeOperationError** for node-specific errors
2. **Validate inputs** before making API calls
3. **Handle API errors** gracefully
4. **Provide meaningful error messages** for users

```typescript
try {
	const result = await client.chatCompletion(messages, model);
	return [this.helpers.returnJsonArray(result)];
} catch (error) {
	throw new NodeOperationError(this.getNode(), 'Failed to complete chat', {
		itemIndex: 0,
		description: error.message,
	});
}
```

### Code Organization

- **Nodes**: `nodes/` directory (e.g., `NanoGPT.node.ts`)
- **Utilities**: `utils/` directory (e.g., `NanoGPTClient.ts`)
- **Types**: `types/` directory (e.g., `nanogpt.ts`)
- **Credentials**: `credentials/` directory

## Development Workflow

### CI/CD Pipeline

- **GitHub Actions** workflow runs on PRs and main branch pushes
- **Steps**: Install → Lint → Build
- **Node.js version**: 22
- **Package manager**: pnpm

### Common Tasks

1. **Adding new API endpoint**:
   - Add type definition in `types/nanogpt.ts`
   - Implement method in `utils/NanoGPTClient.ts`
   - Add operation to node class
   - Update node description

2. **Modifying node UI**:
   - Edit node description properties in `nodes/NanoGPT/NanoGPT.node.ts`

## Project Structure

```
nano-gpt/
├── credentials/          # Credential definitions
├── dist/                # Build output
├── nodes/               # Node implementations
├── types/               # TypeScript type definitions
├── utils/               # Utility functions (API client)
└── package.json         # Project configuration
```

## Troubleshooting

- **Build failures**: Check TypeScript errors, run `pnpm run lint`
- **Linting issues**: Follow Prettier/ESLint configuration
- **API issues**: Verify API key validity and endpoint connectivity at nano-gpt.com
