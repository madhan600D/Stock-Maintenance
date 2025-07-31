import { readFile } from 'fs/promises';

export const ImportEmailHTML = async () => {
  try {
    const data = await readFile('./NodeMailer/Verification.html', 'utf-8');
    return data;
  } catch (err) {
    console.error('Error reading email template:', err.message);
    return;
  }
};
