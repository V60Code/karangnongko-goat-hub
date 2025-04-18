
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Calendar from '../components/Calendar';
import { useCheckins, CheckinEntry } from '../context/CheckinContext';
import { Frown, Meh, Smile } from 'lucide-react';

const JadwalPage: React.FC = () => {
  const { checkins, addCheckin, getCheckinByDate, hasCheckinForDate } = useCheckins();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [mood, setMood] = useState<'Bad' | 'Neutral' | 'Great'>('Neutral');
  const [accomplishments, setAccomplishments] = useState('');
  const [challenges, setChallenges] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    
    // Get existing check-in for this date, if any
    const dateString = format(date, 'yyyy-MM-dd');
    const existingCheckin = getCheckinByDate(dateString);
    
    if (existingCheckin) {
      setMood(existingCheckin.mood);
      setAccomplishments(existingCheckin.accomplishments);
      setChallenges(existingCheckin.challenges);
      setNextSteps(existingCheckin.nextSteps);
    } else {
      // Reset form if no existing check-in
      setMood('Neutral');
      setAccomplishments('');
      setChallenges('');
      setNextSteps('');
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSubmitCheckin = () => {
    if (!selectedDate) return;
    
    const checkin: CheckinEntry = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      mood,
      accomplishments,
      challenges,
      nextSteps
    };
    
    addCheckin(checkin);
    setIsDialogOpen(false);
  };
  
  const MoodButton: React.FC<{
    value: 'Bad' | 'Neutral' | 'Great';
    selected: boolean;
    onClick: () => void;
  }> = ({ value, selected, onClick }) => {
    const getIcon = () => {
      switch (value) {
        case 'Bad':
          return <Frown size={24} />;
        case 'Neutral':
          return <Meh size={24} />;
        case 'Great':
          return <Smile size={24} />;
      }
    };
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={`
          flex flex-col items-center p-4 rounded-lg border-2 transition-all
          ${selected 
            ? 'border-farmblue bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
      >
        {getIcon()}
        <span className="mt-2">{value}</span>
      </button>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-farmblue mb-6">Jadwal</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Check-in Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar 
            onDateSelect={handleDateSelect}
            hasCheckin={hasCheckinForDate}
          />
        </CardContent>
      </Card>
      
      {/* Check-in Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Daily Check-in</DialogTitle>
            <DialogDescription>
              {selectedDate && (
                <>Tanggal: {format(selectedDate, 'EEEE, dd MMMM yyyy', { locale: id })}</>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <h3 className="mb-3 font-medium">Bagaimana perasaan Anda hari ini?</h3>
              <div className="grid grid-cols-3 gap-3">
                <MoodButton
                  value="Bad"
                  selected={mood === 'Bad'}
                  onClick={() => setMood('Bad')}
                />
                <MoodButton
                  value="Neutral"
                  selected={mood === 'Neutral'}
                  onClick={() => setMood('Neutral')}
                />
                <MoodButton
                  value="Great"
                  selected={mood === 'Great'}
                  onClick={() => setMood('Great')}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="accomplishments" className="font-medium block mb-2">
                  Accomplishments
                </label>
                <Textarea
                  id="accomplishments"
                  placeholder="Apa yang telah dicapai hari ini?"
                  value={accomplishments}
                  onChange={(e) => setAccomplishments(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="challenges" className="font-medium block mb-2">
                  Challenges
                </label>
                <Textarea
                  id="challenges"
                  placeholder="Tantangan apa yang dihadapi?"
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <label htmlFor="nextSteps" className="font-medium block mb-2">
                  Next Steps
                </label>
                <Textarea
                  id="nextSteps"
                  placeholder="Langkah selanjutnya yang akan diambil?"
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmitCheckin} className="bg-farmblue hover:bg-farmblue-dark">
              Submit Daily Check-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JadwalPage;
