import {getBoundingBoxFromInstructions} from '../get-bounding-box';
import type {ReducedInstruction} from '../helpers/types';
import {parsePath} from '../parse-path';
import {reduceInstructions} from '../reduce-instructions';
import {serializeInstructions} from '../serialize-instructions';
import type {WarpPathFn} from './warp-helpers';
import {
	fixZInstruction,
	svgPathInterpolate,
	warpTransform,
} from './warp-helpers';

const getDefaultInterpolationThreshold = (
	instructions: ReducedInstruction[],
) => {
	const boundingBox = getBoundingBoxFromInstructions(instructions);
	const longer = Math.max(
		boundingBox.y2 - boundingBox.y1,
		boundingBox.x2 - boundingBox.x1,
	);
	return longer * 0.01;
};

/**
 * @description This function works by splitting SVG instructions into many smaller SVG instructions and then remapping the coordinates of each instruction.
 * @param {string} path an SVG path string
 * @see [Documentation](https://www.remotion.dev/docs/paths/warp-path)
 */
export const warpPath = (
	path: string,
	transformer: WarpPathFn,
	options?: {
		interpolationThreshold?: number;
	},
): string => {
	const reduced = reduceInstructions(parsePath(path));
	const withZFix = fixZInstruction(reduced);

	const interpolated = svgPathInterpolate(
		withZFix,
		options?.interpolationThreshold ??
			getDefaultInterpolationThreshold(withZFix),
	);

	return serializeInstructions(warpTransform(interpolated, transformer));
};

export type {WarpPathFn} from './warp-helpers';
