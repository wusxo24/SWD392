export const extractHeightByDay = (data: any[]) => {
    const heightByDay = [] as any;
  
    data.forEach((record) => {
      const trackings = record.Trackings;
      Object.keys(trackings).forEach((date) => {
        heightByDay.push({
          date,
          height: trackings[date].Height,
        });
      });
    });
  
    return heightByDay;
  };