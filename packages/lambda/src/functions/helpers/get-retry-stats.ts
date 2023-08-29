import type {_Object} from '@aws-sdk/client-s3';
import {lambdaChunkInitializedPrefix} from '../../shared/constants';
import {parseLambdaInitializedKey} from '../../shared/parse-lambda-initialized-key';
import type { RenderExpiryDays } from './lifecycle';

export type ChunkRetry = {
	chunk: number;
	attempt: number;
	time: number;
};

export const getRetryStats = ({
	contents,
	renderId,
	renderFolderExpiry
}: {
	contents: _Object[];
	renderId: string;
	renderFolderExpiry: RenderExpiryDays | null;
}): ChunkRetry[] => {
	const retries = contents
		.filter((c) => c.Key?.startsWith(lambdaChunkInitializedPrefix(renderId, renderFolderExpiry)))
		.filter((c) => parseLambdaInitializedKey(c.Key as string).attempt !== 1);

	return retries.map((retry) => {
		const parsed = parseLambdaInitializedKey(retry.Key as string);
		return {
			chunk: parsed.chunk,
			attempt: parsed.attempt,
			time: retry.LastModified?.getTime() as number,
		};
	});
};
