import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NanoGPTApi implements ICredentialType {
	name = 'nanoGPTApi';
	displayName = 'NanoGPT API';
	icon = 'file:nano-gpt.svg' as const;
	documentationUrl = 'https://docs.nano-gpt.com/introduction';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your NanoGPT API key',
			placeholder: 'sk-...',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'options',
			options: [
				{
					name: 'nano-gpt.com (Default)',
					value: 'https://nano-gpt.com',
				},
				{
					name: 'ai.bitcoin.com',
					value: 'https://ai.bitcoin.com',
				},
				{
					name: 'bcashgpt.com',
					value: 'https://bcashgpt.com',
				},
				{
					name: 'cake.nano-gpt.com',
					value: 'https://cake.nano-gpt.com',
				},
				{
					name: 'Custom',
					value: 'custom',
				},
			],
			default: 'https://nano-gpt.com',
			description: 'NanoGPT API base URL',
		},
		{
			displayName: 'Custom Base URL',
			name: 'customBaseUrl',
			type: 'string',
			displayOptions: {
				show: {
					baseUrl: ['custom'],
				},
			},
			default: '',
			placeholder: 'https://your-custom-domain.com',
			description: 'Custom NanoGPT API base URL',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: 'Bearer {{$credentials.apiKey}}',
				'Content-Type': 'application/json',
				'x-api-key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL:
				'={{$credentials.baseUrl === "custom" ? $credentials.customBaseUrl : $credentials.baseUrl}}',
			url: '/api/v1/models',
			method: 'GET',
		},
	};
}
