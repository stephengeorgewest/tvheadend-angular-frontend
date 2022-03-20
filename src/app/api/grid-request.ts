export interface GridRequest<T> {
	/**
	 * Name of the field to sort the records by. A case-sensitive sort is used.
	 */
	sort?: keyof T;

	/**
	 *  if sort is specified then dir=desc produces a reverse sort.
	 */
	dir?: "ASC" | "DESC";

	/**
	 * Set to 0 to exclude duplicate timers. Default is 1. /dvr/* specific?
	*/
	duplicates?: 0 | 1;

	/**
	 *  First entry to include. Default is the first (0).
	 */
	start?: number;

	/**
	 * Number of entries to include. Default is 50 - use a large number to get all.
	 */
	limit?: number;

	/**
	 * Multiple filters can be applied to a query ONLY if they refer to 
	 * different fields, 
	 * so for example it is not possible to query for EPG events
	 *  having start times between two values.
	 */
	//filter?: filter[];
};

type filter<T> = {
	
		"field" : keyof T;
		"type"  : 'string' | 'numeric' | 'boolean',
		/**
		 * Boolean values must be specified as "0" or "1" (NOT "true" or "false").
		 * A (case-insensitive) regular expression match is used for strings.
		 */
		"value" : string,

		/**
		 * The "comparison" field is only used with numeric data.
		 * */
		"comparison" : "gt"|"lt"|"eq",

		/**
		 * The "intsplit" field is used for integer variables which
		 *  are used to store a quotient and remainder,
		 *  and defines how the bits of the variable are allocated.
		 */
		"intsplit" : any
	 
}