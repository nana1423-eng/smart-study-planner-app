const fs = require('fs');
const path = require('path');

const directoryPath = 'c:\\Users\\Nana\\Downloads\\Smart Study Planner App\\frontend\\src\\pages';
const componentsPath = 'c:\\Users\\Nana\\Downloads\\Smart Study Planner App\\frontend\\src\\components';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-slate-900/g, 'bg-slate-50');
    content = content.replace(/bg-\[\#0f172a\]/g, 'bg-slate-50');
    content = content.replace(/bg-slate-800\/[0-9]+/g, 'bg-white');
    content = content.replace(/bg-slate-800/g, 'bg-white');
    content = content.replace(/bg-\[\#1e293b\]\/[0-9]+/g, 'bg-white');
    
    // Text colors
    // Be careful with text-white, usually it's used on dark backgrounds or inside colored buttons.
    // If it's a heading like `text-white`, we change it.
    content = content.replace(/text-slate-200/g, 'text-slate-700');
    content = content.replace(/text-slate-300/g, 'text-slate-600');
    content = content.replace(/text-slate-400/g, 'text-slate-500');
    content = content.replace(/text-slate-100/g, 'text-slate-800');
    
    // Specific text-white replacements (only when not obviously inside a filled button like bg-blue-600)
    // Actually, simple regex might ruin buttons. Let's just do text-slate changes, and manually fix white text where obvious.
    
    // Borders
    content = content.replace(/border-slate-700/g, 'border-slate-200');
    content = content.replace(/border-slate-600/g, 'border-slate-300');
    content = content.replace(/border-slate-500/g, 'border-slate-300');

    // Dividers
    content = content.replace(/divide-slate-700/g, 'divide-slate-200');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${filePath}`);
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

processDirectory(directoryPath);
processDirectory(componentsPath);
