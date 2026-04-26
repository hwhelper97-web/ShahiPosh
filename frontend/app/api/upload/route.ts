import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Upload to Vercel Blob with public access for product images
    const filename = `${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ 
      message: 'File uploaded successfully', 
      filename: filename,
      url: blob.url
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
  }
}

