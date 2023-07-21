import dnsPromises from 'dns/promises';

const domainCheck = async (domain: string): Promise<boolean> =>{
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
    
    if (!domainRegex.test(domain)) {
        return false;
    }

    try {
        await dnsPromises.resolve(domain);
        return true;
    } catch (error) {
        return false;
    }
}

export default domainCheck;