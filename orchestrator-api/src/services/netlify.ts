import { createReadStream } from 'fs';
import FormData from 'form-data';
import axios from 'axios';

const NETLIFY_API = 'https://api.netlify.com/api/v1';
const NETLIFY_TOKEN = 'nfp_6hiR1UiX9DJdptmpEHN8ns3nFznfxSxt30b2'; // Use env var in production

export async function deployToNetlify(appFolderPath: string, siteName: string): Promise<string> {
    // 1. Create a new site on Netlify
    const siteResponse = await axios.post(
        `${NETLIFY_API}/sites`,
        { name: siteName },
        { headers: { Authorization: `Bearer ${NETLIFY_TOKEN}` } }
    );

    const siteId = siteResponse.data.id;

    // 2. Deploy files (zip the appFolderPath first in a real scenario)
    const formData = new FormData();
    formData.append('file', createReadStream(`${appFolderPath}.zip`));

    const deployResponse = await axios.post(
        `${NETLIFY_API}/sites/${siteId}/deploys`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${NETLIFY_TOKEN}`,
                ...formData.getHeaders()
            }
        }
    );

    // 3. Return the live URL
    return `https://${siteName}.netlify.app`;
}
