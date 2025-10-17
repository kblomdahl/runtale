export default class Speed {
  private readonly metersPerSecond: number;

  private constructor(metersPerSecond: number) {
    this.metersPerSecond = metersPerSecond;
  }

  static fromMetersPerSecond(metersPerSecond: number): Speed {
    return new Speed(metersPerSecond);
  }

  static fromSecondsPerKilometer(secondsPerKilometer: number): Speed {
    return new Speed(1000 / secondsPerKilometer);
  }

  static fromHoursPerKilometer(hoursPerKilometer: number): Speed {
    return new Speed(1000 / (hoursPerKilometer * 3600));
  }

  toMetersPerSecond(): number {
    return this.metersPerSecond;
  }

  toMinutesPerKilometer(): string {
    const totalSeconds = 1000 / this.metersPerSecond;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}
