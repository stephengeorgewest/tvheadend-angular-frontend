import { InjectionToken } from "@angular/core"

export type AppConfig = {
	server: {
		host: string
		port: number
		secure: "s" | ""
	}
}
export let APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG')