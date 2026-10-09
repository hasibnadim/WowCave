import 'server-only';

import { cert, getApp, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';

type ServiceAccountJson = Record<string, string | undefined>;

function parseServiceAccount(value: string): ServiceAccount {
	const trimmed = value.trim();
	const json = trimmed.startsWith('{')
		? trimmed
		: Buffer.from(trimmed, 'base64').toString('utf8');
	const raw = JSON.parse(json) as ServiceAccountJson;
	const serviceAccount = {
		projectId: raw.project_id ?? raw.projectId,
		clientEmail: raw.client_email ?? raw.clientEmail,
		privateKey: (raw.private_key ?? raw.privateKey)?.replace(/\\n/g, '\n'),
		privateKeyId: raw.private_key_id ?? raw.privateKeyId,
		clientId: raw.client_id ?? raw.clientId,
		authUri: raw.auth_uri ?? raw.authUri,
		tokenUri: raw.token_uri ?? raw.tokenUri,
		authProviderX509CertUrl: raw.auth_provider_x509_cert_url ?? raw.authProviderX509CertUrl,
		clientX509CertUrl: raw.client_x509_cert_url ?? raw.clientX509CertUrl,
		universeDomain: raw.universe_domain ?? raw.universeDomain,
	} as ServiceAccount;

	if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
		throw new Error('FIREBASE_ADMIN must contain a valid Firebase service-account credential.');
	}

	return serviceAccount;
}

export function getFirebaseAdminApp(): App | undefined {
	if (getApps().length > 0) return getApp();

	const credential = process.env.FIREBASE_ADMIN;
	if (!credential) return undefined;
	const serviceAccount = parseServiceAccount(credential);

	return initializeApp({
		credential: cert(serviceAccount),
		projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.projectId,
	});
}

export function getFirebaseAuth(): Auth | undefined {
	const app = getFirebaseAdminApp();
	return app ? getAuth(app) : undefined;
}