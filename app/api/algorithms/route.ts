import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  const presets = await prisma.algorithm.findMany({
    where: { isPreset: true },
    orderBy: { name: "asc" },
  });

  let userAlgos: typeof presets = [];
  if (session?.user?.id) {
    userAlgos = await prisma.algorithm.findMany({
      where: { userId: session.user.id, isPreset: false },
      orderBy: { updatedAt: "desc" },
    });
  }

  return NextResponse.json({
    presets,
    userAlgorithms: userAlgos,
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, definition } = body;

  if (!name || !definition) {
    return NextResponse.json(
      { error: "Name and definition are required" },
      { status: 400 }
    );
  }

  const algo = await prisma.algorithm.create({
    data: {
      userId: session.user.id,
      name,
      description: description ?? null,
      definition: typeof definition === "string" ? definition : JSON.stringify(definition),
      isPreset: false,
    },
  });

  return NextResponse.json(algo);
}
