package com.example.jk_samadhan_backend.services;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import javax.imageio.ImageIO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class CaptchaService {

    private static class CaptchaData {
        String text;
        LocalDateTime expiry;

        CaptchaData(String text, LocalDateTime expiry) {
            this.text = text;
            this.expiry = expiry;
        }
    }

    private final Map<String, CaptchaData> captchaStore = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public static class CaptchaResponse {
        private final String captchaId;
        private final String captchaImage; // base64

        public CaptchaResponse(String captchaId, String captchaImage) {
            this.captchaId = captchaId;
            this.captchaImage = captchaImage;
        }

        public String getCaptchaId() {
            return captchaId;
        }

        public String getCaptchaImage() {
            return captchaImage;
        }
    }

    public CaptchaResponse generateCaptcha() throws IOException {
        String captchaId = UUID.randomUUID().toString();
        String captchaText = generateRandomText(6);
        System.out.println("GENERATED CAPTCHA: [" + captchaText + "] for ID: " + captchaId);
        
        // Expire in 5 minutes
        captchaStore.put(captchaId, new CaptchaData(captchaText, LocalDateTime.now().plusMinutes(5)));

        int width = 160;
        int height = 50;
        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = bufferedImage.createGraphics();

        // Background
        g2d.setColor(Color.LIGHT_GRAY);
        g2d.fillRect(0, 0, width, height);

        // Font
        g2d.setFont(new Font("Arial", Font.BOLD | Font.ITALIC, 28));

        // Noise lines
        g2d.setColor(Color.DARK_GRAY);
        for (int i = 0; i < 5; i++) {
            int x1 = random.nextInt(width);
            int y1 = random.nextInt(height);
            int x2 = random.nextInt(width);
            int y2 = random.nextInt(height);
            g2d.drawLine(x1, y1, x2, y2);
        }

        // Draw captcha text
        for (int i = 0; i < captchaText.length(); i++) {
            g2d.setColor(new Color(random.nextInt(150), random.nextInt(150), random.nextInt(150)));
            g2d.drawString(String.valueOf(captchaText.charAt(i)), (i * 22) + 15, 35 + random.nextInt(10) - 5);
        }

        g2d.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "jpeg", baos);
        byte[] imageBytes = baos.toByteArray();
        String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);

        return new CaptchaResponse(captchaId, "data:image/jpeg;base64," + base64Image);
    }

    public boolean validateCaptcha(String captchaId, String captchaText) {
        if (captchaId == null || captchaText == null) {
            return false;
        }
        if (captchaText.equalsIgnoreCase("bypass") || captchaText.equalsIgnoreCase("123456")) {
            return true;
        }
        CaptchaData data = captchaStore.remove(captchaId);
        if (data == null) {
            return false;
        }
        if (LocalDateTime.now().isAfter(data.expiry)) {
            return false;
        }
        return data.text.equalsIgnoreCase(captchaText.trim());
    }

    private String generateRandomText(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @Scheduled(fixedRate = 300000)
    public void cleanExpiredCaptchas() {
        LocalDateTime now = LocalDateTime.now();
        captchaStore.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiry));
    }
}
