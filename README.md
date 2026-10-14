# SGK 6183/48 Tecil ve Taksitlendirme Hesaplama Aracı

SGK 6183 sayılı Amme Alacaklarının Tahsil Usulü Hakkında Kanun'un 48. maddesi ve güncel 2024/12 (2026/15) genelgelerine tam uyumlu tecil, taksitlendirme ve resmî form (Ek-1 & Ek-1/b) hazırlama uygulaması.

---

## 🚀 GitHub'dan Canlıya (Yayına) Alma Seçenekleri

Bu uygulama **tamamen istemci taraflı (Client-side / Static Single Page Application)** çalıştığı için sunucu maliyeti olmadan **ücretsiz** olarak canlıya alınabilir.

### 1. Seçenek: GitHub Pages (En Kolay & Otomatik)
Projeye hazır bir **GitHub Actions Workflow** (`.github/workflows/deploy.yml`) eklenmiştir.

1. Projeyi GitHub'a push edin:
   ```bash
   git init
   git add .
   git commit -m "İlk sürüm: SGK Tecil ve Taksitlendirme Uygulaması"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git
   git push -u origin main
   ```
2. GitHub'da deponuzun (**Repository**) sayfasına gidin.
3. **Settings** (Ayarlar) > **Pages** menüsüne tıklayın.
4. **Build and deployment** başlığı altındaki **Source** kısmında **"GitHub Actions"** seçeneğini seçin.
5. Birkaç dakika içinde GitHub Actions uygulamanızı derleyecek ve `https://kullanici_adiniz.github.io/repo_adiniz/` adresinde canlıya alacaktır.

---

### 2. Seçenek: Vercel (Tek Tıkla Canlı & Özel Alan Adı Desteği)
1. [vercel.com](https://vercel.com) adresine gidin ve GitHub hesabınızla giriş yapın.
2. **"Add New" > "Project"** butonuna tıklayın.
3. Bu GitHub deposunu seçip **"Import"** deyin.
4. Framework Preset olarak **Vite** otomatik algılanır.
5. **"Deploy"** butonuna basmanız yeterlidir. Yaklaşık 30 saniye içinde size ücretsiz bir `*.vercel.app` bağlantısı verir ve isterseniz kendi domain adresinizi (örn. `sgkhesapla.com`) kolayca bağlayabilirsiniz.

---

### 3. Seçenek: Netlify
1. [netlify.com](https://netlify.com) adresine gidip GitHub ile giriş yapın.
2. **"Add new site" > "Import an existing project"** seçeneğini seçin.
3. GitHub deposunu bağlayın:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **"Deploy"** butonuna tıklayın.

---

## 🛠️ Yerel Geliştirme (Localhost)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim derlemesi (Production build) alın
npm run build
```
