import path from 'path'
import fse from 'fs-extra'
import { Global } from './global'
import { renderHtml } from './render';

// 路径解析
export const parseFilePath = (filePath: string) => {
	const {
		dir,
		name,
		ext,
	} = path.parse(filePath)
	return {
		path: dir,
		fileName: `${name}${ext}`,
	}
}

export default async (content: string, options: any, filePath?: string) => {
	const { pdf_options, watermark: text } = Global.config
	const html = renderHtml(content)
	if (!Global.browser?.isConnected()) {
		throw '浏览器启动失败，请确保已经调用过 openBrowser'
	}

	// 设置html content
	await Global.page.setContent(html)

	// 指定位置插入插入 html 片段
	// await Global.page.$eval('#content', (dom, html) => {
	// 	dom.innerHTML = html
	// }, html);

	if (text) {
		await Global.page.addScriptTag({
			path: path.resolve(__dirname, 'lib/waterMask.js'),
		});

		// 运行自定义js脚本，这里用于添加水印
		// 注：调用是需要带上 window 命名空间
		await Global.page.evaluate((text) => {
			// @ts-ignore
			if (window.waterMark) {
				// @ts-ignore
				window.waterMark({
					text
				});
			}
		}, text)
	}

	let result;
	try {
		if (filePath) {
			const downloadConfig = parseFilePath(filePath)
			fse.ensureDir(downloadConfig.path)
			result = await Global.page.pdf({
				...pdf_options,
				...options,
				path: `${downloadConfig.path}/${downloadConfig.fileName}`
			})
			console.log(`${filePath} export complete`)
		} else {
			result = await Global.page.pdf({
				...pdf_options,
				...options
			})
			console.log('pdf export complete')
		}
	} catch (error) {
		throw error
	}
	return Promise.resolve(result)
}
