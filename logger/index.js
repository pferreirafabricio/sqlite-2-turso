import 'dotenv/config'

const isSilent = process.env.SILENT === 'true';

/**
 * @param {string} message 
 */
export function log(message) {
    if (!isSilent) console.log(message);
}
