(function() {
	if (typeof window.waterMark == 'undefined') {
		window.waterMark = function(_options) {
			const options = {
				text: '', // 水印
				height: 200, // 默认高度
				rows: 3,
				columns: 6,
				color: '#aaa', // 水印字体颜色
				opacity: 0.2, // 水印透明度
				fontSize: 18, // 水印字体大小
				font: '微软雅黑', // 水印字体
				angle: 20, // 水印倾斜度数
				..._options
			}

			//获取页面最大高度
			let pageHeight = Math.max(
				document.body.scrollHeight,
				document.body.clientHeight
			) + 450;

			pageHeight = Math.max(
				pageHeight,
				window.innerHeight - 30
			);

			const { text, rows, angle, height, ...rest } = options

			const cacheDocument = document.createDocumentFragment();
			if (options.text) {
				const waterMask = document.createElement('div')
				const waterMaskStyle = {
					top: 0,
					position: 'absolute',
					width: '100%',
					height: '100%',
					'pointer-events': 'none',
					display: 'grid',
					'grid-template-columns': `repeat(${options.rows}, 1fr)`,
					font: options.font,
					fontSize: `${options.fontSize}px`,
					opacity: options.opacity,
					color: options.color,
				}
				waterMask.className = 'water-mask'
				Object.keys(waterMaskStyle).map(key => {
					waterMask.style[key] = waterMaskStyle[key]
				})

				const waterMaskItem = document.createElement('div')
				const waterMaskItemStyle = {
					'text-align': 'center',
					width: '100%',
					height: `${options.height}px`,
					'line-height': `${options.height}px`,
					transform: `rotate(-${options.angle}deg)`,
				}
				waterMaskItem.className = 'water-mask__item'
				console.log('waterMaskItemStyle:', waterMaskItemStyle)
				Object.keys(waterMaskItemStyle).map(key => {
					waterMaskItem.style[key] = waterMaskItemStyle[key]
				})

				const textNode = document.createTextNode(text)
				waterMaskItem.appendChild(textNode)
				const columns = Math.floor(pageHeight / options.height)
				const itemCount = columns * options.rows
				for (let i = 0; i < itemCount; i ++ ) {
					waterMask.appendChild(waterMaskItem.cloneNode(true))
				}
				cacheDocument.appendChild(waterMask)
			}
			document.body.appendChild(cacheDocument);
		}
	}
})();
