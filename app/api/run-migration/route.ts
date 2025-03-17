import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Check if we're in a production environment (like Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// In-memory storage for production environment
let inMemoryData: Record<string, any> = {};

async function updateMigrationData(data: any) {
    console.log('Data received:', JSON.stringify(data, null, 2));
    console.log('Environment:', process.env.NODE_ENV);

    try {
        const updatedFiles = [];
        
        if (isProduction) {
            // In production (Vercel), use in-memory storage
            console.log('Using in-memory storage for production environment');
            
            for (const [key, value] of Object.entries(data)) {
                console.log(`Processing ${key}...`);
                
                // Only update if we have a new value
                if (value !== undefined && value !== null) {
                    // Store in memory
                    inMemoryData[key] = value;
                    console.log(`Updated in-memory data for: ${key}`);
                    updatedFiles.push(key);
                } else {
                    console.log(`Skipping ${key} as no new value was provided`);
                }
            }
            
            console.log('In-memory data updated successfully');
            return { success: true, updatedFiles, storage: 'memory' };
        } else {
            // In development, use file storage
            const dataDir = path.join(process.cwd(), 'data');
            console.log('Data directory:', dataDir);
            
            // Ensure data directory exists
            if (!fs.existsSync(dataDir)) {
                await mkdir(dataDir, { recursive: true });
                console.log('Created data directory');
            }
            
            for (const [key, value] of Object.entries(data)) {
                console.log(`Processing ${key}...`);
                
                // Only update if we have a new value
                if (value !== undefined && value !== null) {
                    const filePath = path.join(dataDir, `${key}.json`);
                    
                    // Format the JSON with proper indentation
                    const jsonContent = JSON.stringify(value, null, 2);
                    
                    // Write to the JSON file
                    await writeFile(filePath, jsonContent, 'utf8');
                    console.log(`Updated file: ${filePath}`);
                    updatedFiles.push(key);
                } else {
                    console.log(`Skipping ${key} as no new value was provided`);
                }
            }
            
            console.log('Files updated successfully');
            return { success: true, updatedFiles, storage: 'file' };
        }
    } catch (error) {
        console.error('Error updating data:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
        }
        return { success: false, error };
    }
}

// Function to get data (either from files or memory)
export async function getData(key: string) {
    if (isProduction) {
        // In production, get from memory
        return inMemoryData[key] || null;
    } else {
        // In development, get from file
        try {
            const dataDir = path.join(process.cwd(), 'data');
            const filePath = path.join(dataDir, `${key}.json`);
            
            if (!fs.existsSync(filePath)) {
                return null;
            }
            
            const content = await readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`Error reading data for ${key}:`, error);
            return null;
        }
    }
}

export async function POST(request: NextRequest) {
    console.log('POST request received');
    try {
        const data = await request.json();
        console.log('Request body:', JSON.stringify(data, null, 2));

        if (!data || Object.keys(data).length === 0) {
            console.error('No data provided');
            return NextResponse.json({ error: 'No data provided' }, { status: 400 });
        }

        // Validate that all values are valid JSON (arrays or objects)
        for (const [key, value] of Object.entries(data)) {
            if (typeof value !== 'object' || value === null) {
                console.error(`Invalid data format for ${key}: expected JSON array or object, got ${typeof value}`);
                return NextResponse.json({ 
                    error: `Invalid data format for ${key}: expected JSON array or object` 
                }, { status: 400 });
            }
        }

        const result = await updateMigrationData(data);
        
        if (result.success) {
            const storageType = result.storage === 'file' ? 'JSON files' : 'in-memory data';
            console.log(`${storageType} updated successfully`);
            return NextResponse.json({ 
                message: `${storageType} updated successfully`,
                updatedFields: result.updatedFiles,
                storageType: result.storage
            });
        } else {
            console.error('Failed to update data');
            return NextResponse.json({ 
                error: 'Failed to update data',
                details: result.error instanceof Error ? result.error.message : String(result.error)
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ 
            error: 'Failed to process request',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

// GET endpoint to retrieve data
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const key = url.searchParams.get('key');
    
    if (!key) {
        return NextResponse.json({ error: 'No key provided' }, { status: 400 });
    }
    
    const data = await getData(key);
    
    if (data === null) {
        return NextResponse.json({ error: `No data found for key: ${key}` }, { status: 404 });
    }
    
    return NextResponse.json({ data });
}
