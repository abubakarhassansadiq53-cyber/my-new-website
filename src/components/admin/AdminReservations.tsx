import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, MessageCircle, X, Check, Ban } from 'lucide-react';

interface ReservationRow {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  date: string;
  time: string;
  guests: number;
  occasion: string | null;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
  completed: 'bg-blue-500/15 text-blue-400',
};

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed'];

type DateFilter = 'today' | 'week' | 'all';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewRes, setViewRes] = useState<ReservationRow | null>(null);

  const fetchReservations = useCallback(async () => {
    let query = supabase.from('reservations').select('*').order('created_at', { ascending: false });
    if (dateFilter === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      query = query.eq('date', today);
    } else if (dateFilter === 'week') {
      const today = new Date();
      const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query = query.gte('date', today.toISOString().slice(0, 10)).lte('date', weekLater.toISOString().slice(0, 10));
    }
    const { data } = await query;
    setReservations((data as ReservationRow[]) ?? []);
    setLoading(false);
  }, [dateFilter]);

  useEffect(() => { fetchReservations(); }, [fetchReservations]);

  const filtered = reservations.filter((r) => statusFilter === 'all' || r.status === statusFilter);

  const updateStatus = async (id: number, status: string) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (viewRes?.id === id) setViewRes((prev) => prev ? { ...prev, status } : prev);
    await supabase.from('reservations').update({ status }).eq('id', id);
  };

  const whatsappLink = (phone: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    return `https://wa.me/${clean.replace('+', '')}`;
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white mb-6">Reservations</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1 bg-[#1a1818] rounded-lg p-1">
          {(['today', 'week', 'all'] as DateFilter[]).map((f) => (
            <button key={f} onClick={() => setDateFilter(f)} className={`px-4 py-2 rounded-md text-xs font-medium capitalize transition-all ${dateFilter === f ? 'bg-[#D89A27] text-black' : 'text-white/50 hover:text-white'}`}>
              {f === 'week' ? 'This Week' : f}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#1a1818] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D89A27] focus:outline-none">
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-12">Loading reservations...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-label tracking-wider text-white/40 border-b border-white/10">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Time</th>
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Phone</th>
                <th className="pb-3 pr-4 hidden lg:table-cell">Email</th>
                <th className="pb-3 pr-4">Guests</th>
                <th className="pb-3 pr-4 hidden lg:table-cell">Occasion</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((res) => (
                <tr key={res.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pr-4"><span className="text-white text-sm">{new Date(res.date).toLocaleDateString()}</span></td>
                  <td className="py-3 pr-4"><span className="text-white/60 text-sm">{res.time}</span></td>
                  <td className="py-3 pr-4"><span className="text-white text-sm font-medium">{res.customer_name}</span></td>
                  <td className="py-3 pr-4 hidden md:table-cell"><span className="text-white/60 text-sm">{res.customer_phone}</span></td>
                  <td className="py-3 pr-4 hidden lg:table-cell"><span className="text-white/60 text-xs">{res.customer_email ?? '—'}</span></td>
                  <td className="py-3 pr-4"><span className="text-white/60 text-sm">{res.guests}</span></td>
                  <td className="py-3 pr-4 hidden lg:table-cell"><span className="text-white/60 text-xs">{res.occasion ?? '—'}</span></td>
                  <td className="py-3 pr-4">
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${STATUS_COLORS[res.status] ?? 'bg-white/10 text-white/60'}`}>{res.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewRes(res)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><Eye className="w-4 h-4 text-white/60" /></button>
                      <button onClick={() => updateStatus(res.id, 'confirmed')} className="p-1.5 hover:bg-green-500/10 rounded-lg transition-colors" title="Confirm"><Check className="w-4 h-4 text-green-400/60" /></button>
                      <button onClick={() => updateStatus(res.id, 'cancelled')} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors" title="Cancel"><Ban className="w-4 h-4 text-red-400/60" /></button>
                      <a href={whatsappLink(res.customer_phone)} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-green-500/10 rounded-lg transition-colors"><MessageCircle className="w-4 h-4 text-green-400/60" /></a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-white/40 text-center py-8">No reservations found.</p>}
        </div>
      )}

      {viewRes && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8 overflow-y-auto" onClick={() => setViewRes(null)}>
          <div className="bg-[#1a1818] rounded-2xl p-6 sm:p-8 max-w-lg w-full my-auto max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold text-white">Reservation #{viewRes.id}</h3>
              <button onClick={() => setViewRes(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Date:</span><span className="text-white">{new Date(viewRes.date).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Time:</span><span className="text-white">{viewRes.time}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Name:</span><span className="text-white">{viewRes.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Phone:</span><span className="text-white">{viewRes.customer_phone}</span></div>
              {viewRes.customer_email && <div className="flex justify-between"><span className="text-white/40">Email:</span><span className="text-white">{viewRes.customer_email}</span></div>}
              <div className="flex justify-between"><span className="text-white/40">Guests:</span><span className="text-white">{viewRes.guests}</span></div>
              {viewRes.occasion && <div className="flex justify-between"><span className="text-white/40">Occasion:</span><span className="text-white">{viewRes.occasion}</span></div>}
              <div className="flex justify-between"><span className="text-white/40">Status:</span><span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${STATUS_COLORS[viewRes.status]}`}>{viewRes.status}</span></div>
              {viewRes.special_requests && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs font-label tracking-wider text-white/40 mb-1">Special Requests</p>
                  <p className="text-white/70 text-sm">{viewRes.special_requests}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
