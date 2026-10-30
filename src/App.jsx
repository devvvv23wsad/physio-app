import React, { useState, useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import {
  Home, Calendar, Camera, CheckCircle2, User, Bell, Play, ChevronLeft,
  Flashlight, RotateCcw, Pause, Square, Share2, Settings, ChevronRight,
  XCircle, Info, TrendingUp, Flame
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens + animation CSS                                      */
/* ------------------------------------------------------------------ */
const BLUE = "#2F6FEE";
const BLUE_DARK = "#1E4FD6";
const BG = "#F4F6FB";
const EASE = "cubic-bezier(.22,1,.36,1)";
const formatThaiDate = (date) => new Intl.DateTimeFormat("th-TH", { day: "numeric", month: "long", year: "numeric" }).format(date);

const CSS = `
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes enterFwd{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:none}}
@keyframes enterBack{from{opacity:0;transform:translateX(-32px)}to{opacity:1;transform:none}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes popIn{0%{opacity:0;transform:scale(.6)}60%{transform:scale(1.12)}100%{opacity:1;transform:none}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}

.enter-fwd{animation:enterFwd .42s ${EASE}}
.enter-back{animation:enterBack .42s ${EASE}}
/* backwards (not forwards) so hover transforms still work after the entrance */
.fade-up{animation:fadeUp .55s ${EASE} backwards;animation-delay:calc(var(--i,0)*70ms)}
.slide-up{animation:slideUp .5s ${EASE} backwards;animation-delay:calc(var(--i,0)*80ms)}
.pop-in{animation:popIn .5s ${EASE} backwards;animation-delay:calc(var(--i,0)*80ms)}
.shake{animation:shake .5s ease .35s}
.pulse{animation:pulse 1.6s ease-in-out infinite}
.draw{stroke-dasharray:1;stroke-dashoffset:1;animation:draw 1.2s ${EASE} .35s forwards}

/* hover / press feedback */
.hov{transition:transform .25s ${EASE},box-shadow .25s ${EASE}}
.hov:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(47,111,238,.16)}
.hov:active{transform:translateY(0) scale(.985)}
.btn{transition:transform .2s ${EASE},filter .2s,box-shadow .2s}
.btn:hover{transform:translateY(-1px);filter:brightness(1.07);box-shadow:0 6px 16px rgba(47,111,238,.3)}
.btn:active{transform:scale(.97);filter:brightness(.97)}
.icon-btn{transition:transform .2s ${EASE},background-color .2s}
.icon-btn:hover{background-color:rgba(100,116,139,.16)}
.icon-btn:active{transform:scale(.88)}
.icon-btn-dark:hover{background-color:rgba(255,255,255,.2)}
.link{transition:opacity .2s,transform .2s}
.link:hover{opacity:.7;transform:translateX(2px)}
.row{transition:background-color .2s}
.row:hover{background-color:#F1F5FF}
.row .chev{transition:transform .2s ${EASE}}
.row:hover .chev{transform:translateX(4px)}
.zoom img{transition:transform .6s ${EASE}}
.zoom:hover img{transform:scale(1.06)}
.bar-fill{transition:width 1s ${EASE} .3s}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}
}
`;

const useMounted = () => {
  const [m, setM] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setM(true), 60);
    return () => clearTimeout(t);
  }, []);
  return m;
};

const CameraPreview = ({ stream }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);
  return <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />;
};

const Card = ({ children, className = "", style, i = 0, hover = false }) => (
  <div
    className={`bg-white rounded-2xl shadow-[0_2px_10px_rgba(20,30,60,0.06)] fade-up ${hover ? "hov" : ""} ${className}`}
    style={{ "--i": i, ...style }}
  >
    {children}
  </div>
);

const BackBtn = ({ onClick, dark = false }) => (
  <button
    onClick={onClick}
    aria-label="ย้อนกลับ"
    className={`icon-btn w-9 h-9 -ml-2 rounded-full flex items-center justify-center ${dark ? "icon-btn-dark text-white" : "text-slate-700"}`}
  >
    <ChevronLeft size={20} />
  </button>
);

