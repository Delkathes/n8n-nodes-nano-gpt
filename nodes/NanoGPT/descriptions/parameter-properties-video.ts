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
				typeOptions: {
					loadOptionsMethod: 'getVideoDurations',
					loadOptionsDependsOn: ['videoModel'],
				},
				default: '5',
				description: 'Video duration (options depend on selected model)',
			},
			{
				displayName: 'Aspect Ratio',
				name: 'aspect_ratio',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getVideoAspectRatios',
					loadOptionsDependsOn: ['videoModel'],
				},
				default: '16:9',
				description: 'Video aspect ratio (options depend on selected model)',
			},
			{
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getVideoResolutions',
					loadOptionsDependsOn: ['videoModel'],
				},
				default: '720p',
				description: 'Output resolution (options depend on selected model)',
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
		displayName: 'Video ID / Request ID',
		name: 'videoId',
		type: 'string',
		displayOptions: {
			show: {
				operation: [
					'checkVideoStatus',
				],
			},
		},
		default: '',
		placeholder: 'video_abc123',
		description: 'Video or request ID to check status',
	},

	{
		displayName:
			'Get Video Content only works with Sora 2 (<code>sora-2</code>). Use the "Generate Video" node with Sora 2 first to obtain a run ID.',
		name: 'videoContentNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: ['getVideoContent'],
			},
		},
	},

	{
		displayName: 'Sora 2 Run ID',
		name: 'videoId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getVideoContent'],
			},
		},
		default: '',
		placeholder: 'vid_abc123',
		description: 'Run ID from a Sora 2 video generation request',
		required: true,
	},

	{
		displayName: 'Variant',
		name: 'videoContentVariant',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['getVideoContent'],
			},
		},
		options: [
			{ name: 'Video', value: 'video' },
			{ name: 'Thumbnail', value: 'thumbnail' },
			{ name: 'Spritesheet', value: 'spritesheet' },
		],
		default: 'video',
		description: 'Type of content to retrieve',
	},

	{
		displayName:
			'Task-based Extend Video is only for Midjourney videos. For all other extend models (Wan, Veo, Seedance), use the Generate Video node directly with an extend model.',
		name: 'extendVideoNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: ['extendVideo'],
			},
		},
	},

	{
		displayName: 'Midjourney Task ID',
		name: 'videoId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['extendVideo'],
			},
		},
		default: '',
		placeholder: 'vid_m1abc123def456',
		description: 'Run ID or Task ID from the original Midjourney video request',
		required: true,
	},

	{
		displayName: 'Video Index',
		name: 'extendVideoIndex',
		type: 'options',
		displayOptions: {
			show: {
				operation: ['extendVideo'],
			},
		},
		options: [
			{ name: 'Video 1 (index 0)', value: 0 },
			{ name: 'Video 2 (index 1)', value: 1 },
			{ name: 'Video 3 (index 2)', value: 2 },
			{ name: 'Video 4 (index 3)', value: 3 },
		],
		default: 0,
		description: 'Which of the 4 Midjourney videos to extend (0-3)',
	},

	{
		displayName: 'Model (Optional)',
		name: 'videoId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['recoverVideo'],
			},
		},
		default: '',
		placeholder: 'sora-2',
		description: 'Filter recovered runs by model, or leave empty for all',
	},

	{
		displayName: 'Max Results',
		name: 'recoverVideoLimit',
		type: 'number',
		displayOptions: {
			show: {
				operation: ['recoverVideo'],
			},
		},
		default: 10,
		description: 'Maximum number of runs to recover (1-50, default 10)',
		typeOptions: {
			minValue: 1,
			maxValue: 50,
		},
	},
];
