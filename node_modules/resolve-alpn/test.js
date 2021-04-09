import http2 from 'http2';
import tls from 'tls';
import util from 'util';
import test from 'ava';
import pem from 'pem';
import resolveALPN from '.';

const createCertificate = util.promisify(pem.createCertificate);

const createServer = async () => {
	const caKeys = await createCertificate({
		days: 1,
		selfSigned: true
	});

	const caRootKey = caKeys.serviceKey;
	const caRootCert = caKeys.certificate;

	const keys = await createCertificate({
		serviceCertificate: caRootCert,
		serviceKey: caRootKey,
		serial: Date.now(),
		days: 500,
		country: '',
		state: '',
		locality: '',
		organization: '',
		organizationUnit: '',
		commonName: 'localhost'
	});

	const key = keys.clientKey;
	const cert = keys.certificate;

	const s = http2.createSecureServer({cert, key, allowHTTP1: true});

	s.listen = util.promisify(s.listen);
	s.close = util.promisify(s.close);

	s.options = {
		host: 'localhost',
		rejectUnauthorized: false,
		ALPNProtocols: ['h2']
	};

	s.on('listening', () => {
		s.options.port = s.address().port;
	});

	return s;
};

let s;

test.before('setup', async () => {
	s = await createServer();
	await s.listen();
});

test.after('cleanup', async () => {
	await s.close();
});

test('works', async t => {
	const result = await resolveALPN(s.options);
	t.deepEqual(result, {
		alpnProtocol: 'h2'
	});
});

test('`resolveSocket` option', async t => {
	const result = await resolveALPN({
		...s.options,
		resolveSocket: true
	});

	t.is(result.alpnProtocol, 'h2');
	t.true(result.socket instanceof tls.TLSSocket);

	result.socket.destroy();
});

test('empty options', async t => {
	await t.throwsAsync(() => resolveALPN(), {code: 'ECONNREFUSED'});
});
