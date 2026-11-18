#!/usr/bin/env python3
"""timeline.json'dan senaryo/senaryo.md ve cikti/youtube.md üretir (zaman damgaları güncel kalsın diye)."""
import json, os
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sen = json.load(open(os.path.join(KOK, 'senaryo', 'senaryo.json'), encoding='utf-8'))
tl = json.load(open(os.path.join(KOK, 'build', 'timeline.json'), encoding='utf-8'))
zm = lambda t: f"{int(t // 60):02d}:{int(t % 60):02d}"
bas = {s['id']: s['bas'] for s in tl['segmentler']}

out = [f"# {sen['baslik']}", "", f"Toplam süre: ~{tl['toplam'] / 60:.1f} dk · Format: rütbe rütbe hayat (en alttan imparatora) · Ses: {sen['ses_modeli']}", "",
       "> Kendi sesinle seslendirmek istersen: her paragraf bir sahnedir; sahne başlangıç zamanları köşeli parantezde.", ""]
bol = None
for s in sen['segmentler']:
    if s['bolum'] != bol:
        bol = s['bolum']; out += ["", f"## {bol}", ""]
    out += [f"**[{zm(bas[s['id']])}]** {s['metin']}", ""]
out += ["", "---", "", "### Kaynak notları", "",
        "- Kuşatma: 6 Nisan – 29 Mayıs 1453. Savunucu sayısı (~7.000) Sphrantzes'in sayımına dayanır (4.983 Rum + ~2.000 yabancı).",
        "- Osmanlı ordusu için modern tahminler ~80.000 civarındadır (çağdaş kaynaklar çok daha yüksek rakamlar verir).",
        "- Gemilerin karadan yürütülmesi: 22 Nisan 1453, ~70 gemi.",
        "- \"Latin külahı / Türk sarığı\" sözü Dukas'ın kroniğinde Lukas Notaras'a atfedilir.",
        "- İmparatorun teslim teklifine cevabı Dukas'ın aktarımıdır.",
        "- Kerkoporta hikâyesi ve Ulubatlı Hasan anlatısı rivayet/gelenek olarak sunulmuştur.",
        "- Gennadios Skolarios Ocak 1454'te patrik olarak atanmıştır. Galata'ya ahitname 1 Haziran 1453'te verilmiştir.",
        "- Ayasofya (537) fetih sırasında ~916 yıllıktı; Fatih döneminde bir minare eklendi, diğerleri sonraki padişahlar döneminde yapıldı."]
open(os.path.join(KOK, 'senaryo', 'senaryo.md'), 'w', encoding='utf-8').write("\n".join(out) + "\n")

ad = {'Giriş': 'Giriş: 29 Mayıs 1453', 'Balıkçı': 'Rütbe 1: Yoksul Balıkçı', 'Keşiş': 'Rütbe 2: Keşiş', 'Asker': 'Rütbe 3: Sur Askeri',
      'Tüccar': 'Rütbe 4: Venedikli Tüccar', 'Soylu': 'Rütbe 5: Bizans Soylusu', 'İmparator': 'Rütbe 6: İmparator', 'Sonuç': 'Sonuç: Fatih ve yeni İstanbul'}
b = []
for s in tl['segmentler']:
    if not b or b[-1][0] != s['bolum']: b.append((s['bolum'], s['bas']))
bolumler = "\n".join(f"{zm(t)} {ad[a]}" for a, t in b)
md = f"""# YouTube yükleme metni

## Başlık önerileri
1. 1453'te İstanbul Halkından Olsaydın Ne Olurdu?
2. 1453'te Her Rütbede Hayatın: Balıkçıdan İmparatora
3. Konstantinopolis Düşerken Sen Kim Olurdun? (1453)

## Açıklama
29 Mayıs 1453. Surların önünde dev bir ordu, surların ardında 40-50 bin kişilik yorgun bir şehir.
Peki sen bu şehrin halkından biri olsaydın ne olurdu? Yoksul bir balıkçıdan keşişe, sur askerinden
Venedikli tüccara, Bizans soylusundan son imparatora kadar, kuşatmayı şehrin içinden yaşıyoruz.

Sen hangisi olmak isterdin? Yorumlara yaz!

Bölümler:
{bolumler}

Not: Kerkoporta hikâyesi, Ulubatlı Hasan anlatısı ve bazı sözler rivayet/gelenek olarak aktarılmıştır.
Kaynaklar: Dukas, Sphrantzes, Kritovulos, Nicolò Barbaro; S. Runciman, "Konstantinopolis'in Düşüşü 1453".

## Etiketler
1453, İstanbul'un fethi, Konstantinopolis, Fatih Sultan Mehmet, Bizans, XI. Konstantin, Ayasofya,
Ulubatlı Hasan, gemilerin karadan yürütülmesi, Haliç zinciri, Orban topu, tarih animasyonu,
her rütbede hayat, Osmanlı tarihi, Bizans tarihi
"""
open(os.path.join(KOK, 'cikti', 'youtube.md'), 'w', encoding='utf-8').write(md)
print(bolumler)