const StatusBar = () => (
  <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[13px] font-semibold text-slate-900">
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="16" height="11" viewBox="0 0 16 11" fill="#0f172a">
        <rect x="0" y="7" width="2.5" height="4" rx="0.5" />
        <rect x="4.5" y="5" width="2.5" height="6" rx="0.5" />
        <rect x="9" y="3" width="2.5" height="8" rx="0.5" />
        <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.5" />
      </svg>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
        <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#0f172a" />
        <rect x="2" y="2" width="16" height="8" rx="1.5" fill="#0f172a" />
        <rect x="21.5" y="3.5" width="1.5" height="5" rx="0.7" fill="#0f172a" />
      </svg>
    </div>
  </div>
);

const NAV = [
  { key: "home", label: "หน้าหลัก", Icon: Home },
  { key: "program", label: "โปรแกรม", Icon: Calendar },
  { key: "camera", label: "ตรวจท่า", Icon: Camera },
  { key: "results", label: "ผลการฝึก", Icon: CheckCircle2 },
  { key: "profile", label: "โปรไฟล์", Icon: User },
];

const BottomNav = ({ active, setActive }) => (
  <div className="h-16 shrink-0 bg-white border-t border-slate-100 flex justify-around items-center px-1 z-20">
    {NAV.map(({ key, label, Icon }) => {
      const on = active === key;
      return (
        <button
          key={key}
          onClick={() => setActive(key)}
          aria-current={on ? "page" : undefined}
          className="group relative flex flex-col items-center gap-0.5 flex-1 pt-2.5 pb-2 my-1 rounded-xl transition-colors duration-200 hover:bg-slate-50"
        >
          {/* active indicator */}
          <span
            className="absolute top-0 h-[3px] w-8 rounded-b-full transition-all duration-300"
            style={{ background: BLUE, opacity: on ? 1 : 0, transform: on ? "scaleX(1)" : "scaleX(0.2)" }}
          />
          <span
            className="flex items-center justify-center w-10 h-7 rounded-full transition-all duration-300 group-hover:-translate-y-0.5 group-active:scale-90"
            style={{ background: on ? "#EAF0FE" : "transparent", transform: on ? "scale(1.08)" : undefined }}
          >
            <Icon size={20} strokeWidth={on ? 2.4 : 1.8} color={on ? BLUE : "#94A3B8"} className="transition-colors duration-200 group-hover:!stroke-[#2F6FEE]" />
          </span>
          <span
            className="text-[10px] transition-colors duration-200 group-hover:text-[#2F6FEE]"
            style={{ color: on ? BLUE : "#94A3B8", fontWeight: on ? 700 : 500 }}
          >
            {label}
          </span>
        </button>
      );
    })}
  </div>
);

/* Circular progress ring (animates from 0) */
const RingProgress = ({ percent, size = 64, stroke = 7, color = BLUE, track = "#E7ECF7", children }) => {
  const m = useMounted();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={m ? offset : c}
          style={{ transition: `stroke-dashoffset 1.1s ${EASE} .2s` }}
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
    <div className="flex items-center justify-between pt-2 pb-4 fade-up">
      <div>
        <h1 className="text-[19px] font-bold text-slate-900">สวัสดี, คุณกานต์</h1>
        <p className="text-[12px] text-slate-400 mt-0.5">วันนี้ {formatThaiDate(new Date())}</p>
      </div>
      <button aria-label="การแจ้งเตือน" className="icon-btn w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center">
        <Bell size={17} className="text-slate-500" />
      </button>
    </div>

    <Card className="p-4 mb-4" i={1} hover>
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
          className="btn mt-4 w-full bg-white rounded-xl py-2.5 flex items-center justify-center gap-2 font-bold text-[14px]"
          style={{ color: BLUE }}
        >
          <Play size={15} fill={BLUE} /> เริ่มฝึกวันนี้
        </button>
      </div>
    </Card>

    <div className="flex items-center justify-between mb-2 fade-up" style={{ "--i": 2 }}>
      <h2 className="text-[14px] font-bold text-slate-800">ท่าที่ต้องฝึกวันนี้</h2>
      <button className="link text-[11px] font-semibold" style={{ color: BLUE }}>ดูทั้งหมด</button>
    </div>
    <Card className="p-2 mb-4" i={3}>
      {exercises.map((ex, i) => (
        <button
          key={ex.id}
          onClick={goProgram}
          className={`row w-full text-left rounded-xl flex items-center gap-3 p-2.5 ${i !== exercises.length - 1 ? "border-b border-slate-100" : ""}`}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px]" style={{ background: "#EAF0FE", color: BLUE }}>
            {ex.id}
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-slate-800">{ex.name}</p>
            <p className="text-[11px] text-slate-400">{ex.detail}</p>
          </div>
          <ChevronRight size={16} className="chev text-slate-300" />
        </button>
      ))}
    </Card>

    <h2 className="text-[14px] font-bold text-slate-800 mb-2 fade-up" style={{ "--i": 4 }}>สรุปการฝึกวันนี้</h2>
    <Card className="p-4 mb-4 flex items-center justify-between" i={5} hover>
      {[["2/3", "ท่าสำเร็จ"], ["30/45", "จำนวนครั้ง"], ["18", "นาที"]].map(([v, l], i) => (
        <React.Fragment key={l}>
          {i > 0 && <div className="w-px h-8 bg-slate-100" />}
          <div className="text-center">
            <p className="text-[16px] font-bold text-slate-800">{v}</p>
            <p className="text-[10px] text-slate-400">{l}</p>
          </div>
        </React.Fragment>
      ))}
      <TrendingUp size={18} className="text-slate-300" />
    </Card>

    <Card className="p-4 flex items-center gap-3" i={6} hover style={{ background: "#EAF0FE" }}>
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
const DAYS = (() => {
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { d: new Intl.DateTimeFormat("th-TH", { weekday: "short" }).format(date), n: date.getDate() };
  });
})();

