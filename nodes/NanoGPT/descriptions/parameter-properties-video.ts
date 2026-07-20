/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items, n8n-nodes-base/node-param-options-type-unsorted-items, n8n-nodes-base/node-param-description-boolean-without-whether */
import type { INodeProperties } from 'n8n-workflow';

export const videoNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['videoGeneration'],
			},
		},
		options: [
			{
				name: 'Generate Video',
				value: 'generateVideo',
				description: 'Generate videos from text prompts',
				action: 'Generate video',
			},
			{
				name: 'Check Video Status',
				value: 'checkVideoStatus',
				description: 'Check video generation status',
				action: 'Check video status',
			},
			{
				name: 'Extend Video',
				value: 'extendVideo',
				description: 'Extend existing video',
				action: 'Extend video',
			},
			{
				name: 'Get Video Content',
				value: 'getVideoContent',
				action: 'Get video content',
			},
			{
				name: 'Get Unified Video Status',
				value: 'unifiedVideoStatus',
				description: 'Get unified video generation status',
				action: 'Get unified video status',
			},
			{
				name: 'Recover Video',
				value: 'recoverVideo',
				description: 'Recover video generation',
				action: 'Recover video',
			},
		],
		default: 'generateVideo',
	},

	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateVideo'],
			},
		},
		default: '',
		placeholder: 'A futuristic cityscape',
		description: 'Text description of the video to generate',
	},

	{
		displayName: 'Model Name or ID',
		name: 'videoModel',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getVideoModels',
		},
		displayOptions: {
			show: {
				operation: ['generateVideo'],
			},
		},
		default: 'veo2-video',
		description: 'Video generation model. Models are dynamically loaded from the API. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Advanced Options',
		name: 'videoAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['generateVideo'],
			},
		},
		options: [
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				options: [
					{ name: '5 Seconds', value: '5' },
					{ name: '5s (VEO Format)', value: '5s' },
					{ name: '8s (VEO Format)', value: '8s' },
					{ name: '10 Seconds', value: '10' },
					{ name: '30s (VEO Format)', value: '30s' },
				],
				default: '5',
				description: 'Video duration',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'aspect_ratio',
				type: 'options',
				options: [
					{ name: '16:9 (Landscape)', value: '16:9' },
					{ name: '9:16 (Portrait)', value: '9:16' },
					{ name: '1:1 (Square)', value: '1:1' },
					{ name: '4:3', value: '4:3' },
					{ name: '3:4', value: '3:4' },
				],
				default: '16:9',
				description: 'Video aspect ratio',
			},
			{
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				options: [
					{ name: '480p', value: '480p' },
					{ name: '720p', value: '720p' },
					{ name: '1080p', value: '1080p' },
				],
				default: '720p',
				description: 'Output resolution',
			},
			{
				displayName: 'Image URL (for I2V)',
				name: 'imageUrl',
				type: 'string',
				default: '',
				description: 'Public URL to source image for image-to-video',
			},
			{
				displayName: 'Image Data URL (for I2V)',
				name: 'imageDataUrl',
				type: 'string',
				default: '',
				description: 'Base64 data URL for source image (max 4MB)',
			},
			{
				displayName: 'Negative Prompt',
				name: 'negative_prompt',
				type: 'string',
				default: '',
				description: 'What to avoid in the video',
			},
			{
				displayName: 'Pro Mode',
				name: 'pro_mode',
				type: 'boolean',
				default: false,
				description: 'Enable pro/higher-quality mode (higher cost)',
			},
			{
				displayName: 'Generate Audio',
				name: 'generateAudio',
				type: 'boolean',
				default: false,
				description: 'Generate audio with video (VEO 3 only)',
			},
			{
				displayName: 'CFG Scale',
				name: 'cfg_scale',
				type: 'number',
				default: 0.5,
				description: 'Classifier-free guidance scale (0-1 for Kling)',
				typeOptions: { minValue: 0, maxValue: 1, numberStepSize: 0.1 },
			},
			{
				displayName: 'Number of Frames',
				name: 'num_frames',
				type: 'number',
				default: 81,
				description: 'Number of frames (for Wan/Hunyuan models)',
			},
			{
				displayName: 'Frames Per Second',
				name: 'frames_per_second',
				type: 'number',
				default: 16,
				description: 'Frames per second (5-24)',
				typeOptions: { minValue: 5, maxValue: 24 },
			},
			{
				displayName: 'Inference Steps',
				name: 'num_inference_steps',
				type: 'number',
				default: 30,
				description: 'Number of inference steps (quality vs speed)',
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: 0,
				description: 'Random seed for reproducibility (0 = random)',
			},
			{
				displayName: 'Camera Fixed',
				name: 'camera_fixed',
				type: 'boolean',
				default: false,
				description: 'Keep camera static (Seedance)',
			},
		],
	},

	{
		displayName: 'Video ID',
		name: 'videoId',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'checkVideoStatus',
					'extendVideo',
					'getVideoContent',
					'unifiedVideoStatus',
					'recoverVideo',
				],
			},
		},
		default: '',
		placeholder: 'video_abc123',
		description: 'Video ID to check, extend, or recover',
	},
];
