import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, MapPin, Calendar, Users, CreditCard,
  Clock, Phone, Mail, User, Hash, CheckCircle,
  XCircle, AlertCircle, Download, Share2, Printer,
  Hotel, Utensils, Shield, RefreshCw
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Home/Footer';

interface BookingDetail {
  _id: string;
  bookingId?: string;
  packageTitle: string;
  destination: string;
  packageImage: string;
  duration: string;
  travelDate: string;
  numberOfGuests: number;
  pricePerPerson: number;
  totalAmount: number;
  discount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  razorpayOrderId?: string;
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  specialRequests?: string;
  agentName?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  daysUntilTravel?: number;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
    confirmed:  { bg: 'bg-emerald-50 border-emerald-200',  text: 'text-emerald-700', icon: <CheckCircle className="w-4 h-4" />, label: 'Confirmed' },
    pending:    { bg: 'bg-amber-50 border-amber-200',      text: 'text-amber-700',   icon: <AlertCircle className="w-4 h-4" />, label: 'Pending' },
    cancelled:  { bg: 'bg-red-50 border-red-200',          text: 'text-red-700',     icon: <XCircle className="w-4 h-4" />,    label: 'Cancelled' },
    completed:  { bg: 'bg-blue-50 border-blue-200',        text: 'text-blue-700',    icon: <CheckCircle className="w-4 h-4" />, label: 'Completed' },
  };
  const c = configs[status] ?? configs.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${c.bg} ${c.text}`}>
      {c.icon}{c.label}
    </span>
  );
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0">
    <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</span>
    <span className={`text-sm font-semibold text-slate-800 text-right max-w-[60%] ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
  </div>
);

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; accent?: string }> = ({
  title, icon, children, accent = 'from-slate-600 to-slate-800'
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className={`bg-gradient-to-r ${accent} px-6 py-4 flex items-center gap-3`}>
      <span className="text-white opacity-80">{icon}</span>
      <h3 className="text-sm font-bold text-white uppercase tracking-widest">{title}</h3>
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // backend returns { success, booking }
        setBooking(res.data.booking ?? res.data);
      } catch (err) {
        console.error(err);
        setError('Booking not found.');
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBooking();
  }, [bookingId]);

  const handleCancel = async () => {
    if (!booking) return;
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(true);
    try {
      await axios.patch(
        `${BACKEND_URL}/api/v1/bookings/${booking._id}/cancel`,
        { cancellationReason: 'Cancelled by user' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooking((prev) => prev ? { ...prev, status: 'cancelled', paymentStatus: 'refunded' } : prev);
    } catch {
      alert('Failed to cancel. Please try again.');
    } finally {
      setCancellingId(false);
    }
  };

  const handlePrint = () => window.print();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-slate-700 animate-spin" />
          <p className="text-slate-500 text-sm font-medium tracking-wide">Loading booking…</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !booking) return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">{error || 'Booking not found'}</h2>
          <button onClick={() => navigate('/my-bookings')} className="mt-4 text-sm text-blue-600 font-semibold hover:underline">
            ← Back to My Bookings
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );

  const savings = booking.discount ?? 0;
  const canCancel = booking.status === 'confirmed' && (booking.daysUntilTravel ?? 999) > 2;

  // ── Page ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 print:bg-white">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-72 overflow-hidden print:hidden">
        <img
          src={booking.packageImage}
          alt={booking.packageTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate('/my-bookings')}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition border border-white/30"
        >
          <ArrowLeft className="w-4 h-4" /> My Bookings
        </button>

        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition border border-white/30"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <StatusBadge status={booking.status} />
                  {booking.paymentStatus === 'completed' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 border border-blue-300/40 text-blue-100 backdrop-blur-sm">
                      <CreditCard className="w-3 h-3" /> Paid
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-black text-white tracking-tight">{booking.packageTitle}</h1>
                <div className="flex items-center gap-1 mt-1 text-white/80 text-sm">
                  <MapPin className="w-4 h-4" /> {booking.destination}
                </div>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-white/60 text-xs uppercase tracking-widest mb-1">Total Paid</p>
                <p className="text-4xl font-black text-white">₹{booking.totalAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column (2/3) ─────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Cancellation notice */}
            {booking.status === 'cancelled' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex gap-4">
                <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-800 mb-1">Booking Cancelled</p>
                  {booking.cancellationReason && (
                    <p className="text-sm text-red-600">Reason: {booking.cancellationReason}</p>
                  )}
                  {booking.cancelledAt && (
                    <p className="text-xs text-red-400 mt-1">
                      Cancelled on {new Date(booking.cancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  <p className="text-sm text-red-600 mt-2 font-medium">Refund status: <span className="capitalize">{booking.paymentStatus}</span></p>
                </div>
              </div>
            )}

            {/* Trip overview */}
            <Section title="Trip Overview" icon={<MapPin className="w-4 h-4" />} accent="from-indigo-600 to-indigo-800">
              <InfoRow label="Destination"  value={booking.destination} />
              <InfoRow label="Duration"     value={booking.duration} />
              <InfoRow label="Travel Date"  value={new Date(booking.travelDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
              <InfoRow label="Guests"       value={`${booking.numberOfGuests} Person${booking.numberOfGuests > 1 ? 's' : ''}`} />
              {booking.agentName && (
                <InfoRow label="Travel Agent" value={booking.agentName} />
              )}
              {booking.specialRequests && (
                <InfoRow label="Special Requests" value={booking.specialRequests} />
              )}
            </Section>

            {/* Traveler info */}
            <Section title="Traveler Information" icon={<User className="w-4 h-4" />} accent="from-teal-600 to-teal-800">
              <InfoRow label="Name"  value={booking.travelerName} />
              <InfoRow label="Email" value={
                <a href={`mailto:${booking.travelerEmail}`} className="text-indigo-600 hover:underline">
                  {booking.travelerEmail}
                </a>
              } />
              <InfoRow label="Phone" value={
                <a href={`tel:${booking.travelerPhone}`} className="text-indigo-600 hover:underline">
                  {booking.travelerPhone}
                </a>
              } />
            </Section>

            {/* Payment details */}
            <Section title="Payment Details" icon={<CreditCard className="w-4 h-4" />} accent="from-violet-600 to-violet-800">
              <InfoRow label="Price per Person"  value={`₹${booking.pricePerPerson.toLocaleString('en-IN')}`} />
              <InfoRow label="Guests"            value={`× ${booking.numberOfGuests}`} />
              {savings > 0 && (
                <InfoRow label="Discount Applied" value={<span className="text-emerald-600">− ₹{savings.toLocaleString('en-IN')}</span>} />
              )}
              <InfoRow label="Total Amount"      value={<span className="text-lg font-black text-slate-900">₹{booking.totalAmount.toLocaleString('en-IN')}</span>} />
              <InfoRow label="Payment Method"    value={<span className="capitalize">{booking.paymentMethod}</span>} />
              <InfoRow label="Payment Status"    value={
                <span className={`capitalize font-bold ${booking.paymentStatus === 'completed' ? 'text-emerald-600' : booking.paymentStatus === 'refunded' ? 'text-blue-600' : 'text-amber-600'}`}>
                  {booking.paymentStatus}
                </span>
              } />
              <InfoRow label="Transaction ID"    value={booking.transactionId} mono />
              {booking.razorpayOrderId && (
                <InfoRow label="Razorpay Order" value={booking.razorpayOrderId} mono />
              )}
            </Section>
          </div>

          {/* ── Right column (1/3) ────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Booking ID card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Booking Reference</p>
              <p className="text-2xl font-black tracking-tight font-mono break-all">
                {booking.bookingId || booking._id.slice(-8).toUpperCase()}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Booked on</span>
                  <span className="font-semibold">
                    {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Status</span>
                  <StatusBadge status={booking.status} />
                </div>
                {(booking.daysUntilTravel !== undefined) && booking.status !== 'cancelled' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Countdown</span>
                    <span className="font-bold text-amber-400">
                      {booking.daysUntilTravel > 0 ? `${booking.daysUntilTravel} days` : 'Today!'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick info */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Info</h3>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Travel Date</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {new Date(booking.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Duration</p>
                  <p className="text-sm font-semibold text-slate-800">{booking.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Guests</p>
                  <p className="text-sm font-semibold text-slate-800">{booking.numberOfGuests} Person{booking.numberOfGuests > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Protection</p>
                  <p className="text-sm font-semibold text-slate-800">Booking Insured</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Bookings
              </button>

              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancellingId}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingId
                    ? <><RefreshCw className="w-4 h-4 animate-spin" /> Cancelling…</>
                    : <><XCircle className="w-4 h-4" /> Cancel Booking</>}
                </button>
              )}

              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition print:hidden"
              >
                <Printer className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>

            {/* Support */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">Need Help?</p>
              <div className="space-y-2">
                <a href="tel:+1800000000" className="flex items-center gap-2 text-sm text-amber-800 font-semibold hover:underline">
                  <Phone className="w-4 h-4" /> +1 800 000 0000
                </a>
                <a href="mailto:support@travelapp.com" className="flex items-center gap-2 text-sm text-amber-800 font-semibold hover:underline">
                  <Mail className="w-4 h-4" /> support@travelapp.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingDetailPage;