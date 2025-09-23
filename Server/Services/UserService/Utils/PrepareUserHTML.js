import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const PrepareHTML = async (MailType, MailData) => {
    try {
        let HTML = await ImportEmailHTML(MailType);

        MailData.forEach((Value , Key) => {
            const Regex = new RegExp(Key, "g");
            HTML = HTML.replace(Regex , Value)
        })

        return HTML;
        
    } catch (error) {
        
    }
}


export const ImportEmailHTML = async (HTML) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname,  'HTML', `${HTML}.html`);
    const data = await readFile(filePath , 'utf-8')
    return data;
  } catch (err) {
    console.error('Error reading email template:', err.message);
    return;
  }
};