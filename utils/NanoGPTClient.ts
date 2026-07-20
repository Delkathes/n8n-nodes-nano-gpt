/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type {
	ChatCompletionResponse,
	CreateResponseResponse,
	GetResponseResponse,
	DeleteResponseResponse,
	CreateMessageResponse,
	CompletionResponse,
	GenerateImageResponse,
	GenerateVideoResponse,
	VideoStatusResponse,
	RecoverVideosResponse,
	ExtendVideoResponse,
	VideoContentResponse,
	MidjourneyStatusResponse,
	TranscribeResponse,
	TranscriptionStatusResponse,
	YouTubeTranscribeResponse,
	TextToSpeechResponse,
	SynchronousTTSResponse,
	TTSStatusResponse,
	CreateEmbeddingResponse,
	ListEmbeddingModelsResponse,
	ScrapeUrlsResponse,
	WebSearchResponse,
	ListModelsResponse,
	CompressMemoryResponse,
	TEEAttestationResponse,
	TEESignatureResponse,
	CheckBalanceResponse,
	SubscriptionUsageResponse,
	CreateInvitationResponse,
	ReceiveNanoResponse,
} from '../types/nanogpt';

export class NanoGPTClient {
	constructor(
		private context: IExecuteFunctions,
		private credentials: any,
	) {}

	private getBaseUrl(): string {
		return this.credentials.baseUrl === 'custom'
			? this.credentials.customBaseUrl
			: this.credentials.baseUrl;
	}

	private buildQueryString(params: Record<string, string>): string {
		return Object.entries(params)
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
			.join('&');
	}

	private getAuthHeaders(endpoint: string): Record<string, string> {
		// OpenAI-compatible endpoints (/v1/*) use Bearer token
		// Custom NanoGPT endpoints use x-api-key
		if (endpoint.startsWith('/v1/')) {
			return { Authorization: `Bearer ${this.credentials.apiKey}` };
		}
		return { 'x-api-key': this.credentials.apiKey };
	}

