const QUALITY = 0;
const EASY = 1;

class DecisionVariable {
  readonly domain: readonly number[];
  readonly label: number;

  constructor(label: number, domain: readonly number[]) {
    this.label = label;
    this.domain = domain;
  }

  isEmpty() {
    return this.domain.length === 0;
  }

  isFixed() {
    return this.domain.length === 1;
  }

  exclude(value: number) {
    return new DecisionVariable(this.label, this.domain.filter(v => v !== value));
  }
}

function isFeasible(variables: readonly DecisionVariable[]) {
  return variables.every(variable => !variable.isEmpty());
}

function minCandidates(variables: readonly DecisionVariable[], value: number) {
  return variables.filter(variable => variable.domain.includes(value)).length;
}

function smallestNonFixedVariable(variables: readonly DecisionVariable[]) {
  return variables.reduce<DecisionVariable | undefined>((smallest, variable) => {
    if (variable.isFixed()) {
      return smallest;
    }

    if (smallest === undefined || variable.domain.length < smallest.domain.length) {
      return variable;
    } else {
      return smallest;
    }
  }, undefined);
}

function propagateQualityDay(variables: readonly DecisionVariable[], qualityDay: number) {
  // constraint: the day before a quality day cannot be a quality day
  const dayBefore = (qualityDay + 6) % 7;

  return variables.map(variable => {
    if (variable.label === dayBefore) {
      return variable.exclude(QUALITY);
    } else {
      return variable;
    }
  });
}

function search(
  variables: readonly DecisionVariable[],
  minQualityDays: number
): number[] | undefined {
  if (!isFeasible(variables) || minCandidates(variables, QUALITY) < minQualityDays) {
    return undefined;
  }

  const decisionPoint = smallestNonFixedVariable(variables);
  if (decisionPoint === undefined) {
    return variables.filter(variable => variable.domain.includes(QUALITY)).map(variable => variable.label);
  }

  for (const value of decisionPoint.domain) {
    let newVariables = variables.map(variable => {
      if (variable === decisionPoint) {
        return new DecisionVariable(variable.label, [value]);
      } else {
        return variable;
      }
    });

    if (value === QUALITY) {
      newVariables = propagateQualityDay(newVariables, decisionPoint.label);
    }

    const result = search(newVariables, minQualityDays);

    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}

export function scheduleQualityDays(days: number[], maxQualityDays: number) {
  const candidateDays = days.map(day => new DecisionVariable(day, [EASY, QUALITY]));

  // maximize: the number of quality days
  for (let minQualityDays = maxQualityDays; minQualityDays >= 1; --minQualityDays) {
    const result = search(candidateDays, minQualityDays);

    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
}
