 
import type { INodeProperties } from 'n8n-workflow';

export const balanceNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['balance'],
			},
		},
		options: [
			{
				name: 'Check Balance',
				value: 'checkBalance',
				description: 'Check account balance',
				action: 'Check balance',
			},
			{
				name: 'Create Invitation',
				value: 'createInvitation',
				description: 'Create invitation for user',
				action: 'Create invitation',
			},
			{
				name: 'Get Subscription Usage',
				value: 'subscriptionUsage',
				description: 'Get subscription usage information',
				action: 'Get subscription usage',
			},
		],
		default: 'checkBalance',
	},

	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['createInvitation'],
			},
		},
		default: '',
		description: 'Email address for invitation',
	},
];

export const nanoCryptoNanoGPTParameterProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['nanoCrypto'],
			},
		},
		options: [
			{
				name: 'Receive Nano Crypto',
				value: 'receiveNano',
				description: 'Receive Nano cryptocurrency deposit',
				action: 'Receive nano crypto',
			},
		],
		default: 'receiveNano',
	},

	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['nanoCrypto'],
			},
		},
		default: '',
		description: 'Nano cryptocurrency address',
	},

	{
		displayName: 'Amount',
		name: 'amount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['nanoCrypto'],
			},
		},
		default: 0,
		description: 'Amount of Nano to receive',
	},
];
