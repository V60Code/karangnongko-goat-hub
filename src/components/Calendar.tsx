
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  hasCheckin: (dateString: string) => boolean;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, hasCheckin }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  // Get the day of the week for the first day of the month (0-6, where 0 is Sunday)
  const firstDayOfMonth = startOfMonth(currentMonth).getDay();
  
  // Create an array for the days of the week
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  // Function to get the empty cells before the first day of the month
  const getEmptyCells = () => {
    const emptyCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      emptyCells.push(<div key={`empty-${i}`} className="h-16 bg-gray-50 border border-gray-100"></div>);
    }
    return emptyCells;
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: id })}
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={goToPreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToCurrentMonth}
            className="px-3 py-1 text-sm bg-farmblue text-white rounded-md"
          >
            Today
          </button>
          <button 
            onClick={goToNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {/* Days of week headers */}
      <div className="grid grid-cols-7 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for days before the first of the month */}
        {getEmptyCells()}
        
        {/* Actual days in the month */}
        {daysInMonth.map(day => {
          const dateString = format(day, 'yyyy-MM-dd');
          const isToday = isSameDay(day, today);
          const isCheckedIn = hasCheckin(dateString);
          
          return (
            <div
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              className={`
                h-16 md:h-24 p-2 border relative cursor-pointer transition-colors
                ${isToday ? 'bg-blue-50 border-blue-300' : 'border-gray-100 hover:bg-gray-50'}
              `}
            >
              <div className="font-medium text-sm mb-1">
                {format(day, 'd')}
                {isToday && <span className="ml-1 text-xs text-blue-500">(Today)</span>}
              </div>
              
              <div className="mt-1 flex items-center text-xs">
                {isCheckedIn ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={14} className="mr-1" />
                    <span>Submitted</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <XCircle size={14} className="mr-1" />
                    <span>Not Submitted</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
