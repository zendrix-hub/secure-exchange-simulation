import React, { useState, useRef, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import './index.css';

// Crypto Helpers
const modPow = (base, exponent, modulus) => {
  if (modulus === 1n) return 0n;
  let result = 1n;
  base = base % modulus;
  while (exponent > 0n) {
    if (exponent % 2n === 1n) {
      result = (result * base) % modulus;
    }
    exponent = exponent >> 1n;
    base = (base * base) % modulus;
  }
  return result;
};

const transformTo128BitKey = (sharedKey) => {
  let keyStr = sharedKey.toString();
  let length = keyStr.length;
  let aesKey = "";
  if (length === 1) {
    while (aesKey.length < 16) { aesKey += keyStr + "C"; }
  } else if (length === 2) {
    while (aesKey.length < 16) { aesKey += keyStr + "DD"; }
  } else if (length >= 3) {
    while (aesKey.length < 16) { aesKey += keyStr + "F"; }
  }
  return aesKey.substring(0, 16);
};

const padSubMessage = (subMsg) => {
  let padded = subMsg;
  while (padded.length < 16) { padded += "@"; }
  return padded;
};

const chunkMessage = (message) => {
  let chunks = [];
  if (message.length === 0) return [padSubMessage("")];
  for (let i = 0; i < message.length; i += 16) {
    chunks.push(message.substring(i, i + 16));
  }
  chunks[chunks.length - 1] = padSubMessage(chunks[chunks.length - 1]);
  return chunks;
};

export default function App() {
  const [params, setParams] = useState({
    p: '199', g: '127', privA: '57', privB: '167',
    message: 'The Mandalorian Must Always Recite, This is The Way!'
  });

  const [simState, setSimState] = useState({
    step: 0,
    data: {},
    logs: {
      1: "Not started.", 2: "Waiting for previous step...",
      3: "Waiting for previous step...", 4: "Waiting for previous step...",
      5: "Waiting for previous step..."
    }
  });

  const stepRefs = {
    1: useRef(null), 2: useRef(null), 3: useRef(null),
    4: useRef(null), 5: useRef(null)
  };

  const handleInputChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const appendLog = (step, msg, overlay = true) => {
    setSimState(prev => {
      let currentLog = prev.logs[step];
      if (!overlay || currentLog.includes("Waiting") || currentLog.includes("Not started")) {
        currentLog = msg;
      } else {
        currentLog += "\n" + msg;
      }
      return { ...prev, logs: { ...prev.logs, [step]: currentLog } };
    });
  };

  const setSimData = (newData) => {
    setSimState(prev => ({ ...prev, data: { ...prev.data, ...newData } }));
  };

  useEffect(() => {
    if (simState.step > 0 && simState.step <= 5) {
      stepRefs[simState.step].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [simState.step]);

  const initSimulation = () => {
    try {
      const p = BigInt(params.p);
      const g = BigInt(params.g);
      const privA = BigInt(params.privA);
      const privB = BigInt(params.privB);
      
      setSimState({
        step: 1,
        data: { p, g, privA, privB, originalMessage: params.message },
        logs: { 1: "Not started.", 2: "Waiting for previous step...", 3: "Waiting for previous step...", 4: "Waiting for previous step...", 5: "Waiting for previous step..." }
      });

      // Execute Step 1 logic
      setTimeout(() => executeStep1(p, g, privA, privB), 50);
    } catch(e) {
      alert("Invalid parameters. Please use numbers.");
    }
  };

  const executeStep1 = (p, g, privA, privB) => {
    appendLog(1, `Prime (p) = ${p}, Generator (g) = ${g}`, false);
    
    let pubA = modPow(g, privA, p);
    let pubB = modPow(g, privB, p);
    
    appendLog(1, `User A Public Value: ${g}^${privA} mod ${p} = ${pubA}`);
    appendLog(1, `User B Public Value: ${g}^${privB} mod ${p} = ${pubB}`);
    
    let sharedA = modPow(pubB, privA, p);
    let sharedB = modPow(pubA, privB, p);
    
    appendLog(1, `\nUser A computes Shared Key: ${pubB}^${privA} mod ${p} = ${sharedA}`);
    appendLog(1, `User B computes Shared Key: ${pubA}^${privB} mod ${p} = ${sharedB}`);
    
    if (sharedA !== sharedB) {
      appendLog(1, `\nERROR: Key exchange failed! Keys do not match.`);
    }

    setSimData({ pubA, pubB, sharedKey: sharedA, sharedB });
  };

  const executeStep = () => {
    const nextStep = simState.step + 1;
    if (nextStep > 5) return;
    
    setSimState(prev => ({ ...prev, step: nextStep }));
    const d = simState.data;

    if (nextStep === 2) {
      let aesKeyStr = transformTo128BitKey(d.sharedKey);
      appendLog(2, `Original Shared Key: ${d.sharedKey}`, false);
      appendLog(2, `Transformed 128-bit AES Key (ASCII): ${aesKeyStr}`);
      setSimData({ aesKeyStr });
    }
    else if (nextStep === 3) {
      appendLog(3, `Original Message (${d.originalMessage.length} chars): '${d.originalMessage}'`, false);
      let chunks = chunkMessage(d.originalMessage);
      chunks.forEach((chunk, idx) => {
        appendLog(3, `Sub-message ${idx + 1}: '${chunk}' -> Length: ${chunk.length}`);
      });
      setSimData({ chunks });
    }
    else if (nextStep === 4) {
      appendLog(4, `Starting AES-128 ECB Encryption...`, false);
      let aesKeyHex = CryptoJS.enc.Utf8.parse(d.aesKeyStr);
      let encryptedHexChunks = [];
      let fullPayloadHex = "";
      
      d.chunks.forEach((chunk, idx) => {
        let chunkData = CryptoJS.enc.Utf8.parse(chunk);
        let encrypted = CryptoJS.AES.encrypt(chunkData, aesKeyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.NoPadding
        });
        let hexStr = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
        encryptedHexChunks.push(hexStr);
        fullPayloadHex += hexStr;
        appendLog(4, `Encrypted Sub-message ${idx + 1} (Hex): ${hexStr}`);
      });
      
      appendLog(4, `\nTransmitted Encrypted Payload (Hex): \n${fullPayloadHex}`);
      setSimData({ fullPayloadHex, encryptedHexChunks });
    }
    else if (nextStep === 5) {
      appendLog(5, `Receiving and decrypting payload...`, false);
      let aesKeyHex = CryptoJS.enc.Utf8.parse(d.aesKeyStr);
      let decryptedMessage = "";
      
      d.encryptedHexChunks.forEach((hexChunk, idx) => {
        let cipherParams = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Hex.parse(hexChunk)
        });
        let decrypted = CryptoJS.AES.decrypt(cipherParams, aesKeyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.NoPadding
        });
        let text = decrypted.toString(CryptoJS.enc.Utf8);
        decryptedMessage += text;
        appendLog(5, `Decrypted Sub-message ${idx + 1}: '${text}'`);
      });
      
      let finalMessage = decryptedMessage.replace(/@+$/, '');
      appendLog(5, `\nReconstructed Message (Padding Stripped): '${finalMessage}'`);
    }
  };

  const getStepClass = (step) => {
    if (step < simState.step) return "step completed active";
    if (step === simState.step) return "step active";
    return "step";
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
      <main className="container">
        <header>
          <h1>Secure Information Exchange</h1>
          <p>Interactive simulation of Diffie-Hellman key exchange and AES-128 encryption</p>
        </header>

        <div className="simulation-layout">
          <section className="card config-section">
            <div className="card-header"><h2>Global Parameters</h2></div>
            <div className="card-body">
              <div className="input-group">
                <label>Prime (p)</label>
                <input type="number" name="p" value={params.p} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Generator (g)</label>
                <input type="number" name="g" value={params.g} onChange={handleInputChange} />
              </div>
              <div className="input-group">
                <label>Secret Message</label>
                <input type="text" name="message" value={params.message} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <div className="users-container">
            <section className="card user-card user-a">
              <div className="card-header"><h2>User A (Sender)</h2></div>
              <div className="card-body">
                <div className="input-group">
                  <label>Private Key (a)</label>
                  <input type="number" name="privA" value={params.privA} onChange={handleInputChange} />
                </div>
                <div className="status-box">
                  <div className="status-row"><span>Public Value:</span> <span className="mono">{simState.data.pubA !== undefined ? simState.data.pubA.toString() : '-'}</span></div>
                  <div className="status-row"><span>Shared Key:</span> <span className="mono">{simState.data.sharedKey !== undefined ? simState.data.sharedKey.toString() : '-'}</span></div>
                  <div className="status-row"><span>AES Key:</span> <span className="mono">{simState.data.aesKeyStr || '-'}</span></div>
                </div>
              </div>
            </section>

            <section className="card user-card user-b">
              <div className="card-header"><h2>User B (Receiver)</h2></div>
              <div className="card-body">
                <div className="input-group">
                  <label>Private Key (b)</label>
                  <input type="number" name="privB" value={params.privB} onChange={handleInputChange} />
                </div>
                <div className="status-box">
                  <div className="status-row"><span>Public Value:</span> <span className="mono">{simState.data.pubB !== undefined ? simState.data.pubB.toString() : '-'}</span></div>
                  <div className="status-row"><span>Shared Key:</span> <span className="mono">{simState.data.sharedB !== undefined ? simState.data.sharedB.toString() : '-'}</span></div>
                  <div className="status-row"><span>AES Key:</span> <span className="mono">{simState.data.aesKeyStr || '-'}</span></div>
                </div>
              </div>
            </section>
          </div>

          <section className="card channel-card">
            <div className="card-header"><h2>Public Transmission Channel</h2></div>
            <div className="card-body">
              <div className={`channel-data ${simState.data.fullPayloadHex ? 'active' : ''}`}>
                {simState.data.fullPayloadHex || 'Waiting for transmission...'}
              </div>
            </div>
          </section>

          <section className="card steps-card">
            <div className="card-header">
              <h2>Simulation Steps</h2>
              <div>
                <button onClick={initSimulation} className="primary-btn" style={{marginRight: '10px'}}>
                  {simState.step > 0 ? "Restart" : "Initialize"} Simulation
                </button>
                <button onClick={executeStep} className="secondary-btn" disabled={simState.step === 0 || simState.step >= 5}>
                  Next Step
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="timeline">
                {[
                  { id: 1, title: "Diffie-Hellman Key Exchange" },
                  { id: 2, title: "AES-128 Key Transformation" },
                  { id: 3, title: "Message Chunking & Padding" },
                  { id: 4, title: "Encryption & Transmission" },
                  { id: 5, title: "Decryption & Reconstruction" }
                ].map(s => (
                  <div key={s.id} className={getStepClass(s.id)} ref={stepRefs[s.id]}>
                    <div className="step-indicator">{s.id}</div>
                    <div className="step-content">
                      <h3>{s.title}</h3>
                      <div className="step-details">{simState.logs[s.id]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
