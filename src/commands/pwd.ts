import { getGitDirRoot } from '../utils/git';

/** Handler for pwd */
export async function pwd() {
  const pwd = await getGitDirRoot();
  console.log(pwd);
}
