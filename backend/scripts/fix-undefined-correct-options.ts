import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../src/topics/assessment-question-bank.ts');
let content = fs.readFileSync(filePath, 'utf8');

// In Native VLAN question:
content = content.replace(
  /(\"The Native VLAN requires all connected client workstations to disable their physical network interface cards\"\s*\],\s*)correctOption:\s*undefined,/g,
  '$1correctOption: 2,'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed Native VLAN correctOption');
