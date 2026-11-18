# 1453'te İstanbul Halkından Olsaydın Ne Olurdu?

"Rütbe rütbe hayat" formatında, ~10,7 dakikalık animasyonlu tarih videosu.
Yoksul bir balıkçıdan başlayıp keşiş, sur askeri, Venedikli tüccar, Bizans soylusu ve son olarak
imparatora kadar, 1453 kuşatmasını şehrin içinden yaşayan altı farklı insanın gözünden anlatır.

Karakter, çizimler, müzik ve efektlerin tamamı bu depodaki kodla sıfırdan üretilir (telifsiz).

## Çıktılar (`cikti/`)

| Dosya | Açıklama |
|---|---|
| `1453_istanbul_halki.mp4` | Final video (1920×1080, 30 fps, H.264 + AAC, ~10:41) |
| `kapak.jpg` | YouTube kapak görseli (1280×720) |
| `altyazi.srt` | Türkçe altyazı (YouTube'a ayrı yüklenebilir) |
| `youtube.md` | Başlık önerileri, bölüm zaman damgalı açıklama, etiketler |
| `../senaryo/senaryo.md` | Zaman damgalı okunabilir senaryo + kaynak notları |

## Yapı

```
senaryo/senaryo.json   # metin, sahne adı, efekt listesi (tek kaynak)
tools/tts.py           # Piper (tr_TR-dfki-medium, kalın erkek sesi) ile seslendirme + timeline + SRT
tools/muzik.py         # sentez müzik (pad, koro, ud/kanun benzeri tel, davul) + efektler
video/*.js             # SVG çizim motoru: karakter, sahneler, harita, motor
tools/kare.js          # tek kare önizleme
tools/render.js        # Playwright/Chromium ile kare kare render -> ffmpeg
tools/render_hepsi.sh  # bölümleri paralel render edip birleştirir
```

## Yeniden üretme

```bash
# 1) Seslendirme (Piper sesi: sherpa-onnx tts-models sürümündeki vits-piper-tr_TR-dfki-medium)
pip install piper-tts scipy
python3 tools/tts.py --model /yol/tr_TR-dfki-medium.onnx --hiz 1.0

# 2) Müzik ve efektler
python3 tools/muzik.py

# 3) Görüntü (Playwright + Chromium gerekir)
tools/render_hepsi.sh 3 30          # tüm bölümler; yalnız bazıları için: tools/render_hepsi.sh 3 30 02 05

# 4) Birleştirme
ffmpeg -i build/video_sessiz.mp4 -i build/final_ses.wav -c:v copy -c:a aac -b:a 192k -shortest cikti/1453_istanbul_halki.mp4
```

Tek bir sahneye bakmak için: `node tools/kare.js onizleme.png id:a05@5` (segment `a05`, 5. saniye).

## Kendi sesinle seslendirmek istersen

`senaryo/senaryo.md` içindeki metni oku, kaydı `build/anlatim.wav` olarak koy (48 kHz mono),
sonra `tools/muzik.py` ve birleştirme adımını tekrar çalıştır. Kayıt süresi farklıysa
`build/timeline.json` içindeki sahne sürelerini kayda göre güncellemek gerekir; en kolayı
her sahneyi ayrı kaydedip `build/ses/<id>.wav` dosyalarının yerine koymak ve `tools/tts.py`'nin
birleştirme kısmını bu dosyalarla çalıştırmaktır.
