import React, { useState } from "react";
import {
  Home, Calendar, Camera, CheckCircle2, User, Bell, Play, ChevronLeft,
  Flashlight, RotateCcw, Pause, Square, Share2, Settings, ChevronRight,
  XCircle, Info, TrendingUp, Flame, Clock, Target
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const BLUE = "#2F6FEE";
const BLUE_DARK = "#1E4FD6";
const BG = "#F4F6FB";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_2px_10px_rgba(20,30,60,0.06)] ${className}`}
  >
    {children}
  </div>
);

const StatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[13px] font-semibold text-slate-900">
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <rect x="0" y="7" width="2.5" height="4" rx="0.5" fill="#0f172a" />
        <rect x="4.5" y="5" width="2.5" height="6" rx="0.5" fill="#0f172a" />
        <rect x="9" y="3" width="2.5" height="8" rx="0.5" fill="#0f172a" />
        <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.5" fill="#0f172a" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <path d="M7.5 2.2C10.2 2.2 12.6 3.3 14.4 5.1L13 6.5C11.5 5.1 9.6 4.2 7.5 4.2C5.4 4.2 3.5 5.1 2 6.5L0.6 5.1C2.4 3.3 4.8 2.2 7.5 2.2Z" fill="#0f172a"/>
        <circle cx="7.5" cy="8.5" r="1.3" fill="#0f172a"/>
      </svg>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#0f172a" />
        <rect x="2" y="2" width="16" height="8" rx="1.5" fill="#0f172a" />
        <rect x="21.5" y="3.5" width="1.5" height="5" rx="0.7" fill="#0f172a" />
      </svg>
    </div>
  </div>
);

const BottomNav = ({ active, setActive }) => {
  const items = [
    { key: "home", label: "หน้าหลัก", Icon: Home },
    { key: "program", label: "โปรแกรม", Icon: Calendar },
    { key: "camera", label: "ตรวจท่า", Icon: Camera },
    { key: "results", label: "ผลการฝึก", Icon: CheckCircle2 },
    { key: "profile", label: "โปรไฟล์", Icon: User },
  ];
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-2 px-1">
      {items.map(({ key, label, Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="flex flex-col items-center gap-0.5 flex-1 py-1"
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.4 : 1.8}
              color={isActive ? BLUE : "#94A3B8"}
            />
            <span
              className="text-[10px]"
              style={{
                color: isActive ? BLUE : "#94A3B8",
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

/* Circular progress ring */
const RingProgress = ({ percent, size = 64, stroke = 7, color = BLUE, track = "#E7ECF7", children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute">{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  1. หน้าหลัก (Home)                                                  */
/* ------------------------------------------------------------------ */
const exercises = [
  { id: 1, name: "ยกแขนด้านหน้า", detail: "3 เซ็ต x 15 ครั้ง" },
  { id: 2, name: "กางแขนด้านข้าง", detail: "3 เซ็ต x 15 ครั้ง" },
  { id: 3, name: "หมุนไหล่", detail: "3 เซ็ต x 15 ครั้ง" },
];

const HomeScreen = ({ goProgram }) => (
  <div className="px-5 pb-4 overflow-y-auto h-full">
    <div className="flex items-center justify-between pt-2 pb-4">
      <div>
        <h1 className="text-[19px] font-bold text-slate-900">สวัสดี, คุณกานต์</h1>
        <p className="text-[12px] text-slate-400 mt-0.5">วันนี้ 8 พฤษภาคม 2567</p>
      </div>
      <button className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
        <Bell size={17} className="text-slate-500" />
      </button>
    </div>

    <Card className="p-4 mb-4" style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_DARK})` }}>
      <div className="rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${BLUE}, ${BLUE_DARK})` }}>
        <p className="text-[12px] opacity-90 mb-2">โปรแกรมกายภาพวันนี้</p>
        <div className="flex items-center gap-4">
          <RingProgress percent={75} size={56} stroke={6} color="#ffffff" track="rgba(255,255,255,0.3)">
            <span className="text-[12px] font-bold">75%</span>
          </RingProgress>
          <div>
            <p className="text-[15px] font-bold">3 ท่า | 25 นาที</p>
            <p className="text-[11px] opacity-85">ความคืบหน้ารวม</p>
          </div>
        </div>
        <button
          onClick={goProgram}
          className="mt-4 w-full bg-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-[14px]"
          style={{ color: BLUE }}
        >
          <Play size={15} fill={BLUE} /> เริ่มฝึกวันนี้
        </button>
      </div>
    </Card>

    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[14px] font-bold text-slate-800">ท่าที่ต้องฝึกวันนี้</h2>
      <button className="text-[11px] font-semibold" style={{ color: BLUE }}>ดูทั้งหมด</button>
    </div>
    <Card className="p-2 mb-4">
      {exercises.map((ex, i) => (
        <div
          key={ex.id}
          className={`flex items-center gap-3 p-2.5 ${i !== exercises.length - 1 ? "border-b border-slate-100" : ""}`}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px]" style={{ background: "#EAF0FE", color: BLUE }}>
            {ex.id}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-slate-800">{ex.name}</p>
            <p className="text-[11px] text-slate-400">{ex.detail}</p>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      ))}
    </Card>

    <h2 className="text-[14px] font-bold text-slate-800 mb-2">สรุปการฝึกวันนี้</h2>
    <Card className="p-4 mb-4 flex items-center justify-between">
      <div className="text-center">
        <p className="text-[16px] font-bold text-slate-800">2/3</p>
        <p className="text-[10px] text-slate-400">ท่าสำเร็จ</p>
      </div>
      <div className="w-px h-8 bg-slate-100" />
      <div className="text-center">
        <p className="text-[16px] font-bold text-slate-800">30/45</p>
        <p className="text-[10px] text-slate-400">จำนวนครั้ง</p>
      </div>
      <div className="w-px h-8 bg-slate-100" />
      <div className="text-center">
        <p className="text-[16px] font-bold text-slate-800">18</p>
        <p className="text-[10px] text-slate-400">นาที</p>
      </div>
      <TrendingUp size={18} className="text-slate-300" />
    </Card>

    <Card className="p-4 flex items-center gap-3" style={{ background: "#EAF0FE" }}>
      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
        <Flame size={16} style={{ color: BLUE }} />
      </div>
      <div>
        <p className="text-[12px] font-bold text-slate-800">คำแนะนำสำหรับคุณ</p>
        <p className="text-[11px] text-slate-500">ฝึกสม่ำเสมอทุกวัน เพื่อผลลัพธ์ที่ดีขึ้น</p>
      </div>
    </Card>
  </div>
);

