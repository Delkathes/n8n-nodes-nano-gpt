# n8n-nodes-nano-gpt

`n8n-nodes-nano-gpt` is an n8n community node package for interacting with the NanoGPT API. NanoGPT provides AI capabilities (chat, image generation, video generation, speech-to-text, text-to-speech, embeddings, web search, web scraping) payable with Nano cryptocurrency.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Install this package as an n8n community node. See the official n8n guide:

- [Install community nodes](https://docs.n8n.io/integrations/community-nodes/installation/)

Then add the following node in your workflow editor:

- **NanoGPT** — AI API (chat, image, video, audio, search, and more)

## Credentials

Credential type: **NanoGPT API**

### Required

- **API Key**: Your NanoGPT API key (find it at [nano-gpt.com](https://nano-gpt.com))
- **Base URL**: API endpoint URL (default: `https://nano-gpt.com`)

## Supported operations

Operations are grouped by resource.

### Chat
- **Chat Completion** (OpenAI-compatible): Full feature support including web search, prompt caching, reasoning, memory, and more
- **Create Response** (OpenAI Responses API): Structured responses with conversation threading
- **Get/Delete Response**: Retrieve or delete stored responses
- **Create Message** (Anthropic-compatible): Messages API with tool use and extended thinking

### Text Generation
- **Completion**: Text completion with model selection and sampling parameters

### Image Generation
- **Generate Image**: Text-to-image with multiple models (Nano Banana, DALL-E, Flux, SDXL, etc.)
- Advanced options: aspect ratio, quality, inpainting, LoRA, style controls

### Video Generation
- **Generate Video**: Text-to-video with multiple models (VEO, Sora, Kling, etc.)
- **Check Video Status**: Poll video generation progress
- **Extend Video** / **Get Video Content** / **Recover Video**

### Speech-to-Text
- **Transcribe Audio**: Convert audio to text (Whisper, Wizper, Elevenlabs)
- **YouTube Transcription**: Transcribe YouTube videos
- **Get STT Status**: Check async transcription status

### Text-to-Speech
- **Generate Speech (Async/Sync)**: Text-to-speech (Kokoro, OpenAI, Elevenlabs)
- **Get TTS Status**: Check async TTS job status

### Embeddings
- **Create Embedding**: Generate text embeddings
- **Get Embedding Models**: List available embedding models

### Web Scraping & Search
- **Scrape URLs**: Extract content from web pages
- **Web Search**: Search the web (Linkup, Tavily, Exa, Kagi, Perplexity, Valyu)

### Models
- **List Models**: Available models (standard, personalized, subscription, paid)

### Context Memory
- **Compress Memory**: Compress chat history via vector memory

### TEE Verification
- **Get TEE Attestation / Signature**: Trusted Execution Environment verification

### Balance & Subscription
- **Check Balance**: Account balance in USD and Nano
- **Create Invitation**: Create invitation/referral links
- **Get Subscription Usage**: Subscription usage details

### Nano Crypto
- **Receive Nano**: Process pending Nano deposits

## Compatibility

- Package is built with the n8n community node tooling (`@n8n/node-cli`).
- Peer dependency: `n8n-workflow` (any version supported by your n8n instance).

## Development

Available scripts:

- `pnpm run build` — Build the project
- `pnpm run build:watch` — Build with watch mode
- `pnpm run dev` — Development mode
- `pnpm run lint` — Run linting
- `pnpm run lint:fix` — Fix lint issues
- `pnpm run release` — Interactive release

## Resources

- [n8n community nodes docs](https://docs.n8n.io/integrations/#community-nodes)
- [NanoGPT API docs](https://docs.nano-gpt.com/introduction)
- [NanoGPT website](https://nano-gpt.com)

## Version history

See [CHANGELOG.md](./CHANGELOG.md).
