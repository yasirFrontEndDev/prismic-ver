import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const file = searchParams.get('file');

        if (!file) {
            return NextResponse.json({ error: 'File parameter is required' }, { status: 400 });
        }

        // Ensure we're only reading files from the project root
        const filePath = path.join(process.cwd(), file);
        const content = await readFile(filePath, 'utf-8');

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error reading file:', error);
        return NextResponse.json({ error: 'Error reading file' }, { status: 500 });
    }
}
