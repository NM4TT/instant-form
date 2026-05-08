/**
 * Encrypts a string payload using a PEM public key via Web Crypto API (RSA-OAEP).
 */
export async function encryptPayload(payload: string, pemKey: string): Promise<string> {
    const publicKey = await importPublicKey(pemKey);
    const encoded = new TextEncoder().encode(payload);
    
    // RSA-OAEP encryption
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        encoded
    );
    
    // Convert to Base64 for transit
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

async function importPublicKey(pem: string) {
    // Remove PEM headers/footers and whitespace
    const pemContents = pem
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s/g, '');
    
    // Decode base64 to array buffer
    const binaryDerString = atob(pemContents);
    const binaryDer = new Uint8Array(binaryDerString.length);
    for (let i = 0; i < binaryDerString.length; i++) {
        binaryDer[i] = binaryDerString.charCodeAt(i);
    }
    
    return await window.crypto.subtle.importKey(
        "spki",
        binaryDer.buffer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        true,
        ["encrypt"]
    );
}
