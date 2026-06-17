import React from 'react';
import { ShieldAlert, ShieldCheck, Sun, Moon, Wind } from 'lucide-react';

export default function EcosystemVisualizer({ anchor, score, activePledges = [] }) {
  // Determine health tier
  let statusText = "";
  let statusColor = "";
  let statusBg = "";
  
  if (score < 30) {
    statusText = "CRITICAL COLLAPSE";
    statusColor = "text-red-400";
    statusBg = "bg-red-500/10 border-red-500/20";
  } else if (score < 60) {
    statusText = "THREATENED SYSTEM";
    statusColor = "text-amber-400";
    statusBg = "bg-amber-500/10 border-amber-500/20";
  } else if (score < 85) {
    statusText = "RECOVERING BIOME";
    statusColor = "text-blue-400";
    statusBg = "bg-blue-500/10 border-blue-500/20";
  } else {
    statusText = "FLOURISHING ECOSYSTEM";
    statusColor = "text-emerald-400";
    statusBg = "bg-emerald-500/10 border-emerald-500/20";
  }

  const isGreenPower = activePledges.includes("green-power");
  const isZeroWaste = activePledges.includes("zero-waste");
  const isCommuteSwap = activePledges.includes("commute-swap");
  const isFlightFast = activePledges.includes("flight-fast");
  const isMeatlessMonday = activePledges.includes("meatless-mondays");

  // Renders the specific environment SVG
  const renderEcosystem = () => {
    switch (anchor) {
      case 'forest':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl transition-all duration-700" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Sky Gradients based on health */}
              <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
                {score < 40 ? (
                  // Smoggy / Wildfire sunset
                  <>
                    <stop offset="0%" stopColor="#2e1009" />
                    <stop offset="60%" stopColor="#4c1d0f" />
                    <stop offset="100%" stopColor="#2b1a13" />
                  </>
                ) : score < 75 ? (
                  // Hazy evening
                  <>
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="70%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </>
                ) : (
                  // Rich vibrant clean dawn
                  <>
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="50%" stopColor="#0d3c32" />
                    <stop offset="100%" stopColor="#064e3b" />
                  </>
                )}
              </linearGradient>
              {/* Forest mountain gradient */}
              <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
            </defs>

            {/* Background Sky */}
            <rect width="800" height="450" fill="url(#forestSky)" className="transition-all duration-1000" />

            {/* Stars (Only in healthy sky) */}
            {score >= 60 && (
              <g className="opacity-60">
                <circle cx="120" cy="80" r="1.5" fill="#fff" />
                <circle cx="280" cy="50" r="1" fill="#fff" />
                <circle cx="450" cy="90" r="2" fill="#fff" className="animate-pulse" />
                <circle cx="680" cy="60" r="1.5" fill="#fff" />
                <circle cx="730" cy="120" r="1" fill="#fff" />
                <circle cx="200" cy="130" r="1.5" fill="#fff" />
              </g>
            )}

            {/* Moon / Sun */}
            {score < 40 ? (
              // Scorching/dim blood sun
              <circle cx="650" cy="140" r="35" fill="#dc2626" opacity="0.3" className="transition-all duration-1000" />
            ) : (
              // Silver moon
              <circle cx="650" cy="100" r="25" fill="#e2e8f0" opacity="0.85" className="transition-all duration-1000 animate-float-slow" />
            )}

            {/* Industrial Plant / Wind Turbine Area */}
            {/* If green power is NOT adopted, show smokestacks and smoke particles if health is low */}
            {!isGreenPower ? (
              <g className="transition-all duration-700">
                {/* Factory Building */}
                <rect x="50" y="220" width="100" height="80" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                <polygon points="50,220 80,190 110,220" fill="#0f172a" />
                {/* Smokestack */}
                <rect x="115" y="140" width="20" height="80" fill="#334155" />
                <rect x="110" y="135" width="30" height="8" fill="#ef4444" />
                
                {/* Rising smoke particles (only if score is low) */}
                {score < 70 && (
                  <g>
                    <circle cx="125" cy="115" r="8" fill="#475569" className="animate-rise-smoke-1" />
                    <circle cx="125" cy="115" r="12" fill="#475569" className="animate-rise-smoke-2" />
                    <circle cx="125" cy="115" r="10" fill="#475569" className="animate-rise-smoke-3" />
                  </g>
                )}
              </g>
            ) : (
              // Green power adopted - show beautiful wind turbines
              <g className="transition-all duration-700" transform="translate(100, 150)">
                <line x1="0" y1="150" x2="0" y2="0" stroke="#94a3b8" strokeWidth="4" />
                {/* Blade rotor */}
                <g className="animate-spin-slow">
                  <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
                  <path d="M0,0 L0,-70" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0,0 L60,35" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0,0 L-60,35" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                </g>
                {/* Secondary small turbine */}
                <g transform="translate(60, 40) scale(0.6)">
                  <line x1="0" y1="150" x2="0" y2="0" stroke="#64748b" strokeWidth="4" />
                  <g className="animate-spin-slow" style={{ animationDuration: '8s' }}>
                    <circle cx="0" cy="0" r="4" fill="#cbd5e1" />
                    <path d="M0,0 L0,-70" stroke="#cbd5e1" strokeWidth="3" />
                    <path d="M0,0 L60,35" stroke="#cbd5e1" strokeWidth="3" />
                    <path d="M0,0 L-60,35" stroke="#cbd5e1" strokeWidth="3" />
                  </g>
                </g>
              </g>
            )}

            {/* Background Mountains */}
            <path d="M-100,320 L150,220 L400,300 L650,200 L900,340 L900,450 L-100,450 Z" fill="url(#mountainGrad)" />

            {/* Midground Hills */}
            <path d="M-50,360 L250,280 L550,340 L850,260 L950,380 L950,450 L-50,450 Z" fill="#06372d" opacity="0.9" />

            {/* Smog Layer (Toggled by commute pledge & score) */}
            {!isCommuteSwap && score < 50 && (
              <rect width="800" height="450" fill="#78350f" opacity={score < 25 ? "0.3" : "0.15"} className="pointer-events-none transition-all duration-1000" />
            )}

            {/* Forest Floor Trash (Toggled by zero waste pledge) */}
            {!isZeroWaste && score < 60 && (
              <g className="transition-all duration-500" opacity="0.85">
                {/* Trash details */}
                <path d="M220,385 L235,382 L230,392 Z" fill="#64748b" /> {/* Can */}
                <rect x="420" y="390" width="15" height="8" rx="2" fill="#ef4444" transform="rotate(15, 420, 390)" /> {/* Wrapper */}
                <ellipse cx="610" cy="402" rx="12" ry="5" fill="#3b82f6" transform="rotate(-10, 610, 402)" /> {/* Bottle */}
              </g>
            )}

            {/* Wildflowers (Toggled by meatless mondays or very high health) */}
            {(isMeatlessMonday || score > 80) && (
              <g className="transition-all duration-700 opacity-90">
                {/* Red/Yellow/Blue dots as wildflowers */}
                <circle cx="210" cy="390" r="3" fill="#f43f5e" />
                <circle cx="214" cy="393" r="2" fill="#f43f5e" />
                <circle cx="250" cy="405" r="3.5" fill="#eab308" />
                <circle cx="340" cy="385" r="3" fill="#3b82f6" />
                <circle cx="480" cy="395" r="4" fill="#a855f7" />
                <circle cx="580" cy="410" r="3" fill="#eab308" />
                <circle cx="670" cy="392" r="3.5" fill="#f43f5e" />
              </g>
            )}

            {/* Trees (Health and leaf count dependent on Score) */}
            {/* Tree 1 (Left - Large) */}
            <g transform="translate(280, 320)" className="animate-sway">
              {/* Trunk */}
              <path d="M-12,80 L-6,0 L6,0 L12,80 Z" fill="#451a03" />
              {/* Leaves Layer 1 (Sick/Brown vs Healthy/Green) */}
              <ellipse cx="0" cy="-20" rx="45" ry="40" fill={score < 35 ? "#78350f" : score < 65 ? "#854d0e" : "#047857"} className="transition-all duration-1000" />
              {/* Leaves Layer 2 */}
              <ellipse cx="-20" cy="-45" rx="35" ry="30" fill={score < 35 ? "#451a03" : score < 65 ? "#a16207" : "#059669"} className="transition-all duration-1000" />
              <ellipse cx="20" cy="-45" rx="35" ry="30" fill={score < 35 ? "#78350f" : score < 65 ? "#65a30d" : "#10b981"} className="transition-all duration-1000" />
            </g>

            {/* Tree 2 (Middle Right) */}
            <g transform="translate(520, 300)" className="animate-sway" style={{ animationDelay: '1s' }}>
              <path d="M-8,70 L-4,0 L4,0 L8,70 Z" fill="#451a03" />
              {/* If score is very low, make it a dead branch tree */}
              {score < 25 ? (
                <g stroke="#451a03" strokeWidth="4" fill="none">
                  <path d="M0,0 Q-20,-20 -35,-30" />
                  <path d="M0,-10 Q20,-30 35,-45" />
                  <path d="M0,-25 Q-15,-45 -10,-65" />
                </g>
              ) : (
                <g className="transition-all duration-1000">
                  <circle cx="0" cy="-20" r="38" fill={score < 50 ? "#a16207" : "#047857"} />
                  <circle cx="-15" cy="-40" r="28" fill={score < 50 ? "#854d0e" : "#059669"} />
                  <circle cx="15" cy="-40" r="28" fill={score < 50 ? "#a16207" : "#10b981"} />
                </g>
              )}
            </g>

            {/* Tree 3 (Right - Small) */}
            <g transform="translate(680, 310)" className="animate-sway" style={{ animationDelay: '2.5s' }}>
              <path d="M-6,60 L-3,0 L3,0 L6,60 Z" fill="#3b1703" />
              {score < 40 ? (
                <circle cx="0" cy="-15" r="22" fill="#78350f" className="transition-all duration-1000" />
              ) : (
                <circle cx="0" cy="-15" r="25" fill="#065f46" className="transition-all duration-1000" />
              )}
              {score >= 60 && <circle cx="10" cy="-25" r="18" fill="#059669" className="transition-all duration-1000" />}
            </g>

            {/* Birds (Toggled by flight pledge or high health) */}
            {(isFlightFast || score > 70) && (
              <g className="opacity-80 transition-all duration-700">
                {/* Bird 1 */}
                <path d="M 320 120 Q 328 112 335 120 Q 342 112 350 120" stroke="#cbd5e1" strokeWidth="2" fill="none" className="animate-float" />
                {/* Bird 2 */}
                <path d="M 360 140 Q 366 134 372 140 Q 378 134 384 140" stroke="#cbd5e1" strokeWidth="1.5" fill="none" className="animate-float-opposite" />
                {/* Bird 3 */}
                <path d="M 290 100 Q 295 95 300 100 Q 305 95 310 100" stroke="#cbd5e1" strokeWidth="1.5" fill="none" className="animate-float" style={{ animationDelay: '0.8s' }} />
              </g>
            )}

            {/* Deer/Forest Life (Only visible in healthy biomes) */}
            {score >= 65 && (
              <g transform="translate(380, 340)" className="opacity-95 transition-all duration-1000">
                {/* Little deer silhouette */}
                {/* Body */}
                <ellipse cx="20" cy="25" rx="14" ry="8" fill="#f59e0b" />
                {/* Neck & Head */}
                <path d="M28,22 L35,10 L39,12 L35,24 Z" fill="#f59e0b" />
                <ellipse cx="37" cy="10" rx="5" ry="3" fill="#f59e0b" />
                {/* Ears */}
                <polygon points="34,8 36,3 38,8" fill="#f59e0b" />
                {/* Legs */}
                <line x1="10" y1="28" x2="8" y2="45" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="16" y1="29" x2="16" y2="45" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="26" y1="28" x2="28" y2="45" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="30" y1="26" x2="33" y2="45" stroke="#f59e0b" strokeWidth="2.5" />
                {/* Tail */}
                <path d="M7,22 L4,26 L9,26 Z" fill="#f59e0b" />
              </g>
            )}
          </svg>
        );

      case 'glacier':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl transition-all duration-700" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Sky Gradients */}
              <linearGradient id="glacierSky" x1="0%" y1="0%" x2="0%" y2="100%">
                {score < 40 ? (
                  // Sick burning grey/orange sky
                  <>
                    <stop offset="0%" stopColor="#431407" />
                    <stop offset="60%" stopColor="#7c2d12" />
                    <stop offset="100%" stopColor="#1e1b4b" />
                  </>
                ) : score < 75 ? (
                  // Overcast cold sky
                  <>
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="80%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </>
                ) : (
                  // Aurora Borealis starry night sky
                  <>
                    <stop offset="0%" stopColor="#020617" />
                    <stop offset="65%" stopColor="#0f172a" />
                    <stop offset="100%" stopColor="#172554" />
                  </>
                )}
              </linearGradient>
              {/* Ice Gradient */}
              <linearGradient id="iceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="30%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              {/* Bleak sun filter */}
              <radialGradient id="scorchingSun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
                <stop offset="30%" stopColor="#facc15" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Sky */}
            <rect width="800" height="450" fill="url(#glacierSky)" className="transition-all duration-1000" />

            {/* Aurora effect (Only in healthy sky) */}
            {score >= 75 && (
              <path d="M-100,100 Q150,20 400,90 T900,50 L900,180 L-100,180 Z" fill="#059669" opacity="0.15" className="animate-float" style={{ filter: 'blur(20px)' }} />
            )}

            {/* Melting Sun Rays (Only if score is low) */}
            {score < 40 && (
              <g className="transition-all duration-1000">
                <circle cx="400" cy="50" r="150" fill="url(#scorchingSun)" />
                <line x1="400" y1="50" x2="250" y2="280" stroke="#facc15" strokeWidth="2" opacity="0.3" />
                <line x1="400" y1="50" x2="400" y2="300" stroke="#facc15" strokeWidth="2" opacity="0.3" />
                <line x1="400" y1="50" x2="550" y2="280" stroke="#facc15" strokeWidth="2" opacity="0.3" />
              </g>
            )}

            {/* Ocean Water (Rises if glacier melts) */}
            {/* Low score = higher, darker water. High score = calm deep teal water */}
            <rect x="0" y={score < 35 ? "260" : "300"} width="800" height="200" fill={score < 35 ? "#0c4a6e" : "#075985"} className="transition-all duration-1000" />

            {/* Floating Icebergs */}
            {/* Small iceberg left */}
            <g transform="translate(100, 270)" className="animate-float-opposite">
              <polygon points="0,50 30,0 70,10 110,60" fill="url(#iceGrad)" opacity={score < 25 ? "0.3" : "0.9"} className="transition-all duration-1000" />
            </g>

            {/* MAIN GLACIER */}
            {/* Shape changes based on melting state */}
            {score < 30 ? (
              // Heavily melted, broken glacier
              <g className="transition-all duration-1000">
                {/* Back pieces */}
                <polygon points="450,280 500,190 550,200 620,290" fill="#0369a1" />
                {/* Main block - cracked and sunken */}
                <path d="M220,300 L250,210 Q280,240 310,215 L360,250 L400,205 L470,300 Z" fill="url(#iceGrad)" />
                <path d="M360,250 L380,290" stroke="#0284c7" strokeWidth="4" /> {/* crack */}
              </g>
            ) : score < 65 ? (
              // Average state
              <g className="transition-all duration-1000">
                <polygon points="150,320 220,160 300,180 390,140 480,180 550,320" fill="url(#iceGrad)" />
                <polygon points="450,320 540,110 650,140 780,320" fill="#0369a1" />
              </g>
            ) : (
              // Massive, healthy, beautiful ice shelf
              <g className="transition-all duration-1000">
                {/* Massive background ice walls */}
                <polygon points="40,320 180,60 350,90 480,50 650,110 820,320" fill="url(#iceGrad)" opacity="0.7" />
                {/* Foreground shelf */}
                <path d="M120,310 L200,100 L380,120 L500,80 L680,140 L720,310 Z" fill="url(#iceGrad)" />
                {/* Beautiful snowy peaks */}
                <polygon points="200,100 240,130 180,130" fill="#ffffff" />
                <polygon points="500,80 540,115 470,115" fill="#ffffff" />
              </g>
            )}

            {/* Environmental Dust/Ash (Toggled by grid power / waste) */}
            {(!isGreenPower || !isZeroWaste) && score < 40 && (
              <g className="opacity-40">
                {/* Soot specs */}
                <circle cx="280" cy="220" r="1.5" fill="#000" />
                <circle cx="340" cy="180" r="1" fill="#000" />
                <circle cx="410" cy="240" r="1.5" fill="#000" />
                <circle cx="460" cy="190" r="2" fill="#000" />
              </g>
            )}

            {/* Snowfall (Only in healthy biomes - score >= 60) */}
            {score >= 60 && (
              <g className="opacity-80">
                <circle cx="80" cy="150" r="2" fill="#fff" className="animate-float-slow" />
                <circle cx="220" cy="80" r="1.5" fill="#fff" className="animate-float" />
                <circle cx="380" cy="120" r="2.5" fill="#fff" className="animate-float-slow" style={{ animationDelay: '1.5s' }} />
                <circle cx="510" cy="140" r="1.5" fill="#fff" className="animate-float" style={{ animationDelay: '0.5s' }} />
                <circle cx="670" cy="90" r="2" fill="#fff" className="animate-float-slow" style={{ animationDelay: '2s' }} />
              </g>
            )}

            {/* POLAR BEAR (Emotional Focal Point) */}
            {score < 30 ? (
              // Stranded polar bear on a tiny, melting ice floe, looking sad
              <g transform="translate(140, 270)" className="animate-float">
                {/* Tiny ice sheet */}
                <ellipse cx="25" cy="40" rx="35" ry="8" fill="#e0f2fe" stroke="#bae6fd" strokeWidth="2" />
                {/* Bear Silhouette */}
                <path d="M10,25 C10,20 15,15 22,15 C26,15 28,18 31,17 C34,16 36,12 39,12 C41,12 43,15 41,18 C40,20 37,23 37,25 C37,28 35,32 30,32 C25,32 20,33 16,33 C12,33 10,30 10,25 Z" fill="#ffffff" />
                <circle cx="39" cy="15" r="0.8" fill="#000" /> {/* Eye */}
                {/* Legs */}
                <line x1="14" y1="30" x2="13" y2="40" stroke="#ffffff" strokeWidth="3" />
                <line x1="20" y1="31" x2="20" y2="40" stroke="#ffffff" strokeWidth="3" />
                <line x1="28" y1="31" x2="28" y2="40" stroke="#ffffff" strokeWidth="3" />
                <line x1="33" y1="29" x2="34" y2="39" stroke="#ffffff" strokeWidth="3" />
              </g>
            ) : (
              // Safe bear family on the massive main glacier
              <g transform="translate(320, 210)" className="transition-all duration-1000">
                {/* Mama Bear */}
                <g>
                  {/* Body */}
                  <ellipse cx="40" cy="45" rx="30" ry="20" fill="#ffffff" />
                  {/* Head */}
                  <circle cx="78" cy="35" r="12" fill="#ffffff" />
                  <path d="M78,35 L90,38 L88,43 L76,43 Z" fill="#ffffff" /> {/* Snout */}
                  <circle cx="84" cy="33" r="1.5" fill="#000" /> {/* Eye */}
                  <circle cx="89" cy="37" r="1" fill="#000" /> {/* Nose */}
                  {/* Ears */}
                  <circle cx="72" cy="23" r="3.5" fill="#ffffff" />
                  {/* Legs */}
                  <rect x="20" y="55" width="8" height="20" rx="3" fill="#ffffff" />
                  <rect x="35" y="57" width="8" height="18" rx="3" fill="#ffffff" />
                  <rect x="52" y="55" width="8" height="20" rx="3" fill="#ffffff" />
                  <rect x="65" y="54" width="8" height="21" rx="3" fill="#ffffff" />
                </g>

                {/* Little Cub (Visible in healthy states) */}
                {score >= 60 && (
                  <g transform="translate(-20, 15) scale(0.65)">
                    <ellipse cx="40" cy="45" rx="30" ry="20" fill="#f8fafc" />
                    <circle cx="78" cy="35" r="12" fill="#f8fafc" />
                    <path d="M78,35 L90,38 L88,43 L76,43 Z" fill="#f8fafc" />
                    <circle cx="84" cy="33" r="1.5" fill="#000" />
                    <circle cx="72" cy="23" r="3.5" fill="#f8fafc" />
                    <rect x="20" y="55" width="8" height="20" rx="3" fill="#f8fafc" />
                    <rect x="52" y="55" width="8" height="20" rx="3" fill="#f8fafc" />
                  </g>
                )}
              </g>
            )}
          </svg>
        );

      case 'reef':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl transition-all duration-700" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Sea Water Gradient based on health */}
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                {score < 40 ? (
                  // Murky yellow-green acidified water
                  <>
                    <stop offset="0%" stopColor="#1e293b" />
                    <stop offset="60%" stopColor="#3f6212" />
                    <stop offset="100%" stopColor="#22420f" />
                  </>
                ) : score < 75 ? (
                  // Average ocean water
                  <>
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="50%" stopColor="#0369a1" />
                    <stop offset="100%" stopColor="#083344" />
                  </>
                ) : (
                  // Ultra clean crystal blue sea
                  <>
                    <stop offset="0%" stopColor="#020617" />
                    <stop offset="40%" stopColor="#0e7490" />
                    <stop offset="100%" stopColor="#155e75" />
                  </>
                )}
              </linearGradient>
              {/* Coral gradients */}
              <linearGradient id="coralVibrant" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#be123c" />
              </linearGradient>
              <linearGradient id="coralSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>

            {/* Sea Water */}
            <rect width="800" height="450" fill="url(#seaGrad)" className="transition-all duration-1000" />

            {/* Sunlight rays filtering down */}
            <g opacity={score < 40 ? "0.1" : "0.25"} className="transition-all duration-1000">
              <polygon points="150,0 220,0 380,450 250,450" fill="#38bdf8" />
              <polygon points="400,0 480,0 650,450 510,450" fill="#38bdf8" />
            </g>

            {/* Floating Trash / Plastics (Toggled by Zero Waste) */}
            {!isZeroWaste && score < 55 && (
              <g className="animate-float" opacity="0.8">
                {/* Floating plastic bag */}
                <path d="M250,110 Q265,100 280,105 Q285,120 270,130 Q255,135 245,120 Z" fill="#cbd5e1" opacity="0.6" stroke="#94a3b8" strokeWidth="1" />
                <line x1="247" y1="120" x2="238" y2="128" stroke="#cbd5e1" strokeWidth="2" />
                {/* Plastic bottle */}
                <g transform="translate(580, 160) rotate(45)">
                  <rect x="0" y="0" width="12" height="25" rx="3" fill="#60a5fa" opacity="0.5" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="3" y="-5" width="6" height="5" fill="#3b82f6" opacity="0.8" />
                </g>
              </g>
            )}

            {/* Healthy fish swimming (Toggled by high health or staycation flights pledge) */}
            {(isFlightFast || score > 65) && (
              <g className="animate-swim transition-all duration-1000">
                {/* Fish 1 (Yellow Tang) */}
                <g transform="translate(350, 140) scale(0.8)">
                  <path d="M 0 0 C 15 -10, 30 -10, 40 0 C 35 15, 20 20, 0 0 Z" fill="#eab308" />
                  <polygon points="40,0 55,-12 48,0 55,12" fill="#eab308" />
                  <circle cx="10" cy="-2" r="1.5" fill="#000" />
                </g>
                {/* Fish 2 (Clownfish) */}
                <g transform="translate(480, 260) scale(0.65) scaleX(-1)">
                  <path d="M 0 0 C 15 -10, 30 -10, 40 0 C 35 15, 20 20, 0 0 Z" fill="#ea580c" />
                  <polygon points="40,0 55,-12 48,0 55,12" fill="#ea580c" />
                  <circle cx="10" cy="-2" r="1.5" fill="#fff" />
                  {/* White stripe */}
                  <path d="M18,-6 L18,8 A3,3 0 0 0 23,8 L23,-6 Z" fill="#fff" />
                </g>
              </g>
            )}

            {/* Sea Floor Ground */}
            <path d="M-50,420 Q120,380 340,410 T850,390 L850,455 L-50,455 Z" fill="#1e293b" />

            {/* CORALS (Emotional Focal Point - Bleaching Status) */}
            
            {/* Left Coral: Staghorn (Complex branches) */}
            <g transform="translate(180, 400)" className="animate-sway">
              {score < 35 ? (
                // Bleached / Dead White Coral
                <path d="M-10,0 C-10,-40 -25,-60 -20,-85 C-18,-95 -10,-100 -5,-110 M-14,-50 Q-40,-75 -35,-95 M-7,-30 Q20,-50 15,-70 M17,-60 Q35,-80 25,-100" 
                      stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" fill="none" className="transition-all duration-1000" />
              ) : (
                // Vibrant Pink Coral
                <path d="M-10,0 C-10,-40 -25,-60 -20,-85 C-18,-95 -10,-100 -5,-110 M-14,-50 Q-40,-75 -35,-95 M-7,-30 Q20,-50 15,-70 M17,-60 Q35,-80 25,-100" 
                      stroke="url(#coralVibrant)" strokeWidth="10" strokeLinecap="round" fill="none" className="transition-all duration-1000" />
              )}
            </g>

            {/* Right Coral: Brain Coral & Fans */}
            <g transform="translate(560, 410)" className="animate-sway" style={{ animationDelay: '1.2s' }}>
              {score < 30 ? (
                // Bleached Brain/Sea Fan
                <g fill="none" stroke="#cbd5e1" strokeLinecap="round" className="transition-all duration-1000">
                  <path d="M0,0 C10,-25 25,-35 20,-60" strokeWidth="12" />
                  <path d="M-20,0 C-25,-20 -15,-40 -5,-55" strokeWidth="9" />
                  <path d="M20,0 C30,-15 45,-20 40,-45" strokeWidth="7" />
                </g>
              ) : (
                // Vibrant Orange Sea Fan
                <g fill="none" stroke="url(#coralSecondary)" strokeLinecap="round" className="transition-all duration-1000">
                  <path d="M0,0 C10,-25 25,-35 20,-60" strokeWidth="14" />
                  <path d="M-20,0 C-25,-20 -15,-40 -5,-55" strokeWidth="10" />
                  <path d="M20,0 C30,-15 45,-20 40,-45" strokeWidth="8" />
                  {/* Glowing details if health is very high */}
                  {score >= 80 && (
                    <circle cx="20" cy="-60" r="4" fill="#fdba74" className="animate-pulse-glow" />
                  )}
                </g>
              )}
            </g>

            {/* Center Coral: Anemone & Clownfish nest */}
            <g transform="translate(380, 420)">
              {score < 40 ? (
                // Bleached Anemone
                <path d="M-20,0 Q-30,-20 -25,-30 M-10,0 Q-15,-25 -8,-35 M5,0 Q10,-28 15,-35 M20,0 Q30,-22 25,-30 M0,0 Q0,-32 4,-40" 
                      stroke="#94a3b8" strokeWidth="5" strokeLinecap="round" fill="none" />
              ) : (
                // Lush Glowing Cyan Anemone
                <g className="animate-pulse-glow">
                  <path d="M-20,0 Q-30,-20 -25,-30 M-10,0 Q-15,-25 -8,-35 M5,0 Q10,-28 15,-35 M20,0 Q30,-22 25,-30 M0,0 Q0,-32 4,-40" 
                        stroke="#06b6d4" strokeWidth="6" strokeLinecap="round" fill="none" />
                </g>
              )}
            </g>

            {/* Bubble Particles rising (Only in healthy biomes - score >= 50) */}
            {score >= 50 && (
              <g className="opacity-60">
                <circle cx="220" cy="300" r="2" fill="#fff" className="animate-float" />
                <circle cx="230" cy="220" r="1.5" fill="#fff" className="animate-float-opposite" />
                <circle cx="580" cy="280" r="3" fill="#fff" className="animate-float" style={{ animationDelay: '1.2s' }} />
                <circle cx="590" cy="180" r="2" fill="#fff" className="animate-float-opposite" style={{ animationDelay: '0.5s' }} />
                <circle cx="390" cy="320" r="1.5" fill="#fff" className="animate-float" style={{ animationDelay: '2s' }} />
              </g>
            )}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full aspect-video glass-panel rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
      {renderEcosystem()}
      
      {/* HUD Panel Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap justify-between items-center gap-2 pointer-events-none">
        {/* Health status badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider border glass-panel transition-all duration-500 ${statusBg} ${statusColor}`}>
          {score >= 60 ? (
            <ShieldCheck className="w-3.5 h-3.5" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5" />
          )}
          {statusText}
        </div>

        {/* Health Score numerical progress */}
        <div className="flex items-center gap-3 bg-slate-900/60 border border-white/5 backdrop-blur-md rounded-full px-4 py-1.5 shadow-lg">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium tracking-widest uppercase">Ecosystem Health</span>
            <span className={`text-lg font-bold tracking-tight ${statusColor} transition-colors duration-500`}>
              {score}%
            </span>
          </div>
          {/* Miniature circular health indicator */}
          <div className="w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center relative overflow-hidden bg-slate-950">
            <div 
              className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ${
                score < 30 ? 'bg-red-500/40' : score < 60 ? 'bg-amber-500/40' : score < 85 ? 'bg-blue-500/40' : 'bg-emerald-500/40'
              }`}
              style={{ height: `${score}%` }}
            />
            <span className="text-[10px] font-bold z-10 text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* Floating hints based on active pledge visual effects */}
      {activePledges.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 border border-white/5 backdrop-blur-md rounded-lg p-2.5 shadow-xl max-h-16 overflow-y-auto text-xs pointer-events-auto">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-0.5">Visual Restorations Applied:</div>
          <div className="text-slate-300 font-medium">
            {activePledges.map((pledgeId, index) => {
              const impactText = {
                'green-power': anchor === 'forest' ? 'smokestack replaced with clean wind turbine' : anchor === 'glacier' ? 'carbon soot rain minimized' : 'ocean heatwave threat neutralized',
                'zero-waste': anchor === 'forest' ? 'forest floor plastics cleared' : anchor === 'glacier' ? 'landfill methane emissions curtailed' : 'plastic debris cleared from coral lagoon',
                'commute-swap': anchor === 'forest' ? 'carbon haze cleared from sky' : anchor === 'glacier' ? 'air cooled, runoff slowed' : 'combustion chemicals filtered from ocean',
                'flight-fast': anchor === 'forest' ? 'migrating birds returning to evergreens' : anchor === 'glacier' ? 'aurora sheets glowing bright' : 'reef water clarity restored',
                'meatless-mondays': anchor === 'forest' ? 'wildflowers blooming on floor' : anchor === 'glacier' ? 'soot deposition on snow crust slowed' : 'marine life count boosted'
              }[pledgeId];
              return impactText ? (
                <span key={pledgeId}>
                  • {impactText}
                  {index < activePledges.length - 1 ? ' ' : ''}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
