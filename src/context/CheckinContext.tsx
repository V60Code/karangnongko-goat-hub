
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';
import { format } from 'date-fns';

export interface CheckinEntry {
  date: string; // ISO date string
  mood: 'Bad' | 'Neutral' | 'Great';
  accomplishments: string;
  challenges: string;
  nextSteps: string;
}

interface CheckinContextType {
  checkins: CheckinEntry[];
  addCheckin: (checkin: CheckinEntry) => void;
  getCheckinByDate: (date: string) => CheckinEntry | undefined;
  hasCheckinForDate: (date: string) => boolean;
}

const CheckinContext = createContext<CheckinContextType | undefined>(undefined);

// Mock data - past 7 days
const generateMockCheckins = (): CheckinEntry[] => {
  const today = new Date();
  const checkins: CheckinEntry[] = [];
  
  for (let i = 7; i > 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Only add every other day
    if (i % 2 === 0) {
      checkins.push({
        date: format(date, 'yyyy-MM-dd'),
        mood: ['Bad', 'Neutral', 'Great'][Math.floor(Math.random() * 3)] as 'Bad' | 'Neutral' | 'Great',
        accomplishments: 'Memberi makan semua kambing',
        challenges: 'Beberapa kambing terlihat lesu',
        nextSteps: 'Periksa kesehatan kambing'
      });
    }
  }
  
  return checkins;
};

export const CheckinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [checkins, setCheckins] = useState<CheckinEntry[]>([]);

  useEffect(() => {
    // Load from localStorage or use mock data
    const storedCheckins = localStorage.getItem('checkins');
    if (storedCheckins) {
      setCheckins(JSON.parse(storedCheckins));
    } else {
      const mockCheckins = generateMockCheckins();
      setCheckins(mockCheckins);
      localStorage.setItem('checkins', JSON.stringify(mockCheckins));
    }
  }, []);

  const saveCheckins = (updatedCheckins: CheckinEntry[]) => {
    localStorage.setItem('checkins', JSON.stringify(updatedCheckins));
    setCheckins(updatedCheckins);
  };

  const addCheckin = (checkin: CheckinEntry) => {
    // Check if a checkin already exists for this date
    const existingIndex = checkins.findIndex(c => c.date === checkin.date);
    
    if (existingIndex !== -1) {
      // Update existing checkin
      const updatedCheckins = [...checkins];
      updatedCheckins[existingIndex] = checkin;
      saveCheckins(updatedCheckins);
      
      toast({
        title: "Check-in Updated",
        description: `Your check-in for ${format(new Date(checkin.date), 'PPP')} has been updated.`,
      });
    } else {
      // Add new checkin
      const updatedCheckins = [...checkins, checkin];
      saveCheckins(updatedCheckins);
      
      toast({
        title: "Check-in Submitted",
        description: `Your check-in for ${format(new Date(checkin.date), 'PPP')} has been recorded.`,
      });
    }
  };

  const getCheckinByDate = (date: string) => {
    return checkins.find(checkin => checkin.date === date);
  };

  const hasCheckinForDate = (date: string) => {
    return checkins.some(checkin => checkin.date === date);
  };

  return (
    <CheckinContext.Provider value={{ checkins, addCheckin, getCheckinByDate, hasCheckinForDate }}>
      {children}
    </CheckinContext.Provider>
  );
};

export const useCheckins = (): CheckinContextType => {
  const context = useContext(CheckinContext);
  if (context === undefined) {
    throw new Error('useCheckins must be used within a CheckinProvider');
  }
  return context;
};
