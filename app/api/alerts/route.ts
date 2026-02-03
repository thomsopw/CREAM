import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventTypes, minReturn } = await request.json();
  if (!Array.isArray(eventTypes) || eventTypes.length === 0) {
    return NextResponse.json(
      { error: "At least one event type is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.alert.create({
      data: {
        userId: session.user.id,
        eventTypes: JSON.stringify(eventTypes),
        minReturn: typeof minReturn === "number" ? minReturn : null,
        isActive: true,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isActive } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "Alert ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.alert.updateMany({
      where: { id, userId: session.user.id },
      data: { isActive: !!isActive },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "Alert ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.alert.deleteMany({
      where: { id, userId: session.user.id },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
