import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Check, Lock } from 'lucide-react';

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayNames: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
};

interface DayHours { open: boolean; from: string; to: string; }

export default function AdminSettings() {
  const [hours, setHours] = useState<Record<string, DayHours>>({});
  const [hoursLoading, setHoursLoading] = useState(true);
  const [hoursSaved, setHoursSaved] = useState(false);

  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [infoLoading, setInfoLoading] = useState(true);
  const [infoSaved, setInfoSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase.from('settings').select('key, value');
      if (data) {
        const hoursMap: Record<string, DayHours> = {};
        for (const row of data) {
          if (row.key.startsWith('hours_')) {
            const day = row.key.replace('hours_', '');
            try { hoursMap[day] = JSON.parse(row.value); } catch { /* skip */ }
          } else if (row.key === 'restaurant_phone') setPhone(row.value ?? '');
          else if (row.key === 'restaurant_whatsapp') setWhatsapp(row.value ?? '');
          else if (row.key === 'restaurant_email') setEmail(row.value ?? '');
          else if (row.key === 'restaurant_address') setAddress(row.value ?? '');
        }
        setHours(hoursMap);
      }
      setHoursLoading(false);
      setInfoLoading(false);
    };
    fetchAll();
  }, []);

  const updateHours = (day: string, field: keyof DayHours, value: string | boolean) => {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const saveHours = async () => {
    for (const day of dayOrder) {
      const h = hours[day];
      if (h) {
        await supabase.from('settings').upsert({ key: `hours_${day}`, value: JSON.stringify(h), updated_at: new Date().toISOString() }, { onConflict: 'key' });
      }
    }
    setHoursSaved(true);
    setTimeout(() => setHoursSaved(false), 3000);
  };

  const saveInfo = async () => {
    await supabase.from('settings').upsert({ key: 'restaurant_phone', value: phone, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    await supabase.from('settings').upsert({ key: 'restaurant_whatsapp', value: whatsapp, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    await supabase.from('settings').upsert({ key: 'restaurant_email', value: email, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    await supabase.from('settings').upsert({ key: 'restaurant_address', value: address, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    setInfoSaved(true);
    setTimeout(() => setInfoSaved(false), 3000);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwMsg({ type: 'error', text: error.message });
    } else {
      setPwMsg({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setPwLoading(false);
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white mb-6">Settings</h1>

      {/* Opening Hours */}
      <div className="bg-[#1a1818] rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="font-heading text-lg font-semibold text-white mb-4">Opening Hours</h2>
        {hoursLoading ? (
          <div className="text-white/40 text-sm py-4">Loading...</div>
        ) : (
          <div className="space-y-3">
            {dayOrder.map((day) => {
              const h = hours[day] ?? { open: true, from: '08:00', to: '23:45' };
              return (
                <div key={day} className="flex items-center gap-4 flex-wrap">
                  <div className="w-28">
                    <span className="text-white/70 text-sm font-medium">{dayNames[day]}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateHours(day, 'open', !h.open)}
                    className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${h.open ? 'bg-[#D89A27]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${h.open ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                  {h.open ? (
                    <div className="flex items-center gap-2">
                      <input type="time" value={h.from} onChange={(e) => updateHours(day, 'from', e.target.value)} className="bg-[#151313] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#D89A27] focus:outline-none" />
                      <span className="text-white/40 text-sm">to</span>
                      <input type="time" value={h.to} onChange={(e) => updateHours(day, 'to', e.target.value)} className="bg-[#151313] border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-[#D89A27] focus:outline-none" />
                    </div>
                  ) : (
                    <span className="text-white/40 text-sm italic">Closed</span>
                  )}
                </div>
              );
            })}
            <button
              onClick={saveHours}
              className="flex items-center gap-2 bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-lg transition-all mt-2"
            >
              {hoursSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {hoursSaved ? 'Saved!' : 'Save Hours'}
            </button>
          </div>
        )}
      </div>

      {/* Restaurant Info */}
      <div className="bg-[#1a1818] rounded-2xl p-6 border border-white/10 mb-6">
        <h2 className="font-heading text-lg font-semibold text-white mb-4">Restaurant Info</h2>
        {infoLoading ? (
          <div className="text-white/40 text-sm py-4">Loading...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-label tracking-wider text-white/50 mb-2">WhatsApp Link</label>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="admin-input" />
            </div>
            <button
              onClick={saveInfo}
              className="flex items-center gap-2 bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-lg transition-all"
            >
              {infoSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {infoSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className="bg-[#1a1818] rounded-2xl p-6 border border-white/10">
        <h2 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#D89A27]" /> Change Password
        </h2>
        {pwMsg && (
          <div className={`rounded-xl p-3 mb-4 text-sm ${pwMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {pwMsg.text}
          </div>
        )}
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="admin-input" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="admin-input" placeholder="•••••••••" />
          </div>
          <div>
            <label className="block text-xs font-label tracking-wider text-white/50 mb-2">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="admin-input" placeholder="•••••••••" />
          </div>
          <button type="submit" disabled={pwLoading}
            className="flex items-center gap-2 bg-[#D89A27] hover:bg-[#D89A27]/90 text-black font-label text-xs font-semibold tracking-wider px-5 py-2.5 rounded-lg transition-all disabled:opacity-60">
            {pwLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
