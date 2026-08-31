/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, it, vi } from 'vitest';
import type { IExecuteFunctions } from 'n8n-workflow';

import { NanoGPTClient } from '../utils/NanoGPTClient';
import { extractParameterOptions } from '../nodes/NanoGPT/NanoGpt.node';

function makeContext(httpRequest: any): IExecuteFunctions {
	return {
		helpers: { httpRequest },
		getNode: () => ({ name: 'NanoGPT', type: 'nanoGpt' }),
	} as unknown as IExecuteFunctions;
}

const credentials = { apiKey: 'test-key', baseUrl: 'https://nano-gpt.com' };

describe('synchronousTTS', () => {
	it('returns base64 audio for binary (audio) responses', async () => {
		const audioBytes = Buffer.from([0x49, 0x44, 0x33, 0x01, 0x02]);
		const httpRequest = vi.fn().mockResolvedValue({
			statusCode: 200,
			headers: { 'content-type': 'audio/mpeg' },
			body: audioBytes,
		});
		const client = new NanoGPTClient(makeContext(httpRequest), credentials as any);

		const result = await client.synchronousTTS('hello', 'Kokoro-82m', 'alloy');

		expect(result.audio).toBe(audioBytes.toString('base64'));
		expect(httpRequest).toHaveBeenCalledTimes(1);
		const call = httpRequest.mock.calls[0][0];
		expect(call.encoding).toBe('arraybuffer');
		expect(call.returnFullResponse).toBe(true);
	});

	it('throws a readable error for non-2xx responses', async () => {
		const httpRequest = vi.fn().mockResolvedValue({
			statusCode: 402,
			headers: { 'content-type': 'application/json' },
			body: Buffer.from(JSON.stringify({ error: { message: 'Insufficient balance' } })),
		});
		const client = new NanoGPTClient(makeContext(httpRequest), credentials as any);

		await expect(client.synchronousTTS('hello', 'Kokoro-82m', 'alloy')).rejects.toThrow(
			'Insufficient balance',
		);
	});
});

describe('transcribe', () => {
	it('strips data: URLs and uploads the decoded bytes', async () => {
		const audioBytes = Buffer.from([1, 2, 3, 4, 5, 6, 7]);
		const httpRequest = vi.fn().mockResolvedValue({
			statusCode: 200,
			headers: {},
			body: JSON.stringify({ text: 'transcribed' }),
		});
		const client = new NanoGPTClient(makeContext(httpRequest), credentials as any);

		const result = await client.transcribe({
			audioUrl: `data:audio/mp3;base64,${audioBytes.toString('base64')}`,
			model: 'Whisper-Large-V3',
		});

		expect(result).toEqual({ text: 'transcribed' });
		const call = httpRequest.mock.calls[0][0];
		expect(call.body).toBeInstanceOf(Buffer);
		expect((call.body as Buffer).includes(audioBytes)).toBe(true);
	});

	it('rejects invalid base64', async () => {
		const httpRequest = vi.fn().mockResolvedValue({ statusCode: 200, body: '{}' });
		const client = new NanoGPTClient(makeContext(httpRequest), credentials as any);

		await expect(
			client.transcribe({ audioUrl: 'not base64!!!', model: 'Whisper-Large-V3' }),
		).rejects.toThrow('valid base64');
	});

	it('rejects uploads larger than 3 MB', async () => {
		const httpRequest = vi.fn().mockResolvedValue({ statusCode: 200, body: '{}' });
		const client = new NanoGPTClient(makeContext(httpRequest), credentials as any);
		const big = Buffer.alloc(Math.ceil(3.5 * 1024 * 1024), 1);

		await expect(
			client.transcribe({ audioUrl: big.toString('base64'), model: 'Whisper-Large-V3' }),
		).rejects.toThrow('3 MB');
	});
});

describe('auth headers', () => {
	it('uses Bearer for OpenAI-compatible endpoints and x-api-key elsewhere', async () => {
		const httpRequest = vi.fn().mockResolvedValue({});
		const client = new NanoGPTClient(makeContext(httpRequest), credentials as any);

		await client.makeRequest('GET', '/check-balance');
		expect(httpRequest.mock.calls[0][0].headers['x-api-key']).toBe('test-key');
		expect(httpRequest.mock.calls[0][0].headers.Authorization).toBeUndefined();

		await client.makeRequest('POST', '/v1/chat/completions', {});
		expect(httpRequest.mock.calls[1][0].headers.Authorization).toBe('Bearer test-key');
	});
});

describe('extractParameterOptions', () => {
	it('handles arrays of strings', () => {
		expect(extractParameterOptions(['16:9', '9:16'])).toEqual([
			{ name: '16:9', value: '16:9' },
			{ name: '9:16', value: '9:16' },
		]);
	});

	it('handles arrays of objects with label/value', () => {
		expect(extractParameterOptions([{ label: '5s', value: '5' }])).toEqual([
			{ name: '5s', value: '5' },
		]);
	});

	it('unwraps options/values wrappers', () => {
		expect(extractParameterOptions({ options: ['720p'] })).toEqual([
			{ name: '720p', value: '720p' },
		]);
	});

	it('returns undefined for empty or unknown shapes', () => {
		expect(extractParameterOptions(undefined)).toBeUndefined();
		expect(extractParameterOptions(null)).toBeUndefined();
		expect(extractParameterOptions({})).toBeUndefined();
	});
});
