export class DateUtils {
  static padTo2Digits = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  static epochToDate(epoch: number): string {
    const formatDate = (date: Date) => {
      return (
        [
          DateUtils.padTo2Digits(date.getMonth() + 1),
          DateUtils.padTo2Digits(date.getDate()),
          DateUtils.padTo2Digits(date.getDate()),
          date.getFullYear().toString().slice(-2),
        ].join('/') +
        ' ' +
        [
          DateUtils.padTo2Digits(date.getHours()),
          DateUtils.padTo2Digits(date.getMinutes()),
        ].join(':')
      );
    };

    return formatDate(new Date(epoch));
  }

  static convertMsToTime(milliseconds: number) {
    const seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    minutes = minutes % 60;
    hours = hours % 24;

    return `${DateUtils.padTo2Digits(hours)} h ${DateUtils.padTo2Digits(
      minutes
    )} min`;
  }
}
