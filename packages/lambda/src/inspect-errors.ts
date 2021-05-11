import {lambdaReadFile} from './io';
import {streamToString} from './stream-to-string';

export const inspectErrors = async ({
	errs,
	bucket,
}: {
	errs: string[];
	bucket: string;
}) => {
	if (errs.length === 0) {
		return [];
	}

	const errors = await Promise.all(
		errs.map(async (key) => {
			const Body = await lambdaReadFile({
				bucketName: bucket,
				key,
			});
			const errorLog = await streamToString(Body);
			return errorLog;
		})
	);
	return errors.map((e) => {
		if (e.includes('ENOSPC')) {
			return 'Your lambda function reached the 512MB storage. To render videos this big, you need to enable EFS mode.';
		}

		// TODO: Make typesafe and handle error
		return JSON.parse(e).error;
	});
};
