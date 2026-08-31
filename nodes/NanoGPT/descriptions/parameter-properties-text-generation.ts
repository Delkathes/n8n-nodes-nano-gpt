 
import type { INodeProperties } from 'n8n-workflow';

export const textGenerationNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['textGeneration'],
			},
		},
		options: [
			{
				name: 'Completion',
				value: 'completion',
				description: 'Generate text completions',
				action: 'Generate text completion',
			},
		],
		default: 'completion',
	},

	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['completion'],
			},
		},
		default: '',
		description: 'Text prompt for completion',
	},

	{
		displayName: 'Model Name or ID',
		name: 'model',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTextModels',
		},
		displayOptions: {
			show: {
				operation: ['completion'],
			},
		},
		default: 'openai/gpt-4o',
		description: 'Text completion model to use. Models are dynamically loaded from the API. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Advanced Options',
		name: 'completionAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['completion'],
			},
		},
		options: [
			{
				displayName: 'Max Tokens',
				name: 'max_tokens',
				type: 'number',
				default: 1000,
				description: 'Maximum number of tokens to generate',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				default: 0.7,
				description: 'Sampling temperature (0-2)',
				typeOptions: { minValue: 0, maxValue: 2, numberStepSize: 0.1 },
			},
			{
				displayName: 'Top P',
				name: 'top_p',
				type: 'number',
				default: 1,
				description: 'Nucleus sampling parameter',
				typeOptions: { minValue: 0, maxValue: 1, numberStepSize: 0.05 },
			},
			{
				displayName: 'Stop Sequences',
				name: 'stop',
				type: 'string',
				default: '',
				description: 'Comma-separated list of stop sequences',
			},
		],
	},
];
