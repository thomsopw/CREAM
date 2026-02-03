import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticker } = await request.json();
  if (!ticker || typeof ticker !== "string") {
    return NextResponse.json(
      { error: "Ticker is required" },
      { status: 400 }
    );
  }

  const normalized = ticker.trim().toUpperCase();
  if (normalized.length === 0) {
    return NextResponse.json(
      { error: "Invalid ticker" },
      { status: 400 }
    );
  }

  try {
    await prisma.watchlist.upsert({
      where: {
        userId_ticker: {
          userId: session.user.id,
          ticker: normalized,
        },
      },
      create: {
        userId: session.user.id,
        ticker: normalized,
      },
      update: {},
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ticker } = await request.json();
  if (!ticker || typeof ticker !== "string") {
    return NextResponse.json(
      { error: "Ticker is required" },
      { status: 400 }
    );
  }

  const normalized = ticker.trim().toUpperCase();

  try {
    await prisma.watchlist.deleteMany({
      where: {
        userId: session.user.id,
        ticker: normalized,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
