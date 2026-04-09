import { useState, useCallback, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { modPow, transformTo128BitKey, chunkMessage, delay } from '../utils/crypto';

export function useSimulation() {
  const [params, setParams] = useState({
    p: '199', g: '127', privA: '57', privB: '167',
    message: 'The Mandalorian Must Always Recite, This is The Way!'
  });

  const [simState, setSimState] = useState({
    step: 0,
    isSimulating: false,
    data: {},
    logs: { 1: [], 2: [], 3: [], 4: [], 5: [] }
  });

  // Used to cancel stale simulations when inputs change rapidly
  const currentSimRef = useRef(0);

  const handleInputChange = useCallback((e) => {
    setParams(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const addLog = useCallback((step, msg) => {
    setSimState(prev => ({
      ...prev,
      logs: {
        ...prev.logs,
        [step]: [...prev.logs[step], msg]
      }
    }));
  }, []);

  const setSimData = useCallback((newData) => {
    setSimState(prev => ({ ...prev, data: { ...prev.data, ...newData } }));
  }, []);

  // --- AUTOMATIC TRIGGER ---
  useEffect(() => {
    // Only run if all required data fields are populated
    if (params.p && params.g && params.privA && params.privB && params.message) {
      // Debounce: Wait 1 second after the user stops typing before starting
      const timer = setTimeout(() => {
        startAutoSimulation();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [params]);

  const startAutoSimulation = async () => {
    const simId = Date.now();
    currentSimRef.current = simId;
    const isActive = () => currentSimRef.current === simId;

    try {
      const p = BigInt(params.p);
      const g = BigInt(params.g);
      const privA = BigInt(params.privA);
      const privB = BigInt(params.privB);

      setSimState({
        step: 1,
        isSimulating: true,
        data: { p, g, privA, privB, originalMessage: params.message },
        logs: { 1: [], 2: [], 3: [], 4: [], 5: [] }
      });

      if (!isActive()) return;
      await delay(800);

      // --- STEP 1: Diffie-Hellman ---
      addLog(1, `Initializing Diffie-Hellman parameters...`);
      addLog(1, `Prime (p) = ${p}, Generator (g) = ${g}`);
      if (!isActive()) return; await delay(1000);

      let pubA = modPow(g, privA, p);
      let pubB = modPow(g, privB, p);
      setSimData({ pubA, pubB });
      addLog(1, `User A calculates Public Value: ${g}^${privA} mod ${p} = ${pubA}`);
      addLog(1, `User B calculates Public Value: ${g}^${privB} mod ${p} = ${pubB}`);
      if (!isActive()) return; await delay(1500);

      addLog(1, `Exchanging public values across channel...`);
      if (!isActive()) return; await delay(1000);

      let sharedA = modPow(pubB, privA, p);
      let sharedB = modPow(pubA, privB, p);
      setSimData({ sharedKey: sharedA, sharedB });
      addLog(1, `User A computes Shared Key: ${pubB}^${privA} mod ${p} = ${sharedA}`);
      addLog(1, `User B computes Shared Key: ${pubA}^${privB} mod ${p} = ${sharedB}`);

      if (sharedA !== sharedB) {
        addLog(1, `ERROR: Key exchange failed! Keys do not match.`);
        setSimState(prev => ({ ...prev, isSimulating: false }));
        return;
      }
      addLog(1, `SUCCESS: Shared secrets match securely!`);
      if (!isActive()) return; await delay(1500);

      // --- STEP 2: AES Transformation ---
      setSimState(prev => ({ ...prev, step: 2 }));
      if (!isActive()) return; await delay(800);
      addLog(2, `Original Shared Key (Int): ${sharedA}`);
      if (!isActive()) return; await delay(1000);

      let aesKeyStr = transformTo128BitKey(sharedA);
      setSimData({ aesKeyStr });
      addLog(2, `Applying transformation protocol...`);
      if (!isActive()) return; await delay(800);
      addLog(2, `Transformed 128-bit AES Key (ASCII): ${aesKeyStr}`);
      if (!isActive()) return; await delay(1500);

      // --- STEP 3: Chunking & Padding ---
      setSimState(prev => ({ ...prev, step: 3 }));
      if (!isActive()) return; await delay(800);
      addLog(3, `Original Message (${params.message.length} chars): '${params.message}'`);
      if (!isActive()) return; await delay(1000);

      let chunks = chunkMessage(params.message);
      setSimData({ chunks });
      chunks.forEach((chunk, idx) => {
        addLog(3, `Chunk [${idx + 1}]: '${chunk}' (Len: ${chunk.length})`);
      });
      if (!isActive()) return; await delay(1500);

      // --- STEP 4: Encryption & Tx ---
      setSimState(prev => ({ ...prev, step: 4 }));
      if (!isActive()) return; await delay(800);
      addLog(4, `Initializing AES-128 ECB Encryption sequence...`);
      if (!isActive()) return; await delay(1000);

      let aesKeyHex = CryptoJS.enc.Utf8.parse(aesKeyStr);
      let encryptedHexChunks = [];
      let fullPayloadHex = "";

      for (let i = 0; i < chunks.length; i++) {
        if (!isActive()) return;
        let chunkData = CryptoJS.enc.Utf8.parse(chunks[i]);
        let encrypted = CryptoJS.AES.encrypt(chunkData, aesKeyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.NoPadding
        });
        let hexStr = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
        encryptedHexChunks.push(hexStr);
        fullPayloadHex += hexStr;
        addLog(4, `Encrypted Chunk [${i + 1}] -> ${hexStr}`);
        await delay(400);
      }

      setSimData({ fullPayloadHex, encryptedHexChunks });
      addLog(4, `TRANSMITTING ENCRYPTED PAYLOAD TO CHANNEL...`);
      if (!isActive()) return; await delay(2500);

      // --- STEP 5: Decryption ---
      setSimState(prev => ({ ...prev, step: 5 }));
      if (!isActive()) return; await delay(800);
      addLog(5, `Intercepting payload from channel...`);
      if (!isActive()) return; await delay(1000);

      let decryptedMessage = "";
      for (let i = 0; i < encryptedHexChunks.length; i++) {
        if (!isActive()) return;
        let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Hex.parse(encryptedHexChunks[i])
        });
        let decrypted = CryptoJS.AES.decrypt(cipherParams, aesKeyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.NoPadding
        });
        let text = decrypted.toString(CryptoJS.enc.Utf8);
        decryptedMessage += text;
        addLog(5, `Decrypted Chunk [${i + 1}] -> '${text}'`);
        await delay(400);
      }

      let finalMessage = decryptedMessage.replace(/@+$/, '');
      setSimData({ finalMessage });
      if (!isActive()) return; await delay(800);
      addLog(5, `Stripping padding sequence '@'...`);
      if (!isActive()) return; await delay(800);
      addLog(5, `RECONSTRUCTED MESSAGE: '${finalMessage}'`);

      setSimState(prev => ({ ...prev, step: 6, isSimulating: false }));

    } catch (e) {
      if (isActive()) {
        addLog(1, "ERROR: Invalid parameters. Mathematical constraints not met.");
        setSimState(prev => ({ ...prev, isSimulating: false }));
      }
    }
  };

  return { params, simState, handleInputChange, startAutoSimulation };
}