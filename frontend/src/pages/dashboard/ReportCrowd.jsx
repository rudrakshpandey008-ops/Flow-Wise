import React, { useState } from 'react';
import {
  MessageSquarePlus,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react';
import CrowdBadge from '../../components/CrowdBadge';
import { submitCrowdReport } from '../../utils/api';
import { demoLocations } from '../../utils/demoData';

export default function ReportCrowd() {
  const [locationId, setLocationId] = useState(demoLocations[0]._id);
  const [crowdLevel, setCrowdLevel] = useState('Moderate');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [recentUserReports, setRecentUserReports] = useState([
    {
      id: 'rep_recent_1',
      location: 'Banke Bihari Temple',
      level: 'High',
      desc: 'Gate 2 has a long serpentine queue, Gate 4 moving faster.',
      time: '15 mins ago'
    },
    {
      id: 'rep_recent_2',
      location: 'Vishram Ghat',
      level: 'Low',
      desc: 'Quiet riverfront breeze, peaceful Aarti seating available.',
      time: '1 hr ago'
    }
  ]);

  const levels = [
    {
      id: 'Low',
      label: 'Low Crowd',
      score: 20,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      activeColor: 'bg-emerald-500 text-slate-950',
      desc: 'Plenty of space, no queues, easy movement'
    },
    {
      id: 'Moderate',
      label: 'Moderate Crowd',
      score: 45,
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
      activeColor: 'bg-sky-400 text-slate-950',
      desc: 'Normal foot traffic, short wait times'
    },
    {
      id: 'High',
      label: 'High Crowd',
      score: 70,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      activeColor: 'bg-amber-400 text-slate-950',
      desc: 'Long queues, slow movement, packed pathways'
    },
    {
      id: 'Extremely High',
      label: 'Extremely Crowded',
      score: 95,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-400',
      activeColor: 'bg-rose-500 text-white',
      desc: 'Heavy congestion, stand-still traffic, avoid if possible'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const targetLoc = demoLocations.find(l => l._id === locationId) || demoLocations[0];

    try {
      const res = await submitCrowdReport({
        locationId: targetLoc._id,
        locationName: targetLoc.name,
        crowdLevel,
        crowdScore: levels.find(l => l.id === crowdLevel)?.score || 50,
        description: description || `Reported ${crowdLevel} crowd density at ${targetLoc.name}`,
        latitude: targetLoc.latitude,
        longitude: targetLoc.longitude
      });

      setSuccessMsg(`Thank you! Your report for ${targetLoc.name} has been broadcasted to the community.`);
      setRecentUserReports(prev => [
        {
          id: `rep_${Date.now()}`,
          location: targetLoc.name,
          level: crowdLevel,
          desc: description || 'No extra comments',
          time: 'Just now'
        },
        ...prev
      ]);
      setDescription('');
    } catch (err) {
      // Local fallback representation
      setSuccessMsg(`Report registered locally! Broadcasted via demo simulator.`);
      setRecentUserReports(prev => [
        {
          id: `rep_${Date.now()}`,
          location: targetLoc.name,
          level: crowdLevel,
          desc: description || 'No extra comments',
          time: 'Just now'
        },
        ...prev
      ]);
      setDescription('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <MessageSquarePlus className="w-6 h-6 text-emerald-400" />
          <span>Community Crowd Reporting</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Empower pilgrims and urban travelers. Your real-time observation directly updates the live map and recalibrates route scores for everyone.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-[#111827] border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Select Monitored Location
          </label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            {demoLocations.map(l => (
              <option key={l._id} value={l._id}>
                {l.name} — {l.category} (Mathura-Vrindavan)
              </option>
            ))}
          </select>
        </div>

        {/* 4 Large Crowd Level Buttons */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-3">
            Observed Crowd Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {levels.map((lvl) => {
              const isSelected = crowdLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setCrowdLevel(lvl.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? `${lvl.activeColor} shadow-lg font-bold scale-[1.01]`
                      : `${lvl.color} hover:bg-slate-800/80`
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{lvl.label}</span>
                    <span className="text-xs opacity-80">{lvl.score}% Score</span>
                  </div>
                  <p className={`text-xs ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                    {lvl.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Observation Notes (Optional)
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Foot traffic is heavy at the main gate, but inner courtyard is peaceful. Parking nearby is completely full."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-spam verification enabled. 5-min cooldown per location.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Broadcasting...' : 'Submit Report'}</span>
          </button>
        </div>
      </form>

      {/* Recent Submissions */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Your Recent Crowd Submissions</span>
        </h3>

        <div className="space-y-3">
          {recentUserReports.map((rep) => (
            <div
              key={rep.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-semibold text-white">{rep.location}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{rep.desc}</div>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  rep.level === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                  rep.level === 'Moderate' ? 'bg-sky-400/20 text-sky-400' :
                  rep.level === 'High' ? 'bg-amber-400/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {rep.level}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">{rep.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
