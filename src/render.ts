import { getLanguage, highlight } from 'highlight.js';
import marked, { MarkedOptions } from 'marked';
import fse from 'fs-extra';
import path from 'path'
import { Global } from './global';

/**
 * @description 修改并设置 marked_options参数
 * @param { MarkedOptions } options
 * */
export const markedOptions = (options: MarkedOptions) => {
	const renderer = options.renderer ?? new marked.Renderer()

	// 对代码段的处理
	if (!renderer.code) {
		renderer.code = (code, language) => {
			const languageName = language && getLanguage(language) ? language : 'plaintext';
			return `
				<pre>
					<code class="hljs ${languageName}">
						${highlight(languageName, code).value}
					</code>
				</pre>
			`;
		}
	}

	// 重新设置参数
	marked.setOptions({
		...options,
		renderer
	});
	return marked;
}

export const renderBody = (markContent: string) => {
	const { marked_options = {} } = Global.config
	return markedOptions(marked_options)(markContent)
}

export const renderHtml = (markContent: string) => {
	const markdownBody = renderBody(markContent)
	const template = fse.readFileSync(path.resolve(__dirname, 'assets/template.html'), { encoding: 'utf8' })
	return template.replace(/markdownBody/, markdownBody)
}

