
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

export interface Goat {
  id: string;
  barn: 'Timur' | 'Barat';
  weight: number;
  age: number;
  gender: 'Jantan' | 'Betina';
  status: 'Hidup' | 'Sakit' | 'Mati';
}

interface GoatContextType {
  goats: Goat[];
  addGoat: (goat: Omit<Goat, 'id'>) => void;
  updateGoat: (id: string, goat: Omit<Goat, 'id'>) => void;
  deleteGoat: (id: string) => void;
  getGoatById: (id: string) => Goat | undefined;
}

const GoatContext = createContext<GoatContextType | undefined>(undefined);

// Mock data for initial state
const mockGoats: Goat[] = [
  { id: 'K001', barn: 'Timur', weight: 35, age: 12, gender: 'Jantan', status: 'Hidup' },
  { id: 'K002', barn: 'Timur', weight: 30, age: 10, gender: 'Betina', status: 'Hidup' },
  { id: 'K003', barn: 'Timur', weight: 28, age: 8, gender: 'Betina', status: 'Sakit' },
  { id: 'K004', barn: 'Barat', weight: 40, age: 15, gender: 'Jantan', status: 'Hidup' },
  { id: 'K005', barn: 'Barat', weight: 25, age: 6, gender: 'Betina', status: 'Hidup' },
  { id: 'K006', barn: 'Timur', weight: 22, age: 5, gender: 'Jantan', status: 'Mati' },
  { id: 'K007', barn: 'Barat', weight: 38, age: 14, gender: 'Jantan', status: 'Sakit' },
  { id: 'K008', barn: 'Timur', weight: 32, age: 11, gender: 'Betina', status: 'Hidup' },
  { id: 'K009', barn: 'Barat', weight: 27, age: 7, gender: 'Betina', status: 'Hidup' },
  { id: 'K010', barn: 'Timur', weight: 36, age: 13, gender: 'Jantan', status: 'Hidup' },
];

export const GoatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goats, setGoats] = useState<Goat[]>([]);

  useEffect(() => {
    // Load from localStorage or use mock data
    const storedGoats = localStorage.getItem('goats');
    if (storedGoats) {
      setGoats(JSON.parse(storedGoats));
    } else {
      setGoats(mockGoats);
      localStorage.setItem('goats', JSON.stringify(mockGoats));
    }
  }, []);

  const saveGoats = (updatedGoats: Goat[]) => {
    localStorage.setItem('goats', JSON.stringify(updatedGoats));
    setGoats(updatedGoats);
  };

  const addGoat = (goat: Omit<Goat, 'id'>) => {
    // Generate a simple ID (in a real app this would be handled by the backend)
    const newId = `K${String(goats.length + 1).padStart(3, '0')}`;
    const newGoat = { ...goat, id: newId } as Goat;
    
    const updatedGoats = [...goats, newGoat];
    saveGoats(updatedGoats);
    
    toast({
      title: "Berhasil Menambahkan",
      description: `Kambing dengan ID ${newId} telah ditambahkan.`,
    });
  };

  const updateGoat = (id: string, goat: Omit<Goat, 'id'>) => {
    const goatIndex = goats.findIndex(g => g.id === id);
    
    if (goatIndex !== -1) {
      const updatedGoats = [...goats];
      updatedGoats[goatIndex] = { ...goat, id } as Goat;
      saveGoats(updatedGoats);
      
      toast({
        title: "Berhasil Mengupdate",
        description: `Data kambing dengan ID ${id} telah diperbarui.`,
      });
    }
  };

  const deleteGoat = (id: string) => {
    const updatedGoats = goats.filter(goat => goat.id !== id);
    saveGoats(updatedGoats);
    
    toast({
      title: "Berhasil Menghapus",
      description: `Kambing dengan ID ${id} telah dihapus.`,
    });
  };

  const getGoatById = (id: string) => {
    return goats.find(goat => goat.id === id);
  };

  return (
    <GoatContext.Provider value={{ goats, addGoat, updateGoat, deleteGoat, getGoatById }}>
      {children}
    </GoatContext.Provider>
  );
};

export const useGoats = (): GoatContextType => {
  const context = useContext(GoatContext);
  if (context === undefined) {
    throw new Error('useGoats must be used within a GoatProvider');
  }
  return context;
};
