// lib/trpc.ts
// tRPC client configuration

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/app';

export const trpc = createTRPCReact<AppRouter>();
