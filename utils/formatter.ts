const timeUnits = {
  год: [365 * 24, 'лет'],
  месяц: [30 * 24, 'месяцев'],
  неделя: [7 * 24, 'недель'],
  день: [24, 'дней'],
  час: [1, 'часов'],
};

export const postTimeFormatter = (date: string): string => {
  const diffHours = Math.floor((new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60));

  for (const [unit, [hoursInUnit, unitName]] of Object.entries(timeUnits)) {
    const quantity = Math.floor(diffHours / Number(hoursInUnit));
    if (quantity >= 1) {
      return `${quantity} ${unitName} назад`;
    }
  }

  return 'Только что';
};

export const formatDuration = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export const formatStatus = (status: number) => {
  const colors: Record<number, string> = {
    1: '#a0a0a0',
    2: '#db7075',
    3: '#b49ee7',
    4: '#ff9800',
    5: '#5aa158',
  };
  return colors[status] || '#888';
};

export const formatCutText = (text: string, maxLength:number=10) =>{
  if(text.length > maxLength){
    return `${text.slice(0,maxLength)}...`
  }

  return text
}

export const formatBalance = (amount: number): string => {
  const absAmount = Math.abs(amount);

  if (absAmount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}b`;
  } else if (absAmount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}m`;
  } else if (absAmount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }

  return amount.toString();
};

// Универсальная функция для парсинга даты из разных форматов
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  try {
    // Проверяем, если время уже в формате "DD.MM.YYYY, HH:mm"
    if (dateString.includes(',') && dateString.includes('.')) {
      // Парсим формат "06.07.2025, 00:43"
      const [datePart, timePart] = dateString.split(', ');
      const [day, month, year] = datePart.split('.');
      const [hour, minute] = timePart.split(':');
      
      // Создаем дату в формате YYYY-MM-DDTHH:mm
      const isoString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`;
      const date = new Date(isoString);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format after parsing:', dateString);
        return null;
      }
      
      return date;
    } else {
      // Стандартный формат ISO или другой
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return null;
      }
      
      return date;
    }
  } catch (error) {
    console.warn('Error parsing date:', error, 'for dateString:', dateString);
    return null;
  }
};


