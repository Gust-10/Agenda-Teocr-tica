
import React, { useState, useRef } from 'react';
import PlayIcon from './icons/PlayIcon';
import UploadIcon from './icons/UploadIcon';

interface ReminderFormProps {
  addReminder: (text: string, dueDate: string, sound: string, repeatDays: number[]) => void;
}

const SOUND_OPTIONS = [
  { name: 'Campana', url: 'https://cdn.freesound.org/previews/270/270318_5123851-lq.mp3' },
  { name: 'Gota de Agua', url: 'https://cdn.freesound.org/previews/415/415763_6142149-lq.mp3' },
  { name: 'Melodía Pacífica', url: 'https://cdn.freesound.org/previews/341/341695_5123851-lq.mp3' },
  { name: 'Alarma Digital', url: 'https://cdn.freesound.org/previews/198/198841_3799655-lq.mp3' },
];

const WEEK_DAYS = [
    { label: 'L', value: 1 }, { label: 'M', value: 2 }, { label: 'MI', value: 3 },
    { label: 'J', value: 4 }, { label: 'V', value: 5 }, { label: 'S', value: 6 },
    { label: 'D', value: 0 }
];


const ReminderForm: React.FC<ReminderFormProps> = ({ addReminder }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [customSounds, setCustomSounds] = useState<{ name: string; url: string; }[]>([]);
  const [selectedSound, setSelectedSound] = useState(SOUND_OPTIONS[0].url);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      alert("El archivo es demasiado grande. Por favor, elige un archivo de menos de 2MB.");
      e.target.value = ''; // Reset file input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newCustomSound = { name: file.name, url: dataUrl };
      
      setCustomSounds(prev => {
        if (prev.some(s => s.url === newCustomSound.url)) return prev;
        return [...prev, newCustomSound];
      });
      setSelectedSound(dataUrl);
    };
    reader.readAsDataURL(file);
  };


  const handlePreviewSound = (soundUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    audioRef.current = new Audio(soundUrl);
    audioRef.current.play().catch(e => console.error("Error playing sound preview:", e));
  };

  const toggleRepeatDay = (dayValue: number) => {
    setRepeatDays(prev => 
        prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue]
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && dueDate) {
      addReminder(text, dueDate, selectedSound, repeatDays);
      setText('');
      setDueDate('');
      setRepeatDays([]);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const allSoundOptions = [...SOUND_OPTIONS, ...customSounds];

  return (
    <form onSubmit={handleSubmit} className="p-4 mx-4 mt-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-lg font-semibold text-white mb-3">Añadir Nuevo Recordatorio</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="¿Qué necesitas recordar?"
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-gray-400"
          aria-label="Texto del recordatorio"
        />
        <input
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          aria-label="Fecha de vencimiento o inicio"
        />
        
        <div>
           <h3 className="text-md font-medium text-white mb-2">Repetir semanalmente</h3>
           <div className="flex justify-between items-center space-x-1">
                {WEEK_DAYS.map(day => (
                    <button
                        type="button"
                        key={day.value}
                        onClick={() => toggleRepeatDay(day.value)}
                        className={`w-9 h-9 flex items-center justify-center font-bold text-sm rounded-full transition-colors duration-200 ${
                            repeatDays.includes(day.value) 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        aria-pressed={repeatDays.includes(day.value)}
                    >
                        {day.label}
                    </button>
                ))}
           </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-white mb-2 mt-4">Sonido de Notificación</h3>
          <div className="space-y-2">
            {allSoundOptions.map(option => (
              <div key={option.url} className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md">
                <label className="flex items-center space-x-3 cursor-pointer flex-grow min-w-0">
                  <input
                    type="radio"
                    name="sound-option"
                    value={option.url}
                    checked={selectedSound === option.url}
                    onChange={(e) => setSelectedSound(e.target.value)}
                    className="form-radio h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500 flex-shrink-0"
                  />
                  <span className="text-gray-300 truncate" title={option.name}>{option.name}</span>
                </label>
                <button
                  type="button"
                  onClick={() => handlePreviewSound(option.url)}
                  className="p-1 rounded-full text-gray-400 hover:bg-indigo-500/20 hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-shrink-0 ml-2"
                  aria-label={`Reproducir sonido ${option.name}`}
                >
                  <PlayIcon className="h-5 w-5"/>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
              <label htmlFor="custom-sound-upload" className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-gray-200 font-semibold rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-200 cursor-pointer">
                  <UploadIcon className="h-5 w-5" />
                  <span>Subir audio personalizado</span>
              </label>
              <input
                  id="custom-sound-upload"
                  type="file"
                  accept="audio/*,.mp3,.wav,.ogg"
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Subir audio personalizado"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">Tamaño máximo del archivo: 2MB.</p>
          </div>
        </div>

      </div>
      <button
        type="submit"
        className="w-full mt-4 py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-indigo-900/50 disabled:cursor-not-allowed"
        disabled={!text.trim() || !dueDate}
      >
        Agendar
      </button>
    </form>
  );
};

export default ReminderForm;