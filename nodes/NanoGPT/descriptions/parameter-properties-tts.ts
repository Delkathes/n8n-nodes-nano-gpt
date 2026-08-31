/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items, n8n-nodes-base/node-param-options-type-unsorted-items */
import type { INodeProperties } from 'n8n-workflow';

export const ttsNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['textToSpeech'],
			},
		},
		options: [
			{
				name: 'Generate Speech (Async)',
				value: 'generateSpeech',
				description: 'Convert text to speech asynchronously',
				action: 'Generate speech async',
			},
			{
				name: 'Generate Speech (Sync)',
				value: 'synchronousTTS',
				description: 'Convert text to speech and return audio directly',
				action: 'Generate speech sync',
			},
			{
				name: 'Get TTS Status',
				value: 'ttsStatus',
				description: 'Get text-to-speech generation status',
				action: 'Get TTS status',
			},
		],
		default: 'generateSpeech',
	},

	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['generateSpeech', 'synchronousTTS'],
			},
		},
		default: '',
		placeholder: 'Hello world',
		description: 'Text to convert to speech',
	},

	{
		displayName: 'Model Name or ID',
		name: 'ttsModel',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTTSModels',
		},
		displayOptions: {
			show: {
				operation: ['generateSpeech', 'synchronousTTS'],
			},
		},
		default: 'Kokoro-82m',
		description: 'Text-to-speech model. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Voice Name or ID',
		name: 'voice',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTTSVoices',
			loadOptionsDependsOn: ['ttsModel'],
		},
		displayOptions: {
			show: {
				operation: ['generateSpeech', 'synchronousTTS'],
			},
		},
		default: 'alloy',
		description: 'Voice ID (varies by model). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Advanced Options',
		name: 'ttsAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['generateSpeech', 'synchronousTTS'],
			},
		},
		options: [
			{
				displayName: 'Speed',
				name: 'speed',
				type: 'number',
				typeOptions: { minValue: 0.5, maxValue: 2.0, numberPrecision: 2 },
				default: 1.0,
				description: 'Playback speed (0.5-2.0)',
			},
			{
				displayName: 'Response Format',
				name: 'response_format',
				type: 'options',
				options: [
					{ name: 'MP3', value: 'mp3' },
					{ name: 'WAV', value: 'wav' },
					{ name: 'OPUS', value: 'opus' },
					{ name: 'FLAC', value: 'flac' },
					{ name: 'AAC', value: 'aac' },
				],
				default: 'mp3',
				description: 'Audio output format (OpenAI models only)',
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				placeholder: 'Speak slowly and clearly with a warm tone',
				description: 'Voice style instructions (OpenAI models only)',
			},
			{
				displayName: 'Enable Streaming',
				name: 'stream',
				type: 'boolean',
				default: false,
				description: 'Whether to return chunked audio bytes progressively (sync mode, OpenAI/Elevenlabs TTS only)',
				displayOptions: {
					show: {
						'/operation': ['synchronousTTS'],
					},
				},
			},
			{
				displayName: 'Stability (Elevenlabs)',
				name: 'stability',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.5,
				description: 'Voice stability — higher = more consistent (Elevenlabs async only)',
				displayOptions: {
					show: {
						'/operation': ['generateSpeech'],
					},
				},
			},
			{
				displayName: 'Similarity Boost (Elevenlabs)',
				name: 'similarity_boost',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0.75,
				description: 'Voice similarity boost (Elevenlabs async only)',
				displayOptions: {
					show: {
						'/operation': ['generateSpeech'],
					},
				},
			},
			{
				displayName: 'Style (Elevenlabs)',
				name: 'style',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 2 },
				default: 0,
				description: 'Style exaggeration (Elevenlabs async only)',
				displayOptions: {
					show: {
						'/operation': ['generateSpeech'],
					},
				},
			},
		],
	},

	{
		displayName: 'Task ID',
		name: 'ttsTaskId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['ttsStatus'],
			},
		},
		default: '',
		description: 'TTS task ID to check status',
	},
	{
		displayName: 'Advanced Options',
		name: 'ttsStatusAdvancedOptions',
		type: 'collection',
		displayOptions: {
			show: {
				operation: ['ttsStatus'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Cost',
				name: 'cost',
				type: 'number',
				default: 0,
				description: 'Echo the cost value from the initial 202 response to enable automatic refunds',
			},
			{
				displayName: 'Payment Source',
				name: 'paymentSource',
				type: 'string',
				default: '',
				description: 'Echo the paymentSource from the initial 202 response to enable automatic refunds',
			},
			{
				displayName: 'Is API Request',
				name: 'isApiRequest',
				type: 'boolean',
				default: false,
				description: 'Whether to echo isApiRequest from the initial 202 response',
			},
		],
	},
];
