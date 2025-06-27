package com.project.plant_nursery_management_system.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class RazorpaySignatureUtil {

    public static boolean verifySignature(String orderId, String paymentId, String actualSignature, String secret) {
        try {
            String payload = orderId + "|" + paymentId;
            String generatedSignature = calculateHMAC(payload, secret);

            System.out.println("Payload            : " + payload);
            System.out.println("Generated Signature: " + generatedSignature);
            System.out.println("Actual Signature   : " + actualSignature);
            System.out.println("Using Secret Key   : " + secret);

            return generatedSignature.equals(actualSignature);
        } catch (Exception e) {
            System.err.println("Signature verification failed: " + e.getMessage());
            return false;
        }
    }

    private static String calculateHMAC(String data, String secret) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secretKey);
        byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return bytesToHex(hash);
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            hexString.append(String.format("%02x", b));
        }
        return hexString.toString();
    }
}
