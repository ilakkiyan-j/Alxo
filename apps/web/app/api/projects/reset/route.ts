import { NextResponse } from 'next/server';
import { clearWorkspaceProjects } from '../../../../../../services/ledger/src/ledger-service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || undefined;
    const result = await clearWorkspaceProjects(userId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to reset workspace projects.' },
      { status: 500 }
    );
  }
}
