import path from 'path'
import fse from 'fs-extra'
import { Global } from './global'
import { renderHtml } from './render';

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

// 下载到指定目录
export default async (content: string, options: any, filePath?: string) => {
	const { pdf_options, watermark: text } = Global.config
	const html = renderHtml(content)
	if (!Global.browser?.isConnected()) {
		throw '浏览器启动失败，请确保已经调用过 openBrowser'
	}
	// 重新loading
	// await Global.page.reload()
	// const template = await Global.page.content()
	// fse.writeFileSync('assets/template.html', template, { encoding: 'utf8' })

	// 两种设置方式
	await Global.page.setContent(html)
	// await Global.page.$eval('#content', (dom, html) => {
	// 	dom.innerHTML = html
	// }, html);
	if (text) {
		console.log('pwd:', process.cwd())
		await Global.page.addScriptTag({
			// path: 'lib/waterMask.js'
			url: 'https://global.uban360.com/sfs/file?digest=fid4ee7704905093bffcbd0976036d405e5&fileType=2'
		});
		// TODO 运行自定义的库，需要带上 window 命名空间
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
		} else {
			result = await Global.page.pdf({
				...pdf_options,
				...options
			})
		}
	} catch (error) {
		throw error
	}
	console.log(`${filePath} export complete`)
	return Promise.resolve(result)
}
