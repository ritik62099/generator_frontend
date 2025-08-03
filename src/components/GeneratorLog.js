import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import GeneratorTable from '../components/GeneratorTable';

function GeneratorLog() {
  const [readings, setReadings] = useState({});
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));

  const daysInMonth = dayjs(`${month}-01`).daysInMonth();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) =>
    dayjs(`${month}-${String(i + 1).padStart(2, '0')}`).format('YYYY-MM-DD')
  );

  useEffect(() => {
    fetchReadings();
  }, [month]);

  const fetchReadings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/readings?month=${month}`);
      const map = {};
      res.data.forEach((r) => {
        map[r.date] = r;
      });
      setReadings(map);
    } catch (err) {
      console.error('Error fetching readings:', err.message);
    }
  };

  const handleChange = (date, field, value) => {
    setReadings((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: Number(value),
      },
    }));
  };

  const handleSave = async (date) => {
    const r = readings[date];
    if (
      r?.openingHour == null ||
      r?.openingMinute == null ||
      r?.closingHour == null ||
      r?.closingMinute == null
    ) return;

    try {
      await axios.post('http://localhost:5000/readings', {
        date,
        openingHour: r.openingHour,
        openingMinute: r.openingMinute,
        closingHour: r.closingHour,
        closingMinute: r.closingMinute,
      });
      fetchReadings();
    } catch (err) {
      console.error('Error saving reading:', err.message);
    }
  };

  const handleClose = async (date) => {
    const now = dayjs();
    const hour = now.hour();
    const minute = now.minute();

    setReadings((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        closingHour: hour,
        closingMinute: minute,
      },
    }));

    setTimeout(() => handleSave(date), 100); // Ensure state is updated before saving
  };

  const calculateUsage = (r) => {
    if (
      r?.openingHour == null ||
      r?.openingMinute == null ||
      r?.closingHour == null ||
      r?.closingMinute == null
    ) return '';

    const opening = r.openingHour * 60 + r.openingMinute;
    const closing = r.closingHour * 60 + r.closingMinute;
    const diff = closing - opening;
    if (diff < 0) return 'Invalid';

    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  };

  const getTotalUsageMinutes = () => {
    return Object.values(readings).reduce((sum, r) => {
      if (
        r?.openingHour == null ||
        r?.openingMinute == null ||
        r?.closingHour == null ||
        r?.closingMinute == null
      ) return sum;

      const opening = r.openingHour * 60 + r.openingMinute;
      const closing = r.closingHour * 60 + r.closingMinute;
      const diff = closing - opening;
      return diff > 0 ? sum + diff : sum;
    }, 0);
  };

  const formatMinutes = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
          Generator Log
        </h2>
        <input
          type="month"
          className="w-full sm:w-60 border rounded px-3 py-2 text-sm shadow-sm"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      <GeneratorTable
        daysArray={daysArray}
        readings={readings}
        handleChange={handleChange}
        handleSave={handleSave}
        handleClose={handleClose}
        calculateUsage={calculateUsage}
        getTotalUsageMinutes={getTotalUsageMinutes}
        formatMinutes={formatMinutes}
      />
    </div>
  );
}

export default GeneratorLog;
