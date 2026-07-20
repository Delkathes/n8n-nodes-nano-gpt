/* eslint-disable n8n-nodes-base/node-param-options-type-unsorted-items, n8n-nodes-base/node-param-description-boolean-without-whether */
import type { INodeProperties } from 'n8n-workflow';

export const modelsNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['models'],
			},
		},
		options: [
			{
				name: 'List Models',
				value: 'listModels',
				description: 'List available models',
				action: 'List models',
			},
			{
				name: 'Personalized Models',
				value: 'personalizedModels',
				description: 'List personalized models',
				action: 'Personalized models',
			},
			{
				name: 'List Subscription Models',
				value: 'subscriptionModels',
				description: 'List subscription-included models',
				action: 'List subscription models',
			},
			{
				name: 'List Paid Models',
				value: 'paidModels',
				description: 'List paid/premium models',
				action: 'List paid models',
			},
			{
				name: 'List Embedding Models',
				value: 'embeddingModels',
				description: 'List available embedding models',
				action: 'List embedding models',
			},
		],
		default: 'listModels',
	},

	{
		displayName: 'Detailed Information',
		name: 'detailed',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['models'],
			},
		},
		default: false,
		description: 'Include detailed model information with pricing',
	},
];
