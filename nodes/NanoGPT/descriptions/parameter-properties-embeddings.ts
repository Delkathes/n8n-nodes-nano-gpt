 
import type { INodeProperties } from 'n8n-workflow';

export const embeddingsNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['embeddings'],
			},
		},
		options: [
			{
				name: 'Create Embedding',
				value: 'createEmbedding',
				description: 'Create text embeddings',
				action: 'Create embedding',
			},
			{
				name: 'Get Embedding Models',
				value: 'getEmbeddingModels',
				description: 'List embedding models',
				action: 'Get embedding models',
			},
		],
		default: 'createEmbedding',
	},

	{
		displayName: 'Input',
		name: 'input',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createEmbedding'],
			},
		},
		default: '',
		placeholder: 'Text to embed',
		description: 'Text to create embeddings for (string or array of strings)',
	},

	{
		displayName: 'Model Name or ID',
		name: 'embeddingModel',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getEmbeddingModels',
		},
		displayOptions: {
			show: {
				operation: ['createEmbedding'],
			},
		},
		default: 'text-embedding-3-small',
		description: 'Embedding model to use. Models are dynamically loaded from the API. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Advanced Options',
		name: 'embeddingAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['createEmbedding'],
			},
		},
		options: [
			{
				displayName: 'Dimensions',
				name: 'dimensions',
				type: 'number',
				default: 0,
				description: 'Reduce embedding dimensions (supported models only). Leave 0 for full dimensions.',
			},
			{
				displayName: 'Encoding Format',
				name: 'encoding_format',
				type: 'options',
				options: [
					{ name: 'Float', value: 'float' },
					{ name: 'Base64', value: 'base64' },
				],
				default: 'float',
				description: 'Output encoding format',
			},
		],
	},
];
