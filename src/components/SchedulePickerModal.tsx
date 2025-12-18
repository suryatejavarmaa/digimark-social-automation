import { motion, AnimatePresence } from 'motion/react';
import { X, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import './SchedulePickerModal.css';

interface SchedulePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (date: Date) => void;
}

export function SchedulePickerModal({ isOpen, onClose, onSchedule }: SchedulePickerModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedHour, setSelectedHour] = useState<string>('12');
    const [selectedMinute, setSelectedMinute] = useState<string>('00');
    const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('PM');

    if (!isOpen) return null;

    const handleSchedule = () => {
        if (!selectedDate) return;

        // Combine date and time
        const hour = selectedPeriod === 'PM' && selectedHour !== '12'
            ? parseInt(selectedHour) + 12
            : selectedPeriod === 'AM' && selectedHour === '12'
                ? 0
                : parseInt(selectedHour);

        const scheduledDateTime = new Date(selectedDate);
        scheduledDateTime.setHours(hour, parseInt(selectedMinute), 0, 0);

        // Validate not in the past
        if (scheduledDateTime <= new Date()) {
            alert('Cannot schedule posts in the past!');
            return;
        }

        onSchedule(scheduledDateTime);
        resetForm();
    };

    const resetForm = () => {
        setSelectedDate(undefined);
        setSelectedHour('12');
        setSelectedMinute('00');
        setSelectedPeriod('PM');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Format preview date
    const getPreviewText = () => {
        if (!selectedDate) return 'Select a date and time';

        const hour = selectedPeriod === 'PM' && selectedHour !== '12'
            ? parseInt(selectedHour) + 12
            : selectedPeriod === 'AM' && selectedHour === '12'
                ? 0
                : parseInt(selectedHour);

        const scheduledDateTime = new Date(selectedDate);
        scheduledDateTime.setHours(hour, parseInt(selectedMinute), 0, 0);

        return scheduledDateTime.toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata'
        }) + ' IST';
    };

    // Generate hour options (1-12)
    const hours = Array.from({ length: 12 }, (_, i) => {
        const hour = i + 1;
        return hour.toString().padStart(2, '0');
    });

    // Generate minute options (00, 15, 30, 45)
    const minutes = ['00', '15', '30', '45'];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                >
                    <motion.div
                        className="bg-[#2d2d2d] rounded-3xl p-6 max-w-md w-full border border-white/10 shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-[#00d4ff]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        Schedule Post
                                    </h2>
                                    <p className="text-white/40 text-xs">Choose date and time</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
                            >
                                <X className="w-4 h-4 text-white/60" />
                            </button>
                        </div>

                        {/* Calendar */}
                        <div className="mb-4 bg-white/5 rounded-2xl p-4 border border-white/10 schedule-calendar">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={{ before: new Date() }}
                                className="text-white"
                            />
                        </div>

                        {/* Time Picker */}
                        <div className="mb-4">
                            <label className="text-white/60 text-sm font-medium mb-2 block">
                                Select Time
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    min="1"
                                    max="12"
                                    value={selectedHour}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 12)) {
                                            setSelectedHour(val);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        setSelectedHour(val.toString().padStart(2, '0'));
                                    }}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-[#00d4ff]/50"
                                    placeholder="01"
                                />

                                <span className="text-white/40 text-2xl pt-1">:</span>

                                <input
                                    type="number"
                                    min="0"
                                    max="59"
                                    value={selectedMinute}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 59)) {
                                            setSelectedMinute(val);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setSelectedMinute(val.toString().padStart(2, '0'));
                                    }}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-center focus:outline-none focus:border-[#00d4ff]/50"
                                    placeholder="00"
                                />

                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value as 'AM' | 'PM')}
                                    className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00d4ff]/50"
                                >
                                    <option value="AM" className="bg-[#2d2d2d]">AM</option>
                                    <option value="PM" className="bg-[#2d2d2d]">PM</option>
                                </select>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarIcon className="w-4 h-4 text-[#00d4ff]" />
                                <span className="text-white/60 text-xs font-medium">Scheduled for:</span>
                            </div>
                            <p className="text-white font-semibold">
                                {getPreviewText()}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                className="flex-1 py-3 bg-white/5 rounded-2xl text-white/60 hover:bg-white/10 transition-all"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-3 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] rounded-2xl text-white font-semibold hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSchedule}
                                disabled={!selectedDate}
                            >
                                Schedule Post
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
