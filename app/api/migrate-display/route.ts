import { readFile, readdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        // Read the migrate2.mjs file
        const filePath = path.join(process.cwd(), 'migrate2.mjs');
        let content = await readFile(filePath, 'utf-8');

        // Read all JSON files from the data directory
        const dataDir = path.join(process.cwd(), 'data');
        const files = await readdir(dataDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        // Create a map of JSON file names to their content
        const jsonContents: Record<string, any> = {};
        for (const file of jsonFiles) {
            const jsonPath = path.join(dataDir, file);
            let jsonContent = await readFile(jsonPath, 'utf-8');
            
            // Remove BOM character if present
            if (jsonContent.charCodeAt(0) === 0xFEFF) {
                jsonContent = jsonContent.slice(1);
            }
            
            const fileName = file.replace('.json', '');
            try {
                jsonContents[fileName] = JSON.parse(jsonContent);
            } catch (error) {
                console.error(`Error parsing JSON file ${file}:`, error);
                // Use an empty object or array as fallback
                jsonContents[fileName] = jsonContent.trim().startsWith('[') ? [] : {};
            }
        }

        // Remove the import statements for JSON files
        const importRegex = /const (\w+)Json = JSON\.parse\(readFileSync\(join\(__dirname, '\.\/data\/(\w+)\.json'\), 'utf8'\)\);/g;
        content = content.replace(importRegex, '');

        // Replace the variable assignments that use the imported JSON
        const assignmentRegex = /const (\w+) = (\w+)Json;/g;
        content = content.replace(assignmentRegex, '');
        
        // Replace the getData calls with the actual JSON content
        const getDataRegex = /const (\w+) = await getData\('(\w+)'\);/g;
        let match;
        while ((match = getDataRegex.exec(content)) !== null) {
            const variableName = match[1];
            const fileName = match[2];
            const jsonContent = jsonContents[fileName];
            
            if (jsonContent) {
                const getDataStatement = new RegExp(`const ${variableName} = await getData\\('${fileName}'\\);`, 'g');
                const replacement = `const ${variableName} = ${JSON.stringify(jsonContent, null, 2)};`;
                content = content.replace(getDataStatement, replacement);
            }
        }

        // Generate researchDocData_es2 dynamically
        const generateEs2Code = `
// Generate researchDocData_es2 dynamically based on researchDocData and researchDocData_es
const researchDocData_es2 = {
  type: researchDocData_es.type,
  uid: researchDocData_es.uid,
  lang: researchDocData_es.lang,
  data: {
    ...researchDocData.data,
    title: researchDocData_es.data.title,
    tldr: researchDocData_es.data.tldr,
    methodology: researchDocData_es.data.methodology,
    intervention: researchDocData_es.data.intervention,
    intervention_snomed_list: researchDocData_es.data.intervention_snomed_list,
    key_findings: researchDocData_es.data.key_findings
  }
};`;

        // Replace the dynamic generation code with a comment
        const generationRegex = /\/\/ Generate researchDocData_es2 dynamically[\s\S]*?};/g;
        content = content.replace(generationRegex, generateEs2Code);

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Error processing file:', error);
        return NextResponse.json({ error: 'Error processing file' }, { status: 500 });
    }
}
