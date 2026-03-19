import { type NextRequest } from 'next/server';
import { createApiProxy } from '@homebase/auth/src/api-proxy';

const proxy = createApiProxy();

type Context = { params: Promise<{ path: string[] }> };

export function GET(req: NextRequest, ctx: Context) { return proxy(req, ctx); }
export function POST(req: NextRequest, ctx: Context) { return proxy(req, ctx); }
export function PUT(req: NextRequest, ctx: Context) { return proxy(req, ctx); }
export function PATCH(req: NextRequest, ctx: Context) { return proxy(req, ctx); }
export function DELETE(req: NextRequest, ctx: Context) { return proxy(req, ctx); }

