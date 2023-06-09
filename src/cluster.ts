import cors from 'cors';
import express from 'express';
import path from 'path';
import { mapParams, getUrlParams, makeQrCode } from './utils';

const ROUTES = {
	paramsSizeBgFgUrl:
		/([0-9]+)\/([a-zA-Z0-9#]+)\/([a-zA-Z0-9#]+)\/(https?:\/\/.*)/,
	paramsSizeBgUrl: /([0-9]+)\/([a-zA-Z0-9#]+)\/(https?:\/\/.*)/,
	paramsSizeUrl: /([0-9]+)\/(https?:\/\/.*)/,
	paramsUrl: /(https?:\/\/.*)/,
};

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../', 'index.html'));
});

app.get(ROUTES['paramsSizeBgFgUrl'], async (req, res) => {
	const options = mapParams(
		{
			size: '',
			color_bg: '',
			color_fg: '',
			url: '',
		},
		getUrlParams(req, ROUTES['paramsSizeBgFgUrl'])
	);

	res.contentType('png');
	res.send(
		await makeQrCode(options['url'], parseInt(options['size']), {
			light: options['color_bg'],
			dark: options['color_fg'],
		})
	);
});

app.get(ROUTES['paramsSizeBgUrl'], async (req, res) => {
	const options = mapParams(
		{
			size: '',
			color_bg: '',
			url: '',
		},
		getUrlParams(req, ROUTES['paramsSizeBgUrl'])
	);

	res.contentType('png');
	res.send(
		await makeQrCode(options['url'], parseInt(options['size']), {
			light: options['color_bg'],
		})
	);
});

app.get(ROUTES['paramsSizeUrl'], async (req, res) => {
	const options = mapParams(
		{
			size: '',
			url: '',
		},
		getUrlParams(req, ROUTES['paramsSizeUrl'])
	);

	res.contentType('png');
	res.send(await makeQrCode(options['url'], parseInt(options['size'])));
});

app.get(ROUTES['paramsUrl'], async (req, res) => {
	const options = mapParams(
		{
			url: '',
		},
		getUrlParams(req, ROUTES['paramsUrl'])
	);

	res.contentType('png');
	res.send(await makeQrCode(options['url']));
});
const port = process.argv.includes('--debug') ? 3006 : 9006;
app.listen(port, async () => {
	console.log(`QR generator running on port ${port}`);
});