	async makeRequest(
		method: string,
		endpoint: string,
		body?: any,
		headers: Record<string, string> = {},
		queryParams?: Record<string, string>,
	): Promise<any> {
		let url = `${this.getBaseUrl()}/api${endpoint}`;

		// Add query parameters if provided
		if (queryParams && Object.keys(queryParams).length > 0) {
			url += `?${this.buildQueryString(queryParams)}`;
		}

		const requestHeaders = {
			...this.getAuthHeaders(endpoint),
			'Content-Type': 'application/json',
			...headers,
		};

		try {
			const response = await this.context.helpers.httpRequest({
				method: method as IHttpRequestMethods,
				url,
				headers: requestHeaders,
				body,
				json: true,
			});

			// Check for API errors
			if (response.error) {
			throw new NodeOperationError(
				this.context.getNode(),
				`NanoGPT API Error: ${response.error.message || response.error || JSON.stringify(response)}`,
			);
		}

		return response;
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.context.getNode(), `NanoGPT API request ${url} failed: ${message}`);
		}
	}

	// ============================================
	// Chat Completion Methods
	// ============================================

	/**
	 * Create a chat completion (OpenAI-compatible)
	 * POST /v1/chat/completions
	 */
	async chatCompletion(
		messages: any[],
		model: string,
		options: {
			temperature?: number;
			maxTokens?: number;
			topP?: number;
			topK?: number;
			minP?: number;
			frequencyPenalty?: number;
			presencePenalty?: number;
			repetitionPenalty?: number;
			stop?: string | string[];
			seed?: number;
			tools?: any[];
			toolChoice?: string | object;
			parallelToolCalls?: boolean;
			logprobs?: boolean;
			topLogprobs?: number;
			logitBias?: Record<string, number>;
			responseFormat?: { type: string; json_schema?: object };
			linkup?: {
				enabled: boolean;
				provider?: 'linkup' | 'tavily' | 'exa' | 'kagi';
				depth?: 'standard' | 'deep';
				searchContextSize?: 'low' | 'medium' | 'high';
				searchType?: 'web' | 'news' | 'search';
			};
			memory?: boolean;
			memoryExpirationDays?: number;
			youtubeTranscripts?: boolean;
			reasoning?: { exclude?: boolean; effort?: string };
			promptCaching?: {
				enabled?: boolean;
				ttl?: number;
				cutAfterMessageIndex?: number;
				stickyProvider?: boolean;
			};
			scraping?: boolean;
			minTokens?: number;
			// Advanced sampling parameters
			tfs?: number;
			typicalP?: number;
			mirostatMode?: 0 | 1 | 2;
			mirostatTau?: number;
			mirostatEta?: number;
		} = {},
	): Promise<ChatCompletionResponse> {
		const {
			temperature,
			maxTokens = 4000,
			topP,
			topK,
			minP,
			frequencyPenalty,
			presencePenalty,
			repetitionPenalty,
			stop,
			seed,
			tools,
			toolChoice,
			parallelToolCalls,
			logprobs,
			topLogprobs,
			logitBias,
			responseFormat,
			linkup,
			memory,
			memoryExpirationDays,
			youtubeTranscripts,
			reasoning,
			promptCaching,
			scraping,
			minTokens,
			tfs,
			typicalP,
			mirostatMode,
			mirostatTau,
			mirostatEta,
		} = options;

		const requestBody: Record<string, any> = {
			model,
			messages,
			max_tokens: maxTokens,
		};

		if (temperature !== undefined) requestBody.temperature = temperature;
		if (topP !== undefined) requestBody.top_p = topP;
		if (topK !== undefined) requestBody.top_k = topK;
		if (minP !== undefined) requestBody.min_p = minP;
		if (frequencyPenalty !== undefined) requestBody.frequency_penalty = frequencyPenalty;
		if (presencePenalty !== undefined) requestBody.presence_penalty = presencePenalty;
		if (repetitionPenalty !== undefined) requestBody.repetition_penalty = repetitionPenalty;
		if (stop !== undefined) requestBody.stop = stop;
		if (seed !== undefined) requestBody.seed = seed;
		if (tools !== undefined) requestBody.tools = tools;
		if (toolChoice !== undefined) requestBody.tool_choice = toolChoice;
		if (parallelToolCalls !== undefined) requestBody.parallel_tool_calls = parallelToolCalls;
		if (logprobs !== undefined) requestBody.logprobs = logprobs;
		if (topLogprobs !== undefined) requestBody.top_logprobs = topLogprobs;
		if (logitBias !== undefined) requestBody.logit_bias = logitBias;
		if (responseFormat !== undefined) requestBody.response_format = responseFormat;
		if (linkup !== undefined) requestBody.linkup = linkup;
		if (youtubeTranscripts !== undefined) requestBody.youtube_transcripts = youtubeTranscripts;
		if (reasoning !== undefined) requestBody.reasoning = reasoning;
		if (promptCaching !== undefined) {
			requestBody.prompt_caching = {
				enabled: promptCaching.enabled,
				ttl: promptCaching.ttl,
				cut_after_message_index: promptCaching.cutAfterMessageIndex,
				sticky_provider: promptCaching.stickyProvider,
			};
		}
		if (scraping !== undefined) requestBody.scraping = scraping;
		if (minTokens !== undefined) requestBody.min_tokens = minTokens;
		if (tfs !== undefined) requestBody.tfs = tfs;
		if (typicalP !== undefined) requestBody.typical_p = typicalP;
		if (mirostatMode !== undefined) requestBody.mirostat_mode = mirostatMode;
		if (mirostatTau !== undefined) requestBody.mirostat_tau = mirostatTau;
		if (mirostatEta !== undefined) requestBody.mirostat_eta = mirostatEta;

		const headers: Record<string, string> = {};
		if (memory) headers.memory = 'true';
		if (memoryExpirationDays) headers.memory_expiration_days = String(memoryExpirationDays);

		return this.makeRequest('POST', '/v1/chat/completions', requestBody, headers);
	}

	// ============================================
	// Responses API (OpenAI Responses API compatible)
	// ============================================

	/**
	 * Create a response (OpenAI Responses API compatible)
	 * POST /v1/responses
	 */
	async createResponse(
		model: string,
		input: string | any[],
		options: {
			instructions?: string;
			maxOutputTokens?: number;
			temperature?: number;
			topP?: number;
			frequencyPenalty?: number;
			presencePenalty?: number;
			topLogprobs?: number;
			tools?: any[];
			toolChoice?: string | object;
			parallelToolCalls?: boolean;
			maxToolCalls?: number;
			store?: boolean;
			previousResponseId?: string;
			reasoning?: { effort?: string; summary?: string };
			text?: { format?: object; verbosity?: string };
			metadata?: Record<string, string>;
			truncation?: string;
			user?: string;
			seed?: number;
			background?: boolean;
			serviceTier?: string;
			conversation?: { id?: string; threadId?: string };
			include?: string[];
		} = {},
	): Promise<CreateResponseResponse> {
		const requestBody: Record<string, any> = { model, input };

		if (options.instructions) requestBody.instructions = options.instructions;
		if (options.maxOutputTokens) requestBody.max_output_tokens = options.maxOutputTokens;
		if (options.temperature !== undefined) requestBody.temperature = options.temperature;
		if (options.topP !== undefined) requestBody.top_p = options.topP;
		if (options.frequencyPenalty !== undefined) requestBody.frequency_penalty = options.frequencyPenalty;
		if (options.presencePenalty !== undefined) requestBody.presence_penalty = options.presencePenalty;
		if (options.topLogprobs !== undefined) requestBody.top_logprobs = options.topLogprobs;
		if (options.tools) requestBody.tools = options.tools;
		if (options.toolChoice) requestBody.tool_choice = options.toolChoice;
		if (options.parallelToolCalls !== undefined) requestBody.parallel_tool_calls = options.parallelToolCalls;
		if (options.maxToolCalls !== undefined) requestBody.max_tool_calls = options.maxToolCalls;
		if (options.store !== undefined) requestBody.store = options.store;
		if (options.previousResponseId) requestBody.previous_response_id = options.previousResponseId;
		if (options.reasoning) requestBody.reasoning = options.reasoning;
		if (options.text) requestBody.text = options.text;
		if (options.metadata) requestBody.metadata = options.metadata;
		if (options.truncation) requestBody.truncation = options.truncation;
		if (options.user) requestBody.user = options.user;
		if (options.seed !== undefined) requestBody.seed = options.seed;
		if (options.background !== undefined) requestBody.background = options.background;
		if (options.serviceTier) requestBody.service_tier = options.serviceTier;
		if (options.conversation) requestBody.conversation = options.conversation;
		if (options.include) requestBody.include = options.include;

		return this.makeRequest('POST', '/v1/responses', requestBody);
	}

	/**
	 * Retrieve a stored response by ID
	 * GET /v1/responses/{id}
	 */
	async getResponse(responseId: string): Promise<GetResponseResponse> {
		return this.makeRequest('GET', `/v1/responses/${responseId}`);
	}

	/**
	 * Delete a stored response
	 * DELETE /v1/responses/{id}
	 */
	async deleteResponse(responseId: string): Promise<DeleteResponseResponse> {
		return this.makeRequest('DELETE', `/v1/responses/${responseId}`);
	}

	// ============================================
	// Messages API (Anthropic-compatible)
	// ============================================

	/**
	 * Create a message (Anthropic API compatible)
	 * POST /v1/messages
	 */
	async createMessage(
		model: string,
		maxTokens: number,
		messages: any[],
		options: {
			system?: string | any[];
			temperature?: number;
			topP?: number;
			topK?: number;
			stopSequences?: string[];
			tools?: any[];
			toolChoice?: string | object;
			disableParallelToolUse?: boolean;
			thinking?: { type: string; budgetTokens?: number };
			metadata?: { user?: string; userId?: string };
			promptCaching?: boolean;
		} = {},
	): Promise<CreateMessageResponse> {
		const requestBody: Record<string, any> = {
			model,
			max_tokens: maxTokens,
			messages,
		};

		if (options.system) requestBody.system = options.system;
		if (options.temperature !== undefined) requestBody.temperature = options.temperature;
		if (options.topP !== undefined) requestBody.top_p = options.topP;
		if (options.topK !== undefined) requestBody.top_k = options.topK;
		if (options.stopSequences) requestBody.stop_sequences = options.stopSequences;
		if (options.tools) requestBody.tools = options.tools;
		if (options.toolChoice) requestBody.tool_choice = options.toolChoice;
		if (options.disableParallelToolUse !== undefined) requestBody.disable_parallel_tool_use = options.disableParallelToolUse;
		if (options.thinking) requestBody.thinking = options.thinking;
		if (options.metadata) requestBody.metadata = options.metadata;

		// Add anthropic-beta header for prompt caching
		const headers: Record<string, string> = {};
		if (options.promptCaching) {
			headers['anthropic-beta'] = 'prompt-caching-2024-07-31';
		}

		return this.makeRequest('POST', '/v1/messages', requestBody, headers);
	}

	// ============================================
	// Text Completion Methods
	// ============================================

	/**
	 * Create a text completion (OpenAI-compatible)
	 * POST /v1/completions
	 */
	async completion(
		prompt: string,
		model: string,
		options: {
			temperature?: number;
			maxTokens?: number;
			topP?: number;
			stop?: string | string[];
			frequencyPenalty?: number;
			presencePenalty?: number;
			seed?: number;
		} = {},
	): Promise<CompletionResponse> {
		const { temperature, maxTokens = 4000, topP, stop, frequencyPenalty, presencePenalty, seed } =
			options;

		const requestBody: Record<string, any> = {
			model,
			prompt,
			max_tokens: maxTokens,
		};

		if (temperature !== undefined) requestBody.temperature = temperature;
		if (topP !== undefined) requestBody.top_p = topP;
		if (stop !== undefined) requestBody.stop = stop;
		if (frequencyPenalty !== undefined) requestBody.frequency_penalty = frequencyPenalty;
		if (presencePenalty !== undefined) requestBody.presence_penalty = presencePenalty;
		if (seed !== undefined) requestBody.seed = seed;

		return this.makeRequest('POST', '/v1/completions', requestBody);
	}

	// ============================================
	// Image Generation Methods
	// ============================================

	/**
	 * Generate images from text prompt (OpenAI-compatible)
	 * POST /v1/images/generations
	 */
	async generateImage(
		prompt: string,
		options: {
			model?: string;
			size?: string;
			n?: number;
			responseFormat?: 'b64_json' | 'url';
			user?: string;
			imageDataUrl?: string;
			imageDataUrls?: string[];
			maskDataUrl?: string;
			strength?: number;
			guidanceScale?: number;
			numInferenceSteps?: number;
			seed?: number;
			kontextMaxMode?: boolean;
			// New parameters
			aspectRatio?: string;
			quality?: 'low' | 'medium' | 'high';
			outputFormat?: 'jpeg' | 'png' | 'webp';
			negativePrompt?: string;
			style?: 'vivid' | 'natural';
			styleType?: string;
			magicPromptOption?: 'On' | 'Off';
			enablePromptExpansion?: boolean;
			enableSafetyChecker?: boolean;
			loraUrl1?: string;
			loraScale1?: number;
		} = {},
	): Promise<GenerateImageResponse> {
		const {
			model = 'nano-banana-pro',
			size = '1024x1024',
			n = 1,
			responseFormat = 'b64_json',
			user,
			imageDataUrl,
			imageDataUrls,
			maskDataUrl,
			strength,
			guidanceScale,
			numInferenceSteps,
			seed,
			kontextMaxMode,
			aspectRatio,
			quality,
			outputFormat,
			negativePrompt,
			style,
			styleType,
			magicPromptOption,
			enablePromptExpansion,
			enableSafetyChecker,
			loraUrl1,
			loraScale1,
		} = options;

		const requestBody: Record<string, any> = {
			prompt,
			model,
			size,
			n,
			response_format: responseFormat,
		};

		if (user) requestBody.user = user;
		if (imageDataUrl) requestBody.imageDataUrl = imageDataUrl;
		if (imageDataUrls && imageDataUrls.length > 0) requestBody.imageDataUrls = imageDataUrls;
		if (maskDataUrl) requestBody.maskDataUrl = maskDataUrl;
		if (strength !== undefined) requestBody.strength = strength;
		if (guidanceScale !== undefined) requestBody.guidance_scale = guidanceScale;
		if (numInferenceSteps !== undefined) requestBody.num_inference_steps = numInferenceSteps;
		if (seed !== undefined && seed !== -1) requestBody.seed = seed;
		if (kontextMaxMode !== undefined) requestBody.kontext_max_mode = kontextMaxMode;
		if (aspectRatio && aspectRatio !== 'auto') requestBody.aspect_ratio = aspectRatio;
		if (quality) requestBody.quality = quality;
		if (outputFormat) requestBody.output_format = outputFormat;
		if (negativePrompt) requestBody.negative_prompt = negativePrompt;
		if (style) requestBody.style = style;
		if (styleType && styleType !== 'Auto') requestBody.style_type = styleType;
		if (magicPromptOption) requestBody.magic_prompt_option = magicPromptOption;
		if (enablePromptExpansion !== undefined) requestBody.enable_prompt_expansion = enablePromptExpansion;
		if (enableSafetyChecker !== undefined) requestBody.enable_safety_checker = enableSafetyChecker;
		if (loraUrl1) requestBody.lora_url_1 = loraUrl1;
		if (loraScale1 !== undefined) requestBody.lora_scale_1 = loraScale1;

		// Note: This endpoint uses /v1/images/generations without /api prefix
		const url = `${this.getBaseUrl()}/v1/images/generations`;
		return this.context.helpers.httpRequest({
			method: 'POST',
			url,
			headers: {
				Authorization: `Bearer ${this.credentials.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: requestBody,
			json: true,
		});
	}

	// ============================================
	// Video Generation Methods
	// ============================================

	/**
	 * Generate video (async)
	 * POST /generate-video
	 */
	async generateVideo(
		model: string,
		options: {
			prompt?: string;
			script?: string;
			duration?: string;
			aspectRatio?: string;
			resolution?: string;
			imageDataUrl?: string;
			imageUrl?: string;
			videoUrl?: string;
			videoDataUrl?: string;
			negativePrompt?: string;
			seed?: number;
			enablePromptExpansion?: boolean;
			generateAudio?: boolean;
			proMode?: boolean;
			[key: string]: any;
		} = {},
	): Promise<GenerateVideoResponse> {
		const requestBody: Record<string, any> = { model, ...options };
		return this.makeRequest('POST', '/generate-video', requestBody);
	}

	/**
	 * Check video generation status (unified endpoint)
	 * GET /video/status
	 */
	async getVideoStatus(requestId: string): Promise<VideoStatusResponse> {
		return this.makeRequest('GET', '/video/status', undefined, {}, { requestId });
	}

	/**
	 * Recover recent video generation runs
	 * GET /generate-video/recover
	 */
	async recoverVideos(options: { model?: string; limit?: number; conversationUUID?: string } = {}): Promise<RecoverVideosResponse> {
		const queryParams: Record<string, string> = {};
		if (options.model) queryParams.model = options.model;
		if (options.limit) queryParams.limit = String(options.limit);
		if (options.conversationUUID) queryParams.conversationUUID = options.conversationUUID;

		return this.makeRequest('GET', '/generate-video/recover', undefined, {}, queryParams);
	}

	/**
	 * Extend a Midjourney video (task-based)
	 * POST /generate-video/extend
	 */
	async extendVideo(taskId: string, index: number): Promise<ExtendVideoResponse> {
		return this.makeRequest('POST', '/generate-video/extend', { taskId, index });
	}

	/**
	 * Get video content (Sora 2 proxy)
	 * GET /generate-video/content
	 */
	async getVideoContent(runId: string, model: string, variant?: string): Promise<VideoContentResponse> {
		const queryParams: Record<string, string> = { runId, model };
		if (variant) queryParams.variant = variant;
		return this.makeRequest('GET', '/generate-video/content', undefined, {}, queryParams);
	}

	/**
	 * Check Midjourney status
	 * POST /check-midjourney-status
	 */
	async checkMidjourneyStatus(taskId: string): Promise<MidjourneyStatusResponse> {
		return this.makeRequest('POST', '/check-midjourney-status', { task_id: taskId });
	}

	// ============================================
	// Speech-to-Text Methods
	// ============================================

	/**
	 * Transcribe audio file
	 * POST /transcribe
	 */
	async transcribe(
		options: {
			audioUrl?: string;
			model?: string;
			language?: string;
			diarize?: boolean;
			tagAudioEvents?: boolean;
		} = {},
	): Promise<TranscribeResponse> {
		const { audioUrl, model = 'Whisper-Large-V3', language = 'auto', diarize = false, tagAudioEvents = false } =
			options;

		return this.makeRequest('POST', '/transcribe', {
			audioUrl,
			model,
			language,
			diarize,
			tagAudioEvents,
		});
	}

	/**
	 * Check transcription status (for async models like Elevenlabs-STT)
	 * POST /transcribe/status
	 */
	async getTranscriptionStatus(
		runId: string,
		options: {
			cost?: number;
			paymentSource?: string;
			isApiRequest?: boolean;
			fileName?: string;
			fileSize?: number;
			chargedDuration?: number;
			diarize?: boolean;
		} = {},
	): Promise<TranscriptionStatusResponse> {
		return this.makeRequest('POST', '/transcribe/status', {
			runId,
			...options,
			isApiRequest: options.isApiRequest ?? true,
		});
	}

	/**
	 * Transcribe YouTube videos
	 * POST /youtube-transcribe
	 */
	async youtubeTranscribe(urls: string[]): Promise<YouTubeTranscribeResponse> {
		return this.makeRequest('POST', '/youtube-transcribe', { urls });
	}

	// ============================================
	// Text-to-Speech Methods
	// ============================================

	/**
	 * Generate speech (async TTS)
	 * POST /tts
	 */
	async textToSpeech(
		text: string,
		options: {
			model?: string;
			voice?: string;
			speed?: number;
			responseFormat?: string;
			instructions?: string;
			stability?: number;
			similarityBoost?: number;
			style?: number;
		} = {},
	): Promise<TextToSpeechResponse> {
		const {
			model = 'Kokoro-82m',
			voice,
			speed = 1,
			responseFormat,
			instructions,
			stability,
			similarityBoost,
			style,
		} = options;

		const requestBody: Record<string, any> = { text, model, speed };

		if (voice) requestBody.voice = voice;
		if (responseFormat) requestBody.response_format = responseFormat;
		if (instructions) requestBody.instructions = instructions;
		if (stability !== undefined) requestBody.stability = stability;
		if (similarityBoost !== undefined) requestBody.similarity_boost = similarityBoost;
		if (style !== undefined) requestBody.style = style;

		return this.makeRequest('POST', '/tts', requestBody);
	}

	/**
	 * Synchronous TTS (returns audio directly)
	 * POST /v1/speech
	 */
	async synchronousTTS(
		input: string,
		model: string,
		voice: string,
		options: {
			format?: string;
			sampleRate?: number;
			speed?: number;
			language?: string;
			pitch?: number;
			emotion?: string;
			stability?: number;
			similarity?: number;
		} = {},
	): Promise<SynchronousTTSResponse> {
		const requestBody: Record<string, any> = { model, input, voice };

		if (options.format) requestBody.format = options.format;
		if (options.sampleRate) requestBody.sample_rate = options.sampleRate;
		if (options.speed !== undefined) requestBody.speed = options.speed;
		if (options.language) requestBody.language = options.language;
		if (options.pitch !== undefined) requestBody.pitch = options.pitch;
		if (options.emotion) requestBody.emotion = options.emotion;
		if (options.stability !== undefined) requestBody.stability = options.stability;
		if (options.similarity !== undefined) requestBody.similarity = options.similarity;

		return this.makeRequest('POST', '/v1/speech', requestBody);
	}

	/**
	 * Check TTS status (for async TTS jobs)
	 * GET /tts/status
	 */
	async getTTSStatus(
		runId: string,
		model: string,
		options: {
			cost?: number;
			paymentSource?: string;
			isApiRequest?: boolean;
		} = {},
	): Promise<TTSStatusResponse> {
		const queryParams: Record<string, string> = { runId, model };
		if (options.cost !== undefined) queryParams.cost = String(options.cost);
		if (options.paymentSource) queryParams.paymentSource = options.paymentSource;
		if (options.isApiRequest !== undefined) queryParams.isApiRequest = String(options.isApiRequest);

		return this.makeRequest('GET', '/tts/status', undefined, {}, queryParams);
	}

	// ============================================
	// Embeddings Methods
	// ============================================

	/**
	 * Create embeddings
	 * POST /v1/embeddings
	 */
	async createEmbedding(
		input: string | string[],
		model: string = 'text-embedding-3-small',
		options: {
			encodingFormat?: 'float' | 'base64';
			dimensions?: number;
			user?: string;
		} = {},
	): Promise<CreateEmbeddingResponse> {
		const requestBody: Record<string, any> = { input, model };

		if (options.encodingFormat) requestBody.encoding_format = options.encodingFormat;
		if (options.dimensions) requestBody.dimensions = options.dimensions;
		if (options.user) requestBody.user = options.user;

		return this.makeRequest('POST', '/v1/embeddings', requestBody);
	}

	/**
	 * List embedding models
	 * GET /v1/embedding-models
	 */
	async listEmbeddingModels(): Promise<ListEmbeddingModelsResponse> {
		return this.makeRequest('GET', '/v1/embedding-models');
	}

	// ============================================
	// Web Scraping & Search Methods
	// ============================================

	/**
	 * Scrape URLs
	 * POST /scrape-urls
	 */
	async scrapeUrls(urls: string[], stealthMode: boolean = false): Promise<ScrapeUrlsResponse> {
		return this.makeRequest('POST', '/scrape-urls', { urls, stealthMode });
	}

	/**
	 * Web search
	 * POST /web
	 */
	async webSearch(
		query: string,
		options: {
			provider?: 'linkup' | 'tavily' | 'exa' | 'kagi' | 'perplexity' | 'valyu';
			depth?: 'standard' | 'deep';
			outputType?: 'searchResults' | 'sourcedAnswer' | 'structured';
			structuredOutputSchema?: string;
			includeImages?: boolean;
			fromDate?: string;
			toDate?: string;
			excludeDomains?: string[];
			includeDomains?: string[];
		} = {},
	): Promise<WebSearchResponse> {
		const requestBody: Record<string, any> = {
			query,
			provider: options.provider || 'linkup',
			depth: options.depth || 'standard',
			outputType: options.outputType || 'searchResults',
		};

		if (options.structuredOutputSchema) requestBody.structuredOutputSchema = options.structuredOutputSchema;
		if (options.includeImages !== undefined) requestBody.includeImages = options.includeImages;
		if (options.fromDate) requestBody.fromDate = options.fromDate;
		if (options.toDate) requestBody.toDate = options.toDate;
		if (options.excludeDomains) requestBody.excludeDomains = options.excludeDomains;
		if (options.includeDomains) requestBody.includeDomains = options.includeDomains;

		return this.makeRequest('POST', '/web', requestBody);
	}

	// ============================================
	// Model Methods
	// ============================================

	/**
	 * List available models
	 * GET /v1/models
	 */
	async listModels(detailed: boolean = false): Promise<ListModelsResponse> {
		const queryParams: Record<string, string> = {};
		if (detailed) queryParams.detailed = 'true';
		return this.makeRequest('GET', '/v1/models', undefined, {}, queryParams);
	}

	/**
	 * List personalized models (account-specific)
	 * GET /personalized/v1/models
	 */
	async getPersonalizedModels(detailed: boolean = false): Promise<ListModelsResponse> {
		const queryParams: Record<string, string> = {};
		if (detailed) queryParams.detailed = 'true';
		return this.makeRequest('GET', '/personalized/v1/models', undefined, {}, queryParams);
	}

	/**
	 * List subscription-only models
	 * GET /subscription/v1/models
	 */
	async listSubscriptionModels(detailed: boolean = false): Promise<ListModelsResponse> {
		const queryParams: Record<string, string> = {};
		if (detailed) queryParams.detailed = 'true';
		return this.makeRequest('GET', '/subscription/v1/models', undefined, {}, queryParams);
	}

	/**
	 * List paid/premium models
	 * GET /paid/v1/models
	 */
	async listPaidModels(detailed: boolean = false): Promise<ListModelsResponse> {
		const queryParams: Record<string, string> = {};
		if (detailed) queryParams.detailed = 'true';
		return this.makeRequest('GET', '/paid/v1/models', undefined, {}, queryParams);
	}

	// ============================================
	// Context Memory Methods
	// ============================================

	/**
	 * Compress conversation with context memory (standalone)
	 * POST /v1/memory
	 */
	async compressMemory(
		messages: any[],
		options: {
			model?: string;
			memoryKey?: string;
			expirationDays?: number;
			modelContextLimit?: number;
		} = {},
	): Promise<CompressMemoryResponse> {
		const requestBody: Record<string, any> = { messages };

		if (options.model) requestBody.model = options.model;
		if (options.memoryKey) requestBody.memory_key = options.memoryKey;
		if (options.expirationDays) requestBody.expiration_days = options.expirationDays;
		if (options.modelContextLimit) requestBody.model_context_limit = options.modelContextLimit;

		return this.makeRequest('POST', '/v1/memory', requestBody);
	}

	// ============================================
	// TEE (Trusted Execution Environment) Methods
	// ============================================

	/**
	 * Get TEE attestation report for a model
	 * GET /v1/tee/attestation
	 */
	async getTEEAttestation(model: string): Promise<TEEAttestationResponse> {
		// Note: This endpoint uses different base path
		const url = `${this.getBaseUrl()}/v1/tee/attestation`;
		return this.context.helpers.httpRequest({
			method: 'GET',
			url: `${url}?model=${encodeURIComponent(model)}`,
			headers: {
				Authorization: `Bearer ${this.credentials.apiKey}`,
			},
			json: true,
		});
	}

	/**
	 * Get TEE signature for a chat request
	 * GET /v1/tee/signature/{requestId}
	 */
	async getTEESignature(requestId: string, model: string, signingAlgo?: string): Promise<TEESignatureResponse> {
		const url = `${this.getBaseUrl()}/v1/tee/signature/${requestId}`;
		const queryParams: Record<string, string> = { model };
		if (signingAlgo) queryParams.signing_algo = signingAlgo;

		return this.context.helpers.httpRequest({
			method: 'GET',
			url: `${url}?${this.buildQueryString(queryParams)}`,
			headers: {
				Authorization: `Bearer ${this.credentials.apiKey}`,
			},
			json: true,
		});
	}

	// ============================================
	// Balance and Subscription Methods
	// ============================================

	/**
	 * Check account balance
	 * POST /check-balance
	 */
	async checkBalance(): Promise<CheckBalanceResponse> {
		return this.makeRequest('POST', '/check-balance');
	}

	/**
	 * Get subscription usage
	 * GET /subscription/v1/usage
	 */
	async getSubscriptionUsage(): Promise<SubscriptionUsageResponse> {
		return this.makeRequest('GET', '/subscription/v1/usage');
	}

	/**
	 * Create invitation or referral link
	 * POST /invitations/create
	 */
	async createInvitation(
		options: {
			type?: 'invitation' | 'referralLink';
			amount?: number;
			currency?: string;
			recipientName?: string;
			issuerName?: string;
			issuerNote?: string;
		} = {},
	): Promise<CreateInvitationResponse> {
		return this.makeRequest('POST', '/invitations/create', options);
	}

	// ============================================
	// Nano Crypto Methods
	// ============================================

	/**
	 * Process pending Nano transactions
	 * POST /receive-nano
	 */
	async receiveNano(): Promise<ReceiveNanoResponse> {
		return this.makeRequest('POST', '/receive-nano');
	}
}
