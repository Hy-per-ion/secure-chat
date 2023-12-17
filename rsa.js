const crypto = require('crypto');

function random_prime(bits) {
    while (true) {
        let num = BigInt(Math.floor(Math.random() * (2n ** BigInt(bits))));
        if (is_prime(num)) {
            return num;
        }
    }
}

function gcd(a, b) {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
}

function mod_inverse(a, m) {
    let m0 = m, x0 = 0n, x1 = 1n;
    while (a > 1n) {
        let q = a / m;
        [m, a] = [a % m, m];
        [x0, x1] = [x1 - q * x0, x0];
    }
    return x1 + m0 < 0n ? x1 + m0 : x1;
}

function is_prime(num, accuracy = 5) {
    if (num === 2n || num === 3n) {
        return true;
    }
    if (num < 2n || num % 2n === 0n) {
        return false;
    }
    let r = 0n, d = num - 1n;
    while (d % 2n === 0n) {
        r += 1n;
        d /= 2n;
    }
    for (let i = 0n; i < BigInt(accuracy); i++) {
        let a = BigInt(Math.floor(Math.random() * (Number(num) - 2))) + 2n;
        let x = BigInt(Math.pow(Number(a), Number(d))) % num;
        if (x === 1n || x === num - 1n) {
            continue;
        }
        for (let j = 0n; j < r - 1n; j++) {
            x = BigInt(Math.pow(Number(x), 2)) % num;
            if (x === num - 1n) {
                break;
            }
        }
        if (x !== num - 1n) {
            return false;
        }
    }
    return true;
}

function generate_keypair(bits) {
    let p = random_prime(bits);
    let q = random_prime(bits);
    let n = p * q;
    let totient = (p - 1n) * (q - 1n);
    let e = 65537n;
    let d = mod_inverse(e, totient);
    return [[n, e], [n, d]];
}

function encrypt(message, public_key) {
    let [n, e] = public_key;
    let cipher_text = BigInt(Math.pow(Number(message), Number(e))) % n;
    return cipher_text;
}

function decrypt(encrypted_message, private_key) {
    let decrypted_message = BigInt(Math.pow(Number(encrypted_message), Number(private_key[1]))) % private_key[0];
    return decrypted_message;
}