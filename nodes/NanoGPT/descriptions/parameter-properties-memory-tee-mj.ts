 
import type { INodeProperties } from 'n8n-workflow';

export const memoryNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contextMemory'],
			},
		},
		options: [
			{
				name: 'Compress Memory',
				value: 'compressMemory',
				description: 'Compress chat history into a summary using vector memory',
				action: 'Compress memory',
			},
		],
		default: 'compressMemory',
	},

	{
		displayName: 'Messages',
		name: 'compressMessages',
		type: 'json',
		displayOptions: {
			show: {
				operation: ['compressMemory'],
			},
		},
		default: '[]',
		placeholder: '[{"role": "user", "content": "Hello"}, {"role": "assistant", "content": "Hi there!"}]',
		description: 'Array of chat messages to compress into memory',
	},

	{
		displayName: 'Model',
		name: 'compressModel',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['compressMemory'],
			},
		},
		default: 'gpt-4.1-nano',
		description: 'Model to use for memory compression',
	},

	{
		displayName: 'Memory Key',
		name: 'memoryKey',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['compressMemory'],
			},
		},
		default: '',
		placeholder: 'my-conversation-ID',
		description: 'Optional unique key to identify this memory session',
	},
];

export const teeNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tee'],
			},
		},
		options: [
			{
				name: 'Get TEE Attestation',
				value: 'teeAttestation',
				description: 'Get Trusted Execution Environment attestation',
				action: 'Get TEE attestation',
			},
			{
				name: 'Get TEE Signature',
				value: 'teeSignature',
				description: 'Get Trusted Execution Environment signature',
				action: 'Get TEE signature',
			},
		],
		default: 'teeAttestation',
	},
];

export const midjourneyNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['midjourney'],
			},
		},
		options: [
			{
				name: 'Check Midjourney Status',
				value: 'midjourneyStatus',
				description: 'Check Midjourney generation status',
				action: 'Check midjourney status',
			},
		],
		default: 'midjourneyStatus',
	},

	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['midjourney'],
			},
		},
		default: '',
		description: 'Midjourney job ID',
	},
];
