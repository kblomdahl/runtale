export default class Distance {
  private readonly meters: number;

  private constructor(meters: number) {
    this.meters = meters;
  }

  static fromMeters(meters: number): Distance {
    return new Distance(meters);
  }

  static fromJSON(json: number): Distance {
    return Distance.fromMeters(json);
  }

  format(): string {
    return this.toKilometers().toFixed(1);
  }

  add(other: Distance): Distance {
    return Distance.fromMeters(this.toMeters() + other.toMeters());
  }

  toMeters(): number {
    return this.meters;
  }

  toKilometers(): number {
    return this.meters / 1000;
  }

  toJSON(): number {
    return this.meters;
  }
}