/* ------------------------------------------------------------------ */
/*  2. โปรแกรมกายภาพ (Program)                                          */
/* ------------------------------------------------------------------ */
const ProgramScreen = ({ goCamera }) => {
  const days = [
    { d: "จ.", n: 6 }, { d: "อ.", n: 7 }, { d: "พ.", n: 8, active: true },
    { d: "พฤ.", n: 9 }, { d: "ศ.", n: 10 }, { d: "ส.", n: 11 }, { d: "อา.", n: 12 },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-5 pt-2 pb-3">
        <ChevronLeft size={20} className="text-slate-700" />
        <h1 className="text-[16px] font-bold text-slate-900">โปรแกรมกายภาพ</h1>
      </div>
      <div className="flex justify-between px-5 mb-4">
        {days.map((day) => (
          <div key={day.n} className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-slate-400">{day.d}</span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold"
              style={day.active ? { background: BLUE, color: "white" } : { color: "#334155" }}
            >
              {day.n}
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 overflow-y-auto flex-1 pb-4">
        <p className="text-[11px] text-slate-400 mb-1">ท่าที่ 1 จาก 3</p>
        <h2 className="text-[19px] font-bold text-slate-900 mb-3">ยกแขนด้านหน้า</h2>
        <p className="text-[12px] font-semibold text-slate-500 mb-2">3 เซ็ต x 15 ครั้ง</p>

        <Card className="overflow-hidden mb-4 relative">
          <div className="h-44 bg-slate-200 flex items-center justify-center relative">
            <img
              src="https://images.unsplash.com/photo-1616279969096-54a228695e77?q=80&w=800&auto=format&fit=crop"
              alt="ท่ายกแขนด้านหน้า"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play size={20} fill="#0f172a" className="text-slate-900 ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">00:45</span>
          </div>
        </Card>

        <h3 className="text-[13px] font-bold text-slate-800 mb-1.5">วิธีการทำ</h3>
        <p className="text-[12px] text-slate-500 leading-relaxed mb-2">
          นั่งตัวตรง ยกแขนขึ้นด้านหน้าให้ขนานกับพื้น ค้างไว้ 2 วินาที แล้วค่อยๆ ลดลง
        </p>
        <p className="text-[13px] font-bold text-slate-800 mb-1.5">คำแนะนำ</p>
        <ul className="text-[12px] text-slate-500 space-y-1 mb-4 list-disc pl-4">
          <li>เกร็งหน้าท้อง</li>
          <li>หลังตรง ไหล่ผ่อนคลาย</li>
          <li>หายใจเข้า-ออกตามจังหวะ</li>
        </ul>

        <Card className="p-3 mb-4 flex justify-between">
          <div className="text-center flex-1">
            <p className="text-[10px] text-slate-400 mb-0.5">เซ็ต</p>
            <p className="text-[16px] font-bold text-slate-800">3</p>
          </div>
          <div className="w-px bg-slate-100" />
          <div className="text-center flex-1">
            <p className="text-[10px] text-slate-400 mb-0.5">จำนวนครั้ง</p>
            <p className="text-[16px] font-bold text-slate-800">15</p>
          </div>
          <div className="w-px bg-slate-100" />
          <div className="text-center flex-1">
            <p className="text-[10px] text-slate-400 mb-0.5">พักระหว่างเซ็ต</p>
            <p className="text-[16px] font-bold text-slate-800">30 วิ</p>
          </div>
        </Card>
      </div>
      <div className="px-5 pb-4">
        <button
          onClick={goCamera}
          className="w-full text-white rounded-xl py-3 font-bold text-[14px]"
          style={{ background: BLUE }}
        >
          เริ่มตรวจท่า
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  3. กล้อง AI วัดมุม (Camera)                                          */
/* ------------------------------------------------------------------ */
const CameraScreen = ({ goCheck }) => (
  <div className="h-full relative bg-slate-900 text-white flex flex-col overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1616279969096-54a228695e77?q=80&w=900&auto=format&fit=crop"
      alt="กล้อง AI วัดมุม"
      className="absolute inset-0 w-full h-full object-cover opacity-80"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

    <div className="relative z-10 flex items-center justify-between px-4 pt-2">
      <XCircle size={22} className="opacity-90" />
      <h1 className="text-[14px] font-bold">ยกแขนด้านหน้า</h1>
      <Flashlight size={20} className="opacity-90" />
    </div>

    <div className="relative z-10 flex gap-2 px-4 mt-3">
      <span className="bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">เซ็ต 1/3</span>
      <span className="bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">ครั้งที่ 6/15</span>
    </div>

    {/* skeleton overlay + angle */}
    <svg className="absolute inset-0 z-10 w-full h-full" viewBox="0 0 300 500">
      <line x1="150" y1="150" x2="90" y2="155" stroke="#34D399" strokeWidth="3" />
      <line x1="150" y1="150" x2="215" y2="155" stroke="#34D399" strokeWidth="3" />
      <line x1="150" y1="150" x2="150" y2="260" stroke="#34D399" strokeWidth="3" />
      <line x1="150" y1="260" x2="120" y2="360" stroke="#34D399" strokeWidth="3" />
      <line x1="150" y1="260" x2="185" y2="365" stroke="#34D399" strokeWidth="3" />
      {[[150,150],[90,155],[215,155],[150,260],[120,360],[185,365]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="5" fill="#34D399" />
      ))}
      <text x="188" y="185" fill="#34D399" fontSize="20" fontWeight="bold">91°</text>
    </svg>

    <div className="relative z-10 mt-auto px-4 pb-3">
      <div className="bg-black/55 backdrop-blur rounded-xl px-4 py-3 flex items-center justify-between mb-3">
        <div>
          <p className="text-[11px] opacity-70">มุมที่เหมาะสม</p>
          <p className="text-[15px] font-bold">90° - 110°</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
          <CheckCircle2 size={16} />
        </div>
      </div>
      <div className="flex items-center justify-around pb-2">
        <button className="flex flex-col items-center gap-1 text-[10px] opacity-90">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center"><Flashlight size={18} /></div>
          เปิดไฟ
        </button>
        <button onClick={goCheck} className="w-16 h-16 rounded-full bg-white border-4 border-white/40" />
        <button className="flex flex-col items-center gap-1 text-[10px] opacity-90">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center"><RotateCcw size={18} /></div>
          สลับกล้อง
        </button>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  4. ตรวจสอบท่ากายภาพ (Form check, live)                              */
/* ------------------------------------------------------------------ */
const FormCheckScreen = ({ goSummary }) => (
  <div className="h-full relative bg-slate-900 text-white flex flex-col overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1616279969096-54a228695e77?q=80&w=900&auto=format&fit=crop"
      alt="ตรวจสอบท่ากายภาพ"
      className="absolute inset-0 w-full h-full object-cover opacity-70"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

    <div className="relative z-10 flex gap-2 px-4 pt-3">
      <span className="bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">เซ็ต 1/3</span>
      <span className="bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">ครั้งที่ 8/15</span>
    </div>

    <svg className="absolute inset-0 z-10 w-full h-full" viewBox="0 0 300 500">
      <line x1="130" y1="150" x2="75" y2="175" stroke="#F87171" strokeWidth="3" />
      <line x1="130" y1="150" x2="200" y2="140" stroke="#F87171" strokeWidth="3" />
      <line x1="130" y1="150" x2="130" y2="260" stroke="#F87171" strokeWidth="3" />
      <line x1="130" y1="260" x2="105" y2="360" stroke="#F87171" strokeWidth="3" />
      <line x1="130" y1="260" x2="165" y2="365" stroke="#F87171" strokeWidth="3" />
      {[[130,150],[75,175],[200,140],[130,260],[105,360],[165,365]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="5" fill="#F87171" />
      ))}
      <text x="150" y="120" fill="#F87171" fontSize="20" fontWeight="bold">78°</text>
    </svg>

    <div className="relative z-10 mt-auto px-4 pb-3">
      <div className="bg-rose-500/95 rounded-xl px-4 py-3 flex items-center gap-3 mb-3">
        <Info size={18} />
        <div>
          <p className="text-[13px] font-bold">ท่าไม่ถูกต้อง</p>
          <p className="text-[11px] opacity-90">ยกแขนให้สูงขึ้นอีกเล็กน้อย</p>
        </div>
      </div>

      <p className="text-[11px] opacity-80 mb-1">ความคืบหน้าเซ็ตนี้</p>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: "53%", background: "#4ADE80" }} />
        </div>
        <span className="text-[11px] font-semibold">8 / 15 ครั้ง</span>
      </div>

      <div className="flex gap-3 pb-2">
        <button className="flex-1 bg-rose-500 rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-[13px]">
          <Square size={14} fill="white" /> หยุด
        </button>
        <button onClick={goSummary} className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 font-bold text-[13px]" style={{ background: BLUE }}>
          <Pause size={14} fill="white" /> หยุดพัก
        </button>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  4b. สรุปผลการฝึก (Results summary)                                  */
/* ------------------------------------------------------------------ */
const angleHistory = [
  { day: "5 พ.ค.", v: 78 }, { day: "6 พ.ค.", v: 82 }, { day: "7 พ.ค.", v: 86 }, { day: "8 พ.ค.", v: 92 },
];

const ResultsSummary = ({ goHome }) => {
  const w = 260, h = 90;
  const min = 70, max = 95;
  const pts = angleHistory.map((p, i) => {
    const x = (i / (angleHistory.length - 1)) * w;
    const y = h - ((p.v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  return (
    <div className="h-full flex flex-col bg-[--bg]" style={{ "--bg": BG }}>
      <div className="flex items-center justify-between px-5 pt-2 pb-3">
        <ChevronLeft size={20} className="text-slate-700" />
        <h1 className="text-[15px] font-bold text-slate-900">สรุปผลการฝึก</h1>
        <Share2 size={18} className="text-slate-500" />
      </div>

      <div className="px-5 overflow-y-auto flex-1 pb-4">
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-4">
            <RingProgress percent={92} size={72} stroke={8} color="#22C55E">
              <div className="text-center">
                <p className="text-[16px] font-bold text-slate-800">92%</p>
              </div>
            </RingProgress>
            <div>
              <p className="text-[11px] text-slate-400">ความถูกต้อง</p>
            </div>
            <div className="ml-auto grid grid-cols-2 gap-x-6 gap-y-2 text-right">
              <div>
                <p className="text-[15px] font-bold text-slate-800">3/3</p>
                <p className="text-[10px] text-slate-400">ท่าสำเร็จ</p>
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800">45/45</p>
                <p className="text-[10px] text-slate-400">จำนวนครั้ง</p>
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800">25 นาที</p>
                <p className="text-[10px] text-slate-400">เวลาในการฝึก</p>
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-800">120 kcal</p>
                <p className="text-[10px] text-slate-400">แคลอรี่ที่ใช้ไป</p>
              </div>
            </div>
          </div>
        </Card>

        <h2 className="text-[13px] font-bold text-slate-800 mb-2">มุมเฉลี่ยของแต่ละท่า</h2>
        <Card className="p-3 mb-4">
          {[
            { n: "ยกแขนด้านหน้า", v: "92°", ok: true },
            { n: "กางแขนด้านข้าง", v: "88°", ok: true },
            { n: "หมุนไหล่", v: "90°", ok: true },
          ].map((r, i, arr) => (
            <div key={r.n} className={`flex items-center justify-between py-2.5 ${i !== arr.length - 1 ? "border-b border-slate-100" : ""}`}>
              <div>
                <p className="text-[12px] font-semibold text-slate-700">{i + 1}. {r.n}</p>
                <p className="text-[11px] text-slate-400">เฉลี่ย {r.v}</p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 size={13} /> ดีมาก
              </span>
            </div>
          ))}
        </Card>

        <h2 className="text-[13px] font-bold text-slate-800 mb-2">พัฒนาการของมุมเอียง (ยกแขนไปด้านหน้า)</h2>
        <Card className="p-4 mb-4">
          <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} className="overflow-visible">
            <polyline points={pts.join(" ")} fill="none" stroke={BLUE} strokeWidth="2.5" />
            {angleHistory.map((p, i) => {
              const x = (i / (angleHistory.length - 1)) * w;
              const y = h - ((p.v - min) / (max - min)) * h;
              return (
                <g key={p.day}>
                  <circle cx={x} cy={y} r="3.5" fill={BLUE} />
                  <text x={x} y={y - 10} fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">{p.v}°</text>
                  <text x={x} y={h + 18} fontSize="9" fill="#94a3b8" textAnchor="middle">{p.day}</text>
                </g>
              );
            })}
          </svg>
        </Card>
      </div>
      <div className="px-5 pb-4">
        <button onClick={goHome} className="w-full text-white rounded-xl py-3 font-bold text-[14px]" style={{ background: BLUE }}>
          เสร็จสิ้น
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  5. โปรไฟล์เจ้าของ (Profile)                                          */
/* ------------------------------------------------------------------ */
const history = [
  { date: "8 พ.ค. 2567", status: "ฝึกเสร็จสมบูรณ์", min: "25 นาที", ok: true },
  { date: "7 พ.ค. 2567", status: "ฝึกเสร็จสมบูรณ์", min: "24 นาที", ok: true },
  { date: "6 พ.ค. 2567", status: "ฝึกเสร็จสมบูรณ์", min: "22 นาที", ok: true },
  { date: "5 พ.ค. 2567", status: "ฝึกไม่ครบ", min: "15 นาที", ok: false },
];

const ProfileScreen = () => (
  <div className="px-5 pb-4 overflow-y-auto h-full">
    <div className="flex items-center justify-between pt-2 pb-4">
      <h1 className="text-[16px] font-bold text-slate-900">โปรไฟล์เจ้าของ</h1>
      <Settings size={19} className="text-slate-500" />
    </div>

    <Card className="p-4 mb-4">
      <div className="flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop"
          className="w-14 h-14 rounded-full object-cover"
          alt="รูปโปรไฟล์"
        />
        <div className="flex-1">
          <p className="text-[15px] font-bold text-slate-900">คุณกานต์ สมสุข</p>
          <p className="text-[11px] text-slate-400">อายุ 28 ปี  |  ชาย</p>
          <p className="text-[11px] text-slate-400">ส่วนสูง 175 ซม.  |  น้ำหนัก 70 กก.</p>
        </div>
      </div>
      <button className="mt-3 text-[12px] font-semibold flex items-center gap-1" style={{ color: BLUE }}>
        แก้ไขข้อมูล <ChevronRight size={14} />
      </button>
    </Card>

    <h2 className="text-[13px] font-bold text-slate-800 mb-2">ภาพรวมการฝึก</h2>
    <div className="grid grid-cols-4 gap-2 mb-4">
      {[
        { v: "12", l: "วันฝึกทั้งหมด" },
        { v: "15", l: "ท่าที่ฝึก" },
        { v: "320", l: "จำนวนครั้งทั้งหมด" },
        { v: "24", l: "เวลาเฉลี่ย/วัน" },
      ].map((s) => (
        <Card key={s.l} className="p-2.5 text-center">
          <p className="text-[15px] font-bold" style={{ color: BLUE }}>{s.v}</p>
          <p className="text-[9px] text-slate-400 leading-tight mt-1">{s.l}</p>
        </Card>
      ))}
    </div>

    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[13px] font-bold text-slate-800">ประวัติการฝึก</h2>
      <button className="text-[11px] font-semibold flex items-center gap-0.5" style={{ color: BLUE }}>
        ดูทั้งหมด <ChevronRight size={13} />
      </button>
    </div>
    <Card className="p-2">
      {history.map((h, i) => (
        <div key={h.date} className={`flex items-center justify-between p-2.5 ${i !== history.length - 1 ? "border-b border-slate-100" : ""}`}>
          <div className="flex items-center gap-2.5">
            {h.ok ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : (
              <XCircle size={18} className="text-rose-500" />
            )}
            <div>
              <p className="text-[12px] font-semibold text-slate-700">{h.date}</p>
              <p className="text-[11px] text-slate-400">{h.status}</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">{h.min}</span>
        </div>
      ))}
    </Card>
  </div>
);

/* ------------------------------------------------------------------ */
/*  App shell                                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [tab, setTab] = useState("home");
  const [checkStage, setCheckStage] = useState("camera"); // camera -> live -> summary

  const renderScreen = () => {
    switch (tab) {
      case "home":
        return <HomeScreen goProgram={() => setTab("program")} />;
      case "program":
        return <ProgramScreen goCamera={() => { setCheckStage("camera"); setTab("camera"); }} />;
      case "camera":
        if (checkStage === "camera") return <CameraScreen goCheck={() => setCheckStage("live")} />;
        if (checkStage === "live") return <FormCheckScreen goSummary={() => setCheckStage("summary")} />;
        return <ResultsSummary goHome={() => { setCheckStage("camera"); setTab("home"); }} />;
      case "results":
        return <ResultsSummary goHome={() => setTab("home")} />;
      case "profile":
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  const isDarkScreen = tab === "camera" && checkStage !== "summary";

  // On a real phone (via Capacitor) this fills the actual device screen,
  // respecting the notch/home-indicator safe areas instead of the
  // desktop phone-mockup frame used for in-browser preview.
  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: isDarkScreen ? "#0f172a" : BG,
        fontFamily: "'Noto Sans Thai', 'Sarabun', system-ui, sans-serif",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {!isDarkScreen && <StatusBar />}
      <div className="h-full pb-[64px] relative">{renderScreen()}</div>
      <BottomNav
        active={tab === "camera" ? "camera" : tab}
        setActive={(k) => {
          setTab(k);
          if (k === "camera") setCheckStage("camera");
        }}
      />
    </div>
  );
}
