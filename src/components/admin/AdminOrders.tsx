import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Eye, Trash2, MessageCircle, Download, X } from 'lucide-react';

interface OrderRow {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  order_items: { name: string; size: string | null; quantity: number; price: number }[];
  order_total: number | null;
  order_type: string;
  delivery_address: string | null;
  preferred_datetime: string | null;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  ready: 'bg-green-500/15 text-green-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

const STATUS_OPTIONS = ['new', 'confirmed', 'ready', 'cancelled'];

type DateFilter = 'today' | 'week' | 'all';

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewOrder, setViewOrder] = useState<OrderRow | null>(null);

  const fetchOrders = useCallback(async () => {
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (dateFilter === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      query = query.gte('created_at', `${today}T00:00:00`);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('created_at', weekAgo);
    }
    const { data } = await query;
    setOrders((data as OrderRow[]) ?? []);
    setLoading(false);
  }, [dateFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesType = typeFilter === 'all' || o.order_type === typeFilter;
    return matchesStatus && matchesType;
  });

  const updateStatus = async (id: number, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (viewOrder?.id === id) setViewOrder((prev) => prev ? { ...prev, status } : prev);
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const deleteOrder = async (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await supabase.from('orders').delete().eq('id', id);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Customer', 'Phone', 'Email', 'Items', 'Total', 'Type', 'Status'];
    const rows = filtered.map((o) => [
      new Date(o.created_at).toLocaleString(),
      o.customer_name,
      o.customer_phone,
      o.customer_email ?? '',
      o.order_items.map((i) => `${i.quantity}x ${i.name}`).join('; '),
      o.order_total?.toFixed(2) ?? '',
      o.order_type,
      o.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const whatsappLink = (phone: string) => {
    const clean = phone.replace(/[^0-9+]/g, '');
    return `https://wa.me/${clean.replace('+', '')}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-white">Orders</h1>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-label text-xs font-semibold tracking-wider px-4 py-2.5 rounded-lg transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

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
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="bg-[#1a1818] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#D89A27] focus:outline-none">
          <option value="all">All Types</option>
          <option value="Dine In">Dine In</option>
          <option value="Collection">Collection</option>
          <option value="Delivery">Delivery</option>
        </select>
      </div>

      {loading ? (
        <div className="text-white/40 text-center py-12">Loading orders...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-label tracking-wider text-white/40 border-b border-white/10">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Customer</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Phone</th>
                <th className="pb-3 pr-4 hidden lg:table-cell">Items</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4 hidden md:table-cell">Type</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 pr-4"><span className="text-white/60 text-xs">{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></td>
                  <td className="py-3 pr-4"><span className="text-white text-sm font-medium">{order.customer_name}</span></td>
                  <td className="py-3 pr-4 hidden md:table-cell"><span className="text-white/60 text-sm">{order.customer_phone}</span></td>
                  <td className="py-3 pr-4 hidden lg:table-cell"><span className="text-white/60 text-xs">{order.order_items.length} items</span></td>
                  <td className="py-3 pr-4"><span className="text-[#D89A27] text-sm font-semibold">{order.order_total ? `€${order.order_total.toFixed(2)}` : '—'}</span></td>
                  <td className="py-3 pr-4 hidden md:table-cell"><span className="text-white/60 text-sm">{order.order_type}</span></td>
                  <td className="py-3 pr-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer ${STATUS_COLORS[order.status] ?? 'bg-white/10 text-white/60'}`}
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-[#1a1818] text-white capitalize">{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewOrder(order)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"><Eye className="w-4 h-4 text-white/60" /></button>
                      <a href={whatsappLink(order.customer_phone)} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-green-500/10 rounded-lg transition-colors"><MessageCircle className="w-4 h-4 text-green-400/60" /></a>
                      <button onClick={() => deleteOrder(order.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400/60" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-white/40 text-center py-8">No orders found.</p>}
        </div>
      )}

      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4 py-8 overflow-y-auto" onClick={() => setViewOrder(null)}>
          <div className="bg-[#1a1818] rounded-2xl p-6 sm:p-8 max-w-lg w-full my-auto max-h-[90vh] overflow-y-auto border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold text-white">Order #{viewOrder.id}</h3>
              <button onClick={() => setViewOrder(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Date:</span><span className="text-white">{new Date(viewOrder.created_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Customer:</span><span className="text-white">{viewOrder.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Phone:</span><span className="text-white">{viewOrder.customer_phone}</span></div>
              {viewOrder.customer_email && <div className="flex justify-between"><span className="text-white/40">Email:</span><span className="text-white">{viewOrder.customer_email}</span></div>}
              <div className="flex justify-between"><span className="text-white/40">Type:</span><span className="text-white">{viewOrder.order_type}</span></div>
              {viewOrder.delivery_address && <div className="flex justify-between"><span className="text-white/40">Address:</span><span className="text-white">{viewOrder.delivery_address}</span></div>}
              {viewOrder.preferred_datetime && <div className="flex justify-between"><span className="text-white/40">Preferred:</span><span className="text-white">{viewOrder.preferred_datetime}</span></div>}
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs font-label tracking-wider text-white/40 mb-2">Items</p>
              <div className="space-y-2">
                {viewOrder.order_items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-white">{item.quantity}x {item.name}{item.size ? ` (${item.size})` : ''}</span>
                    <span className="text-[#D89A27]">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-heading font-bold text-white pt-3 mt-3 border-t border-white/10">
                <span>Total</span><span className="text-[#D89A27]">€{viewOrder.order_total?.toFixed(2) ?? '—'}</span>
              </div>
            </div>
            {viewOrder.special_requests && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-label tracking-wider text-white/40 mb-1">Special Requests</p>
                <p className="text-white/70 text-sm">{viewOrder.special_requests}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
