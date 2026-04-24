import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}.${ext}`;

    
    // Save to public/[folder]
    const folder = formData.get('folder') as string || 'products';
    const uploadDir = join(process.cwd(), 'public', folder);
    
    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // already exists
    }

    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      filename: filename,
      url: `/products/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
  }
}
