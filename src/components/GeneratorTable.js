import React from 'react';

function GeneratorTable({
  daysArray,
  readings,
  handleChange,
  handleSave,
  handleClose,
  calculateUsage,
  getTotalUsageMinutes,
  formatMinutes,
}) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Opening (Hr)</th>
            <th className="px-3 py-2">Opening (Min)</th>
            <th className="px-3 py-2">Closing (Hr)</th>
            <th className="px-3 py-2">Closing (Min)</th>
            <th className="px-3 py-2">Usage</th>
            <th className="px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {daysArray.map((date) => {
            const r = readings[date] || {};
            return (
              <tr key={date} className="border-t">
                <td className="px-3 py-2 whitespace-nowrap">{date}</td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-16 border px-2 py-1 rounded"
                    value={r.openingHour ?? ''}
                    onChange={(e) => handleChange(date, 'openingHour', e.target.value)}
                    min="0"
                    max="23"
                  />
                </td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-16 border px-2 py-1 rounded"
                    value={r.openingMinute ?? ''}
                    onChange={(e) => handleChange(date, 'openingMinute', e.target.value)}
                    min="0"
                    max="59"
                  />
                </td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-16 border px-2 py-1 rounded"
                    value={r.closingHour ?? ''}
                    onChange={(e) => handleChange(date, 'closingHour', e.target.value)}
                    min="0"
                    max="23"
                  />
                </td>

                <td className="px-2 py-2">
                  <input
                    type="number"
                    className="w-16 border px-2 py-1 rounded"
                    value={r.closingMinute ?? ''}
                    onChange={(e) => handleChange(date, 'closingMinute', e.target.value)}
                    min="0"
                    max="59"
                  />
                </td>

                <td className="px-3 py-2 text-gray-700">
                  {calculateUsage(r)}
                </td>

                <td className="px-3 py-2 space-y-1 flex flex-col sm:flex-row sm:space-y-0 sm:space-x-1">
                  <button
                    onClick={() => handleSave(date)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleClose(date)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Close
                  </button>
                </td>
              </tr>
            );
          })}

          <tr className="bg-gray-50 border-t">
            <td className="px-3 py-2 font-bold" colSpan="5">
              Total Usage
            </td>
            <td className="px-3 py-2 font-semibold text-blue-600" colSpan="2">
              {formatMinutes(getTotalUsageMinutes())}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default GeneratorTable;
