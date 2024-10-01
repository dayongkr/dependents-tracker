export const PACAKGE = process.env.PACKAGE;

export const PACKAGE_OWNER = PACAKGE?.split('/')[0] ?? '';
