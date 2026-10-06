import { NextResponse } from 'next/server';
import {
  verifyLedgerItems,
  calculateProjectTotals,
} from '../../../../../../services/ledger/src/ledger-service';
import { VerifyLedgerItemRequest } from '@scope-creep-ledger/shared';

export async function POST(request: Request) {
  try {
    const body: VerifyLedgerItemRequest = await request.json();
    const itemIds = body.ledgerItemIds || (body.ledgerItemId ? [body.ledgerItemId] : []);

    if (!body.projectId || itemIds.length === 0 || !body.action) {
      return NextResponse.json(
        { error: 'projectId, ledgerItemId(s), and action are required.' },
        { status: 400 }
      );
    }

    await verifyLedgerItems(
      body.projectId,
      itemIds,
      body.action,
      body.customEstimatedHours,
      body.userId,
      body.fallbackLedgerItems,
      body.fallbackProject
    );

    const totals = await calculateProjectTotals(body.projectId, body.userId);

    return NextResponse.json({ totals });
  } catch (err: any) {
    console.error('API POST /api/ledger/verify Error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to verify ledger item.' },
      { status: 400 }
    );
  }
}