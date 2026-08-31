 
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
		displayName: 'Amount',
		name: 'invitationAmount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['createInvitation'],
			},
		},
		default: 0,
		typeOptions: {
			minValue: 0,
		},
		description: 'Optional Nano amount attached to the invitation. Set to 0 to skip.',
	},
	{
		displayName: 'Currency',
		name: 'invitationCurrency',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['createInvitation'],
			},
		},
		default: 'NANO',
		description: 'Currency for the invitation amount',
	},
	{
		displayName: 'Recipient Name',
		name: 'invitationRecipientName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['createInvitation'],
			},
		},
		default: '',
		description: 'Optional name of the invitation recipient',
	},
	{
		displayName: 'Issuer Name',
		name: 'invitationIssuerName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['createInvitation'],
			},
		},
		default: '',
		description: 'Optional name of the invitation issuer',
	},
	{
		displayName: 'Issuer Note',
		name: 'invitationIssuerNote',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['balance'],
				operation: ['createInvitation'],
			},
		},
		default: '',
		description: 'Optional note from the invitation issuer',
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
				description: 'Process pending Nano deposits on your NanoGPT account',
				action: 'Receive nano crypto',
			},
		],
		default: 'receiveNano',
	},
];
