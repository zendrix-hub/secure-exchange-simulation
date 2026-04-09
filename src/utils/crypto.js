export const modPow = (base, exponent, modulus) => {
  const zero = BigInt(0);
  const one = BigInt(1);
  const two = BigInt(2);

  if (modulus === one) return zero;
  let result = one;
  base = base % modulus;
  while (exponent > zero) {
    if (exponent % two === one) {
      result = (result * base) % modulus;
    }
    exponent = exponent / two;
    base = (base * base) % modulus;
  }
  return result;
};

export const transformTo128BitKey = (sharedKey) => {
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

export const padSubMessage = (subMsg) => {
  let padded = subMsg;
  while (padded.length < 16) { padded += "@"; }
  return padded;
};

export const chunkMessage = (message) => {
  let chunks = [];
  if (message.length === 0) return [padSubMessage("")];
  for (let i = 0; i < message.length; i += 16) {
    chunks.push(message.substring(i, i + 16));
  }
  chunks[chunks.length - 1] = padSubMessage(chunks[chunks.length - 1]);
  return chunks;
};

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
