import type {AbsoluteInstruction, UnarcedAbsoluteInstruction} from './types';

export const iterateOverSegments = <T extends UnarcedAbsoluteInstruction>({
	segments,
	iterate,
}: {
	segments: AbsoluteInstruction[];
	iterate: (options: {
		segment: AbsoluteInstruction;
		x: number;
		y: number;
	}) => T[];
}): T[] => {
	let x = 0;
	let y = 0;

	const newSegments = segments.map((s) => {
		const newSeg = iterate({segment: s, x, y});
		switch (s.type) {
			case 'M':
			case 'A':
			case 'C':
			case 'Q':
			case 'S':
			case 'T':
			case 'L': {
				x = s.x;
				y = s.y;
				break;
			}

			case 'V': {
				y = s.y;
				break;
			}

			case 'H': {
				x = s.x;
				break;
			}

			case 'Z': {
				break;
			}

			default:
				// @ts-expect-error
				throw new Error(`Unexpected instruction ${s.type}`);
		}

		return newSeg;
	});
	return newSegments.flat(1);
};
