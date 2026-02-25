# 🤖 GitHub AI Code Assistant

Bu proje, kod okuma ve repository analiz etme süreçlerini hızlandırmak için geliştirilmiş, doğrudan GitHub arayüzüne entegre olan **Yapay Zeka (LLM) Destekli bir Chrome Eklentisidir.**

Tamamen **Vanilla JS** (React veya Vue gibi frameworkler kullanılmadan) ve **Manifest V3** standartlarına uygun, modüler bir mimariyle kodlanmıştır.

---

## 🌟 Temel Özellikler (Modlar)

Eklenti, GitHub üzerinde iki farklı sayfada otomatik olarak devreye girer:

### 1. Dosya Modu (File Mode)
GitHub üzerinde incelediğiniz herhangi bir kod dosyasının (`.js`, `.py`, `.go` vb.) içine girdiğinizde sağ tarafta sürüklenebilir (draggable) ve küçültülebilir (minimize) estetik bir AI Asistan paneli açılır. Bu panel üzerinden şu 4 işlevi gerçekleştirebilirsiniz:

- **🔍 Kod Açıklaması (Explain Code):** Anlamadığınız karmaşık bir dosyayı saniyeler içinde analiz edip "Bu kod ne işe yarıyor?" sorusunu sizin için kısaca özetler.
- **📊 Kod Kalite Puanı (Quality Score):** Yazılan koda 100 üzerinden bir kalite puanı verir. "Okunabilirlik" ve "Sürdürülebilirlik" düzeylerini ölçüp asıl problemi (Main Issue) sizin için bulup gösterir.
- **🛡 Güvenlik Testi (Security Check):** İncelenen dosyadaki olası kritik güvenlik açıklarını tespit edip risk seviyesini (Düşük/Orta/Yüksek) belirler.
- **🔧 Yeniden Düzenleme Önerisi (Refactor Suggestion):** Spagetti veya yavaş çalışabilecek kod parçalarını nasıl daha temiz (Clean Code) ve hızlı hale getirebileceğinizle ilgili 2-3 maddelik öneriler (ve kod parçacıkları) sunar.

### 2. Repo Modu (Repo Mode)
Bir GitHub projesinin ana sayfasına girdiğinizde dizinlerin hemen üstünde **🔎 Analyze Repository** isimli yeşil bir buton belirir. 
Bu buton, repodaki örnek dosyaların ağacını hızlıca analiz edip LLM'e yollar ve size projenin genel kalitesini, güçlü yanlarını ve zayıf/eksik (örn. CI/CD eksikliği, test eksikliği vb.) yönlerini maddeler halinde sunar.

---

## 🚀 Desteklenen Yapay Zeka Modelleri

Eklentiyi kullanırken arkada çalışacak beyni (LLM sağlayıcısını) esnek bir şekilde değiştirebilirsiniz:

1. **Ollama Local (Önerilen):** Tamamen ücretsiz ve internetsiz şekilde kendi bilgisayarınızda çalışan modeller. (Örn: `llama3`, `gpt-oss:120b-cloud` vb.)
2. **OSS Cloud (OpenRouter vs.):** Bulut tabanlı Llama, Mixtral, Qwen vb. Açık kaynak kodlu LLM sunucularına bağlanma yeteneği.
3. **OpenAI (Fallback):** Eğer Ollama sunucusuna bağlanılamazsa otomatik olarak arka planda ChatGPT (`gpt-3.5-turbo`) API'sine düşme özelliği.

---

## 🛠️ Kurulum Adımları

Eklentiyi bilgisayarınıza kurup Chrome veya Chromium tabanlı bir tarayıcıda çalıştırmak çok basittir:

1. Bu depoyu (repository) bilgisayarınıza indirin veya klonlayın:
   ```bash
   git clone https://github.com/berraakman/GithubAI-extention.git
   ```
2. Chrome tarayıcınızı açın ve adres çubuğuna şunu yazın: `chrome://extensions/`
3. Sağ üst köşeden **Geliştirici modu (Developer mode)** seçeneğini aktif hale getirin.
4. Sol üstten **Paketlenmemiş öğe yükle (Load unpacked)** butonuna tıklayın.
5. Bilgisayarınıza bağladığınız `GithubAI-extention` klasörünü seçin.

Tebrikler! Kurulum tamamlandı. Artık herhangi bir GitHub sayfasına giderek eklentiyi deneyebilirsiniz.

---

## ⚙️ Yapılandırma ve API Ayarları (Config)

Eklentinin hangi modeli kullanacağını seçmek veya API anahtarlarını girmek için `src/config/config.js` dosyasını favori kod editörünüzde (VS Code vb.) açın:

- Varsayılan sağlayıcıyı ayarlamak için `provider: 'ollama_local'` (veya `oss_cloud`, `openai`) değerini değiştirin.
- Eğer bulut veya OpenAI kullanacaksanız ilgili `keys:` kısmına anahtarınızı yapıştırın.
- Yerel (Local) `ollama` sunucunuzdaki model ismini değiştirmek için `models:` altındaki `ollama_local:` karşılığını düzenleyin (Örn: `llama3`, `qwen`, `phi3`).

> ⚠️ **Ollama Kullananlar İçin Çok Önemli Not (CORS Koruması):**
> Chrome eklentisinin bilgisayarınızdaki Ollama'ya erişebilmesi için Ollama'yı mutlaka CORS yetkisiyle başlatmanız gerekir. Terminalden şu komutla çalıştırın:
> ```bash
> OLLAMA_ORIGINS="*" ollama serve
> ```

---

## 🎨 UI & UX Tasarım Zenginliği

Proje, GitHub'ın kendi koyu Mavi / Gri (Native) arayüz tasarımıyla kusursuz şekilde birleşmek üzere özel CSS kodlarıyla donatılmıştır:
- Panel **sürüklenebilir** (Draggable), farenizle tutup panel başlığından istediğiniz yere çekebilirsiniz.
- Okuma alanınızı kapatmaması için sağ üstünden ( _ veya v ikonu ) **küçültülüp (Minimize)** tek bir başlığa sığdırılabilir.
- Asistandan gelen cevaplar düz metin olarak değil; özel `marked.js` kütüphanesi yardımıyla kalınlık, kod highlightı ve renkli maddeler barındıran tam **Markdown (.md)** estetiği ile okunur.
- Tıklamalarda, buton hoverlarında ve ekran belirmelerinde yumuşak iOS benzeri **Bounce/Fade animasyonları** kullanılmıştır.

---

## 📄 Lisans
MIT License - Dilediğiniz gibi kullanabilir ve geliştirebilirsiniz.
