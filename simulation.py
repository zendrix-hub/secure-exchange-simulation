from Crypto.Cipher import AES
import binascii

# ---------------------------------------------------------
# 1. Diffie-Hellman Key Exchange
# ---------------------------------------------------------
def calculate_public_value(g, priv_key, p):
    """Calculates the public value: g^a mod p"""
    return pow(g, priv_key, p)

def calculate_shared_key(public_val, priv_key, p):
    """Calculates the shared secret key."""
    return pow(public_val, priv_key, p)

# ---------------------------------------------------------
# 2. AES-128 Key Transformation
# ---------------------------------------------------------
def transform_to_128bit_key(shared_key):
    """Transforms the integer shared key into a 16-byte (128-bit) ASCII string."""
    key_str = str(shared_key)
    length = len(key_str)
    aes_key = ""
    
    # Apply transformation rules based on character length
    if length == 1:
        while len(aes_key) < 16:
            aes_key += key_str + "C"
    elif length == 2:
        while len(aes_key) < 16:
            aes_key += key_str + "DD"
    elif length >= 3:
        while len(aes_key) < 16:
            aes_key += key_str + "F"
            
    # Ensure it is exactly 16 bytes (128 bits)
    return aes_key[:16].encode('utf-8')

# ---------------------------------------------------------
# 3. Message Processing & Padding
# ---------------------------------------------------------
def pad_sub_message(sub_msg):
    """Pads a sub-message with '@' if it is less than 16 characters."""
    while len(sub_msg) < 16:
        sub_msg += "@"
    return sub_msg

def chunk_message(message):
    """Chunks the message into 16-character (128-bit) sub-messages."""
    chunks = [message[i:i+16] for i in range(0, len(message), 16)]
    # Ensure the last chunk is padded
    chunks[-1] = pad_sub_message(chunks[-1])
    return chunks

# ---------------------------------------------------------
# 4. Main Execution & Transmission Flow
# ---------------------------------------------------------
def main():
    print("=== SECURE INFORMATION EXCHANGE PROGRAM SIMULATION ===\n")

    # Provided constraints
    p = 199
    g = 127
    
    # User A and B Private Keys (Decimal equivalents of ASCII)
    priv_key_A = 57  # ASCII '9'
    priv_key_B = 167 
    original_message = "The Mandalorian Must Always Recite, This is The Way!"

    print("\n--- Step 6: Execute Test Case ---")
    print(f"Using test case: User A={priv_key_A}, User B={priv_key_B}, Message='{original_message}'")
    
    print("\n--- Step 1: Implement Diffie-Hellman Key Exchange ---")
    print(f"Prime (p) = {p}, Generator (g) = {g}")
    
    # Calculate Public Values
    pub_value_A = calculate_public_value(g, priv_key_A, p)
    pub_value_B = calculate_public_value(g, priv_key_B, p)
    
    print(f"User A Public Value: {g}^{priv_key_A} mod {p} = {pub_value_A}")
    print(f"User B Public Value: {g}^{priv_key_B} mod {p} = {pub_value_B}")
    
    # Calculate Shared Keys
    shared_key_A = calculate_shared_key(pub_value_B, priv_key_A, p)
    shared_key_B = calculate_shared_key(pub_value_A, priv_key_B, p)
    
    print(f"\nUser A computes Shared Key: {pub_value_B}^{priv_key_A} mod {p} = {shared_key_A}")
    print(f"User B computes Shared Key: {pub_value_A}^{priv_key_B} mod {p} = {shared_key_B}")
    
    assert shared_key_A == shared_key_B, "Key exchange failed!"
    
    print("\n--- Step 2: Transform the Shared Key for AES-128 ---")
    aes_key_bytes = transform_to_128bit_key(shared_key_A)
    print(f"Original Shared Key: {shared_key_A}")
    print(f"Transformed 128-bit AES Key (ASCII): {aes_key_bytes.decode('utf-8')}")
    
    print("\n--- Step 3: Process the Message (Chunking and Padding) ---")
    print(f"Original Message ({len(original_message)} chars): '{original_message}'")
    
    sub_messages = chunk_message(original_message)
    for i, sub in enumerate(sub_messages):
        print(f"Sub-message {i+1}: '{sub}' -> Length: {len(sub)}")
        
    print("\n--- Step 4: Encrypt and Transmit ---")
    # Using ECB mode because we are encrypting each block independently as requested
    cipher_encrypt = AES.new(aes_key_bytes, AES.MODE_ECB)
    
    encrypted_chunks = []
    for i, sub in enumerate(sub_messages):
        # AES requires bytes
        encrypted_sub = cipher_encrypt.encrypt(sub.encode('utf-8'))
        encrypted_chunks.append(encrypted_sub)
        print(f"Encrypted Sub-message {i+1} (Hex): {binascii.hexlify(encrypted_sub).decode('utf-8').upper()}")
        
    # Concatenate all encrypted chunks into one big payload
    transmitted_payload = b"".join(encrypted_chunks)
    print(f"\nTransmitted Encrypted Payload (Hex): \n{binascii.hexlify(transmitted_payload).decode('utf-8').upper()}")
    
    print("\n--- Step 5: Decrypt (Receiver Side) ---")
    # Receiver chunks the incoming byte payload into 16-byte blocks
    received_chunks = [transmitted_payload[i:i+16] for i in range(0, len(transmitted_payload), 16)]
    
    cipher_decrypt = AES.new(aes_key_bytes, AES.MODE_ECB)
    decrypted_message = ""
    
    for i, enc_sub in enumerate(received_chunks):
        decrypted_sub = cipher_decrypt.decrypt(enc_sub).decode('utf-8')
        print(f"Decrypted Sub-message {i+1}: '{decrypted_sub}'")
        decrypted_message += decrypted_sub
        
    # Strip the padding to get the final message
    final_message = decrypted_message.rstrip('@')
    print(f"Original Message (Recovered): '{final_message}'")

if __name__ == "__main__":
    main()