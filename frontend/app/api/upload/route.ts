import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

    // 1. Try Vercel Blob if token is present
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(filename, file, { access: 'public' });
        return NextResponse.json({ message: 'Uploaded to Vercel', filename, url: blob.url });
      } catch (err: any) {
        console.warn('Vercel Blob failed:', err);
        
        if (err.message?.includes('private store')) {
          return NextResponse.json({ 
            message: 'Vercel Blob Access Error: Your store is set to Private. Please change it to Public in the Vercel Dashboard (Storage -> Settings).',
            error: 'Store Access Mismatch'
          }, { status: 500 });
        }

        if (isProduction) {
          return NextResponse.json({ 
            message: 'Cloud upload failed. Please check your BLOB_READ_WRITE_TOKEN in Vercel.', 
            error: String(err) 
          }, { status: 500 });
        }
      }
    }

    // 2. Local Fallback (Development Only)
    if (isProduction) {
      return NextResponse.json({ 
        message: 'Storage configuration missing. Please add BLOB_READ_WRITE_TOKEN to Vercel Environment Variables.',
        tip: 'Go to Vercel Dashboard -> Settings -> Environment Variables'
      }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    return NextResponse.json({ 
      message: 'Uploaded locally', 
      filename: filename,
      url: `/uploads/${filename}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
  }
}

