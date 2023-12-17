import random

def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def mod_inverse(a, m):
    m0, x0, x1 = m, 0, 1
    while a > 1:
        q = a // m
        m, a = a % m, m
        x0, x1 = x1 - q * x0, x0
    return x1 + m0 if x1 < 0 else x1

def is_prime(num, accuracy=5):
    if num == 2 or num == 3:
        return True
    if num < 2 or num % 2 == 0:
        return False
    r, d = 0, num - 1
    while d % 2 == 0:
        r += 1
        d //= 2
    for _ in range(accuracy):
        a = random.randint(2, num - 2)
        x = pow(a, d, num)
        if x == 1 or x == num - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, num)
            if x == num - 1:
                break
        else:
            return False
    return True

def random_prime(bits):
    while True:
        num = random.getrandbits(bits)
        if is_prime(num):
            return num

def generate_keypair(bits):
    p = random_prime(bits)
    q = random_prime(bits)
    n = p * q
    totient = (p - 1) * (q - 1)
    e = 65537
    d = mod_inverse(e, totient)

    return ((n, e), (n, d))

def encrypt(message, public_key):
    n, e = public_key
    cipher_text = pow(message, e, n)
    return cipher_text

def decrypt(encrypted_message, private_key):
    decrypted_message = pow(encrypted_message, private_key[1], private_key[0])
    return decrypted_message

message = 16
public_key, private_key = generate_keypair(2048)

encrypted_message = encrypt(message, public_key)
decrypted_message = decrypt(encrypted_message, private_key)

print(f"Original Message: {message}")
print(f"Encrypted Message: {encrypted_message}")
print(f"Decrypted Message: {decrypted_message}")