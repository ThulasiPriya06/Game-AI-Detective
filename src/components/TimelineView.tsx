import React, { useState } from 'react';
import { TimelineEntry, SuspectId } from '../types/case';
import { Clock, CheckCircle2, Lock, User, Filter, AlertCircle } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEntry[];
  unlockedTimelineIds: string[];
  suspectNames: Record<SuspectId, string>;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timeline,
  unlockedTimelineIds,
  suspectNames,
}) => {
  const [filterSuspect, setFilterSuspect] = useState<string>('ALL');

  const filtered = timeline.filter((entry) => {
    if (filterSuspect === 'ALL') return true;
    return entry.relatedSuspects.includes(filterSuspect as SuspectId);
  });

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] select-text">
      {/* Header and Filter */}
      <div className="p-4 bg-[#10141d] border-b border-[#1f2533] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-cinzel font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d4af37]" />
            Chronological Reconstruction
          </h2>
          <p className="text-xs text-slate-400">
            Events between 11:15 PM and 12:00 AM on the night of the theft
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={filterSuspect}
            onChange={(e) => setFilterSuspect(e.target.value)}
            className="bg-[#161b26] border border-[#252c3d] rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-[#d4af37]"
          >
            <option value="ALL">All Individuals</option>
            {Object.entries(suspectNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="relative border-l-2 border-[#202738] ml-4 sm:ml-6 space-y-6 sm:space-y-8">
          {filtered.map((entry) => {
            const isUnlocked = entry.unlockedAtStart || unlockedTimelineIds.includes(entry.id);

            return (
              <div key={entry.id} className="relative pl-6 sm:pl-8 group">
                {/* Node marker */}
                <div
                  className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-all ${
                    isUnlocked
                      ? entry.verified
                        ? 'bg-[#d4af37] border-amber-300 shadow-sm'
                        : 'bg-amber-800 border-amber-500'
                      : 'bg-[#151922] border-slate-700'
                  }`}
                />

                {isUnlocked ? (
                  <div className="bg-[#121620] border border-[#22293b] rounded-xl p-4 shadow-md hover:border-slate-600 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono-code font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                          {entry.time}
                        </span>
                        <h3 className="text-sm font-semibold text-slate-100">
                          {entry.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono-code text-slate-500 bg-[#161c28] px-2 py-0.5 rounded">
                        Source: {entry.source}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                      {entry.description}
                    </p>

                    {/* Linked suspects */}
                    {entry.relatedSuspects.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1b2230]">
                        <span className="text-[10px] font-mono-code text-slate-500">Present / Connected:</span>
                        {entry.relatedSuspects.map((sid) => (
                          <span
                            key={sid}
                            className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-[#181f2c] text-amber-200/80 border border-slate-700"
                          >
                            {suspectNames[sid] || sid}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#0e1118]/60 border border-[#1b212e] rounded-xl p-3 text-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span className="text-xs font-mono-code text-slate-500 font-semibold">
                        {entry.time} • Unverified Movement
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-code text-slate-700">
                      Discovered via testimony
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
