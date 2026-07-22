 
import type { INodeProperties } from 'n8n-workflow';

export const messagesNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['messages'],
			},
		},
		options: [
			{
				name: 'Count Tokens',
				value: 'countTokens',
				description: 'Estimate input tokens for messages (Anthropic format)',
				action: 'Count tokens',
			},
		],
		default: 'countTokens',
	},

	{
		displayName: 'Model Name or ID',
		name: 'messageModel',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTextModels',
		},
		displayOptions: {
			show: {
				resource: ['messages'],
				operation: ['countTokens'],
			},
		},
		default: 'openai/gpt-4o',
		description: 'The model to use for token counting. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Messages (JSON)',
		name: 'messages',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['messages'],
				operation: ['countTokens'],
			},
		},
		default: '[{"role":"user","content":"Hello"}]',
		description: 'Messages in Anthropic format: [{ "role": "user", "content": "..." }]',
	},

	{
		displayName: 'Count Tokens Options',
		name: 'countTokensOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['messages'],
				operation: ['countTokens'],
			},
		},
		options: [
			{
				displayName: 'System Prompt',
				name: 'system',
				type: 'string',
				default: '',
				description: 'System prompt for the messages',
			},
			{
				displayName: 'Tools (JSON)',
				name: 'tools',
				type: 'json',
				default: '[]',
				description: 'Tool definitions in Anthropic format',
			},
			{
				displayName: 'Tool Choice',
				name: 'toolChoice',
				type: 'string',
				default: '',
				description: 'Tool choice specification (e.g. "auto" or a specific tool name)',
			},
		],
	},
];
