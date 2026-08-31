/* eslint-disable n8n-nodes-base/node-param-collection-type-unsorted-items, n8n-nodes-base/node-param-options-type-unsorted-items, n8n-nodes-base/node-param-description-boolean-without-whether */
import type { INodeProperties } from 'n8n-workflow';

export const webNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webScraping'],
			},
		},
		options: [
			{
				name: 'Scrape URLs',
				value: 'scrapeUrls',
				description: 'Scrape web page content',
				action: 'Scrape ur ls',
			},
		],
		default: 'scrapeUrls',
	},

	{
		displayName: 'URLs',
		name: 'urls',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['scrapeUrls'],
			},
		},
		default: '',
		placeholder: 'https://example.com,https://example.org',
		description: 'Comma-separated list of URLs to scrape (maximum 5 URLs per request)',
	},

	{
		displayName: 'Advanced Options',
		name: 'scrapeAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['scrapeUrls'],
			},
		},
		options: [
			{
				displayName: 'Stealth Mode',
				name: 'stealthMode',
				type: 'boolean',
				default: false,
				description: 'Route requests through stealth proxy for tougher targets. Costs 5x the standard per-URL rate ($0.005 instead of $0.001).',
			},
		],
	},

	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webSearch'],
			},
		},
		options: [
			{
				name: 'Web Search',
				value: 'webSearch',
				description: 'Search the web',
				action: 'Web search',
			},
		],
		default: 'webSearch',
	},

	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				operation: ['webSearch'],
			},
		},
		default: '',
		placeholder: 'What is NanoGPT?',
		description: 'Search query',
	},

	{
		displayName: 'Advanced Options',
		name: 'webSearchAdvancedOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['webSearch'],
			},
		},
		options: [
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				options: [
					{ name: 'Linkup', value: 'linkup' },
					{ name: 'Tavily', value: 'tavily' },
					{ name: 'Exa', value: 'exa' },
					{ name: 'Kagi', value: 'kagi' },
					{ name: 'Perplexity', value: 'perplexity' },
					{ name: 'Valyu', value: 'valyu' },
				],
				default: 'linkup',
				description: 'Search provider to use',
			},
			{
				displayName: 'Search Depth',
				name: 'depth',
				type: 'options',
				options: [
					{ name: 'Standard ($0.006/search)', value: 'standard' },
					{ name: 'Deep ($0.06/search)', value: 'deep' },
				],
				default: 'standard',
				description: 'Search depth - deep provides more comprehensive results',
			},
			{
				displayName: 'Output Type',
				name: 'outputType',
				type: 'options',
				options: [
					{ name: 'Search Results', value: 'searchResults' },
					{ name: 'Sourced Answer', value: 'sourcedAnswer' },
					{ name: 'Structured', value: 'structured' },
				],
				default: 'searchResults',
				description: 'Type of output to return',
			},
			{
				displayName: 'Structured Output Schema',
				name: 'structuredOutputSchema',
				type: 'json',
				default: '{}',
				description: 'JSON Schema for structured output (when outputType is "structured")',
				displayOptions: {
					show: {
						outputType: ['structured'],
					},
				},
			},
			{
				displayName: 'Include Images',
				name: 'includeImages',
				type: 'boolean',
				default: false,
				description: 'Include relevant images in results',
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'string',
				default: '',
				placeholder: '2024-01-01',
				description: 'Filter results from this date (YYYY-MM-DD)',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'string',
				default: '',
				placeholder: '2024-12-31',
				description: 'Filter results to this date (YYYY-MM-DD)',
			},
			{
				displayName: 'Include Domains',
				name: 'includeDomains',
				type: 'string',
				default: '',
				placeholder: 'example.com, docs.example.org',
				description: 'Comma-separated list of domains to include',
			},
			{
				displayName: 'Exclude Domains',
				name: 'excludeDomains',
				type: 'string',
				default: '',
				placeholder: 'spam.com, ads.example.org',
				description: 'Comma-separated list of domains to exclude',
			},
		],
	},
];
