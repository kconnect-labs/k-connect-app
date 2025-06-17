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


