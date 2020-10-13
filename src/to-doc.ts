import path from 'path'
import fse from 'fs-extra'

import * as childProcess from 'child_process'
// import * as fse from 'fs-extra'
import { Global } from './global'
import { renderHtml } from './render'

// 解析路径
export const parseFilePath = (filePath: string = `${Math.random()}/${Math.random()}.docx`) => {
	const {
		dir,
		name,
		ext,
	} = path.parse(filePath)
	return {
		path: dir,
		name,
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

	let result: any = filePath;
	try {
		const pageHtml = await Global.page.content()
		const downloadConfig = parseFilePath(filePath)
		const targetFile = `${downloadConfig.path}/${downloadConfig.name}`
		fse.ensureFileSync(`${targetFile}.html`)
		fse.writeFileSync(`${targetFile}.html`, pageHtml);
		childProcess.execSync(`pandoc -s ${targetFile}.html -o ${targetFile}.docx`)
		if (!filePath) {
			result = fse.readFileSync(`${targetFile}.docx`);
			fse.removeSync(`${targetFile}.docx`);
		}
		fse.rmdirSync(downloadConfig.path, { recursive: true });
		console.log('doc export complete')
	} catch (error) {
		console.error(error)
	}
	return Promise.resolve(result)
}
