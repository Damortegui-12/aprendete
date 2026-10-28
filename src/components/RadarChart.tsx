import React, { useState } from 'react';
import { DimensionResult, DimensionKey } from '../types';
import { DIMENSIONS } from '../data/questions';
import { Sparkles, ArrowRight, Lightbulb, Compass, ChevronRight } from 'lucide-react';

interface RadarChartProps {
  results: DimensionResult[];
  selectedKey: DimensionKey | null;
  onSelectKey: (key: DimensionKey) => void;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  results,
  selectedKey,
  onSelectKey
}) => {
  const [hoveredKey, setHoveredKey] = useState<DimensionKey | null>(null);

  // Map results in standard 6-axis order
  const order: DimensionKey[] = [
    'visual_espacial',
    'verbal_explicativo',
    'practico_experiencial',
    'analitico_estructurado',
    'social_colaborativo',
    'autorregulacion_metacognicion'
  ];

  const orderedResults = order.map((key) => {
    return results.find((r) => r.key === key) || {
      key,
      name: DIMENSIONS[key].name,
      shortName: DIMENSIONS[key].shortName,
      friendlyName: DIMENSIONS[key].friendlyName,
      tagline: DIMENSIONS[key].tagline,
      mean: 3.0,
      sum: 12,
      percentage: 50,
      rank: 1,
      isTied: false,
      tiedKeys: [],
      meta: DIMENSIONS[key],
      intensityLabel: 'Intermedio'
    };
  });

  const activeKey = selectedKey || hoveredKey || orderedResults[0]?.key || 'visual_espacial';
  const activeDim = DIMENSIONS[activeKey];
  const activeResult = results.find((r) => r.key === activeKey);

  // SVG Radar geometry
  const size = 440;
  const center = size / 2;
  const maxRadius = 135;
  const levels = [1, 2, 3, 4, 5];

  // 6 Angles starting from top (-90 deg)
  const angleStep = (2 * Math.PI) / 6;
  const getCoordinates = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const r = (value / 5) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Label coordinates (positioned outside the max radius)
  const getLabelCoordinates = (index: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const labelRadius = maxRadius + 38;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y, angle };
  };

  // Build grid polygon paths for levels 1 to 5
  const gridPolygons = levels.map((lvl) => {
    const points = order
      .map((_, i) => {
        const { x, y } = getCoordinates(i, lvl);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return { level: lvl, points };
  });

  // Build user data polygon
  const dataPoints = orderedResults.map((item, i) => getCoordinates(i, item.mean));
  const dataPolygonString = dataPoints
    .map((pt) => `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
    .join(' ');

  return (
    <div className="w-full bg-[#121018] border border-[#2D2838] rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden transition-all">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-to-tr from-[#FF2D95]/15 via-[#8B5CF6]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header bar of the chart */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF2D95] shadow-[0_0_10px_#FF2D95]" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#FFF8FC] font-['Space_Grotesk'] tracking-tight">
              Mapa Radial de tus 6 Habilidades
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#B8ADBF]">
            Visualiza el equilibrio de tus preferencias. Toca cualquier eje o etiqueta para explorar la habilidad.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#B8ADBF] bg-[#1A1724] px-3 py-1.5 rounded-xl border border-[#2D2838]">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-[#FF2D95] to-[#8B5CF6] inline-block shadow-[0_0_8px_#FF2D95]" />
            <span>Escala real 1 a 5</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Interactive Sidebar Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        {/* Radar SVG Container */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] aspect-square relative select-none">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(255,45,149,0.15)]"
            >
              <defs>
                {/* Luminous Gradient for the polygon area */}
                <linearGradient id="radarNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF2D95" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#36CFFF" stopOpacity="0.20" />
                </linearGradient>

                {/* Soft neon filter for the line */}
                <filter id="neonGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Concentric Hexagons */}
              {gridPolygons.map(({ level, points }) => (
                <polygon
                  key={level}
                  points={points}
                  fill={level === 5 ? '#0A0810' : 'none'}
                  stroke={level === 5 ? '#3A3348' : '#231E2E'}
                  strokeWidth={level === 5 ? '1.5' : '1'}
                  strokeDasharray={level < 5 ? '3 3' : undefined}
                />
              ))}

              {/* 6 Axes lines radiating from center */}
              {order.map((key, i) => {
                const edge = getCoordinates(i, 5);
                const isSelected = activeKey === key;
                return (
                  <line
                    key={`axis-${key}`}
                    x1={center}
                    y1={center}
                    x2={edge.x}
                    y2={edge.y}
                    stroke={isSelected ? '#FF2D95' : '#2D273B'}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-colors duration-200"
                  />
                );
              })}

              {/* Data polygon area */}
              <polygon
                points={dataPolygonString}
                fill="url(#radarNeonGradient)"
                stroke="#FF2D95"
                strokeWidth="2.5"
                filter="url(#neonGlowFilter)"
                className="transition-all duration-500"
              />

              {/* Axis Data Points & Interactive Vertices */}
              {orderedResults.map((item, i) => {
                const pt = dataPoints[i];
                const isSelected = activeKey === item.key;

                return (
                  <g
                    key={`point-${item.key}`}
                    className="cursor-pointer"
                    onClick={() => onSelectKey(item.key)}
                    onMouseEnter={() => setHoveredKey(item.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    {/* Pulsing ring on selection */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="11"
                        fill="none"
                        stroke="#FF69C8"
                        strokeWidth="2"
                        className="animate-ping opacity-75"
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? '6.5' : '4.5'}
                      fill={isSelected ? '#FF69C8' : '#FF2D95'}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? '2' : '1.5'}
                      className="transition-all duration-200"
                      filter={isSelected ? 'url(#neonGlowFilter)' : undefined}
                    />

                    {/* Numeric Score Tag */}
                    <text
                      x={pt.x}
                      y={pt.y - 12}
                      textAnchor="middle"
                      fill={isSelected ? '#FF69C8' : '#FFF8FC'}
                      fontSize={isSelected ? '12' : '10'}
                      fontWeight="bold"
                      className="font-mono transition-all pointer-events-none drop-shadow-md"
                    >
                      {item.mean.toFixed(2)}
                    </text>
                  </g>
                );
              })}

              {/* Outer Axis Labels */}
              {orderedResults.map((item, i) => {
                const labelPos = getLabelCoordinates(i);
                const isSelected = activeKey === item.key;

                let anchor: 'middle' | 'start' | 'end' = 'middle';
                if (Math.abs(labelPos.x - center) > 20) {
                  anchor = labelPos.x > center ? 'start' : 'end';
                }

                // Split long names for crisp display
                const lines = item.friendlyName.split(' y ');
                const line1 = lines[0] ? (lines.length > 1 ? `${lines[0]} y` : lines[0]) : item.friendlyName;
                const line2 = lines[1] || '';

                return (
                  <g
                    key={`label-${item.key}`}
                    className="cursor-pointer group"
                    onClick={() => onSelectKey(item.key)}
                    onMouseEnter={() => setHoveredKey(item.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  >
                    <text
                      x={labelPos.x}
                      y={line2 ? labelPos.y - 6 : labelPos.y}
                      textAnchor={anchor}
                      fill={isSelected ? '#FF2D95' : '#B8ADBF'}
                      fontSize="11.5"
                      fontWeight={isSelected ? '700' : '600'}
                      className="transition-colors duration-200 group-hover:fill-[#FF69C8]"
                    >
                      {line1}
                    </text>
                    {line2 && (
                      <text
                        x={labelPos.x}
                        y={labelPos.y + 8}
                        textAnchor={anchor}
                        fill={isSelected ? '#FF69C8' : '#8E8296'}
                        fontSize="10.5"
                        fontWeight={isSelected ? '600' : '500'}
                        className="transition-colors duration-200 group-hover:fill-[#FF69C8]"
                      >
                        {line2}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Interactive Detail Card for the Active Dimension */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-[#1A1724]/90 border border-[#2D2838] hover:border-[#FF2D95]/50 rounded-2xl p-5 sm:p-6 transition-all shadow-lg relative">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full border"
                style={{
                  backgroundColor: activeDim.theme.badgeBg,
                  color: activeDim.theme.badgeText,
                  borderColor: activeDim.theme.border
                }}
              >
                {activeDim.friendlyName}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-[#FF2D95] font-mono">
                  {activeResult?.mean.toFixed(2) || '0.00'}
                </span>
                <span className="text-xs text-[#B8ADBF]">/ 5.00</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-[#FF69C8] uppercase tracking-wider block mb-1">
                {activeResult?.intensityLabel}
              </span>
              <p className="text-xs sm:text-sm text-[#FFF8FC] leading-relaxed">
                {activeDim.summary}
              </p>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="p-3.5 rounded-xl bg-[#121018] border border-[#282334]">
                <strong className="text-[#36CFFF] flex items-center gap-1.5 mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  Cómo se manifiesta en tu día a día:
                </strong>
                <p className="text-[#B8ADBF] leading-relaxed">
                  {activeDim.dailyLifeManifestation}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121018] border border-[#282334]">
                <strong className="text-[#FFE45E] flex items-center gap-1.5 mb-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  Ejemplo en estudio o trabajo:
                </strong>
                <p className="text-[#B8ADBF] leading-relaxed">
                  {activeDim.studyWorkExample}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2D2838]">
            <strong className="text-[#FF2D95] text-xs font-bold flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Estrategia práctica para explorarla:
            </strong>
            <p className="text-xs text-[#FFF8FC] leading-relaxed mb-3">
              {activeDim.quickAction}
            </p>

            {/* Quick switcher buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {orderedResults.map((r) => (
                <button
                  key={r.key}
                  onClick={() => onSelectKey(r.key)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeKey === r.key
                      ? 'bg-[#FF2D95] text-white border-[#FF2D95] shadow-[0_0_10px_rgba(255,45,149,0.5)]'
                      : 'bg-[#121018] text-[#B8ADBF] border-[#2D2838] hover:border-[#FF2D95]/40 hover:text-white'
                  }`}
                >
                  {r.shortName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
