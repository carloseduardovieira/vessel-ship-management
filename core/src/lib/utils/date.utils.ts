export class DateUtils {
  static epochToDate(epoch: number): string {
    const padTo2Digits = (num: number) => {
      return num.toString().padStart(2, '0');
    };

    const formatDate = (date: Date) => {
      return (
        [
          padTo2Digits(date.getMonth() + 1),
          padTo2Digits(date.getDate()),
          padTo2Digits(date.getDate()),
          date.getFullYear().toString().slice(-2),
        ].join('/') +
        ' ' +
        [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes())].join(
          ':'
        )
      );
    };

    return formatDate(new Date(epoch));
  }
}
