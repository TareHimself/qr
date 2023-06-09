import * as QR from 'qrcode';
import { Request } from 'express';

export function mapParams<T extends object>(object: T, params: string[]) {
	Object.keys(object).forEach((key, idx) => {
		object[key] = params[idx];
	});
	return object;
}

export function makeQrCode(
	text: string | QR.QRCodeSegment[],
	size = 1000,
	color?: QR.QRCodeRenderersOptions['color']
) {
	return new Promise<Buffer>((res, rej) =>
		QR.toBuffer(
			text,
			{
				type: 'png',
				errorCorrectionLevel: 'H',
				width: size,
				color: color,
			},
			(e, d) => {
				if (e) {
					rej(e);
					return;
				}

				res(d);
			}
		)
	);
}

export function getUrlParams(req: Request, reg: RegExp) {
	return Array.from(req.originalUrl.match(reg) ?? []).slice(1);
}
