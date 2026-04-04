const fs = require('fs');
const path = require('path');

const directories = [
    'c:\\Users\\Nana\\Downloads\\Smart Study Planner App\\frontend\\src\\pages',
    'c:\\Users\\Nana\\Downloads\\Smart Study Planner App\\frontend\\src\\components',
    'c:\\Users\\Nana\\Downloads\\Smart Study Planner App\\frontend\\src'
];

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reverse structural backgrounds
    content = content.replace(/bg-slate-50/g, 'bg-[#0f172a]');
    content = content.replace(/bg-white/g, 'bg-slate-800/60');
    
    // Structural tweaks for navbar/sidebar
    content = content.replace(/bg-slate-800\/60 border-r/g, 'bg-[#0f172a] border-r');
    content = content.replace(/bg-slate-800\/60 border-b/g, 'bg-[#0f172a] border-b');
    
    // Reverse texts
    content = content.replace(/text-slate-800/g, 'text-slate-100');
    content = content.replace(/text-slate-700/g, 'text-slate-200');
    content = content.replace(/text-slate-600/g, 'text-slate-300');
    content = content.replace(/text-slate-500/g, 'text-slate-400');
    content = content.replace(/text-slate-900/g, 'text-white');
    
    // Reverse borders
    content = content.replace(/border-slate-100/g, 'border-slate-800/50');
    content = content.replace(/border-slate-200/g, 'border-slate-700/50');
    content = content.replace(/border-slate-300/g, 'border-slate-700');

    // Professional Accents (removing chaotic neons like pink/purple to use sleek blue/indigo)
    content = content.replace(/pink-400/g, 'indigo-400');
    content = content.replace(/pink-500/g, 'indigo-500');
    content = content.replace(/pink-600/g, 'indigo-600');
    content = content.replace(/purple-400/g, 'indigo-400');
    content = content.replace(/purple-500/g, 'indigo-500');
    content = content.replace(/purple-600/g, 'indigo-600');
    content = content.replace(/emerald-400/g, 'teal-400');
    content = content.replace(/emerald-500/g, 'teal-500');
    content = content.replace(/emerald-600/g, 'teal-600');
    
    // Fix shadow opacities (soften neon glows to professional subtle glows)
    content = content.replace(/shadow-lg shadow-(blue|indigo|teal)-500\/[0-9]+/g, 'shadow-md shadow-$1-500/10');
    content = content.replace(/shadow-\[0_0_15px_rgba\([0-9]+,[0-9]+,[0-9]+,0.3\)\]/g, 'shadow-md border-transparent');
    
    // Tone down pure text gradient drop shadows
    content = content.replace(/drop-shadow-lg/g, 'drop-shadow-sm');
    content = content.replace(/drop-shadow-md/g, 'drop-shadow-sm');

    fs.writeFileSync(filePath, content, 'utf8');
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

for (const dir of directories) {
    if (fs.existsSync(dir)) {
        processDirectory(dir);
        console.log(`Processed ${dir}`);
    }
}
