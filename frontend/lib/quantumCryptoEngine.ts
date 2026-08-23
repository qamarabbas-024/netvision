/**
 * NetVision Quantum-Safe Cryptography & Post-Quantum Engine (Version 5.7)
 * Simulates NIST PQC lattice cryptography (ML-KEM Crystals-Kyber-1024,
 * Crystals-Dilithium) and evaluates resistance against Shor's Quantum Algorithm.
 */

export interface CryptoAlgorithmProfile {
  id: string;
  name: string;
  family: 'CLASSICAL_RSA' | 'CLASSICAL_ECC' | 'PQC_LATTICE_KEM' | 'PQC_LATTICE_DSA';
  publicKeySizeBytes: number;
  ciphertextSizeBytes: number;
  quantumSecurityBits: number;
  shorsAlgorithmVulnerable: boolean;
  mathematicalHardness: string;
}

export class QuantumCryptoEngine {
  public static getAlgorithmProfiles(): CryptoAlgorithmProfile[] {
    return [
      {
        id: 'rsa-4096',
        name: 'RSA-4096 (Classical)',
        family: 'CLASSICAL_RSA',
        publicKeySizeBytes: 512,
        ciphertextSizeBytes: 512,
        quantumSecurityBits: 0,
        shorsAlgorithmVulnerable: true,
        mathematicalHardness: 'Integer Prime Factorization (Shor Factorable in O(n³))',
      },
      {
        id: 'ecdh-x25519',
        name: 'ECDH X25519 (Classical)',
        family: 'CLASSICAL_ECC',
        publicKeySizeBytes: 32,
        ciphertextSizeBytes: 32,
        quantumSecurityBits: 0,
        shorsAlgorithmVulnerable: true,
        mathematicalHardness: 'Elliptic Curve Discrete Logarithm (ECDLP)',
      },
      {
        id: 'ml-kem-kyber-1024',
        name: 'ML-KEM Crystals-Kyber-1024 (NIST PQC)',
        family: 'PQC_LATTICE_KEM',
        publicKeySizeBytes: 1568,
        ciphertextSizeBytes: 1568,
        quantumSecurityBits: 256,
        shorsAlgorithmVulnerable: false,
        mathematicalHardness: 'Module Learning With Errors (M-LWE) over Polynomial Rings',
      },
      {
        id: 'ml-dsa-dilithium-5',
        name: 'ML-DSA Crystals-Dilithium-5 (NIST PQC)',
        family: 'PQC_LATTICE_DSA',
        publicKeySizeBytes: 2592,
        ciphertextSizeBytes: 4595,
        quantumSecurityBits: 256,
        shorsAlgorithmVulnerable: false,
        mathematicalHardness: 'Module Short Integer Solution (M-SIS)',
      },
    ];
  }
}
