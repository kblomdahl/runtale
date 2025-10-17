export default class Distance {
  private readonly amount: number;

  private constructor(amount: number) {
    this.amount = amount;
  }

  static fromMeters(meters: number): Distance {
    return new Distance(meters);
  }

  format(): string {
    return this.toKilometers().toFixed(1);
  }

  add(other: Distance): Distance {
    return Distance.fromMeters(this.toMeters() + other.toMeters());
  }

  toMeters(): number {
    return this.amount;
  }

  toKilometers(): number {
    return this.amount / 1000;
  }
}
