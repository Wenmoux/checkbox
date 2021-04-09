export interface Options {
	/**
	 * String to use as replacement for reserved filename characters.
	 *
	 * Cannot contain: `<` `>` `:` `"` `/` `\` `|` `?` `*`
	 *
	 * @default '!'
	 */
	readonly replacement?: string;
}

/**
 * Accepts a filename and returns a valid filename.
 *
 * @param input - A string to convert to a valid filename.
 */
export interface Filenamify {
	(input: string, options?: Options): string;

	/**
	 * Accepts a path and returns the path with a valid filename.
	 *
	 * @param input - A string to convert to a valid path with a filename.
	 */
	path(input: string, options?: Options): string;
}

declare const filenamify: Filenamify;

export default filenamify;
