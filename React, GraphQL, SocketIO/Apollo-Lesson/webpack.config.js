import path from 'path'


const __dirname = path.resolve()

export default {
	entry: './src/index.js',
	output:{
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			options: {
				'presets':[['@babel/preset-react', {"runtime": "automatic"}]],
			}
	}]},
	
}