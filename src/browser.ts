import puppeteer from 'puppeteer-core';
import { Global } from './global';

// 打开浏览器
export const openBrowser = async (config: any = {}) => {
	Global.config = {
		...Global.config,
		...config
	}
	const { launch_options = {} } = Global.config
	if (!Global.browser?.isConnected()) {
		Global.browser = await puppeteer.launch(launch_options)
		Global.page = await Global.browser.newPage()

		// 只开启一个page，并跳转到我们配置的页面到指定页面
		const { page_export_template } = Global.config
		if (page_export_template) {
			await Global.page.goto(page_export_template, {
				waitUntil: 'networkidle0', // 等到
			}).catch(error => {
				throw error
			});
		}
		console.log('open browser complete')
	}
}

// 关闭浏览器
export const closeBrowser = async () => {
	// 关闭浏览器
	if (Global.browser?.isConnected()) {
		await Global.page.close()
		await Global.browser.close()
		console.log('close browser complete')
	}
}



