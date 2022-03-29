export interface Entry {
	/**
	 * char                      *image;            ///< Episode image
	 */
	start: number;
	/**
	 * time_t                     stop;             ///< End time
	 */
	stop: number;
	/**
	 * char                      *image;            ///< Episode image
	 */
	image?: string;
	/**
	 *   uint16_t                   copyright_year;
	 *    ///< xmltv DTD gives a tag "date" (separate to previously-shown/first aired).
          ///< This is the date programme was "finished...probably the copyright date."
          ///< We'll call it copyright_year since words like "complete" and "finished"
          ///< sound too similar to dvr recorded functionality. We'll only store the
          ///< year since we only get year not month and day.
	 */
	copyright_year?: number;
}