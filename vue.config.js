module.exports = {
	lintOnSave: true,
	css: {
		loaderOptions: {
			postcss: {
				plugins: [
					require('postcss-pxtorem')({
						rootValue : 75, // 换算的基数
						minPixelValue: 2,
						propList: ['*'],
					}),
				]
			}
		}
	}
}