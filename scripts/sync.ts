import { simpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';

const REPO_URL = 'https://github.com/Anduin2017/HowToCook.git';
const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const REPO_DIR = path.join(CACHE_DIR, 'HowToCook');

export async function syncRepository(): Promise<string> {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  const git = simpleGit();

  if (fs.existsSync(path.join(REPO_DIR, '.git'))) {
    console.log('📦 更新已有仓库...');
    const repoGit = simpleGit(REPO_DIR);
    await repoGit.pull('origin', 'master');
    console.log('✅ 仓库已更新');
  } else {
    console.log('📥 首次克隆仓库（shallow clone）...');
    await git.clone(REPO_URL, REPO_DIR, ['--depth', '1']);
    console.log('✅ 仓库已克隆');
  }

  return REPO_DIR;
}
