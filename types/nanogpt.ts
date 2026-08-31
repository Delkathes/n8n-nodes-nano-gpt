/**
 * NanoGPT API Type Definitions
 *
 * Typed responses for all NanoGPT API endpoints.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ============================================
// Common Types
// ============================================

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant' | 'tool';
	content: string;
	name?: string;
	tool_calls?: ToolCall[];
	tool_call_id?: string;
}

export interface ToolCall {
	id: string;
	type: 'function';
	function: {
		name: string;
		arguments: string;
	};
}

export interface Usage {
	prompt_tokens: number;
	completion_tokens: number;
	total_tokens: number;
}

export interface Model {
	id: string;
	object: 'model';
	created: number;
	owned_by: string;
}

// ============================================
// Chat Completion Types
// ============================================

export interface ChatCompletionChoice {
	index: number;
	message: ChatMessage;
	finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | null;
	logprobs?: any;
}

export interface ChatCompletionResponse {
	id: string;
	object: 'chat.completion';
	created: number;
	model: string;
	choices: ChatCompletionChoice[];
	usage: Usage;
	system_fingerprint?: string;
}

// ============================================
// Responses API Types (OpenAI-compatible)
// ============================================

export interface ResponseOutput {
	type: 'message';
	id: string;
	status: string;
	role: 'assistant';
	content: ResponseContent[];
}

export interface ResponseContent {
	type: 'output_text';
	text: string;
	annotations: any[];
}

export interface CreateResponseResponse {
	id: string;
	object: 'response';
	created_at: number;
	status: 'completed' | 'failed' | 'in_progress' | 'incomplete';
	model: string;
	output: ResponseOutput[];
	usage: Usage;
	error?: any;
	incomplete_details?: any;
	metadata?: Record<string, string>;
}

export type GetResponseResponse = CreateResponseResponse;

export interface DeleteResponseResponse {
	id: string;
	object: 'response.deleted';
	deleted: boolean;
}

// ============================================
// Messages API Types (Anthropic-compatible)
// ============================================

export interface MessageContent {
	type: 'text' | 'tool_use' | 'tool_result';
	text?: string;
	id?: string;
	name?: string;
	input?: any;
	tool_use_id?: string;
	content?: string;
}

export interface CreateMessageResponse {
	id: string;
	type: 'message';
	role: 'assistant';
	content: MessageContent[];
	model: string;
	stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
	stop_sequence?: string;
	usage: {
		input_tokens: number;
		output_tokens: number;
	};
}

// ============================================
// Text Completion Types
// ============================================

export interface CompletionChoice {
	index: number;
	text: string;
	finish_reason: 'stop' | 'length' | null;
	logprobs?: any;
}

export interface CompletionResponse {
	id: string;
	object: 'text_completion';
	created: number;
	model: string;
	choices: CompletionChoice[];
	usage: Usage;
}

// ============================================
// Image Generation Types
// ============================================

export interface ImageData {
	url?: string;
	b64_json?: string;
	revised_prompt?: string;
}

export interface GenerateImageResponse {
	created: number;
	model?: string;
	data: ImageData[];
}

// ============================================
// Video Generation Types
// ============================================

export interface GenerateVideoResponse {
	status: 'pending' | 'processing' | 'completed' | 'failed';
	requestId: string;
	message?: string;
	estimatedTime?: number;
}

export interface VideoStatusResponse {
	status: 'pending' | 'processing' | 'completed' | 'failed';
	requestId: string;
	videoUrl?: string;
	thumbnailUrl?: string;
	error?: string;
	progress?: number;
}

export interface RecoverVideosResponse {
	runs: Array<{
		requestId: string;
		model: string;
		status: string;
		createdAt: string;
		videoUrl?: string;
	}>;
}

export interface ExtendVideoResponse {
	status: string;
	taskId: string;
	message?: string;
}

export interface VideoContentResponse {
	content: string;
	contentType: string;
}

export interface MidjourneyStatusResponse {
	status: 'pending' | 'processing' | 'completed' | 'failed';
	taskId: string;
	imageUrl?: string;
	progress?: number;
	error?: string;
}

// ============================================
// Speech-to-Text Types
// ============================================

export interface TranscribeResponse {
	status: 'pending' | 'processing' | 'completed' | 'failed';
	runId?: string;
	text?: string;
	segments?: TranscriptionSegment[];
	language?: string;
	duration?: number;
}

export interface TranscriptionSegment {
	id: number;
	start: number;
	end: number;
	text: string;
	speaker?: string;
}

export interface TranscriptionStatusResponse {
	status: 'pending' | 'processing' | 'completed' | 'failed';
	runId: string;
	text?: string;
	segments?: TranscriptionSegment[];
	error?: string;
}

export interface YouTubeTranscribeResponse {
	transcripts: Array<{
		url: string;
		title?: string;
		text: string;
		segments?: TranscriptionSegment[];
	}>;
}

// ============================================
// Text-to-Speech Types
// ============================================

export interface TextToSpeechResponse {
	status?: 'pending' | 'processing' | 'completed' | 'failed';
	runId?: string;
	audioUrl?: string;
	audio?: string;
	contentType?: string;
	model?: string;
	message?: string;
}

export interface SynchronousTTSResponse {
	audio: string; // base64 encoded audio or URL
	format?: string;
	duration?: number;
}

export interface TTSStatusResponse {
	status: 'pending' | 'processing' | 'completed' | 'failed';
	runId: string;
	audioUrl?: string;
	error?: string;
}

// ============================================
// Embeddings Types
// ============================================

export interface EmbeddingData {
	object: 'embedding';
	index: number;
	embedding: number[] | string; // float array or base64
}

export interface CreateEmbeddingResponse {
	object: 'list';
	data: EmbeddingData[];
	model: string;
	usage: {
		prompt_tokens: number;
		total_tokens: number;
	};
}

export interface EmbeddingModel {
	id: string;
	dimensions: number;
	maxTokens: number;
}

export interface ListEmbeddingModelsResponse {
	object?: 'list';
	data?: EmbeddingModel[];
	models?: EmbeddingModel[];
}

// ============================================
// Web Scraping & Search Types
// ============================================

export interface ScrapeResult {
	url: string;
	title?: string;
	content: string;
	html?: string;
	error?: string;
}

export interface ScrapeUrlsResponse {
	results: ScrapeResult[];
}

export interface SearchResult {
	title: string;
	url: string;
	snippet: string;
	publishedDate?: string;
}

export interface WebSearchResponse {
	query: string;
	results: SearchResult[];
	answer?: string;
	images?: Array<{ url: string; title?: string }>;
}

// ============================================
// Models Types
// ============================================

export interface ListModelsResponse {
	object: 'list';
	data: Model[];
}

// ============================================
// Context Memory Types
// ============================================

export interface CompressMemoryResponse {
	compressed_messages: ChatMessage[];
	original_token_count: number;
	compressed_token_count: number;
	compression_ratio: number;
}

// ============================================
// TEE Types
// ============================================

export interface TEEAttestationResponse {
	attestation: string;
	model: string;
	timestamp: number;
	signature?: string;
}

export interface TEESignatureResponse {
	requestId: string;
	model: string;
	signature: string;
	algorithm: string;
	timestamp: number;
}

// ============================================
// Balance & Subscription Types
// ============================================

export interface CheckBalanceResponse {
	balance?: string;
	usd_balance?: string;
	nano_balance?: string;
	nanoDepositAddress?: string;
	currency?: string;
}

export interface SubscriptionUsageResponse {
	used: number;
	limit: number;
	period: string;
	reset_at: string;
	models?: Record<string, { used: number; limit: number }>;
}

// ============================================
// Invitation Types
// ============================================

export interface CreateInvitationResponse {
	type: 'invitation' | 'referralLink';
	code?: string;
	url: string;
	amount?: number;
	currency?: string;
	expiresAt?: string;
}

// ============================================
// Nano Crypto Types
// ============================================

export interface ReceiveNanoResponse {
	success: boolean;
	received_blocks?: string[];
	total_received?: string;
	message?: string;
}

// ============================================
// Usage Types (GET /v1/usage)
// ============================================

export interface UsageResponse {
	object: 'usage';
	scope: string;
	apiKey: { id: number };
	from: string;
	to: string;
	timezone: string;
	groupBy: string;
	asOf: string;
	source: {
		rollupDays: string[];
		liveDays: string[];
		missingRollupDays: string[];
	};
	totals: UsageCounterBucket;
	byDay?: UsageCounterBucket[];
	byModel?: UsageCounterBucket[];
	byDayModel?: UsageCounterBucket[];
}

export interface UsageCounterBucket {
	date?: string;
	model?: string;
	requests: number;
	costUsd: number;
	refundedUsd: number;
	netCostUsd: number;
	inputTokens: number;
	outputTokens: number;
	reasoningTokens: number;
	totalTokens: number;
}

// ============================================
// Messages Count Tokens Types (POST /v1/messages/count_tokens)
// ============================================

export interface CountTokensResponse {
	input_tokens: number;
}

// ============================================
// AI Detection Types (POST /v1/ai-detection)
// ============================================

export interface AIDetectionResponse {
	object: string;
	mode: string;
	model: string;
	content: string;
	result: {
		score: number;
	};
	word_count: number;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
	pricing: {
		amount: number;
		currency: string;
	};
}

// ============================================
// Moderation Types (POST /v1/moderations)
// ============================================

export interface ModerationResponse {
	id: string;
	model: string;
	results: Array<{
		flagged: boolean;
		categories: Record<string, boolean>;
		category_scores?: Record<string, number>;
	}>;
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

// ============================================
// Moderation Models Types (GET /v1/moderation-models)
// ============================================

export interface ModerationModelsResponse {
	object: string;
	data: Array<{
		id: string;
		object: string;
		created: number;
		owned_by: string;
		context_length?: number;
		capabilities?: {
			text?: boolean;
			image?: boolean;
			batch?: boolean;
		};
		pricing?: {
			prompt?: number;
			completion?: number;
			currency?: string;
			unit?: string;
		};
	}>;
}

// ============================================
// Data Extraction Types
// ============================================

export interface DataExtractionResponse {
	data: any[];
	meta: {
		nanogpt: {
			costUsd: number;
			itemsReturned?: number;
			[endpoint: string]: any;
		};
		[provider: string]: any;
	};
}
