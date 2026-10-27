const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const files=['index.html','lectures.html','materials.html','materials.js','course-theme.css','course-shell.js','landing.js','decision-math.js','lecture-content.js','lecture-visuals.js','lesson-experiments.js','lectures.js','math-render.js','math.css','assets'];
const dest='.build/site';fs.rmSync(dest,{recursive:true,force:true});fs.mkdirSync(dest,{recursive:true});for(const name of files)fs.cpSync(name,path.join(dest,name),{recursive:true});fs.writeFileSync(path.join(dest,'.nojekyll'),'');console.log('Built static site in '+dest);
// Updated explanations must not reuse an earlier cached content bundle or renderer.
for(const name of files.filter(name=>name.endsWith('.html'))){
 const file=path.join(dest,name);
 const html=fs.readFileSync(file,'utf8').replace(/\b(src|href)="([^":?#]+\.(?:js|css))"/g,(match,attribute,url)=>{
  const asset=path.join(dest,url);if(!fs.existsSync(asset))throw Error('Missing runtime asset '+url);
  const version=crypto.createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0,12);
  return `${attribute}="${url}?v=${version}"`;
 });
 fs.writeFileSync(file,html);
}
