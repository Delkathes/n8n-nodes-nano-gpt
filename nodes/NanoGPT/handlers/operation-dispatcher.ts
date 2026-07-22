/* eslint-disable @typescript-eslint/no-explicit-any */

import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NanoGPTClient } from '../../../utils/NanoGPTClient';
import type { NanoGptMessage } from '../NanoGpt.node';

export interface DispatchParams {
	executeFunctions: IExecuteFunctions;
	operation: string;
	itemIndex: number;
	client: NanoGPTClient;
}

export async function dispatchNanoGPTOperation(params: DispatchParams): Promise<IDataObject> {
	const { executeFunctions, operation, itemIndex, client } = params;
	const i = itemIndex;

	switch (operation) {
		case 'chatCompletion':
			return handleChatCompletion(executeFunctions, client, i);
		case 'createResponse':
			return handleCreateResponse(executeFunctions, client, i);
		case 'getResponse':
			return handleGetResponse(executeFunctions, client, i);
		case 'deleteResponse':
			return handleDeleteResponse(executeFunctions, client, i);
		case 'createMessage':
			return handleCreateMessage(executeFunctions, client, i);
		case 'completion':
			return handleTextCompletion(executeFunctions, client, i);
		case 'generateImage':
			return handleGenerateImage(executeFunctions, client, i);
		case 'generateVideo':
			return handleGenerateVideo(executeFunctions, client, i);
		case 'checkVideoStatus':
		case 'extendVideo':
		case 'getVideoContent':
		case 'recoverVideo':
			return handleVideoOperations(executeFunctions, client, i, operation);
		case 'transcribe':
			return handleTranscribe(executeFunctions, client, i);
		case 'youtubeTranscribe':
			return handleYoutubeTranscribe(executeFunctions, client, i);
		case 'speechToTextStatus':
			return handleSpeechToTextStatus(executeFunctions, client, i);
		case 'generateSpeech':
			return handleGenerateSpeech(executeFunctions, client, i);
		case 'synchronousTTS':
			return handleSynchronousTTS(executeFunctions, client, i);
		case 'ttsStatus':
			return handleTTSStatus(executeFunctions, client, i);
		case 'createEmbedding':
			return handleCreateEmbedding(executeFunctions, client, i);
		case 'getEmbeddingModels':
			return handleGetEmbeddingModels(executeFunctions, client);
		case 'scrapeUrls':
			return handleScrapeUrls(executeFunctions, client, i);
		case 'webSearch':
			return handleWebSearch(executeFunctions, client, i);
		case 'listModels':
		case 'personalizedModels':
		case 'subscriptionModels':
		case 'paidModels':
		case 'embeddingModels':
			return handleListModels(executeFunctions, client, i, operation);
		case 'compressMemory':
			return handleMemoryOperation(executeFunctions, client, i);
		case 'teeAttestation':
		case 'teeSignature':
			return handleTEEOperation(executeFunctions, client, i, operation);
		case 'midjourneyStatus':
			return handleMidjourneyStatus(executeFunctions, client, i);
		case 'checkBalance':
		case 'createInvitation':
		case 'subscriptionUsage':
			return handleBalanceOperation(executeFunctions, client, i, operation);
		case 'receiveNano':
			return handleNanoCryptoOperation(executeFunctions, client);
		case 'getUsage':
			return handleGetUsage(executeFunctions, client, i);
		case 'countTokens':
			return handleCountTokens(executeFunctions, client, i);
		case 'aiDetection':
			return handleAIDetection(executeFunctions, client, i);
		case 'moderate':
			return handleModerate(executeFunctions, client, i);
		case 'listModerationModels':
			return handleListModerationModels(executeFunctions, client, i);
		case 'firecrawl':
		case 'googleMaps':
		case 'googleMapsReviews':
		case 'facebookAds':
		case 'instagramProfile':
		case 'instagramPosts':
		case 'instagramReels':
		case 'reddit':
		case 'tiktok':
		case 'linkedinProfile':
		case 'hunter':
			return handleDataExtraction(executeFunctions, client, i, operation);
		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}

async function handleChatCompletion(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const messagesRaw = context.getNodeParameter('messages', i) as string | NanoGptMessage[];
	const model = context.getNodeParameter('model', i) as string;
	const advancedOptions = context.getNodeParameter('chatAdvancedOptions', i, {}) as IDataObject;

	const messages = typeof messagesRaw === 'string' ? JSON.parse(messagesRaw) : messagesRaw;

	if (!Array.isArray(messages) || messages.length === 0) {
		throw new Error('Messages must be a non-empty array');
	}

	let linkup;
	if (advancedOptions.linkup_enabled) {
		linkup = {
			enabled: true,
			provider: advancedOptions.linkup_provider as 'linkup' | 'tavily' | 'exa' | 'kagi',
			depth: advancedOptions.linkup_depth as 'standard' | 'deep',
			searchContextSize: advancedOptions.linkup_search_context_size as 'low' | 'medium' | 'high',
			searchType: advancedOptions.linkup_search_type as 'web' | 'news' | 'search',
		};
	}

	let reasoning;
	if (advancedOptions.reasoning_effort || advancedOptions.reasoning_exclude) {
		reasoning = {
			effort: advancedOptions.reasoning_effort as string,
			exclude: advancedOptions.reasoning_exclude as boolean,
		};
	}

	let promptCaching;
	if (advancedOptions.prompt_caching_enabled) {
		promptCaching = {
			enabled: true,
			ttl: advancedOptions.prompt_caching_ttl === '1h' ? 3600 : 300,
			stickyProvider: advancedOptions.prompt_caching_sticky_provider as boolean,
		};
	}

	let responseFormat: { type: string; json_schema?: object } | undefined;
	if (advancedOptions.response_format_type && advancedOptions.response_format_type !== 'text') {
		responseFormat = { type: advancedOptions.response_format_type as string };
		if (advancedOptions.response_format_type === 'json_schema' && advancedOptions.json_schema) {
			const schema = advancedOptions.json_schema;
			responseFormat.json_schema = typeof schema === 'string' ? JSON.parse(schema as string) : schema;
		}
	}

	let tools;
	if (advancedOptions.tools) {
		const toolsRaw = advancedOptions.tools;
		tools = typeof toolsRaw === 'string' ? JSON.parse(toolsRaw as string) : toolsRaw;
	}

	let logitBias;
	if (advancedOptions.logit_bias) {
		const biasRaw = advancedOptions.logit_bias;
		logitBias = typeof biasRaw === 'string' ? JSON.parse(biasRaw as string) : biasRaw;
	}

	let stop;
	if (advancedOptions.stop && (advancedOptions.stop as string).trim()) {
		stop = (advancedOptions.stop as string).split(',').map((s: string) => s.trim());
	}

	const response = await client.chatCompletion(messages, model, {
		temperature: advancedOptions.temperature as number,
		maxTokens: advancedOptions.max_tokens as number,
		topP: advancedOptions.top_p as number,
		topK: advancedOptions.top_k as number,
		minP: advancedOptions.min_p as number,
		frequencyPenalty: advancedOptions.frequency_penalty as number,
		presencePenalty: advancedOptions.presence_penalty as number,
		repetitionPenalty: advancedOptions.repetition_penalty as number,
		stop,
		seed: advancedOptions.seed as number,
		tools,
		toolChoice: advancedOptions.tool_choice as string,
		parallelToolCalls: advancedOptions.parallel_tool_calls as boolean,
		logprobs: advancedOptions.logprobs as boolean,
		topLogprobs: advancedOptions.top_logprobs as number,
		logitBias,
		responseFormat,
		linkup,
		memory: advancedOptions.memory_enabled as boolean,
		memoryExpirationDays: advancedOptions.memory_expiration_days as number,
		youtubeTranscripts: advancedOptions.youtube_transcripts as boolean,
		reasoning,
		promptCaching,
		scraping: advancedOptions.scraping as boolean,
		minTokens: advancedOptions.min_tokens as number,
		tfs: advancedOptions.tfs as number,
		typicalP: advancedOptions.typical_p as number,
		mirostatMode: advancedOptions.mirostat_mode as 0 | 1 | 2,
		mirostatTau: advancedOptions.mirostat_tau as number,
		mirostatEta: advancedOptions.mirostat_eta as number,
	});

	return response as unknown as IDataObject;
}

async function handleCreateResponse(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const model = context.getNodeParameter('model', i) as string;
	const input = context.getNodeParameter('responseInput', i) as string;
	const instructions = context.getNodeParameter('instructions', i, '') as string;

	if (!input || input.trim() === '') {
		throw new Error('Input cannot be empty');
	}

	const response = await client.createResponse(model, input, {
		instructions: instructions || undefined,
	});

	return response as unknown as IDataObject;
}

async function handleGetResponse(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const responseId = context.getNodeParameter('responseId', i) as string;

	if (!responseId || responseId.trim() === '') {
		throw new Error('Response ID cannot be empty');
	}

	const response = await client.getResponse(responseId);
	return response as unknown as IDataObject;
}

async function handleDeleteResponse(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const responseId = context.getNodeParameter('responseId', i) as string;

	if (!responseId || responseId.trim() === '') {
		throw new Error('Response ID cannot be empty');
	}

	const response = await client.deleteResponse(responseId);
	return response as unknown as IDataObject;
}

async function handleCreateMessage(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const model = context.getNodeParameter('model', i) as string;
	const messagesRaw = context.getNodeParameter('messages', i) as string | any[];
	const maxTokens = context.getNodeParameter('maxTokens', i, 4096) as number;
	const systemPrompt = context.getNodeParameter('systemPrompt', i, '') as string;

	const messages = typeof messagesRaw === 'string' ? JSON.parse(messagesRaw) : messagesRaw;

	if (!Array.isArray(messages) || messages.length === 0) {
		throw new Error('Messages must be a non-empty array');
	}

	const response = await client.createMessage(model, maxTokens, messages, {
		system: systemPrompt || undefined,
	});

	return response as unknown as IDataObject;
}

async function handleTextCompletion(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const prompt = context.getNodeParameter('prompt', i) as string;
	const model = context.getNodeParameter('completionModel', i, 'gpt-4.1-nano') as string;
	const advancedOptions = context.getNodeParameter('completionAdvancedOptions', i, {}) as IDataObject;

	if (!prompt || prompt.trim() === '') {
		throw new Error('Prompt cannot be empty');
	}

	const response = await client.completion(prompt, model, {
		maxTokens: (advancedOptions.max_tokens as number) || 1000,
		temperature: (advancedOptions.temperature as number) || 0.7,
		topP: advancedOptions.top_p as number,
		stop: advancedOptions.stop as string[],
	});

	return response as unknown as IDataObject;
}

async function handleGenerateImage(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const prompt = context.getNodeParameter('prompt', i) as string;
	const imageModel = context.getNodeParameter('imageModel', i, 'nano-banana-pro') as string;
	const advancedOptions = context.getNodeParameter('imageAdvancedOptions', i, {}) as IDataObject;

	if (!prompt || prompt.trim() === '') {
		throw new Error('Image prompt cannot be empty');
	}

	let imageDataUrls: string[] | undefined;
	if (advancedOptions.imageDataUrls) {
		if (typeof advancedOptions.imageDataUrls === 'string') {
			try {
				imageDataUrls = JSON.parse(advancedOptions.imageDataUrls);
			} catch {
				imageDataUrls = undefined;
			}
		} else if (Array.isArray(advancedOptions.imageDataUrls)) {
			imageDataUrls = advancedOptions.imageDataUrls as string[];
		}
	}

	const response = await client.generateImage(prompt, {
		model: imageModel,
		size: (advancedOptions.size as string) || '1024x1024',
		n: (advancedOptions.n as number) || 1,
		responseFormat: advancedOptions.response_format as 'url' | 'b64_json',
		imageDataUrl: advancedOptions.imageDataUrl as string,
		imageDataUrls,
		maskDataUrl: advancedOptions.maskDataUrl as string,
		strength: advancedOptions.strength as number,
		guidanceScale: advancedOptions.guidance_scale as number,
		numInferenceSteps: advancedOptions.num_inference_steps as number,
		seed: advancedOptions.seed as number,
		kontextMaxMode: advancedOptions.kontext_max_mode as boolean,
		aspectRatio: advancedOptions.aspect_ratio as string,
		quality: advancedOptions.quality as 'low' | 'medium' | 'high',
		outputFormat: advancedOptions.output_format as 'jpeg' | 'png' | 'webp',
		negativePrompt: advancedOptions.negative_prompt as string,
		style: advancedOptions.style as 'vivid' | 'natural',
		styleType: advancedOptions.style_type as string,
		magicPromptOption: advancedOptions.magic_prompt_option as 'On' | 'Off',
		enablePromptExpansion: advancedOptions.enable_prompt_expansion as boolean,
		enableSafetyChecker: advancedOptions.enable_safety_checker as boolean,
		loraUrl1: advancedOptions.lora_url_1 as string,
		loraScale1: advancedOptions.lora_scale_1 as number,
	});

	return response as unknown as IDataObject;
}

async function handleGenerateVideo(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const prompt = context.getNodeParameter('prompt', i) as string;
	const videoModel = context.getNodeParameter('videoModel', i, 'veo3') as string;
	const advancedOptions = context.getNodeParameter('videoAdvancedOptions', i, {}) as IDataObject;

	if (!prompt || prompt.trim() === '') {
		throw new Error('Video prompt cannot be empty');
	}

	const response = await client.generateVideo(videoModel, {
		prompt,
		duration: advancedOptions.duration as string,
		aspectRatio: advancedOptions.aspect_ratio as string,
		resolution: advancedOptions.resolution as string,
		imageUrl: advancedOptions.imageUrl as string,
		imageDataUrl: advancedOptions.imageDataUrl as string,
		negativePrompt: advancedOptions.negative_prompt as string,
		proMode: advancedOptions.pro_mode as boolean,
		generateAudio: advancedOptions.generateAudio as boolean,
		seed: advancedOptions.seed as number,
	});

	return response as unknown as IDataObject;
}

async function handleVideoOperations(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
	operation: string,
): Promise<IDataObject> {
	const videoId = context.getNodeParameter('videoId', i) as string;

	if (!videoId || videoId.trim() === '') {
		throw new Error('Video ID / Request ID cannot be empty');
	}

	let response;
	switch (operation) {
		case 'checkVideoStatus':
			response = await client.getVideoStatus(videoId);
			break;
		case 'extendVideo': {
			const index = context.getNodeParameter('extendVideoIndex', i, 0) as number;
			response = await client.extendVideo(videoId, index);
			break;
		}
		case 'getVideoContent': {
			const variant = context.getNodeParameter('videoContentVariant', i, 'video') as string;
			response = await client.getVideoContent(videoId, 'sora-2', variant);
			break;
		}
		case 'recoverVideo': {
			const limit = context.getNodeParameter('recoverVideoLimit', i, 10) as number;
			const model = videoId || undefined;
			response = await client.recoverVideos({ model, limit });
			break;
		}
	}

	return response as unknown as IDataObject;
}

async function handleTranscribe(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const audioFile = context.getNodeParameter('audioFile', i) as string;
	const sttModel = context.getNodeParameter('sttModel', i, 'Whisper-Large-V3') as string;
	const advancedOptions = context.getNodeParameter('sttAdvancedOptions', i, {}) as IDataObject;

	if (!audioFile || audioFile.trim() === '') {
		throw new Error('Audio file URL cannot be empty');
	}

	const response = await client.transcribe({
		audioUrl: audioFile,
		model: sttModel,
		language: advancedOptions.language as string,
		diarize: advancedOptions.diarize as boolean,
		tagAudioEvents: advancedOptions.tagAudioEvents as boolean,
		actualDuration: advancedOptions.actualDuration ? (advancedOptions.actualDuration as number) : undefined,
		contentType: (advancedOptions.audioContentType as string) || undefined,
	});

	return response as unknown as IDataObject;
}

async function handleYoutubeTranscribe(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const youtubeUrl = context.getNodeParameter('youtubeUrl', i) as string;

	if (!youtubeUrl || youtubeUrl.trim() === '') {
		throw new Error('YouTube URL cannot be empty');
	}

	const urls = youtubeUrl.split(',').map((url: string) => url.trim());
	const response = await client.youtubeTranscribe(urls);

	return response as unknown as IDataObject;
}

async function handleSpeechToTextStatus(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const runId = context.getNodeParameter('taskId', i) as string;

	if (!runId || runId.trim() === '') {
		throw new Error('Run ID cannot be empty');
	}

	const response = await client.getTranscriptionStatus(runId);
	return response as unknown as IDataObject;
}

async function handleGenerateSpeech(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const text = context.getNodeParameter('text', i) as string;
	const model = context.getNodeParameter('ttsModel', i, 'Kokoro-82m') as string;
	const voice = context.getNodeParameter('voice', i, 'alloy') as string;
	const advancedOptions = context.getNodeParameter('ttsAdvancedOptions', i, {}) as IDataObject;

	if (!text || text.trim() === '') {
		throw new Error('Text cannot be empty');
	}

	const response = await client.textToSpeech(text, {
		model,
		voice,
		speed: advancedOptions.speed as number,
		responseFormat: advancedOptions.response_format as string,
		instructions: advancedOptions.instructions as string,
		stability: advancedOptions.stability !== undefined ? (advancedOptions.stability as number) : undefined,
		similarityBoost: advancedOptions.similarity_boost !== undefined ? (advancedOptions.similarity_boost as number) : undefined,
		style: advancedOptions.style !== undefined ? (advancedOptions.style as number) : undefined,
	});

	return response as unknown as IDataObject;
}

async function handleSynchronousTTS(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const text = context.getNodeParameter('text', i) as string;
	const model = context.getNodeParameter('ttsModel', i, 'Kokoro-82m') as string;
	const voice = context.getNodeParameter('voice', i, 'alloy') as string;
	const advancedOptions = context.getNodeParameter('ttsAdvancedOptions', i, {}) as IDataObject;

	if (!text || text.trim() === '') {
		throw new Error('Text cannot be empty');
	}

	const response = await client.synchronousTTS(text, model, voice, {
		speed: advancedOptions.speed as number,
		responseFormat: advancedOptions.response_format as string,
		instructions: advancedOptions.instructions as string,
		stream: advancedOptions.stream as boolean,
	});

	return response as unknown as IDataObject;
}

async function handleTTSStatus(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const runId = context.getNodeParameter('ttsTaskId', i) as string;
	const model = context.getNodeParameter('ttsModel', i, 'Kokoro-82m') as string;

	if (!runId || runId.trim() === '') {
		throw new Error('TTS Run ID cannot be empty');
	}

	const response = await client.getTTSStatus(runId, model);
	return response as unknown as IDataObject;
}

async function handleCreateEmbedding(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const input = context.getNodeParameter('input', i) as string;
	const model = context.getNodeParameter('embeddingModel', i, 'text-embedding-3-small') as string;
	const advancedOptions = context.getNodeParameter('embeddingAdvancedOptions', i, {}) as IDataObject;

	if (!input || input.trim() === '') {
		throw new Error('Input text cannot be empty');
	}

	const response = await client.createEmbedding(input, model, {
		dimensions: advancedOptions.dimensions as number,
		encodingFormat: advancedOptions.encoding_format as 'float' | 'base64',
	});

	return response as unknown as IDataObject;
}

async function handleGetEmbeddingModels(
	_context: IExecuteFunctions,
	client: NanoGPTClient,
): Promise<IDataObject> {
	const response = await client.listEmbeddingModels();
	return response as unknown as IDataObject;
}

async function handleScrapeUrls(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const urls = context.getNodeParameter('urls', i) as string;
	const advancedOptions = context.getNodeParameter('scrapeAdvancedOptions', i, {}) as IDataObject;

	if (!urls || urls.trim() === '') {
		throw new Error('URLs cannot be empty');
	}

	const urlList = urls.split(',').map((url: string) => url.trim()).filter((url: string) => url);

	if (urlList.length > 5) {
		throw new Error('Maximum 5 URLs per request allowed');
	}

	const stealthMode = (advancedOptions.stealthMode as boolean) || false;
	const response = await client.scrapeUrls(urlList, stealthMode);

	return response as unknown as IDataObject;
}

async function handleWebSearch(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const query = context.getNodeParameter('query', i) as string;
	const advancedOptions = context.getNodeParameter('webSearchAdvancedOptions', i, {}) as IDataObject;

	if (!query || query.trim() === '') {
		throw new Error('Query cannot be empty');
	}

	const includeDomains = advancedOptions.includeDomains
		? (advancedOptions.includeDomains as string).split(',').map((d: string) => d.trim()).filter((d: string) => d)
		: undefined;
	const excludeDomains = advancedOptions.excludeDomains
		? (advancedOptions.excludeDomains as string).split(',').map((d: string) => d.trim()).filter((d: string) => d)
		: undefined;

	let structuredOutputSchema: string | undefined;
	if (advancedOptions.structuredOutputSchema) {
		const schema = advancedOptions.structuredOutputSchema;
		structuredOutputSchema = typeof schema === 'string' ? schema : JSON.stringify(schema);
	}

	const response = await client.webSearch(query, {
		provider: advancedOptions.provider as 'linkup' | 'tavily' | 'exa' | 'kagi' | 'perplexity' | 'valyu',
		depth: advancedOptions.depth as 'standard' | 'deep',
		outputType: advancedOptions.outputType as 'searchResults' | 'sourcedAnswer' | 'structured',
		structuredOutputSchema,
		includeImages: advancedOptions.includeImages as boolean,
		fromDate: advancedOptions.fromDate as string,
		toDate: advancedOptions.toDate as string,
		includeDomains,
		excludeDomains,
	});

	return response as unknown as IDataObject;
}

async function handleListModels(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
	operation: string,
): Promise<IDataObject> {
	const detailed = context.getNodeParameter('detailed', i, false) as boolean;

	let response;
	switch (operation) {
		case 'listModels':
			response = await client.listModels(detailed);
			break;
		case 'personalizedModels':
			response = await client.getPersonalizedModels(detailed);
			break;
		case 'subscriptionModels':
			response = await client.listSubscriptionModels(detailed);
			break;
		case 'paidModels':
			response = await client.listPaidModels(detailed);
			break;
		case 'embeddingModels':
			response = await client.listEmbeddingModels();
			break;
	}

	return response as unknown as IDataObject;
}

async function handleMemoryOperation(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const messagesRaw = context.getNodeParameter('compressMessages', i) as string | any;
	const messages = typeof messagesRaw === 'string' ? JSON.parse(messagesRaw) : messagesRaw;
	const model = context.getNodeParameter('compressModel', i, 'gpt-4.1-nano') as string;
	const memoryKey = context.getNodeParameter('memoryKey', i, '') as string;

	const response = await client.compressMemory(messages, {
		model,
		memoryKey: memoryKey || undefined,
	});

	return response as unknown as IDataObject;
}

async function handleTEEOperation(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
	operation: string,
): Promise<IDataObject> {
	const model = context.getNodeParameter('model', i, 'DeepSeek-R1-Distill-Llama-70B-TEE') as string;

	let response;
	switch (operation) {
		case 'teeAttestation':
			response = await client.getTEEAttestation(model);
			break;
		case 'teeSignature': {
			const requestId = context.getNodeParameter('jobId', i, '') as string;
			if (!requestId) {
				throw new Error('Request ID is required for TEE signature');
			}
			response = await client.getTEESignature(requestId, model);
			break;
		}
	}

	return response as unknown as IDataObject;
}

async function handleMidjourneyStatus(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const taskId = context.getNodeParameter('jobId', i) as string;

	if (!taskId || taskId.trim() === '') {
		throw new Error('Task ID cannot be empty');
	}

	const response = await client.checkMidjourneyStatus(taskId);
	return response as unknown as IDataObject;
}

async function handleBalanceOperation(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
	operation: string,
): Promise<IDataObject> {
	let response;
	switch (operation) {
		case 'checkBalance':
			response = await client.checkBalance();
			break;
		case 'createInvitation':
			response = await client.createInvitation({ type: 'invitation' });
			break;
		case 'subscriptionUsage':
			response = await client.getSubscriptionUsage();
			break;
	}

	return response as unknown as IDataObject;
}

async function handleNanoCryptoOperation(
	_context: IExecuteFunctions,
	client: NanoGPTClient,
): Promise<IDataObject> {
	const response = await client.receiveNano();
	return response as unknown as IDataObject;
}

async function handleGetUsage(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const usageOptions = context.getNodeParameter('usageOptions', i, {}) as IDataObject;

	const response = await client.getUsage({
		from: usageOptions.from as string,
		to: usageOptions.to as string,
		groupBy: usageOptions.groupBy as string,
		scope: usageOptions.scope as string,
		apiKeyId: usageOptions.apiKeyId as number,
	});

	return response as unknown as IDataObject;
}

async function handleCountTokens(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const model = context.getNodeParameter('messageModel', i) as string;
	const messagesRaw = context.getNodeParameter('messages', i);
	const messages = typeof messagesRaw === 'string' ? JSON.parse(messagesRaw) : messagesRaw;
	const countTokensOptions = context.getNodeParameter('countTokensOptions', i, {}) as IDataObject;

	const toolsRaw = countTokensOptions.tools;
	const tools = typeof toolsRaw === 'string' ? JSON.parse(toolsRaw as string) : toolsRaw;

	const response = await client.countTokens({
		model,
		messages,
		system: countTokensOptions.system as string,
		tools: tools as any[],
		toolChoice: countTokensOptions.toolChoice as string,
	});

	return response as unknown as IDataObject;
}

async function handleAIDetection(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const text = context.getNodeParameter('inputText', i) as string;
	const mode = context.getNodeParameter('detectionMode', i, 'ai') as string;

	const response = await client.aiDetection({
		text,
		mode: mode as 'ai' | 'plagiarism',
	});

	return response as unknown as IDataObject;
}

async function handleModerate(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const model = context.getNodeParameter('moderationModel', i, '') as string;
	const inputRaw = context.getNodeParameter('moderationInput', i);
	const input = typeof inputRaw === 'string' ? JSON.parse(inputRaw) : inputRaw;

	const response = await client.moderate({
		input,
		model: model || undefined,
	});

	return response as unknown as IDataObject;
}

async function handleListModerationModels(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
): Promise<IDataObject> {
	const detailed = context.getNodeParameter('detailed', i, true) as boolean;

	const response = await client.listModerationModels({ detailed });
	return response as unknown as IDataObject;
}

async function handleDataExtraction(
	context: IExecuteFunctions,
	client: NanoGPTClient,
	i: number,
	operation: string,
): Promise<IDataObject> {
	const maxTotalChargeUsd = context.getNodeParameter('maxTotalChargeUsd', i, undefined) as number | undefined;
	const body: Record<string, any> = {};

	if (maxTotalChargeUsd !== undefined && maxTotalChargeUsd > 0) {
		body.maxTotalChargeUsd = maxTotalChargeUsd;
	}

	function parseArray(val: string): string[] {
		return val.split(',').map((s) => s.trim()).filter(Boolean);
	}

	function normalizeRedditUrl(url: string): string {
		url = url.replace(/^https?:\/\/www\.reddit\.com\//, 'https://reddit.com/');
		url = url.replace(/\/$/, '');
		url = url.replace(/^(https?:\/\/reddit\.com\/r\/\w+\/comments\/\w+).*$/, '$1');
		return url;
	}

	function mergeOpts(body: Record<string, any>, opts: IDataObject, arrayFields: string[], remap?: Record<string, string>): void {
		for (const [key, value] of Object.entries(opts)) {
			if (value === undefined || value === '' || value === false) continue;
			const apiKey = (remap && remap[key]) || key;
			if (arrayFields.includes(key)) {
				body[apiKey] = parseArray(value as string);
			} else {
				body[apiKey] = value;
			}
		}
	}

	let endpoint: string;

	switch (operation) {
		case 'firecrawl': {
			endpoint = 'v1/firecrawl';
			body.url = context.getNodeParameter('firecrawlUrl', i) as string;
			body.operation = context.getNodeParameter('firecrawlOperation', i, 'scrape') as string;
			const opts = context.getNodeParameter('firecrawlOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, ['formats']);
			break;
		}
		case 'googleMaps': {
			endpoint = 'v1/googlemaps';
			const searchStrings = context.getNodeParameter('googleMapsSearchStrings', i, '') as string;
			const startUrls = context.getNodeParameter('googleMapsStartUrls', i, '') as string;
			const placeIds = context.getNodeParameter('googleMapsPlaceIds', i, '') as string;
			if (searchStrings) body.searchStringsArray = parseArray(searchStrings);
			if (startUrls) body.startUrls = parseArray(startUrls);
			if (placeIds) body.placeIds = parseArray(placeIds);
			const opts = context.getNodeParameter('googleMapsOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, [], { googleMapsResultLimit: 'resultLimit', googleMapsMaxReviews: 'maxReviews' });
			break;
		}
		case 'googleMapsReviews': {
			endpoint = 'v1/googlemaps/reviews';
			const startUrls = context.getNodeParameter('googleMapsReviewsStartUrls', i, '') as string;
			const placeIds = context.getNodeParameter('googleMapsReviewsPlaceIds', i, '') as string;
			if (startUrls) body.startUrls = parseArray(startUrls);
			if (placeIds) body.placeIds = parseArray(placeIds);
			const opts = context.getNodeParameter('googleMapsReviewsOptions', i, {}) as IDataObject;
			if (opts.personalData !== undefined) body.personalData = opts.personalData;
			mergeOpts(body, opts, [], { googleMapsReviewsResultLimit: 'resultLimit', googleMapsReviewsMaxReviews: 'maxReviews' });
			break;
		}
		case 'facebookAds': {
			endpoint = 'v1/facebook/ads';
			body.startUrls = parseArray(context.getNodeParameter('facebookAdsStartUrls', i) as string);
			const opts = context.getNodeParameter('facebookAdsOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, [], { facebookAdsResultLimit: 'resultLimit', facebookAdsResultsLimit: 'resultsLimit' });
			break;
		}
		case 'instagramProfile': {
			endpoint = 'v1/instagram/profile';
			body.username = parseArray(context.getNodeParameter('instagramProfileUsernames', i) as string);
			const opts = context.getNodeParameter('instagramProfileOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, [], { instagramProfileResultLimit: 'resultLimit' });
			break;
		}
		case 'instagramPosts': {
			endpoint = 'v1/instagram/posts';
			body.username = parseArray(context.getNodeParameter('instagramPostsUsernames', i) as string);
			const opts = context.getNodeParameter('instagramPostsOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, [], { instagramPostsResultLimit: 'resultLimit', instagramPostsResultsLimit: 'resultsLimit' });
			break;
		}
		case 'instagramReels': {
			endpoint = 'v1/instagram/reels';
			body.username = parseArray(context.getNodeParameter('instagramReelsUsernames', i) as string);
			const opts = context.getNodeParameter('instagramReelsOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, [], { instagramReelsResultLimit: 'resultLimit', instagramReelsResultsLimit: 'resultsLimit' });
			break;
		}
		case 'reddit': {
			endpoint = 'v1/reddit';
			const startUrls = context.getNodeParameter('redditStartUrls', i, '') as string;
			const searches = context.getNodeParameter('redditSearches', i, '') as string;
			if (startUrls) {
				body.startUrls = parseArray(startUrls).map((url) => ({ url: normalizeRedditUrl(url) }));
			}
			if (searches) body.searches = parseArray(searches);
			const opts = context.getNodeParameter('redditOptions', i, {}) as IDataObject;
			if (opts.searchPosts !== undefined) body.searchPosts = opts.searchPosts;
			if (opts.searchComments !== undefined) body.searchComments = opts.searchComments;
			if (opts.searchCommunities !== undefined) body.searchCommunities = opts.searchCommunities;
			if (opts.searchUsers !== undefined) body.searchUsers = opts.searchUsers;
			if (opts.includeNSFW !== undefined) body.includeNSFW = opts.includeNSFW;
			mergeOpts(body, opts, [], { redditResultLimit: 'resultLimit' });
			if (searches && body.searchPosts === undefined) body.searchPosts = true;
			break;
		}
		case 'tiktok': {
			endpoint = 'v1/tiktok';
			const hashtags = context.getNodeParameter('tiktokHashtags', i, '') as string;
			const profiles = context.getNodeParameter('tiktokProfiles', i, '') as string;
			const searchQueries = context.getNodeParameter('tiktokSearchQueries', i, '') as string;
			const postURLs = context.getNodeParameter('tiktokPostURLs', i, '') as string;
			if (hashtags) body.hashtags = parseArray(hashtags);
			if (profiles) body.profiles = parseArray(profiles);
			if (searchQueries) body.searchQueries = parseArray(searchQueries);
			if (postURLs) body.postURLs = parseArray(postURLs);
			const opts = context.getNodeParameter('tiktokOptions', i, {}) as IDataObject;
			mergeOpts(body, opts, [], { tiktokResultLimit: 'resultLimit' });
			break;
		}
		case 'linkedinProfile': {
			endpoint = 'v1/linkedin/profile';
			body.profileUrls = parseArray(context.getNodeParameter('linkedinProfileUrls', i) as string);
			break;
		}
		case 'hunter': {
			endpoint = 'v1/hunter';
			const hunterEndpoint = context.getNodeParameter('hunterEndpoint', i) as string;
			const hunterOpts = context.getNodeParameter('hunterOptions', i, {}) as IDataObject;
			const paramsRaw = hunterOpts.params;
			const extraParams: Record<string, any> = (typeof paramsRaw === 'string' ? JSON.parse(paramsRaw) : paramsRaw) || {};
			const isPost = hunterEndpoint === 'discover';
			const qp: Record<string, string> = {};
			function getStr(name: string) { const v = context.getNodeParameter(name, i, '') as string; return v || ''; }
			function getNum(name: string) { return context.getNodeParameter(name, i, 0) as number; }
			function getBool(name: string) { return context.getNodeParameter(name, i, false) as boolean; }
			function add(key: string, value: string | number | boolean | undefined): void {
				if (value !== undefined && value !== '' && value !== 0 && value !== false) {
					qp[key] = String(value);
				}
			}

			switch (hunterEndpoint) {
				case 'domain-search':
					add('domain', getStr('hunterDomain'));
					add('company', getStr('hunterCompany'));
					add('type', getStr('hunterEmailType'));
					add('department', getStr('hunterDepartment'));
					add('seniority', getStr('hunterSeniority'));
					add('limit', getNum('hunterLimit'));
					add('offset', getNum('hunterOffset'));
					break;
				case 'email-finder':
					add('domain', getStr('hunterFinderDomain'));
					add('company', getStr('hunterFinderCompany'));
					add('linkedin', getStr('hunterFinderLinkedin'));
					add('full_name', getStr('hunterFullName'));
					add('first_name', getStr('hunterFirstName'));
					add('last_name', getStr('hunterLastName'));
					add('max_duration', getNum('hunterMaxDuration'));
					add('limit', getNum('hunterLimit'));
					break;
				case 'email-verifier':
					add('email', getStr('hunterEmail'));
					break;
				case 'email-count':
					add('domain', getStr('hunterCountDomain'));
					add('company', getStr('hunterCountCompany'));
					add('type', getStr('hunterCountEmailType'));
					add('limit', getNum('hunterLimit'));
					break;
				case 'people/find':
					add('email', getStr('hunterEnrichEmail'));
					add('linkedin', getStr('hunterFinderLinkedin'));
					break;
				case 'companies/find':
					add('domain', getStr('hunterCompanyEnrichDomain'));
					add('clearbit', getBool('hunterCompanyClearbit'));
					break;
				case 'combined/find':
					add('email', getStr('hunterCombinedEmail'));
					add('clearbit', getBool('hunterCompanyClearbit'));
					break;
				case 'discover':
					add('query', getStr('hunterDiscoverQuery'));
					add('domain', getStr('hunterDiscoverDomain'));
					add('company', getStr('hunterDiscoverCompany'));
					add('industries', getStr('hunterDiscoverIndustries'));
					add('country', getStr('hunterDiscoverCountry'));
					add('headcount', getStr('hunterDiscoverHeadcount'));
					add('limit', getNum('hunterLimit'));
					add('offset', getNum('hunterOffset'));
					break;
			}

			for (const [k, v] of Object.entries(extraParams)) {
				if (v !== undefined && v !== null && v !== '') {
					qp[k] = String(v);
				}
			}

			if (!isPost) {
				const response = await (client as any).makeRequest('GET', `/v1/hunter/${hunterEndpoint}`, undefined, {}, qp);
				return response as unknown as IDataObject;
			} else {
				body.endpoint = hunterEndpoint;
				for (const [k, v] of Object.entries(qp)) {
					body[k] = v;
				}
			}
			break;
		}
		default:
			throw new Error(`Unknown data extraction operation: ${operation}`);
	}

	const response = await client.dataExtraction(endpoint, body);
	return response as unknown as IDataObject;
}
