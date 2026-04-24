import fs from 'fs';
import path from 'path';

const apiDir = path.resolve('frontend/app/api');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already using the shared singleton
  if (content.includes("from '@/lib/prisma'") || content.includes('from "@/lib/prisma"')) {
    console.log(`  ✅ Already fixed: ${filePath}`);
    return;
  }
  
  // Check if it has PrismaClient import
  if (!content.includes('PrismaClient')) {
    return;
  }
  
  // Replace import line
  content = content.replace(
    /import\s*\{\s*PrismaClient\s*\}\s*from\s*['"][^'"]+['"]\s*;?\n?/g,
    ''
  );
  
  // Replace const prisma = new PrismaClient();
  content = content.replace(
    /const\s+prisma\s*=\s*new\s+PrismaClient\(\)\s*;?\n?/g,
    ''
  );
  
  // Add the correct import at the top (after 'next/server' import if it exists)
  if (content.includes("from 'next/server'")) {
    content = content.replace(
      "from 'next/server';",
      "from 'next/server';\nimport prisma from '@/lib/prisma';"
    );
  } else {
    content = "import prisma from '@/lib/prisma';\n" + content;
  }
  
  // Clean up any double newlines caused by removal
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`  🔧 Fixed: ${filePath}`);
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name === 'route.ts') {
      fixFile(fullPath);
    }
  }
}

console.log('🔄 Fixing PrismaClient imports across all API routes...\n');
walkDir(apiDir);
console.log('\n✅ Done!');
