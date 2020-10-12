import path from 'path'
import fse from 'fs-extra'
// import * as fse from 'fs-extra'
import { Global } from './global'
import { renderHtml } from './render'

const HtmlDocx = require('html-docx-js')

// 解析路径
export const parseFilePath = (filePath: string = `download/${Math.random()}.doc`) => {
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

export default async (content: string, filePath?: string) => {
	const html = renderHtml(content)
	if (!Global.browser?.isConnected()) {
		throw '浏览器启动失败，请确保已经调用过 openBrowser'
	}

	// 设置html content
	await Global.page.setContent(html, {
		waitUntil: 'domcontentloaded'
	})

	// 指定位置插入插入 html 片段
	// await Global.page.$eval('#content', (dom, html) => {
	// 	dom.innerHTML = html
	// }, html);

	let result;
	try {
		const pageHtml = await Global.page.content()
		const docx = HtmlDocx.asBlob(pageHtml)
		if (filePath) {
			const downloadConfig = parseFilePath(filePath)
			fse.ensureFileSync(`${downloadConfig.path}/${downloadConfig.fileName}`)
			fse.writeFileSync(`${downloadConfig.path}/${downloadConfig.fileName}`, docx);
		} else {
			result = docx
		}
		console.log('doc export complete')
	} catch (error) {
		console.error(error)
	}
	return Promise.resolve(result)
}
