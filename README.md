# Physio App — คู่มือติดตั้งและรันบนมือถือจริง (Capacitor)

โครงสร้างนี้คือโปรเจกต์ React (Vite) ที่ห่อด้วย Capacitor เพื่อ build เป็นแอป Android (.apk) และ iOS (.ipa) จากโค้ดเว็บชุดเดียวกัน

## สิ่งที่ต้องติดตั้งในเครื่องก่อน

| เครื่องมือ | ใช้ทำอะไร | ดาวน์โหลด |
|---|---|---|
| Node.js (v18 ขึ้นไป) | รันคำสั่ง npm | nodejs.org |
| Android Studio | build/run แอป Android | developer.android.com/studio |
| Xcode (เฉพาะ Mac) | build/run แอป iOS | Mac App Store |
| Apple Developer Account ($99/ปี) | จำเป็นถ้าจะ publish ขึ้น App Store (ทดสอบบนเครื่องตัวเองไม่ต้องเสีย แต่ใช้ Apple ID ธรรมดาได้) | developer.apple.com |

> ถ้าต้องการแค่ Android ก็ไม่ต้องมี Mac/Xcode เลย — ใช้ Windows/Linux ก็ทำได้ครบ

## ขั้นตอนที่ 1: ติดตั้ง dependencies

เปิด terminal ในโฟลเดอร์นี้ (`physio-app/`) แล้วรัน:

```bash
npm install
```

## ขั้นตอนที่ 2: ทดสอบบนเบราว์เซอร์ก่อน (ยังไม่ใช่มือถือ)

```bash
npm run dev
```

เปิด `http://localhost:5173` ดูว่าหน้าตาแอปถูกต้องก่อน แล้วค่อยไปขั้นต่อไป

## ขั้นตอนที่ 3: เพิ่มแพลตฟอร์ม Android / iOS

รันครั้งเดียวตอนตั้งโปรเจกต์ (สร้างโฟลเดอร์ `android/` และ/หรือ `ios/`):

```bash
npx cap add android
npx cap add ios      # รันบน Mac เท่านั้น
```

## ขั้นตอนที่ 4: Build เว็บ แล้ว sync เข้าโปรเจกต์ native

ทุกครั้งที่แก้โค้ดใน `src/` แล้วอยากเห็นผลบนมือถือ ให้รัน:

```bash
npm run cap:android   # build + sync + เปิด Android Studio
# หรือ
npm run cap:ios       # build + sync + เปิด Xcode
```

(คำสั่งนี้เท่ากับรัน `npm run build` → `npx cap sync` → `npx cap open android/ios` ให้อัตโนมัติ ตามที่ตั้งไว้ใน package.json)

## ขั้นตอนที่ 5: รันบนเครื่องจริง/emulator

- **Android:** ใน Android Studio กด ▶ Run เลือกเครื่องมือถือที่เสียบ USB (เปิด USB debugging ในมือถือก่อน) หรือเลือก Emulator
- **iOS:** ใน Xcode เลือกเครื่อง iPhone ที่เชื่อมต่อ หรือ Simulator แล้วกด ▶ Run

พอกด Run แอปจะติดตั้งและเปิดขึ้นมาในมือถือจริง เหมือนแอปทั่วไปที่โหลดจาก store

## ขั้นตอนที่ 6: ทำเป็นไฟล์ติดตั้งจริง (release build)

- **Android → .apk/.aab:** ใน Android Studio ไปที่ `Build > Generate Signed Bundle / APK` แล้วสร้าง keystore ของตัวเอง (เก็บไฟล์นี้ไว้ดีๆ ใช้ทุกครั้งที่อัปเดตแอป) จะได้ไฟล์ `.apk` ส่งให้คนอื่นติดตั้งตรงๆ ได้เลย หรือ `.aab` เพื่ออัปโหลดขึ้น Google Play Console
- **iOS → .ipa:** ใน Xcode `Product > Archive` แล้วอัปโหลดผ่าน App Store Connect (ต้องมี Apple Developer Account)

## จุดที่ต้องแก้ก่อนใช้งานจริง (production)

1. **ไอคอนแอป/Splash screen** — แทนที่ไอคอน default ด้วยแพ็กเกจ `@capacitor/assets` (`npx @capacitor/assets generate`) โดยเตรียมไฟล์ `resources/icon.png` (1024x1024) และ `resources/splash.png` ไว้ก่อน
2. **แถบสถานะปลอมด้านบน** (เวลา 9:41, สัญญาณ, แบตเตอรี่) ใน `StatusBar` component เป็นของตกแต่งไว้พรีวิวบนเว็บเท่านั้น — บนมือถือจริงจะมีแถบสถานะของระบบ (เวลา/แบต) อยู่แล้ว แนะนำลบ `<StatusBar />` ออกจาก `App.jsx` หรือซ่อนด้วยเงื่อนไข `Capacitor.isNativePlatform()`
3. **กล้อง AI วัดมุมข้อต่อ** — ตอนนี้เป็นภาพนิ่ง/SVG จำลอง ยังไม่ได้เชื่อมกล้องจริง ต้องติดตั้งปลั๊กอินกล้อง เช่น `@capacitor/camera` หรือ pose-detection ผ่าน TensorFlow.js/MediaPipe ถ้าต้องการให้วัดมุมจากวิดีโอสดจริง (แจ้งได้ ทำต่อให้ได้)
4. **ขอ permission กล้อง** — ต้องเพิ่มสิทธิ์ในไฟล์ `android/app/src/main/AndroidManifest.xml` (`<uses-permission android:name="android.permission.CAMERA" />`) และ `ios/App/App/Info.plist` (`NSCameraUsageDescription`) ก่อนใช้กล้องได้จริง

## โครงสร้างไฟล์

```
physio-app/
├── src/
│   ├── App.jsx          ← โค้ดหน้าจอทั้งหมด (5 หน้าจอ)
│   ├── main.jsx          ← จุดเริ่มโปรเจกต์ React
│   └── index.css         ← Tailwind
├── index.html
├── capacitor.config.json ← ตั้งชื่อแอป/appId ตรงนี้
├── package.json
├── vite.config.js
└── tailwind.config.js
```

แก้โค้ดหน้าตาแอปทั้งหมดได้ที่ **`src/App.jsx`** ไฟล์เดียว
