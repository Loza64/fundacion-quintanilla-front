 
import { execSync } from 'child_process'
import { existsSync } from 'fs'

const huskyDirectory = 'node_modules/husky'

if (existsSync(huskyDirectory)) execSync('pnpm husky', { stdio: 'inherit' })
else console.log('Husky is not installed.')
