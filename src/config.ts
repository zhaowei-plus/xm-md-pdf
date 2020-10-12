import { MarkedOptions } from 'marked';
import { resolve } from 'path';
import { LaunchOptions, PDFOptions } from 'puppeteer';

export const defaultConfig: Config = {
	page_export_template: 'https://www.baidu.com/', // 默认百度页面，本地不再开启http server，优化导出性能
	basedir: process.cwd(),
	stylesheet: [
		resolve(__dirname, '..', '..', 'markdown.css')
	],
	css: '',
	body_class: [],
	highlight_style: 'github',

	// markdown 转 html 的配置参数
	marked_options: {

	},

	// html 转 pdf的配置参数
	pdf_options: {
		printBackground: false,
		format: 'A4',
		margin: {
			top: '20mm',
			right: '10mm',
			bottom: '20mm',
			left: '10mm',
		},
	},
	// puppeteer 启动浏览器的参数
	launch_options: {},

	// md 转 html 的编码
	md_file_encoding: 'utf-8',

	// style 文件编码
	stylesheet_encoding: 'utf-8',

	as_html: false,
	devtools: false,
};

/**
 * In config keys, dashes of cli flag names are replaced with underscores.
 */
export interface Config {
	watermark?: string, // 水印

	page_export_template: string, // 导出模版：pdf和doc，避免在页面各种资源缺失（css,js,img），图片防盗链处理

	mode?: string,
	/**
	 * Base directory to be served by the file server.
	 */
	basedir: string;

	/**
	 * Optional destination path for the output file (including the extension).
	 */
	dest?: string;

	/**
	 * List of css files to use for styling.
	 */
	stylesheet: string[];

	/**
	 * Custom css styles.
	 */
	css: string;

	/**
	 * List of classes for the body tag.
	 */
	body_class: string[];

	/**
	 * Highlight.js stylesheet to use (without the .css extension).
	 *
	 * @see https://github.com/isagalaev/highlight.js/tree/master/src/styles
	 */
	highlight_style: string;

	/**
	 * Options for the Marked parser.
	 *
	 * @see https://marked.js.org/#/USING_ADVANCED.md
	 */
	marked_options: MarkedOptions;

	/**
	 * PDF options for Puppeteer.
	 *
	 * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
	 */
	pdf_options: PDFOptions;

	/**
	 * Launch options for Puppeteer.
	 *
	 * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
	 */
	launch_options: LaunchOptions;

	/**
	 * Markdown file encoding. Default: `utf-8`.
	 */
	md_file_encoding: string;

	/**
	 * CSS stylesheet encoding. Default: `utf-8`.
	 */
	stylesheet_encoding: string;

	/**
	 * If true, generate HTML output instead of PDF output. Default: `false`.
	 */
	as_html: boolean;

	/**
	 * If true, open chromium with devtools instead of saving the pdf. This is
	 * meant for development only, to inspect the rendered HTML.
	 */
	devtools: boolean;

	/**
	 * Port to run the local server on. 本地服务端口
	 */
	port?: number;
}


export interface IConfig extends Config {

}
