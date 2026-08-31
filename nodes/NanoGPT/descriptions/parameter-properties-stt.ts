/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items, n8n-nodes-base/node-param-description-boolean-without-whether */
import type { INodeProperties } from 'n8n-workflow';

export const sttNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['speechToText'],
			},
		},
		options: [
			{
				name: 'Transcribe Audio',
				value: 'transcribe',
				description: 'Convert audio to text',
				action: 'Transcribe audio',
			},
			{
				name: 'YouTube Transcription',
				value: 'youtubeTranscribe',
				description: 'Transcribe YouTube video',
				action: 'Transcribe you tube',
			},
			{
				name: 'Get Speech-to-Text Status',
				value: 'speechToTextStatus',
				description: 'Get speech-to-text transcription status',
				action: 'Get STT status',
			},
		],
		default: 'transcribe',
	},

	{
		displayName: 'Audio File',
		name: 'audioFile',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['transcribe'],
			},
		},
		default: '',
		description: 'Base64 encoded audio file or URL',
	},

	{
		displayName: 'Model Name or ID',
		name: 'sttModel',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getSTTModels',
		},
		displayOptions: {
			show: {
				operation: ['transcribe'],
			},
		},
		default: 'Whisper-Large-V3',
		description: 'Speech-to-text model. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Advanced Options',
		name: 'sttAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['transcribe'],
			},
		},
		options: [
			{
				displayName: 'Actual Duration (Minutes)',
				name: 'actualDuration',
				type: 'number',
				default: 0,
				description: 'Actual audio duration for accurate billing',
			},
			{
				displayName: 'Audio Content Type',
				name: 'audioContentType',
				type: 'string',
				default: '',
				placeholder: 'audio/mpeg',
				description: 'MIME type of the audio (e.g. audio/wav, audio/mpeg). Use JSON from TTS nodes for automatic detection.',
			},
			{
				displayName: 'Enable Speaker Diarization',
				name: 'diarize',
				type: 'boolean',
				default: false,
				description: 'Identify different speakers (Elevenlabs-STT only)',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'Auto Detect', value: 'auto' },
					{ name: 'English', value: 'en' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Chinese', value: 'zh' },
					{ name: 'Japanese', value: 'ja' },
					{ name: 'Arabic', value: 'ar' },
					{ name: 'Portuguese', value: 'pt' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Korean', value: 'ko' },
					{ name: 'Russian', value: 'ru' },
					{ name: 'Hindi', value: 'hi' },
				],
				default: 'auto',
				description: 'Language of the audio (97+ supported)',
			},
			{
				displayName: 'Tag Audio Events',
				name: 'tagAudioEvents',
				type: 'boolean',
				default: false,
				description: 'Tag non-speech audio events like [laughter] (Elevenlabs-STT only)',
			},
		],
	},

	{
		displayName: 'YouTube URL',
		name: 'youtubeUrl',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['youtubeTranscribe'],
			},
		},
		default: '',
		placeholder: 'https://youtube.com/watch?v=...',
		description: 'YouTube video URL to transcribe',
	},

	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['speechToTextStatus'],
			},
		},
		default: '',
		description: 'Speech-to-text task ID to check status',
	},
];
