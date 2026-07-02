export const getEncouragingMessage = (score: number, total: number) => {
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);

  if (percent >= 90) {
    return 'Excellent work! You are studying like a future tourism leader.';
  }

  if (percent >= 70) {
    return 'Nice work! Want to try a harder challenge next?';
  }

  return 'Great effort! Every attempt helps you improve.';
};
