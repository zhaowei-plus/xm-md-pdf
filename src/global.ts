import puppeteer from 'puppeteer';
import { IConfig } from './config'

// 全局对象
export module Global {
	// 全局 browser 对象
	export let browser: puppeteer.Browser;

	// 全局 page 对象
	export let page: puppeteer.Page;

	// 全局 browserWSEndpoint 对象
	export let browserWSEndpoint: puppeteer.BrowserContext;

	// 全局 config 对象
	export let config: IConfig;
}
