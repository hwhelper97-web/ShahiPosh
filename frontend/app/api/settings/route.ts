import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsObj = (settings || []).reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Upsert each setting
    const promises = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      });
    });

    await Promise.all(promises);
    return NextResponse.json({ message: 'Settings updated' });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
