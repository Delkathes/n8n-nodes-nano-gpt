 
import type { INodeProperties } from 'n8n-workflow';

export const usageNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['usage'],
			},
		},
		options: [
			{
				name: 'Get Usage',
				value: 'getUsage',
				description: 'Get aggregate API usage statistics',
				action: 'Get usage',
			},
		],
		default: 'getUsage',
	},

	{
		displayName: 'Usage Options',
		name: 'usageOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['usage'],
				operation: ['getUsage'],
			},
		},
		options: [
			{
				displayName: 'API Key ID',
				name: 'apiKeyId',
				type: 'number',
				default: undefined,
				description: 'Optional current API key ID. Requests for another API key are rejected.',
			},
			{
				displayName: 'From Date',
				name: 'from',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'UTC start date. Defaults to 30 days ago.',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Day and Model', value: 'day,model' },
					{ name: 'Day', value: 'day' },
					{ name: 'Model', value: 'model' },
				],
				default: 'day,model',
				description: 'How to group the usage data',
			},
			{
				displayName: 'Scope',
				name: 'scope',
				type: 'options',
				options: [
					{ name: 'Current Key', value: 'current_key' },
					{ name: 'API Key', value: 'api_key' },
				],
				default: 'current_key',
				description: 'Usage scope, both values return the same result',
			},
			{
				displayName: 'To Date',
				name: 'to',
				type: 'string',
				default: '',
				placeholder: 'YYYY-MM-DD',
				description: 'UTC end date, inclusive. Cannot be in the future.',
			},
		],
	},
];
