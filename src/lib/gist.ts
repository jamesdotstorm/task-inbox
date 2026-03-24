const GIST_TOKEN = process.env.NEXT_PUBLIC_GIST_TOKEN || '';
const GIST_FILENAME = 'task-inbox-v1.json';
const GIST_ID = 'db7e2493355e421982e35e79ffdc3069';

async function getOrCreateGist(): Promise<string> {
  return GIST_ID;
}

export async function loadFromGist(): Promise<unknown[] | null> {
  try {
    const id = await getOrCreateGist();
    const res = await fetch(`https://api.github.com/gists/${id}`, {
      headers: { Authorization: `token ${GIST_TOKEN}` },
    });
    const gist = await res.json();
    const content = gist.files?.[GIST_FILENAME]?.content;
    return content ? JSON.parse(content) : null;
  } catch (e) {
    console.error('Gist load failed:', e);
    return null;
  }
}

export async function saveToGist(tasks: unknown[]): Promise<void> {
  try {
    const id = await getOrCreateGist();
    await fetch(`https://api.github.com/gists/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `token ${GIST_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(tasks) } } }),
    });
  } catch (e) {
    console.error('Gist save failed:', e);
  }
}