const ProgramScreen = ({ goCamera, goBack }) => {
  const [sel, setSel] = useState(new Date().getDate());
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-5 pt-2 pb-3 fade-up">
        <BackBtn onClick={goBack} />
        <h1 className="text-[16px] font-bold text-slate-900">โปรแกรมกายภาพ</h1>
      </div>
      <div className="flex justify-between px-5 mb-4 fade-up" style={{ "--i": 1 }}>
        {DAYS.map((day) => {
          const on = sel === day.n;
          return (
            <button key={day.n} onClick={() => setSel(day.n)} className="group flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-slate-400 transition-colors group-hover:text-slate-700">{day.d}</span>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-300 group-hover:scale-110 group-active:scale-90"
                style={on ? { background: BLUE, color: "white", boxShadow: "0 4px 10px rgba(47,111,238,.35)" } : { color: "#334155" }}
              >
                {day.n}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 overflow-y-auto flex-1 pb-4">
        <div key={sel} className="enter-fwd">
          <p className="text-[11px] text-slate-400 mb-1">ท่าที่ 1 จาก 3</p>
          <h2 className="text-[19px] font-bold text-slate-900 mb-3">ยกแขนด้านหน้า</h2>
          <p className="text-[12px] font-semibold text-slate-500 mb-2">3 เซ็ต x 15 ครั้ง</p>
        </div>

        <Card className="overflow-hidden mb-4" i={2}>
          <button onClick={goCamera} aria-label="เริ่มฝึกท่ายกแขนด้านหน้า" className="w-full h-44 bg-[#EAF0FE] flex flex-col items-center justify-center gap-2">
            <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#2F6FEE]">
              <Play size={20} fill="currentColor" />
            </span>
            <span className="text-[13px] font-bold text-slate-800">เริ่มฝึกท่านี้</span>
            <span className="text-[11px] text-slate-500">เปิดกล้องหรือฝึกแบบนับเอง</span>
          </button>
        </Card>

        <div className="fade-up" style={{ "--i": 3 }}>
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
        </div>

        <Card className="p-3 mb-4 flex justify-between" i={4} hover>
          {[["เซ็ต", "3"], ["จำนวนครั้ง", "15"], ["พักระหว่างเซ็ต", "30 วิ"]].map(([l, v], i) => (
            <React.Fragment key={l}>
              {i > 0 && <div className="w-px bg-slate-100" />}
              <div className="text-center flex-1">
                <p className="text-[10px] text-slate-400 mb-0.5">{l}</p>
                <p className="text-[16px] font-bold text-slate-800">{v}</p>
              </div>
            </React.Fragment>
          ))}
        </Card>
      </div>
      <div className="px-5 pb-4 fade-up" style={{ "--i": 5 }}>
        <button onClick={goCamera} className="btn w-full text-white rounded-xl py-3 font-bold text-[14px]" style={{ background: BLUE }}>
          เริ่มตรวจท่า
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  3. กล้อง AI วัดมุม (Camera)                                          */
/* ------------------------------------------------------------------ */
const CameraScreen = ({ stream, cameraError, startCamera, toggleTorch, switchCamera, torchOn, goCheck, goBack }) => (
  <div className="h-full relative bg-slate-900 text-white flex flex-col overflow-hidden">
    {stream ? <CameraPreview stream={stream} /> : <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-sm text-white/80">{cameraError || "แตะปุ่มด้านล่างเพื่อเปิดกล้อง"}</div>}
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />

    <div className="relative z-10 flex items-center justify-between px-4 pt-2">
      <button onClick={goBack} aria-label="ปิด" className="icon-btn icon-btn-dark w-9 h-9 rounded-full flex items-center justify-center">
        <XCircle size={22} className="opacity-90" />
      </button>
      <h1 className="text-[14px] font-bold">ยกแขนด้านหน้า</h1>
      <button onClick={toggleTorch} aria-label="เปิดหรือปิดไฟฉาย" className="icon-btn icon-btn-dark w-9 h-9 rounded-full flex items-center justify-center">
        <Flashlight size={20} className={torchOn ? "text-amber-300" : "opacity-90"} />
      </button>
    </div>

    <div className="relative z-10 mt-3 mx-4 rounded-lg bg-black/55 px-3 py-2 text-[11px] text-white/90">
      ภาพกล้องสด · การวัดมุมอัตโนมัติยังไม่พร้อม
    </div>
    {cameraError && <p role="status" className="relative z-10 mx-4 mt-2 text-center text-[11px]">{cameraError}</p>}
    <button onClick={goCheck} className="relative z-10 mx-4 mt-2 rounded-lg bg-white/15 px-3 py-2 text-[11px] font-semibold">
      ฝึกต่อแบบนับเอง
    </button>

    <div className="relative z-10 mt-auto px-4 pb-3">
      <div className="slide-up bg-black/55 backdrop-blur rounded-xl px-4 py-3 flex items-center justify-between mb-3" style={{ "--i": 2 }}>
        <div>
          <p className="text-[11px] opacity-70">มุมที่เหมาะสม</p>
          <p className="text-[15px] font-bold">90° - 110°</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
          <CheckCircle2 size={16} />
        </div>
      </div>
      <div className="flex items-center justify-around pb-2">
        <button onClick={toggleTorch} className="group flex flex-col items-center gap-1 text-[10px] opacity-90">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-active:scale-90"><Flashlight size={18} /></div>
          {torchOn ? "ปิดไฟ" : "เปิดไฟ"}
        </button>
        <button
          onClick={stream ? goCheck : startCamera}
          aria-label={stream ? "เริ่มฝึก" : "เปิดกล้อง"}
          className="w-16 h-16 rounded-full bg-white border-4 border-white/40 transition-all duration-200 hover:scale-110 hover:border-white/70 active:scale-90"
        />
        <button onClick={switchCamera} className="group flex flex-col items-center gap-1 text-[10px] opacity-90">
          <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-180 group-active:scale-90"><RotateCcw size={18} /></div>
          สลับกล้อง
        </button>
      </div>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  4. ตรวจสอบท่ากายภาพ (Form check, live)                              */
/* ------------------------------------------------------------------ */
const FormCheckScreen = ({ stream, sessionCount, paused, onRecordRep, onTogglePause, onStop }) => {
  const m = useMounted();
  const setNumber = Math.min(3, Math.floor(sessionCount / 15) + 1);
  const repsInSet = sessionCount === 45 ? 15 : sessionCount % 15;
  return (
    <div className="h-full relative bg-slate-900 text-white flex flex-col overflow-hidden">
      {stream && <CameraPreview stream={stream} />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

      <div className="relative z-10 flex items-center gap-2 px-4 pt-2">
        <span className="pop-in bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">เซ็ต {setNumber}/3</span>
        <span className="pop-in bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-[11px] font-semibold">ครั้งที่ {repsInSet}/15</span>
      </div>

      <div className="relative z-10 mt-auto px-4 pb-3">
        <div className="slide-up bg-black/60 backdrop-blur rounded-xl px-4 py-3 flex items-center gap-3 mb-3" style={{ "--i": 1 }}>
          <Info size={18} />
          <div>
            <p className="text-[13px] font-bold">บันทึกจำนวนครั้งด้วยตนเอง</p>
            <p className="text-[11px] opacity-90">ระบบยังไม่ได้วิเคราะห์ท่าจากกล้อง</p>
          </div>
        </div>

        <p className="text-[11px] opacity-80 mb-1">ความคืบหน้าเซ็ตนี้</p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="bar-fill h-full rounded-full" style={{ width: m ? `${(repsInSet / 15) * 100}%` : "0%", background: "#4ADE80" }} />
          </div>
          <span className="text-[11px] font-semibold">{repsInSet} / 15 ครั้ง</span>
        </div>

        <div className="flex gap-2 pb-2">
          <button onClick={onStop} className="btn flex-1 bg-rose-500 rounded-xl py-3 flex items-center justify-center gap-1 font-bold text-[11px]">
            <Square size={14} fill="white" /> หยุด
          </button>
          <button onClick={onTogglePause} className="btn flex-1 rounded-xl py-3 flex items-center justify-center gap-1 font-bold text-[11px]" style={{ background: BLUE_DARK }}>
            {paused ? <Play size={14} fill="white" /> : <Pause size={14} fill="white" />}
            {paused ? "ฝึกต่อ" : "พัก"}
          </button>
          <button onClick={onRecordRep} disabled={paused} className="btn flex-[1.3] rounded-xl py-3 flex items-center justify-center gap-1 font-bold text-[11px] disabled:opacity-50" style={{ background: BLUE }}>
            <CheckCircle2 size={14} /> บันทึก 1 ครั้ง
          </button>
        </div>
        {paused && <p className="text-center text-xs mb-2">พักอยู่</p>}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  4b. สรุปผลการฝึก (Results summary)                                  */
/* ------------------------------------------------------------------ */
const angleHistory = [
  { day: "5 พ.ค.", v: 78 }, { day: "6 พ.ค.", v: 82 }, { day: "7 พ.ค.", v: 86 }, { day: "8 พ.ค.", v: 92 },
];

const ResultsSummary = ({ goHome, goBack }) => {
  const w = 260, h = 90, min = 70, max = 95;
  const xy = (p, i) => [(i / (angleHistory.length - 1)) * w, h - ((p.v - min) / (max - min)) * h];
  const pts = angleHistory.map((p, i) => xy(p, i).join(","));
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-5 pt-2 pb-3 fade-up">
        <BackBtn onClick={goBack} />
        <h1 className="text-[15px] font-bold text-slate-900">สรุปผลการฝึก</h1>
        <button aria-label="แชร์" className="icon-btn w-9 h-9 -mr-2 rounded-full flex items-center justify-center">
          <Share2 size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="px-5 overflow-y-auto flex-1 pb-4">
        <Card className="p-4 mb-4" i={1} hover>
          <div className="flex items-center gap-4">
            <RingProgress percent={92} size={72} stroke={8} color="#22C55E">
              <p className="text-[16px] font-bold text-slate-800">92%</p>
            </RingProgress>
            <p className="text-[11px] text-slate-400">ความถูกต้อง</p>
            <div className="ml-auto grid grid-cols-2 gap-x-6 gap-y-2 text-right">
              {[["3/3", "ท่าสำเร็จ"], ["45/45", "จำนวนครั้ง"], ["25 นาที", "เวลาในการฝึก"], ["120 kcal", "แคลอรี่ที่ใช้ไป"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-[15px] font-bold text-slate-800">{v}</p>
                  <p className="text-[10px] text-slate-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <h2 className="text-[13px] font-bold text-slate-800 mb-2 fade-up" style={{ "--i": 2 }}>มุมเฉลี่ยของแต่ละท่า</h2>
        <Card className="p-3 mb-4" i={3}>
          {[
            { n: "ยกแขนด้านหน้า", v: "92°" },
            { n: "กางแขนด้านข้าง", v: "88°" },
            { n: "หมุนไหล่", v: "90°" },
          ].map((r, i, arr) => (
            <div key={r.n} className={`row rounded-lg px-1 flex items-center justify-between py-2.5 ${i !== arr.length - 1 ? "border-b border-slate-100" : ""}`}>
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

        <h2 className="text-[13px] font-bold text-slate-800 mb-2 fade-up" style={{ "--i": 4 }}>พัฒนาการของมุมเอียง (ยกแขนไปด้านหน้า)</h2>
        <Card className="p-4 mb-4" i={5} hover>
          <svg width="100%" viewBox={`-10 -20 ${w + 20} ${h + 46}`} className="overflow-visible">
            <polyline points={pts.join(" ")} fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="draw" />
            {angleHistory.map((p, i) => {
              const [x, y] = xy(p, i);
              return (
                <g key={p.day} className="pop-in" style={{ "--i": 4 + i, transformOrigin: `${x}px ${y}px` }}>
                  <circle cx={x} cy={y} r="3.5" fill={BLUE} />
                  <text x={x} y={y - 10} fontSize="11" fontWeight="bold" fill="#1e293b" textAnchor="middle">{p.v}°</text>
                  <text x={x} y={h + 18} fontSize="9" fill="#94a3b8" textAnchor="middle">{p.day}</text>
                </g>
              );
            })}
          </svg>
        </Card>
      </div>
      <div className="px-5 pb-4 fade-up" style={{ "--i": 6 }}>
        <button onClick={goHome} className="btn w-full text-white rounded-xl py-3 font-bold text-[14px]" style={{ background: BLUE }}>
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
    <div className="flex items-center justify-between pt-2 pb-4 fade-up">
      <h1 className="text-[16px] font-bold text-slate-900">โปรไฟล์เจ้าของ</h1>
      <button aria-label="ตั้งค่า" className="icon-btn w-9 h-9 -mr-2 rounded-full flex items-center justify-center">
        <Settings size={19} className="text-slate-500 transition-transform duration-500 hover:rotate-90" />
      </button>
    </div>

    <Card className="p-4 mb-4" i={1} hover>
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
      <button className="link mt-3 text-[12px] font-semibold flex items-center gap-1" style={{ color: BLUE }}>
        แก้ไขข้อมูล <ChevronRight size={14} />
      </button>
    </Card>

    <h2 className="text-[13px] font-bold text-slate-800 mb-2 fade-up" style={{ "--i": 2 }}>ภาพรวมการฝึก</h2>
    <div className="grid grid-cols-4 gap-2 mb-4">
      {[
        { v: "12", l: "วันฝึกทั้งหมด" },
        { v: "15", l: "ท่าที่ฝึก" },
        { v: "320", l: "จำนวนครั้งทั้งหมด" },
        { v: "24", l: "เวลาเฉลี่ย/วัน" },
      ].map((s, i) => (
        <Card key={s.l} className="p-2.5 text-center" i={3 + i * 0.5} hover>
          <p className="text-[15px] font-bold" style={{ color: BLUE }}>{s.v}</p>
          <p className="text-[9px] text-slate-400 leading-tight mt-1">{s.l}</p>
        </Card>
      ))}
    </div>

    <div className="flex items-center justify-between mb-2 fade-up" style={{ "--i": 5 }}>
      <h2 className="text-[13px] font-bold text-slate-800">ประวัติการฝึก</h2>
      <button className="link text-[11px] font-semibold flex items-center gap-0.5" style={{ color: BLUE }}>
        ดูทั้งหมด <ChevronRight size={13} />
      </button>
    </div>
    <Card className="p-2" i={6}>
      {history.map((h, i) => (
        <div key={h.date} className={`row rounded-xl flex items-center justify-between p-2.5 ${i !== history.length - 1 ? "border-b border-slate-100" : ""}`}>
          <div className="flex items-center gap-2.5">
            {h.ok ? <CheckCircle2 size={18} className="text-emerald-500" /> : <XCircle size={18} className="text-rose-500" />}
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
/*  App shell — navigation stack so "back" really goes back            */
/* ------------------------------------------------------------------ */
const TAB_ORDER = NAV.map((n) => n.key);

export default function App() {
  // each entry: { tab, stage }  (stage only used by the camera flow)
  const [stack, setStack] = useState([{ tab: "home", stage: null }]);
  const [dir, setDir] = useState("fwd");
  const [cameraStream, setCameraStream] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraFacing, setCameraFacing] = useState("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const cur = stack[stack.length - 1];

  const startCamera = async (facingMode = cameraFacing) => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("เบราว์เซอร์นี้ไม่รองรับกล้องสด กรุณาเปิดแอปผ่าน HTTPS หรือ localhost");
      return;
    }
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setCameraStream((previous) => {
        previous?.getTracks().forEach((track) => track.stop());
        return stream;
      });
      setTorchOn(false);
    } catch (error) {
      setCameraError(error.name === "NotAllowedError"
        ? "ไม่ได้รับอนุญาตให้ใช้กล้อง กรุณาอนุญาตในการตั้งค่าเบราว์เซอร์"
        : "เปิดกล้องไม่สำเร็จ กรุณาตรวจสอบว่ากล้องไม่ได้ถูกแอปอื่นใช้งาน");
    }
  };

  const stopCamera = () => {
    setCameraStream((stream) => {
      stream?.getTracks().forEach((track) => track.stop());
      return null;
    });
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    const track = cameraStream?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.();
    if (!capabilities?.torch) {
      setCameraError("อุปกรณ์นี้ไม่รองรับไฟฉาย");
      return;
    }
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((on) => !on);
      setCameraError("");
    } catch {
      setCameraError("ไม่สามารถเปิดไฟฉายของกล้องได้");
    }
  };

  const switchCamera = async () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    if (cameraStream) await startCamera(nextFacing);
  };

  useEffect(() => () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
  }, [cameraStream]);

  const push = (s) => { setDir("fwd"); setStack((st) => [...st, s]); };

  const switchTab = (k) => {
    if (k === cur.tab && stack.length === 1) return;
    if (k !== "camera") stopCamera();
    setDir(TAB_ORDER.indexOf(k) >= TAB_ORDER.indexOf(cur.tab) ? "fwd" : "back");
    setStack([{ tab: k, stage: k === "camera" ? "camera" : null }]);
  };

  const goBack = () => {
    if (stack.length > 1) {
      const previous = stack[stack.length - 2];
      if (cur.tab === "camera" && previous.tab !== "camera") stopCamera();
      setDir("back");
      setStack((st) => st.slice(0, -1));
    } else if (cur.tab !== "home") {
      switchTab("home");
    }
  };

  const goBackRef = useRef(goBack);
  useEffect(() => {
    goBackRef.current = goBack;
  }, [goBack]);

  // Android hardware back button / browser back, if running via Capacitor
  useEffect(() => {
    let active = true;
    let listener;
    import("@capacitor/app")
      .then(({ App: CapApp }) => {
        CapApp.addListener("backButton", () => goBackRef.current()).then((subscription) => {
          if (active) listener = subscription;
          else subscription.remove();
        });
      })
      .catch(() => {});
    return () => {
      active = false;
      listener?.remove();
    };
  }, []);

  const renderScreen = () => {
    switch (cur.tab) {
      case "home":
        return <HomeScreen goProgram={() => push({ tab: "program" })} />;
      case "program":
        return <ProgramScreen goBack={goBack} goCamera={() => { setSessionCount(0); setPaused(false); setCameraError(""); push({ tab: "camera", stage: "camera" }); }} />;
      case "camera":
        if (cur.stage === "camera") return <CameraScreen stream={cameraStream} cameraError={cameraError} startCamera={startCamera} toggleTorch={toggleTorch} switchCamera={switchCamera} torchOn={torchOn} goBack={() => { stopCamera(); goBack(); }} goCheck={() => { setSessionCount(0); push({ tab: "camera", stage: "live" }); }} />;
        if (cur.stage === "live") return <FormCheckScreen stream={cameraStream} sessionCount={sessionCount} paused={paused} onRecordRep={() => { if (sessionCount >= 44) { setSessionCount(45); setPaused(false); stopCamera(); push({ tab: "camera", stage: "summary" }); } else { setSessionCount((count) => count + 1); } }} onTogglePause={() => setPaused((value) => !value)} onStop={() => { stopCamera(); setPaused(false); switchTab("program"); }} />;
        return <ResultsSummary goBack={() => switchTab("program")} goHome={() => switchTab("home")} />;
      case "results":
        return <ResultsSummary goBack={goBack} goHome={() => switchTab("home")} />;
      case "profile":
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  const isDarkScreen = cur.tab === "camera" && cur.stage !== "summary";

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden transition-colors duration-500"
      style={{
        background: isDarkScreen ? "#0f172a" : BG,
        fontFamily: "'Noto Sans Thai', 'Sarabun', system-ui, sans-serif",
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <style>{CSS}</style>
      {!isDarkScreen && !Capacitor.isNativePlatform() && <StatusBar />}
      <div className="min-h-0 flex-1 relative overflow-hidden">
        <div key={`${cur.tab}-${cur.stage}`} className={`h-full ${dir === "fwd" ? "enter-fwd" : "enter-back"}`}>
          {renderScreen()}
        </div>
      </div>
      <BottomNav active={cur.tab} setActive={switchTab} />
    </div>
  );
}