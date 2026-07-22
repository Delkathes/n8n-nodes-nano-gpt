/* eslint-disable @n8n/community-nodes/no-http-request-with-manual-auth, @n8n/community-nodes/icon-prefer-themed-variants */

import {
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { NanoGPTClient } from '../../utils/NanoGPTClient';

import { chatNanoGPTParameterProperties } from './descriptions/parameter-properties-chat';
import { textGenerationNanoGPTParameterProperties } from './descriptions/parameter-properties-text-generation';
import { imageNanoGPTParameterProperties } from './descriptions/parameter-properties-image';
import { videoNanoGPTParameterProperties } from './descriptions/parameter-properties-video';
import { sttNanoGPTParameterProperties } from './descriptions/parameter-properties-stt';
import { ttsNanoGPTParameterProperties } from './descriptions/parameter-properties-tts';
import { embeddingsNanoGPTParameterProperties } from './descriptions/parameter-properties-embeddings';
import { webNanoGPTParameterProperties } from './descriptions/parameter-properties-web';
import { modelsNanoGPTParameterProperties } from './descriptions/parameter-properties-models';
import {
	memoryNanoGPTParameterProperties,
	teeNanoGPTParameterProperties,
	midjourneyNanoGPTParameterProperties,
} from './descriptions/parameter-properties-memory-tee-mj';
import {
	balanceNanoGPTParameterProperties,
	nanoCryptoNanoGPTParameterProperties,
} from './descriptions/parameter-properties-balance';
import { usageNanoGPTParameterProperties } from './descriptions/parameter-properties-usage';
import { messagesNanoGPTParameterProperties } from './descriptions/parameter-properties-messages';
import { aiDetectionNanoGPTParameterProperties } from './descriptions/parameter-properties-ai-detection';
import { moderationNanoGPTParameterProperties } from './descriptions/parameter-properties-moderation';
import { dispatchNanoGPTOperation } from './handlers/operation-dispatcher';

export interface NanoGptMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export class NanoGpt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'NanoGPT',
		name: 'nanoGpt',
		icon: 'file:nano-gpt.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'NanoGPT AI API for text, image, video, and audio generation',
		defaults: {
			name: 'NanoGPT',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'nanoGPTApi',
				required: true,
			},
		],
		codex: {
			categories: ['Development'],
			subcategories: {
				Development: ['Language Models', 'Image Generation', 'Speech & Audio'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.nano-gpt.com/introduction',
					},
				],
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'AI Detection',
						value: 'aiDetection',
						description: 'AI-text and plagiarism detection',
					},
					{
						name: 'Balance & Subscription',
						value: 'balance',
						description: 'Balance and subscription management',
					},
					{
						name: 'Chat',
						value: 'chat',
						description: 'Chat completion and conversation APIs',
					},
					{
						name: 'Context Memory',
						value: 'contextMemory',
						description: 'Context memory APIs',
					},
					{
						name: 'Embedding',
						value: 'embeddings',
						description: 'Text embedding APIs',
					},
					{
						name: 'Image Generation',
						value: 'imageGeneration',
						description: 'Image generation APIs',
					},
					{
						name: 'Message',
						value: 'messages',
						description: 'Messages token counting APIs',
					},
					{
						name: 'Midjourney',
						value: 'midjourney',
						description: 'Midjourney generation status',
					},
					{
						name: 'Model',
						value: 'models',
						description: 'Model management APIs',
					},
					{
						name: 'Moderation',
						value: 'moderation',
						description: 'Content moderation and safety classification',
					},
					{
						name: 'Nano Crypto',
						value: 'nanoCrypto',
						description: 'Nano cryptocurrency operations',
					},
					{
						name: 'Speech-to-Text',
						value: 'speechToText',
						description: 'Audio transcription APIs',
					},
					{
						name: 'TEE Verification',
						value: 'tee',
						description: 'Trusted Execution Environment verification',
					},
					{
						name: 'Text Generation',
						value: 'textGeneration',
						description: 'Text completion and generation APIs',
					},
					{
						name: 'Text-to-Speech',
						value: 'textToSpeech',
						description: 'Text-to-speech APIs',
					},
					{
						name: 'Usage',
						value: 'usage',
						description: 'API usage statistics',
					},
					{
						name: 'Video Generation',
						value: 'videoGeneration',
						description: 'Video generation APIs',
					},
					{
						name: 'Web Scraping',
						value: 'webScraping',
						description: 'Web scraping APIs',
					},
					{
						name: 'Web Search',
						value: 'webSearch',
						description: 'Web search APIs',
					},
				],
				default: 'chat',
			},
			...chatNanoGPTParameterProperties,
			...textGenerationNanoGPTParameterProperties,
			...imageNanoGPTParameterProperties,
			...videoNanoGPTParameterProperties,
			...sttNanoGPTParameterProperties,
			...ttsNanoGPTParameterProperties,
			...embeddingsNanoGPTParameterProperties,
			...webNanoGPTParameterProperties,
			...modelsNanoGPTParameterProperties,
			...memoryNanoGPTParameterProperties,
			...teeNanoGPTParameterProperties,
			...midjourneyNanoGPTParameterProperties,
			...balanceNanoGPTParameterProperties,
			...nanoCryptoNanoGPTParameterProperties,
			...messagesNanoGPTParameterProperties,
			...usageNanoGPTParameterProperties,
			...aiDetectionNanoGPTParameterProperties,
			...moderationNanoGPTParameterProperties,
		],
	};

	methods = {
		loadOptions: {
			async getTextModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('nanoGPTApi');
				const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/models`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});

					const models = response.data || [];
					return models.map((model: { id: string }) => ({
						name: model.id,
						value: model.id,
					}));
				} catch {
					return [
						{ name: 'openai/gpt-4o', value: 'openai/gpt-4o' },
						{ name: 'claude-3-5-sonnet-20241022', value: 'claude-3-5-sonnet-20241022' },
					];
				}
			},

			async getImageModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('nanoGPTApi');
				const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/models`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});

					const imageModels = response.models?.image || {};
					const models: INodePropertyOptions[] = [];

					for (const [modelId, modelData] of Object.entries(imageModels)) {
						const data = modelData as { name: string; model: string };
						models.push({ name: data.name || modelId, value: data.model });
					}

					return models.length > 0
						? models.sort((a, b) => a.name.localeCompare(b.name))
						: [];
				} catch {
					return [
						{ name: 'Nano Banana Pro', value: 'nano-banana-pro' },
						{ name: 'Nano Banana', value: 'nano-banana' },
						{ name: 'Flux Schnell', value: 'flux-schnell' },
						{ name: 'Flux Kontext', value: 'flux-kontext' },
						{ name: 'DALL-E 3', value: 'dall-e-3' },
						{ name: 'GPT Image 1', value: 'gpt-image-1' },
						{ name: 'HiDream', value: 'hidream' },
						{ name: 'Stable Diffusion XL', value: 'fast-sdxl' },
						{ name: 'Midjourney', value: 'midjourney' },
					];
				}
			},

			async getVideoModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('nanoGPTApi');
				const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/models`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});

					const videoModels = response.models?.video || {};
					const models: INodePropertyOptions[] = [];

					for (const [modelId, modelData] of Object.entries(videoModels)) {
						const data = modelData as { name?: string };
						models.push({ name: data.name || modelId, value: modelId });
					}

					return models.length > 0
						? models.sort((a, b) => a.name.localeCompare(b.name))
						: [];
				} catch {
					return [
						{ name: 'VEO 2', value: 'veo2-video' },
						{ name: 'VEO 3', value: 'veo3-video' },
						{ name: 'Sora 2', value: 'sora-2' },
						{ name: 'Kling Video V2', value: 'kling-video-v2' },
						{ name: 'MiniMax Video', value: 'minimax-video' },
						{ name: 'Hunyuan Video', value: 'hunyuan-video' },
					];
				}
			},

			async getTTSModels(): Promise<INodePropertyOptions[]> {
				return [
					{ name: 'Kokoro 82M ($0.10/1M Chars)', value: 'Kokoro-82m' },
					{ name: 'Elevenlabs Turbo V2.5 ($0.30/1000 Chars)', value: 'Elevenlabs-Turbo-V2.5' },
					{ name: 'OpenAI TTS-1 ($15/1M Chars)', value: 'tts-1' },
					{ name: 'OpenAI TTS-1 HD ($30/1M Chars)', value: 'tts-1-hd' },
					{ name: 'GPT-4o Mini TTS ($10/1M Chars)', value: 'gpt-4o-mini-tts' },
				];
			},

			async getSTTModels(): Promise<INodePropertyOptions[]> {
				return [
					{ name: 'Whisper Large V3 ($0.01/min)', value: 'Whisper-Large-V3' },
					{ name: 'Wizper ($0.01/min)', value: 'Wizper' },
					{ name: 'Elevenlabs STT ($0.03/min, Async)', value: 'Elevenlabs-STT' },
					{ name: 'GPT-4o Mini Transcribe ($0.003/min)', value: 'gpt-4o-mini-transcribe' },
					{ name: 'OpenAI Whisper Video ($0.06/min)', value: 'openai-whisper-with-video' },
				];
			},

			async getTTSVoices(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const model = this.getNodeParameter('ttsModel') as string;

				const openaiModels = ['tts-1', 'tts-1-hd', 'gpt-4o-mini-tts'];
				const elevenlabsModels = ['Elevenlabs-Turbo-V2.5', 'Elevenlabs-V3'];
				const kokoroModels = ['Kokoro-82m'];

				if (openaiModels.includes(model)) {
					return [
						{ name: 'Alloy', value: 'alloy' },
						{ name: 'Ash', value: 'ash' },
						{ name: 'Ballad', value: 'ballad' },
						{ name: 'Coral', value: 'coral' },
						{ name: 'Echo', value: 'echo' },
						{ name: 'Fable', value: 'fable' },
						{ name: 'Nova', value: 'nova' },
						{ name: 'Onyx', value: 'onyx' },
						{ name: 'Sage', value: 'sage' },
						{ name: 'Shimmer', value: 'shimmer' },
						{ name: 'Verse', value: 'verse' },
					];
				}

				if (elevenlabsModels.includes(model)) {
					return [
						{ name: 'Rachel', value: 'Rachel' },
						{ name: 'Adam', value: 'Adam' },
						{ name: 'Bella', value: 'Bella' },
						{ name: 'Brian', value: 'Brian' },
						{ name: 'Sarah', value: 'Sarah' },
						{ name: 'Michael', value: 'Michael' },
						{ name: 'Emily', value: 'Emily' },
						{ name: 'James', value: 'James' },
						{ name: 'Nicole', value: 'Nicole' },
					];
				}

				if (kokoroModels.includes(model)) {
					return [
						{ name: 'Af_bella (American Female)', value: 'af_bella' },
						{ name: 'Af_nova (American Female)', value: 'af_nova' },
						{ name: 'Af_aoede (American Female)', value: 'af_aoede' },
						{ name: 'Af_jessica (American Female)', value: 'af_jessica' },
						{ name: 'Af_sarah (American Female)', value: 'af_sarah' },
						{ name: 'Am_adam (American Male)', value: 'am_adam' },
						{ name: 'Am_onyx (American Male)', value: 'am_onyx' },
						{ name: 'Am_eric (American Male)', value: 'am_eric' },
						{ name: 'Am_liam (American Male)', value: 'am_liam' },
						{ name: 'Bf_alice (British Female)', value: 'bf_alice' },
						{ name: 'Bf_emma (British Female)', value: 'bf_emma' },
						{ name: 'Bm_daniel (British Male)', value: 'bm_daniel' },
						{ name: 'Bm_george (British Male)', value: 'bm_george' },
						{ name: 'Jf_alpha (Japanese Female)', value: 'jf_alpha' },
						{ name: 'Zf_xiaoxiao (Chinese Female)', value: 'zf_xiaoxiao' },
						{ name: 'Ff_siwis (French Female)', value: 'ff_siwis' },
						{ name: 'Im_nicola (Italian Male)', value: 'im_nicola' },
					];
				}

				return [
					{ name: 'Alloy', value: 'alloy' },
					{ name: 'Nova', value: 'nova' },
					{ name: 'Shimmer', value: 'shimmer' },
				];
			},

			async getEmbeddingModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('nanoGPTApi');
				const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
				try {
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/embedding-models`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});

					if (response.data && Array.isArray(response.data)) {
						return response.data.map((model: { id: string; name?: string }) => ({
							name: model.name || model.id,
							value: model.id,
						}));
					}

					return [];
				} catch {
					return [
						{ name: 'text-embedding-3-small', value: 'text-embedding-3-small' },
						{ name: 'text-embedding-3-large', value: 'text-embedding-3-large' },
						{ name: 'text-embedding-ada-002', value: 'text-embedding-ada-002' },
						{ name: 'BAAI/bge-M3', value: 'BAAI/bge-m3' },
						{ name: 'jina-embeddings-v3', value: 'jina-embeddings-v3' },
					];
				}
			},

			async getVideoDurations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const model = this.getNodeParameter('videoModel') as string;
				if (!model) return [{ name: '5 Seconds', value: '5' }];
				try {
					const credentials = await this.getCredentials('nanoGPTApi');
					const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/video-models?detailed=true`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});
					const modelData = response.data?.find((m: { id: string }) => m.id === model);
					const opts = modelData?.supported_parameters?.parameters?.duration?.options;
					if (opts) return opts.map((o: { value: string; label: string }) => ({ name: o.label, value: o.value }));
				} catch { /* fall through to defaults */ }
				return [{ name: '5 Seconds', value: '5' }, { name: '10 Seconds', value: '10' }];
			},

			async getVideoResolutions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const model = this.getNodeParameter('videoModel') as string;
				if (!model) return [{ name: '720p', value: '720p' }];
				try {
					const credentials = await this.getCredentials('nanoGPTApi');
					const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/video-models?detailed=true`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});
					const modelData = response.data?.find((m: { id: string }) => m.id === model);
					const opts = modelData?.supported_parameters?.parameters?.resolution?.options;
					if (opts) return opts.map((o: { value: string; label: string }) => ({ name: o.label, value: o.value }));
				} catch { /* fall through to defaults */ }
				return [{ name: '720p', value: '720p' }, { name: '1080p', value: '1080p' }];
			},

			async getVideoAspectRatios(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const model = this.getNodeParameter('videoModel') as string;
				if (!model) return [{ name: '16:9', value: '16:9' }];
				try {
					const credentials = await this.getCredentials('nanoGPTApi');
					const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/video-models?detailed=true`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});
					const modelData = response.data?.find((m: { id: string }) => m.id === model);
					const opts = modelData?.supported_parameters?.parameters?.aspect_ratio?.options;
					if (opts) return opts.map((o: { value: string; label: string }) => ({ name: o.label, value: o.value }));
				} catch { /* fall through to defaults */ }
				return [
					{ name: '16:9', value: '16:9' },
					{ name: '9:16', value: '9:16' },
					{ name: '1:1', value: '1:1' },
				];
			},

			async getModerationModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const credentials = await this.getCredentials('nanoGPTApi');
					const baseUrl = credentials.baseUrl === 'custom' ? credentials.customBaseUrl : credentials.baseUrl;
					const response = await this.helpers.httpRequest({
						method: 'GET',
						url: `${baseUrl}/api/v1/moderation-models`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'x-api-key': credentials.apiKey as string,
						},
						json: true,
					});
					const models = response.data || [];
					return models.map((m: { id: string }) => ({ name: m.id, value: m.id }));
				} catch { /* fall through to defaults */ }
				return [];
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				const credentials = await this.getCredentials('nanoGPTApi', i);
				const client = new NanoGPTClient(this, credentials);

				const responseData = await dispatchNanoGPTOperation({
					executeFunctions: this,
					operation,
					itemIndex: i,
					client,
				});

				returnData.push({ json: responseData, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
							input: items[i].json,
						},
						pairedItem: { item: i },
					});
				} else {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
