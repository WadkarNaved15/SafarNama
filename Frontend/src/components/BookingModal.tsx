import React from "react";
import { X } from "lucide-react";
import { Package } from "../types";

interface BookingModalProps {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  guests: number;
  setGuests: React.Dispatch<React.SetStateAction<number>>;
  bookingForm: {
    travelerName: string;
    travelerEmail: string;
    travelerPhone: string;
    specialRequests: string;
  };
  handleBookingChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleConfirmBooking: () => void;
  bookingLoading: boolean;
  totalPrice: number;
  savings: number;
  packageData: Package;
  bookingError: string | null;
  bookingSuccess: boolean;
  setShowBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const BookingModal: React.FC<BookingModalProps> = ({
  selectedDate,
  setSelectedDate,
  guests,
  setGuests,
  bookingForm,
  handleBookingChange,
  handleConfirmBooking,
  bookingLoading,
  totalPrice,
  savings,
  packageData,
  bookingError,
  bookingSuccess,
  setShowBookingModal,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConfirmBooking();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowBookingModal(false)} // Close on backdrop click
    >
      <div
        className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside
      >
        <div className="p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Book Your Trip
            </h3>
            <button
              type="button"
              onClick={() => setShowBookingModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a date</option>
                {packageData?.availability?.map((slot) => (
                  <option
                    key={slot.date}
                    value={slot.date}
                    disabled={!slot.available}
                  >
                    {new Date(slot.date).toLocaleDateString()} - $
                    {slot.price}
                    {!slot.available && " (Sold Out)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Traveler Name
              </label>
              <input
                type="text"
                name="travelerName"
                value={bookingForm.travelerName}
                onChange={handleBookingChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Traveler Email
              </label>
              <input
                type="email"
                name="travelerEmail"
                value={bookingForm.travelerEmail}
                onChange={handleBookingChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Traveler Phone
              </label>
              <input
                type="tel"
                name="travelerPhone"
                value={bookingForm.travelerPhone}
                onChange={handleBookingChange}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter your phone number"
                required
              />
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                name="specialRequests"
                value={bookingForm.specialRequests}
                onChange={handleBookingChange}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Any special requirements?"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Package Price ({guests} guests)</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span>- ${savings.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            {bookingError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                    {bookingError}
                </div>
                )}

                {bookingSuccess && (
                <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg">
                    Booking Successful! 🎉
                </div>
                )}

            {/* Terms */}
            <div className="flex items-start">
              <input type="checkbox" required className="mt-1 mr-2" />
              <span className="text-sm text-gray-600">
                I agree to the terms and conditions and privacy policy
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={bookingLoading || !selectedDate}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300"
            >
              {bookingLoading
                ? "Booking..."
                : `Confirm Booking - $${totalPrice.toLocaleString()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;