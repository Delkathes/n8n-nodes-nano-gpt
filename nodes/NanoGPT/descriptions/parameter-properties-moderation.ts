import type { INodeProperties } from 'n8n-workflow';

export const moderationNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['moderation'],
			},
		},
		options: [
			{
				name: 'Classify Content',
				value: 'moderate',
				description: 'Classify text or image content for safety',
				action: 'Classify content',
			},
			{
				name: 'List Models',
				value: 'listModerationModels',
				description: 'List available moderation models with capabilities and pricing',
				action: 'List moderation models',
			},
		],
		default: 'moderate',
	},

	{
		displayName: 'Model Name or ID',
		name: 'moderationModel',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getModerationModels',
		},
		displayOptions: {
			show: {
				resource: ['moderation'],
				operation: ['moderate'],
			},
		},
		default: '',
		description: 'Moderation model to use. Leave empty to use the default model. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Input',
		name: 'moderationInput',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['moderation'],
				operation: ['moderate'],
			},
		},
		default: '"Text to classify for safety."',
		description: 'Content to classify. Can be a string, array of strings, or array of content parts: [{ type: "text", text: "..." }, { type: "image_url", image_url: { URL: "..." } }].',
	},

	{
		displayName: 'Detailed',
		name: 'detailed',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['moderation'],
				operation: ['listModerationModels'],
			},
		},
		default: true,
		description: 'Whether to return detailed model information with capabilities and pricing',
	},
];
