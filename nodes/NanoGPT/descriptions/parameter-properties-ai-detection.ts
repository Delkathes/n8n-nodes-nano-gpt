import type { INodeProperties } from 'n8n-workflow';

export const aiDetectionNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['aiDetection'],
			},
		},
		options: [
			{
				name: 'Detect AI Text',
				value: 'aiDetection',
				description: 'Run AI-text or plagiarism detection on text',
				action: 'Detect AI text',
			},
		],
		default: 'aiDetection',
	},

	{
		displayName: 'Text',
		name: 'inputText',
		type: 'string',
		required: true,
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['aiDetection'],
				operation: ['aiDetection'],
			},
		},
		default: '',
		description: 'Text to analyze for AI detection or plagiarism',
	},

	{
		displayName: 'Detection Mode',
		name: 'detectionMode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['aiDetection'],
				operation: ['aiDetection'],
			},
		},
		options: [
			{ name: 'AI Detection', value: 'ai' },
			{ name: 'Plagiarism', value: 'plagiarism' },
		],
		default: 'ai',
		description: 'Detection mode. AI detects AI-generated text, Plagiarism detects copied text.',
	},
];
