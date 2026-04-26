import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // We use Raw SQL for the role just in case the Enum/String mismatch persists in some parts of Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        isActive: true
      }
    });

    // Force the role using raw SQL to be safe
    await prisma.$executeRawUnsafe(
      `UPDATE "User" SET "role" = $1 WHERE "id" = $2`,
      role, user.id
    );

    return NextResponse.json({ 
      success: true, 
      message: `Successfully created ${role}: ${name}` 
    });

  } catch (error: any) {
    console.error('Create User Error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
