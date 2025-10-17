export default class Duration {
  private readonly seconds: number;

  private constructor(seconds: number) {
    this.seconds = seconds;
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds);
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60);
  }

  static fromHours(hours: number): Duration {
    return new Duration(hours * 3600);
  }

  static fromJSON(json: number): Duration {
    return Duration.fromSeconds(json);
  }

  format(minParts: number = 1): string {
    const parts = [
      Math.floor(this.toSeconds() / 3600),
      Math.floor((this.toSeconds() % 3600) / 60),
      Math.floor(this.toSeconds() % 60)
    ];

    const firstNonZeroIndex = Math.min(
      parts.length - minParts,
      parts.findIndex(part => part > 0)
    );

    return parts.slice(firstNonZeroIndex).map(part => part.toString().padStart(2, '0')).join(':');
  }

  multiply(factor: number): Duration {
    return Duration.fromSeconds(this.toSeconds() * factor);
  }

  divide(factor: number): Duration {
    return Duration.fromSeconds(this.toSeconds() / factor);
  }

  add(other: Duration): Duration {
    return Duration.fromSeconds(this.toSeconds() + other.toSeconds());
  }

  subtract(other: Duration): Duration {
    return Duration.fromSeconds(this.toSeconds() - other.toSeconds());
  }

  max(other: Duration): Duration {
    return Duration.fromSeconds(Math.max(this.toSeconds(), other.toSeconds()));
  }

  min(other: Duration): Duration {
    return Duration.fromSeconds(Math.min(this.toSeconds(), other.toSeconds()));
  }

  toSeconds(): number {
    return this.seconds;
  }

  toMinutes(): number {
    return this.seconds / 60;
  }

  toHours(): number {
    return this.seconds / 3600;
  }

  toJSON(): number {
    return this.seconds;
  }
}
